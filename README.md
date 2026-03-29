# 🩺 Jivan-Mitra: Multimodal AI Medical Companion

Jivan-Mitra (Life-Friend) is a compassionate AI-driven healthcare assistant designed to bridge the digital divide in rural India. By utilizing Google Gemini 2.0 Flash, the platform provides instant medical guidance, prescription analysis, and emergency support through a seamless Web and WhatsApp interface.

## 🚀 Key Features
* 🌍 **Vernacular First:** Full support for Marathi, Hindi, and English to ensure rural users can communicate without language barriers.
* 📲 **WhatsApp Integration:** Powered by Twilio, allowing users to access AI medical advice without installing any new applications.
* 🔍 **Multimodal Prescription Scan:** Uses Gemini’s vision capabilities to extract handwritten medicine names from photos and generate a simplified dosage schedule.
* 🚨 **Real-Time SOS:** A one-tap emergency feature that captures the user's GPS coordinates and prepares them for local help via Twilio.
* ⚡ **Low-Latency Architecture:** Optimized with FastAPI to provide near-instant responses even on slower rural networks.

## 🛠️ Technical Stack

| Layer | Technology |
| :--- | :--- |
| **Brain (AI)** | Google Gemini 2.0 Flash (Multimodal API) |
| **Backend** | FastAPI (Python 3.10+), Uvicorn |
| **Frontend** | Next.js 14, Tailwind CSS, Lucide React |
| **Gateway** | Twilio WhatsApp API |
| **Tunneling** | Ngrok (for local development/demo) |

---

## 📂 Project Structure

```text
Jivan-Mitra/
├── backend/            # FastAPI Server (AI & Messaging Logic)
│   ├── app.py          # Core API endpoints (/chat, /whatsapp, /analyze)
│   ├── requirements.txt # Python dependencies
│   └── .env.example    # API Key template
├── frontend/           # Next.js Application (Web Interface)
│   ├── app/            # Main application pages
│   ├── components/     # Reusable UI components (Chatbot, SOS)
│   └── package.json    # Node.js dependencies
├── .gitignore          # Security (hides API keys & node_modules)
└── README.md           # Project Documentation
```

## ⚙️ Installation & Setup

### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt
# Create a .env file and add your GEMINI_API_KEY
uvicorn app:main --reload --port 8000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. WhatsApp Tunneling
Start Ngrok: ngrok http 8000

Update Twilio Sandbox: Set the Webhook URL to (https://your-ngrok-url.app/whatsapp) (ensure it is set to POST).

**💡 Technical Innovation**
For this hackathon, we focused on Gemini 2.0 Flash's multimodal capabilities. Most rural patients struggle to read doctor's handwriting. Our system processes these images, converts them into structured JSON data, and then re-interprets that data into a friendly, localized explanation. This converts a "confusing paper" into a "clear digital plan."

**👥 The Team**
Blessy Waydande – Full Stack Developer & Cybersecurity (PVPIT, Budhgaon)

Prachi Suryawanshi – Frontend & UI/UX Design (PVPIT, Budhgaon)

**📺 Demo Video**
[![Jivan-Mitra Demo Video](https://img.shields.io/badge/Watch-Demo_Video-red?style=for-the-badge&logo=youtube)](https://go.screenpal.com/watch/cOeUDfnTtMC)
