import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';

export default function NLEMReportCards() {
  const reports = [
    {
      id: 1,
      title: 'Essential Medicines Report',
      description: 'NLEM Coverage Analysis',
      status: 'completed',
      icon: CheckCircle2,
      medicines: 12,
      coverage: 89,
      color: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-700'
    },
    {
      id: 2,
      title: 'Drug Interaction Check',
      description: 'Potential interactions detected',
      status: 'warning',
      icon: AlertCircle,
      interactions: 2,
      severity: 'low',
      color: 'from-amber-50 to-orange-50',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-700'
    },
    {
      id: 3,
      title: 'Dosage Recommendations',
      description: 'Age & weight adjusted',
      status: 'completed',
      icon: TrendingUp,
      medicines: 12,
      adjusted: 3,
      color: 'from-blue-50 to-indigo-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700'
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">NLEM Analysis Report</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reports.map((report) => {
          const Icon = report.icon;
          return (
            <Card key={report.id} className={`glass-glow border ${report.borderColor} bg-gradient-to-br ${report.color}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg text-slate-900">{report.title}</CardTitle>
                    <CardDescription className={report.textColor}>{report.description}</CardDescription>
                  </div>
                  <Icon className={`w-6 h-6 ${report.textColor}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {report.status === 'completed' && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">NLEM Coverage</span>
                        <span className="font-semibold text-slate-900">{report.coverage}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                          style={{ width: `${report.coverage}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-600 mt-2">{report.medicines} medicines verified</p>
                    </>
                  )}
                  {report.status === 'warning' && (
                    <>
                      <p className="text-sm font-semibold text-slate-900">{report.interactions} potential interactions</p>
                      <div className="bg-white/50 rounded p-2">
                        <p className="text-xs text-slate-600">Severity: <span className="font-semibold text-amber-700">{report.severity}</span></p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
