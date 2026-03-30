from fastapi import FastAPI, UploadFile, File, Response, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
from google import genai
from google.genai import types
from dotenv import load_dotenv
import json

from twilio.twiml.messaging_response import MessagingResponse

load_dotenv()

# 1. Configure Client
api_key = os.getenv("GEMINI_API_KEY") 
client = genai.Client(api_key=api_key)

# Using a stable and valid model ID
MODEL_ID = "gemini-2.5-flash"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

def safe_json_parse(text):
    """Cleans potential markdown backticks from AI response."""
    clean_text = text.replace("```json", "").replace("```", "").strip()
    try:
        return json.loads(clean_text)
    except json.JSONDecodeError:
        return []

@app.get("/")
async def root():
    return {"message": "Jivan-Mitra Backend Active"}

@app.post("/whatsapp")
async def whatsapp_reply(Body: str = Form(...), From: str = Form(...)):
    try:
        config = types.GenerateContentConfig(
            system_instruction="You are Jivan-Mitra, a compassionate medical assistant. Reply concisely in the language the user is speaking (Marathi, Hindi, or English)."
        )
        
        response = client.models.generate_content(
            model=MODEL_ID,
            contents=Body,
            config=config
        )
        
        twiml = MessagingResponse()
        twiml.message(response.text)
        
        return Response(content=str(twiml), media_type="application/xml")
    
    except Exception as e:
        print(f"CRITICAL WhatsApp Error: {e}")
        twiml = MessagingResponse()
        twiml.message("Jivan-Mitra is currently busy. Please try again in a moment.")
        return Response(content=str(twiml), media_type="application/xml")

@app.post("/chat")
async def chat_endpoint(data: dict):
    user_msg = data.get("message")
    user_lang = data.get("lang", "Marathi")
    
    config = types.GenerateContentConfig(
        system_instruction=f"You are Jivan-Mitra, a rural medical assistant. Speak {user_lang}."
    )
    
    try:
        response = client.models.generate_content(
            model=MODEL_ID, 
            contents=user_msg, 
            config=config
        )
        return {"response": response.text}
    except Exception as e:
        print(f"Chat Error: {e}")
        return {"response": f"Error: {str(e)}"}

@app.post("/analyze-prescription")
async def analyze_prescription(file: UploadFile = File(...)):
    temp_path = f"temp_{file.filename}"
    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        with open(temp_path, "rb") as f:
            image_bytes = f.read()

        prompt = "Extract medicines from this prescription. Return ONLY a JSON list of objects with 'name', 'use', and 'dosage'."
        
        response = client.models.generate_content(
            model=MODEL_ID,
            contents=[
                types.Part.from_text(text=prompt),
                types.Part.from_bytes(data=image_bytes, mime_type=file.content_type or "image/jpeg")
            ]
        )
        
        return {"status": "success", "medicines": safe_json_parse(response.text)}
    except Exception as e:
        print(f"Prescription Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
