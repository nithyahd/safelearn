"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  ShieldAlert, 
  MapPin, 
  Loader2, 
  AlertTriangle, 
  Info,
  ShieldCheck,
  Flame,
  Zap,
  CheckCircle2,
  X,
  PhoneCall,
  ClipboardList,
  MoveUpRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Specific category details for the expandable cards
const CATEGORY_DETAILS: Record<string, { 
  title: string, 
  icon: any, 
  color: string, 
  sections: { title: string, icon: any, items: string[] }[] 
}> = {
  fire: {
    title: "Fire Safety & Prevention",
    icon: Flame,
    color: "text-red-500",
    sections: [
      { 
        title: "Prevention Tips", 
        icon: ShieldCheck,
        items: [
          "Install smoke alarms on every level and inside every bedroom.",
          "Keep space heaters at least 3 feet away from anything that can burn.",
          "Never leave candles or cooking appliances unattended.",
          "Inspect electrical cords for fraying or damage monthly."
        ] 
      },
      { 
        title: "Emergency Contacts", 
        icon: PhoneCall,
        items: [
          "Local Fire Department: 101 / 911",
          "Burn Center Referral Line",
          "Poison Control Hotline",
          "Building Management Emergency Line"
        ] 
      },
      { 
        title: "Evacuation Guidance", 
        icon: MoveUpRight,
        items: [
          "Stay low to the floor to avoid inhaling toxic smoke.",
          "Test door handles with the back of your hand before opening.",
          "Have a designated outdoor meeting spot for your household.",
          "Once out, stay out. Never go back inside a burning building."
        ] 
      }
    ]
  },
  flood: {
    title: "Flood Risk Preparedness",
    icon: Waves,
    color: "text-blue-500",
    sections: [
      { 
        title: "Preparedness Tips", 
        icon: ShieldCheck,
        items: [
          "Elevate electrical components and water heaters above flood level.",
          "Install check valves in plumbing to prevent backup.",
          "Keep important documents in a waterproof, portable container.",
          "Maintain clear gutters and drains around your property."
        ] 
      },
      { 
        title: "Safe Evacuation Steps", 
        icon: MoveUpRight,
        items: [
          "Follow designated evacuation routes only.",
          "Avoid walking or driving through moving water.",
          "Turn off utilities at the main switches if instructed.",
          "Seek higher ground immediately if a flash flood is possible."
        ] 
      },
      { 
        title: "Emergency Kit Checklist", 
        icon: ClipboardList,
        items: [
          "3-day supply of water (1 gallon per person per day).",
          "Non-perishable food and manual can opener.",
          "Battery-powered or hand-crank radio.",
          "Flashlight and extra batteries."
        ] 
      }
    ]
  },
  seismic: {
    title: "Seismic Activity Response",
    icon: Zap,
    color: "text-orange-500",
    sections: [
      { 
        title: "Drop, Cover, Hold On", 
        icon: ShieldCheck,
        items: [
          "DROP to your hands and knees.",
          "COVER your head and neck with your arms.",
          "HOLD ON to your shelter until shaking stops.",
          "Stay away from glass, windows, and heavy furniture."
        ] 
      },
      { 
        title: "Earthquake Safety Tips", 
        icon: ClipboardList,
        items: [
          "Secure heavy furniture like bookcases to wall studs.",
          "Know how to shut off gas and water main valves.",
          "Store heavy items on lower shelves.",
          "Keep sturdy shoes and a flashlight next to your bed."
        ] 
      },
      { 
        title: "Emergency Response Steps", 
        icon: MoveUpRight,
        items: [
          "Be prepared for aftershocks following the main tremor.",
          "Check yourself and others for injuries immediately.",
          "Use stairs, never elevators, if you must evacuate.",
          "If trapped, tap on a pipe or wall so rescuers can find you."
        ] 
      }
    ]
  }
};

