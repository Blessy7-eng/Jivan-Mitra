"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Activity, ArrowRight, Mail, Phone, ArrowLeft, 
  Lock, Eye, EyeOff, Clock, Trash2, BellRing, Pill, Heart
} from "lucide-react"; 
import Header from '@/components/Header';
import PrescriptionScanner from '@/components/PrescriptionScanner';
import Chatbot from '@/components/Chatbot';
import SOSEmergency from '@/components/SOSEmergency';

interface UserData {
  name: string;
  identifier: string;
  password?: string;
}

interface Medication {
  id: number;
  name: string;
  time: string;
  status: "Upcoming" | "Taken";
}

interface ScannedMedicine {
  name: string;
  use: string;
  dosage: string;
}

export default function Home() {
  const [step, setStep] = useState(0); 
  const [loginMethod, setLoginMethod] = useState<"email" | "phone" | null>(null);
  const [showPass, setShowPass] = useState(false);
  const [userData, setUserData] = useState<UserData>({ name: "", identifier: "", password: "" });
  const [meds, setMeds] = useState<Medication[]>([{ id: 1, name: "Paracetamol 650mg", time: "08:00", status: "Upcoming" }]);
  const [scannedMeds, setScannedMeds] = useState<ScannedMedicine[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMed, setNewMed] = useState({ name: "", time: "" });
  const [notification, setNotification] = useState<string | null>(null);

  // --- Notification Logic ---
  const triggerNotification = useCallback((msg: string, systemBody?: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 5000);
    if (systemBody && "Notification" in window && Notification.permission === "granted") {
      new Notification("Jivan-Mitra Reminder", { body: systemBody });
    }
  }, []);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
    const timer = setInterval(() => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      meds.forEach(med => {
        if (med.time === currentTime && med.status === "Upcoming") {
          triggerNotification(`💊 Time for ${med.name}`, `It's ${currentTime}. Please take your dosage.`);
          setMeds(prev => prev.map(m => m.id === med.id ? { ...m, status: "Taken" } : m));
        }
      });
    }, 30000); 
    return () => clearInterval(timer);
  }, [meds, triggerNotification]);

  const addMedication = () => {
    if (newMed.name && newMed.time) {
      setMeds([...meds, { id: Date.now(), ...newMed, status: "Upcoming" }]);
      setIsModalOpen(false);
      setNewMed({ name: "", time: "" });
      triggerNotification(`✅ Reminder set for ${newMed.name}`);
    }
  };

  const deleteMed = (id: number) => {
    setMeds(meds.filter(m => m.id !== id));
    triggerNotification(`🗑️ Schedule Updated`);
  };

  // --- Step 0: Landing ---
  if (step === 0) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[100] p-6 text-center">
        <div className="max-w-md animate-in fade-in zoom-in duration-700">
          <div className="w-24 h-24 bg-blue-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl animate-up-down">
            <Activity className="text-white w-12 h-12" strokeWidth={2.5} />
          </div>
          <h1 className="text-6xl font-black text-slate-900 mb-4 tracking-tighter">Jivan-Mitra</h1>
          <p className="text-slate-500 text-lg mb-10 leading-relaxed font-medium">Your Secure AI Health Vault. <br/>Scan. Verify. Protect.</p>
          <button onClick={() => setStep(1)} className="group w-full bg-blue-600 text-white py-5 rounded-3xl font-bold text-xl flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-xl active:scale-95">
            Get Started <ArrowRight className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  // --- Step 1 & 2: Login ---
  if (step === 1 || step === 2) {
    return (
      <div className="fixed inset-0 bg-slate-50 flex items-center justify-center z-[100] p-4 text-slate-900">
        <div className="bg-white p-8 rounded-[3rem] max-w-sm w-full shadow-2xl border border-slate-100">
          <button onClick={() => setStep(step - 1)} className="text-slate-400 mb-6 hover:text-slate-900 transition-colors p-2"><ArrowLeft size={24} /></button>
          <h2 className="text-3xl font-extrabold mb-2">{step === 2 ? "Account Details" : "Welcome"}</h2>
          <div className="min-h-[280px] flex flex-col justify-center">
            {step === 1 ? (
              <div className="space-y-4">
                <button onClick={() => { setLoginMethod("email"); setStep(2); }} className="w-full p-5 border-2 border-slate-50 rounded-[1.5rem] flex items-center gap-4 hover:border-blue-500 hover:bg-blue-50 transition-all font-bold text-left">
                  <div className="p-3 bg-blue-100 rounded-xl text-blue-600"><Mail size={24} /></div> Email & Name
                </button>
                <button onClick={() => { setLoginMethod("phone"); setStep(2); }} className="w-full p-5 border-2 border-slate-50 rounded-[1.5rem] flex items-center gap-4 hover:border-blue-500 hover:bg-green-50 transition-all font-bold text-left">
                  <div className="p-3 bg-green-100 rounded-xl text-green-600"><Phone size={24} /></div> Phone Number
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {loginMethod === "email" ? (
                  <>
                    <input type="text" placeholder="Full Name" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl font-semibold outline-none" value={userData.name} onChange={(e) => setUserData({...userData, name: e.target.value})} />
                    <input type="email" placeholder="Email Address" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl font-semibold outline-none" value={userData.identifier} onChange={(e) => setUserData({...userData, identifier: e.target.value})} />
                  </>
                ) : (
                  <input type="tel" placeholder="+91 00000 00000" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-center text-xl outline-none" value={userData.identifier} onChange={(e) => setUserData({...userData, identifier: e.target.value, name: "Valued User"})} />
                )}
                <div className="relative pt-2 border-t border-slate-50 mt-2">
                  <input type={showPass ? "text" : "password"} placeholder="Password" 
                    className="w-full p-4 pl-12 bg-slate-50 border border-slate-100 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500"
                    value={userData.password} onChange={(e) => setUserData({...userData, password: e.target.value})} />
                  <Lock className="absolute left-4 top-[1.6rem] text-slate-400" size={18} />
                  <button onClick={() => setShowPass(!showPass)} className="absolute right-4 top-[1.6rem] text-slate-400">{showPass ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                </div>
                <button onClick={() => setStep(3)} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg active:scale-95 transition-all mt-4">Login</button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- Main Dashboard ---
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header userName={userData.name.trim() !== "" ? userData.name : "Guest"} />
      
      {notification && (
        <div className="fixed top-24 right-6 z-[300] bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <BellRing className="text-yellow-400" size={20} />
          <span className="font-bold text-sm">{notification}</span>
        </div>
      )}

      <main className="flex-grow max-w-7xl mx-auto px-4 py-12">
        <section className="mb-16 text-center">
          <h1 className="text-5xl font-black mb-4">Your Personal <span className="text-blue-600">Health Companion</span></h1>
          <p className="text-xl text-slate-600">Scan prescriptions and get instant medical insights.</p>
        </section>

        <section className="mb-16">
          <PrescriptionScanner onAnalysisComplete={(data: ScannedMedicine[]) => setScannedMeds(data)} />
        </section>

        {scannedMeds.length > 0 && (
          <section className="max-w-4xl mx-auto mb-20">
            <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <Pill className="text-blue-600" /> औषधांची माहिती (Medicine Details)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {scannedMeds.map((med, index) => (
                <div key={index} className="bg-white border-2 border-blue-500 rounded-[2rem] p-6 shadow-xl relative overflow-hidden transition-transform hover:scale-[1.02]">
                  <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 rounded-bl-2xl font-bold text-xs uppercase">
                    Medicine {index + 1}
                  </div>
                  <h4 className="text-2xl font-black text-blue-900 mb-4">{med.name}</h4>
                  <div className="space-y-4">
                    <div className="bg-slate-50 p-3 rounded-xl">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">उपयोग / Use</p>
                      <p className="text-lg font-bold text-slate-700">{med.use}</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                      <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">कधी घ्यावे / Dosage</p>
                      <p className="text-xl font-black text-blue-900">{med.dosage}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Medication Schedule */}
        <section className="max-w-2xl mx-auto mb-20">
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
             <div className="flex justify-between items-center mb-8">
               <h3 className="text-xl font-bold flex items-center gap-3">
                 <Clock className="text-blue-500" size={24} /> Medication Schedule
               </h3>
               <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold text-sm"> + Add New </button>
             </div>
             <div className="space-y-4">
               {meds.map((med) => (
                 <div key={med.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-3xl border hover:border-blue-100 hover:bg-white transition-all">
                   <div className="flex items-center gap-4">
                     <div className={`w-3 h-3 rounded-full ${med.status === 'Taken' ? 'bg-green-500' : 'bg-orange-500'}`} />
                     <div>
                       <p className="font-bold">{med.name}</p>
                       <p className="text-[10px] font-black uppercase text-slate-400">{med.status}</p>
                     </div>
                   </div>
                   <div className="flex items-center gap-6">
                     <span className="text-sm font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">{med.time}</span>
                     <button onClick={() => deleteMed(med.id)} className="text-slate-300 hover:text-red-500"><Trash2 size={18} /></button>
                   </div>
                 </div>
               ))}
             </div>
           </div>
        </section>
      </main>

      <footer className="w-full py-8 mt-auto border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-[10px] text-white font-bold">
              JM
            </div>
            <p className="text-sm text-slate-500 font-medium">
              © 2026 Jivan-Mitra. Made with ❤️ for Rural Health.
            </p>
          </div>
          
          <div className="flex gap-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Support</a>
          </div>
        </div>
      </footer>

      {/* --- Floating Buttons Section --- */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-[200]">
        <SOSEmergency /> 
        <Chatbot />
      </div>

      {/* --- Add Medication Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[400] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] p-10 w-full max-w-sm shadow-2xl">
            <h3 className="text-3xl font-black mb-6">New Reminder</h3>
            <div className="space-y-4">
              <input type="text" placeholder="Medicine Name" className="w-full p-5 bg-slate-50 rounded-2xl outline-none font-bold" value={newMed.name} onChange={(e) => setNewMed({...newMed, name: e.target.value})} />
              <input type="time" className="w-full p-5 bg-slate-50 rounded-2xl outline-none font-bold text-xl" value={newMed.time} onChange={(e) => setNewMed({...newMed, time: e.target.value})} />
              <div className="flex gap-4 pt-4">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 font-bold text-slate-400">Cancel</button>
                <button onClick={addMedication} className="flex-[2] bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700">Set Alarm</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
