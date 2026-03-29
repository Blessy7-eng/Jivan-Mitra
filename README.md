🩺 Jivan-Mitra: Multimodal AI Medical CompanionJivan-Mitra (Life-Friend) is a compassionate AI-driven healthcare assistant designed to bridge the digital divide in rural India. By utilizing Google Gemini 2.0 Flash, the platform provides instant medical guidance, prescription analysis, and emergency support through a seamless Web and WhatsApp interface.🚀 Key Features🌍 Vernacular First: Full support for Marathi, Hindi, and English to ensure rural users can communicate without language barriers.📲 WhatsApp Integration: Powered by Twilio, allowing users to access AI medical advice without installing any new applications.🔍 Multimodal Prescription Scan: Uses Gemini’s vision capabilities to extract handwritten medicine names from photos and generate a simplified dosage schedule.🚨 Real-Time SOS: A one-tap emergency feature that captures the user's GPS coordinates and prepares them for local help via Twilio.⚡ Low-Latency Architecture: Optimized with FastAPI to provide near-instant responses even on slower rural networks.🛠️ Technical StackLayerTechnologyBrain (AI)Google Gemini 2.0 Flash (Multimodal API)BackendFastAPI (Python 3.10+), UvicornFrontendNext.js 14, Tailwind CSS, Lucide ReactGatewayTwilio WhatsApp APITunnelingNgrok (for local development/demo)📂 Project StructurePlaintextJivan-Mitra/
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
⚙️ Installation & Setup1. Backend SetupBashcd backend
pip install -r requirements.txt
# Create a .env file and add your GEMINI_API_KEY
uvicorn app:main --reload --port 8000
2. Frontend SetupBashcd frontend
npm install
npm run dev
3. WhatsApp TunnelingStart Ngrok: ngrok http 8000Update the Twilio Sandbox Webhook URL: https://your-ngrok-url.app/whatsapp (Set to POST)💡 Technical InnovationFor this hackathon, we focused on Gemini 2.0 Flash's multimodal capabilities. Most rural patients struggle to read doctor's handwriting. Our system processes these images, converts them into structured JSON data, and then re-interprets that data into a friendly, localized explanation. This converts a "confusing paper" into a "clear digital plan."👥 The TeamBlessy Waydande - Full Stack Developer & Cybersecurity (PVPIT, Budhgaon)[Teammate Name] - Frontend & UI/UX Design (PVPIT, Budhgaon)
