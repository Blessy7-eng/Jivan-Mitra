import os
import PIL.Image
from dotenv import load_dotenv
from google.genai import Client as GoogleClient
from supabase import create_client

# 1. LOAD DOTENV AT THE VERY TOP
load_dotenv()

class JivanMitraAgents:
    # 2. Initialize clients as class variables or inside methods
    # Using os.getenv AFTER load_dotenv() ensures they aren't None
    client = GoogleClient(api_key=os.getenv("GEMINI_API_KEY"))
    supabase = create_client(
        os.getenv("SUPABASE_URL"), 
        os.getenv("SUPABASE_KEY")
    )

    @staticmethod
    def vision_agent(image_path):
        """Extracts medicine names from prescription."""
        img = PIL.Image.open(image_path)
        # Using 1.5-flash-latest or 2.0-flash for demo stability
        res = JivanMitraAgents.client.models.generate_content(
            model="gemini-2.5-flash",
            contents=["List only the medicine names in this image, comma-separated.", img]
        )
        return res.text.strip()

    @staticmethod
    def compliance_agent(medicines):
        """Queries Supabase and verifies against NLEM."""
        # 1. Get Context (Vector Search)
        response = JivanMitraAgents.client.models.embed_content(
            model="gemini-embedding-001",
            contents=medicines,
            config={"output_dimensionality": 768}
        )
        query_vec = response.embeddings[0].values
        
        # Search DB
        result = JivanMitraAgents.supabase.rpc("match_medical_guidelines", {
            "query_embedding": query_vec,
            "match_threshold": 0.1, 
            "match_count": 3
        }).execute()
        
        # Add a check to prevent join errors if result.data is empty
        if not result.data:
            context = "No relevant NLEM 2022 guidelines found for these medicines."
        else:
            context = "\n\n".join([r['content'] for r in result.data])

        # 2. Final Reasoning
        prompt = f"""
        You are Jivan-Mitra, a clinical compliance agent. 
        Verify these medicines against the NLEM 2022 guidelines.
        
        CONTEXT: {context}
        MEDICINES: {medicines}
        
        Provide a clear 'Essential' or 'Non-Essential' status for each.
        """
        final_res = JivanMitraAgents.client.models.generate_content(
            model="gemini-2.5-flash", 
            contents=prompt
        )
        return final_res.text