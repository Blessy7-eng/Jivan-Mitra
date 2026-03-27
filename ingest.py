import os
import time
import json
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from google.genai import Client as GoogleClient 
from supabase import create_client

load_dotenv()

# Setup Clients
api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
client = GoogleClient(api_key=api_key)
supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))

def ingest_pdf():
    pdf_path = os.path.join("data", "NLEM_2022.pdf")
    
    if not os.path.exists(pdf_path):
        print(f"❌ Error: Could not find {pdf_path}")
        return

    print(f"📖 Reading PDF from {pdf_path}...")
    loader = PyPDFLoader(pdf_path)
    pages = loader.load()
    
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=150)
    chunks = text_splitter.split_documents(pages)
    print(f"✂️ Split into {len(chunks)} chunks. Uploading to Supabase...")

    for i, chunk in enumerate(chunks):
        try:
            # FIXED: Changed 'embedding-001' to 'gemini-embedding-001'
            response = client.models.embed_content(
                model="gemini-embedding-001", 
                contents=chunk.page_content,
                config={
                    "output_dimensionality": 768
                }
            )
            embedding = response.embeddings[0].values

            # Insert Row (rest of the code remains the same)
            supabase.table("medical_guidelines").insert({
                "content": chunk.page_content,
                "metadata": chunk.metadata,
                "embedding": embedding
            }).execute()

            if i % 10 == 0:
                print(f"✅ Successful Upload: {i}/{len(chunks)} chunks...")
            
            time.sleep(0.5) # Rate limiting safety
            
        except Exception as e:
            print(f"❌ Error at chunk {i}: {e}")
            # If you get a 404 again, it might be a library version issue—check your pip list.
            
if __name__ == "__main__":
    ingest_pdf()