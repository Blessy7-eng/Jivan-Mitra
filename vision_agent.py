import os
from dotenv import load_dotenv
from google.genai import Client as GoogleClient
from google.genai import types

load_dotenv()

client = GoogleClient(api_key=os.getenv("GEMINI_API_KEY"))

def analyze_prescription(image_path):
    print(f"📸 Analyzing prescription: {image_path}...")
    
    # Load the image
    with open(image_path, "rb") as f:
        image_bytes = f.read()

    # Define the prompt for medical extraction
    prompt = """
    You are a professional medical assistant. Analyze this prescription image.
    1. Extract all medicine names.
    2. Extract the dosage and frequency if visible.
    3. Identify any potential warnings or instructions (e.g., 'after food').
    
    Return the data in a clean list format.
    """

    # Generate content using Gemini 2.0 Flash
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=[
            prompt,
            types.Part.from_bytes(data=image_bytes, mime_type="image/png")
        ]
    )

    print("\n--- Extraction Results ---")
    print(response.text)
    return response.text

if __name__ == "__main__":
    # Ensure you have your prescription image in the root or data folder
    test_image = "image_e48a3b.png" 
    if os.path.exists(test_image):
        analyze_prescription(test_image)
    else:
        print(f"❌ Could not find {test_image}")