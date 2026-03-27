from fastapi import FastAPI, UploadFile, File
from agent import JivanMitraAgents
import shutil
import os

app = FastAPI()

@app.post("/analyze-prescription")
async def analyze_prescription(file: UploadFile = File(...)):
    # 1. Save uploaded file temporarily
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # 2. Run Agents
    medicines = JivanMitraAgents.vision_agent(temp_path)
    report = JivanMitraAgents.compliance_agent(medicines)
    
    # 3. Cleanup and Return JSON
    os.remove(temp_path)
    return {
        "status": "success",
        "extracted_medicines": medicines,
        "nlem_report": report
    }