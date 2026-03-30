'use client';

import { useState } from 'react';
import { AlertTriangle, Phone, MapPin, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function SOSEmergency() {
  const [isOpen, setIsOpen] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSOSSubmit = () => {
    if (contactName && contactPhone) {
      console.log('SOS Alert submitted:', { contactName, contactPhone });
      setSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
        setContactName('');
        setContactPhone('');
        setSubmitted(false);
      }, 2000);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <button 
            className="fixed bottom-28 right-6 z-[35] w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center hover:scale-110 transform duration-200"
            aria-label="Emergency SOS"
            title="Emergency Alert"
          >
            <AlertTriangle className="w-6 h-6" strokeWidth={1.5} />
          </button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md bg-white rounded-[2rem]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600 text-xl font-black">
              <AlertTriangle className="w-6 h-6" strokeWidth={2} />
              Emergency Alert
            </DialogTitle>
            <DialogDescription className="font-medium">
              Send an emergency notification to your emergency contacts.
            </DialogDescription>
          </DialogHeader>

          {!submitted ? (
            <div className="space-y-4 pt-4">
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">
                  <User className="w-3 h-3 inline mr-1" />
                  Contact Name
                </label>
                <Input
                  placeholder="Emergency contact name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none p-6 font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">
                  <Phone className="w-3 h-3 inline mr-1" />
                  Phone Number
                </label>
                <Input
                  placeholder="+91 XXXXXXXXXX"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none p-6 font-bold"
                  type="tel"
                />
              </div>

              <div className="bg-blue-50 border border-blue-500/20 rounded-2xl p-4 text-sm text-slate-700 flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-600 shrink-0" strokeWidth={2} />
                <p className="font-medium leading-relaxed">
                  Your current GPS location will be shared with emergency contacts automatically.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="ghost"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 font-bold text-slate-400"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSOSSubmit}
                  disabled={!contactName || !contactPhone}
                  className="flex-[2] bg-red-600 hover:bg-red-700 text-white py-6 rounded-3xl font-bold text-lg shadow-lg active:scale-95 transition-all"
                >
                  Send SOS Alert
                </Button>
              </div>
              
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6 animate-bounce">
                <span className="text-4xl">✓</span>
              </div>
              <h4 className="text-2xl font-black text-slate-900 mb-2">Alert Sent!</h4>
              <p className="text-slate-500 font-medium">Emergency contacts are being notified.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
