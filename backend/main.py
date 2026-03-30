import os
import time
import PIL.Image
from dotenv import load_dotenv
from google.genai import Client as GoogleClient
from supabase import create_client

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
client = GoogleClient(api_key=api_key)
supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))

def get_nlem_context(medicine_names):
    """Retrieves matching medical guidelines from Supabase Vector Store."""
    print(f"🧠 Encoding '{medicine_names}' into vectors...")
    
    response = client.models.embed_content(
        model="gemini-embedding-001",
        contents=medicine_names,
        config={"output_dimensionality": 768}
    )
    query_vec = response.embeddings[0].values

    result = supabase.rpc("match_medical_guidelines", {
        "query_embedding": query_vec,
        "match_threshold": 0.2, 
        "match_count": 3
    }).execute()
    
    if not result.data:
        return "No specific NLEM matches found."
    
    return "\n\n".join([r['content'] for r in result.data])

def jivan_mitra_full_check(image_path):
    try:
        # --- STEP 1: VISION ---
        print(f"\n[1/3] 📸 Scanning: {image_path}...")
        img = PIL.Image.open(image_path)
        
        vision_res = client.models.generate_content(
            model="gemini-2.5-flash", 
            contents=["List the medicine names in this image, separated by commas.", img]
        )
        
        medicines = vision_res.text.strip()
        print(f"✅ Found: {medicines}")

        # --- STEP 2: RETRIEVAL ---
        print("\n[2/3] ⏳ API Cooldown (20s)...")
        time.sleep(20) 
        context = get_nlem_context(medicines)

        # --- STEP 3: GENERATION ---
        print("\n[3/3] ⏳ Final Cooldown (20s)...")
        time.sleep(20)

        print("🤖 Compiling Verification Report...")

        final_prompt = f"""
        You are Jivan-Mitra, a Clinical Pharmacist assistant. 
        Task: Verify if the prescribed medicines (or their generic equivalents) are in the NLEM 2022 list.
        
        PRESCRIBED MEDICINES: {medicines}
        NLEM DATA SNIPPETS: {context}
        
        REPORT FORMAT:
        1. Medicine Name (Brand vs Generic)
        2. NLEM Status (Found/Not Found)
        3. Therapeutic Category (if found in context)
        4. Patient Safety Note: Is this an essential medicine?
        
        Note: If a brand name like 'Amphogel' is used, check if its generic 'Aluminum Hydroxide' appears in the context.
        """

        final_res = client.models.generate_content(
            model="gemini-2.5-flash", 
            contents=final_prompt
        )
        
        print("\n" + "═"*50)
        print("🏥 JIVAN-MITRA: ANALYSIS REPORT")
        print("═"*50)
        print(final_res.text)
        print("═"*50)

    except Exception as e:
        print(f"\n❌ ERROR: {e}")

if __name__ == "__main__":
    # Ensure this matches your file in the 'data' folder
    image_path = os.path.join("data", "prescription.png") 
    if os.path.exists(image_path):
        jivan_mitra_full_check(image_path)
    else:
        print(f"❌ File not found at {image_path}")
