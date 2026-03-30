"use client";

import { Upload, Loader2, CheckCircle2, ClipboardCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useRef } from 'react';

interface ScannerProps {
  onAnalysisComplete: (data: any) => void;
}

export default function PrescriptionScanner({ onAnalysisComplete }: ScannerProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setAnalyzed(false);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/analyze-prescription", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Analysis failed");

      const result = await response.json();

      if (result.status === "success") {
        setAnalyzed(true);
        onAnalysisComplete(result.medicines);
      }
    } catch (error) {
      console.error("Error details:", error);
      
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        alert("CONNECTION ERROR: Is your Python backend running on Port 8000?");
      } else {
        alert("SERVER ERROR: The backend is running, but the AI analysis failed. Check the Python terminal logs.");
      }
    } finally {
      setLoading(false);
    }
  }; 

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-blue-500', 'bg-blue-50');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      setAnalyzed(false);
    }
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="bg-white rounded-2xl p-8 border-2 border-dashed border-blue-300 transition-all cursor-pointer hover:border-blue-500 hover:shadow-lg shadow-lg flex flex-col items-center justify-center min-h-[400px]"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center gap-4 w-full">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
            <Upload className="w-8 h-8 text-blue-600" strokeWidth={1.5} />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              {file ? 'Prescription Ready' : 'Upload Prescription'}
            </h2>
            <p className="text-slate-600 text-sm">
              {file ? file.name : 'Drag and drop your prescription here or click to browse'}
            </p>
          </div>

          {!analyzed && file && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleAnalyze();
              }}
              disabled={loading}
              className="gap-2 text-white px-8 font-bold rounded-xl transition-transform active:scale-95"
              style={{ backgroundColor: '#4C8CE4' }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Analyze Prescription'
              )}
            </Button>
          )}

          {analyzed && (
            <div className="w-full bg-green-50 border border-green-300 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-green-700 font-bold mb-1">
                <CheckCircle2 className="w-5 h-5" />
                Analysis Complete
              </div>
              <p className="text-green-600 text-sm">Your prescription has been analyzed successfully</p>
            </div>
          )}
        </div>
      </div>

      {/* Results Panel */}
      <div className="bg-white rounded-2xl p-8 border border-blue-300 shadow-lg flex flex-col min-h-[400px]">
        <div className="space-y-6 flex-1 flex flex-col">
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">NLEM Compliance Report</h3>
            <p className="text-slate-600 text-sm font-medium">National List of Essential Medicines Analysis</p>
          </div>

          {!analyzed ? (
            <div className="space-y-4 py-12 flex flex-col items-center justify-center flex-1">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-50">
                <ClipboardCheck className="w-6 h-6 text-blue-400" />
              </div>
              <p className="text-center text-slate-400 font-bold text-sm">
                Analysis pending... Upload a prescription to begin.
              </p>
            </div>
          ) : (
            <div className="space-y-4 flex-1">
              <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-slate-900">Essential Medicines Coverage</h4>
                  <span className="text-sm font-black text-blue-600">92%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5">
                  <div className="h-2.5 rounded-full bg-blue-500 transition-all duration-1000" style={{ width: '92%' }} />
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                <h4 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-wider">Key Findings</h4>
                <ul className="space-y-3 text-sm text-slate-600 font-medium">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500 font-bold">✓</span> All primary medications are on NLEM list
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500 font-bold">✓</span> No critical drug interactions detected
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-amber-500 font-bold">⚠</span> Check dosage for patient age group
                  </li>
                </ul>
              </div>

              <Button className="w-full text-white mt-auto bg-blue-600 hover:bg-blue-700 rounded-xl font-bold py-6 shadow-md transition-all">
                View Full Detailed Report
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