export default function RiskToolPage() {
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (location.trim() === "") {
      setResult(null);
    }
  }, [location]);

  const handleAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim()) {
      toast({
        variant: "destructive",
        title: "Input required",
        description: "Please enter a location to assess risk."
      });
      return;
    }

    setLoading(true);
    setResult(null);

    await new Promise(resolve => setTimeout(resolve, 800));

    const city = location.toLowerCase().trim();
    let riskLevel = 'Low';
    let reason = "Based on general geographic data, this area shows a stable risk profile with no immediate high-priority hazards identified.";
    let breakdown = { fire: 'Low', flood: 'Low', seismic: 'Low' };

    if (city.includes("bangalore") || city.includes("mumbai")) {
      riskLevel = 'Medium';
      reason = "Regional weather patterns indicate potential urban flooding risks during monsoon seasons. Historical data shows susceptibility to heavy waterlogging.";
      breakdown = { fire: 'Low', flood: 'Medium', seismic: 'Low' };
    } else if (city.includes("delhi")) {
      riskLevel = 'Medium';
      reason = "High population density and dry climate contribute to increased fire safety concerns in urban sectors, especially during summer months.";
      breakdown = { fire: 'Medium', flood: 'Low', seismic: 'Low' };
    } else if (city.includes("shimla")) {
      riskLevel = 'High';
      reason = "Mountainous terrain and historical seismic data suggest higher earthquake vulnerability in this region. Landslide risk is also elevated.";
      breakdown = { fire: 'Low', flood: 'Low', seismic: 'High' };
    }

    setResult({
      riskLevel,
      reason,
      breakdown
    });
    setLoading(false);
  };

  const handleDownloadResource = () => {
    if (!selectedCategory) return;

    const pdfMap: Record<string, string> = {
      fire: "/resources/fire-safety-guide.pdf",
      flood: "/resources/flood-safety-guide.pdf",
      seismic: "/resources/seismic-activity-guide.pdf",
    };

    const pdfUrl = pdfMap[selectedCategory];

    if (pdfUrl) {
      window.open(pdfUrl, "_blank");
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Resource guide for this category is currently unavailable.",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mb-2">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h1 className="text-4xl font-bold font-headline text-foreground">Local Risk Assessment</h1>
        <p className="text-muted-foreground dark:text-zinc-400 text-lg max-w-2xl mx-auto">
          Understand the disaster risk profile of your area based on local geographic factors.
        </p>
      </div>

      <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white dark:bg-zinc-900">
        <CardContent className="p-10">
          <form onSubmit={handleAssessment} className="relative group max-w-2xl mx-auto">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground dark:text-zinc-500">
              <MapPin className="h-5 w-5" />
            </div>
            <Input 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter Bangalore, Mumbai, Delhi, Shimla..."
              className="h-16 pl-14 pr-36 rounded-2xl text-lg bg-muted/30 dark:bg-zinc-950 border-none shadow-inner focus-visible:ring-primary text-foreground"
            />
            <Button 
              type="submit" 
              disabled={loading || !location.trim()}
              className="absolute right-2 top-2 bottom-2 bg-primary hover:bg-primary/90 rounded-xl px-8 font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Assess Risk"}
            </Button>
          </form>

          {loading && (
            <div className="mt-12 flex flex-col items-center gap-4 text-muted-foreground dark:text-zinc-500 animate-pulse">
              <div className="h-4 w-48 bg-muted dark:bg-zinc-800 rounded-full" />
              <div className="h-4 w-64 bg-muted dark:bg-zinc-800 rounded-full" />
            </div>
          )}

          {result && !loading && (
            <div className="mt-12 space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center border-t border-border dark:border-zinc-800 pt-12">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl ${
                    result.riskLevel === 'High' ? 'bg-red-500/10 text-red-500' :
                    result.riskLevel === 'Medium' ? 'bg-orange-500/10 text-orange-500' :
                    'bg-emerald-500/10 text-emerald-500'
                  }`}>
                    {result.riskLevel === 'High' ? <AlertTriangle className="h-12 w-12" /> :
                     result.riskLevel === 'Medium' ? <Info className="h-12 w-12" /> :
                     <ShieldCheck className="h-12 w-12" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground dark:text-zinc-500">Overall Risk</p>
                    <p className={`text-3xl font-bold font-headline ${
                      result.riskLevel === 'High' ? 'text-red-500' :
                      result.riskLevel === 'Medium' ? 'text-orange-500' :
                      'text-emerald-500'
                    }`}>{result.riskLevel}</p>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-6">
                  <div className="bg-muted/50 dark:bg-zinc-800/50 p-6 rounded-3xl">
                    <h3 className="text-lg font-bold mb-2 flex items-center gap-2 text-foreground">
                      Geographic Analysis
                    </h3>
                    <p className="text-muted-foreground dark:text-zinc-400 leading-relaxed">
                      {result.reason}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-border dark:border-zinc-700">
                      <Flame className="h-5 w-5 mx-auto mb-1 text-red-500" />
                      <p className="text-[10px] uppercase font-black text-muted-foreground dark:text-zinc-500">Fire</p>
                      <p className="text-sm font-bold text-foreground">{result.breakdown.fire}</p>
                    </div>
                    <div className="text-center p-3 bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-border dark:border-zinc-700">
                      <Waves className="h-5 w-5 mx-auto mb-1 text-blue-500" />
                      <p className="text-[10px] uppercase font-black text-muted-foreground dark:text-zinc-500">Flood</p>
                      <p className="text-sm font-bold text-foreground">{result.breakdown.flood}</p>
                    </div>
                    <div className="text-center p-3 bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-border dark:border-zinc-700">
                      <Zap className="h-5 w-5 mx-auto mb-1 text-orange-500" />
                      <p className="text-[10px] uppercase font-black text-muted-foreground dark:text-zinc-500">Seismic</p>
                      <p className="text-sm font-bold text-foreground">{result.breakdown.seismic}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {[
          { id: 'fire', title: "Fire Safety", icon: Flame, desc: "Heatmaps and historical wildfire data analysis.", color: "bg-red-500" },
          { id: 'flood', title: "Flood Risk", icon: Waves, desc: "Elevation mapping and precipitation trends.", color: "bg-blue-500" },
          { id: 'seismic', title: "Seismic Activity", icon: Zap, desc: "Fault line proximity and earthquake patterns.", color: "bg-orange-500" },
        ].map((tool, i) => (
          <Card 
            key={i} 
            onClick={() => setSelectedCategory(selectedCategory === tool.id ? null : tool.id)}
            className={`border-none shadow-lg rounded-3xl hover:shadow-xl transition-all cursor-pointer group relative overflow-hidden ${
              selectedCategory === tool.id ? 'ring-2 ring-primary bg-primary/5 dark:bg-primary/10' : 'bg-white dark:bg-zinc-900'
            }`}
          >
            {selectedCategory === tool.id && (
              <div className="absolute top-3 right-3">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
            )}
            <CardContent className="p-6">
              <div className={`${tool.color} w-10 h-10 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                <tool.icon className="h-5 w-5" />
              </div>
              <h4 className="font-bold mb-2 font-headline text-foreground">{tool.title}</h4>
              <p className="text-xs text-muted-foreground dark:text-zinc-400">{tool.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedCategory && CATEGORY_DETAILS[selectedCategory] && (
        <Card className="border-none shadow-2xl rounded-[2.5rem] bg-slate-900 dark:bg-zinc-950 text-white overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
          <CardContent className="p-10 relative">
            <button 
              onClick={() => setSelectedCategory(null)}
              className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors z-20"
            >
              <X className="h-6 w-6" />
            </button>
            
            <div className="space-y-10">
              <div className="flex items-center gap-6">
                <div className={`p-5 rounded-2xl bg-white/10 ${CATEGORY_DETAILS[selectedCategory].color}`}>
                  {React.createElement(CATEGORY_DETAILS[selectedCategory].icon, { className: "h-10 w-10" })}
                </div>
                <div>
                  <h2 className="text-3xl font-bold font-headline">{CATEGORY_DETAILS[selectedCategory].title}</h2>
                  <p className="text-white/60 font-medium">Critical actions and information for community resilience.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {CATEGORY_DETAILS[selectedCategory].sections.map((section, idx) => (
                  <div key={idx} className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 bg-primary/20 rounded-lg text-primary">
                        {React.createElement(section.icon, { className: "h-4 w-4" })}
                      </div>
                      <h3 className="font-bold uppercase tracking-widest text-xs text-primary/80">{section.title}</h3>
                    </div>
                    <ul className="space-y-3">
                      {section.items.map((item, i) => (
                        <li key={i} className="flex gap-3 text-sm leading-relaxed text-white/80 group">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0 group-hover:scale-150 transition-transform" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
                 <div className="flex items-center gap-4">
                   <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                     <ShieldCheck className="h-6 w-6" />
                   </div>
                   <p className="text-sm font-medium text-white/70">Verified safety protocols based on national emergency guidelines.</p>
                 </div>
                 <Button 
                    onClick={handleDownloadResource}
                    className="bg-primary hover:bg-primary/90 text-white rounded-xl px-8 h-12 font-bold shadow-lg shadow-primary/20"
                 >
                    Download Resource Guide
                 </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Waves(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
      <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
      <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
    </svg>
  );
}
