
"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Gamepad2, 
  Zap, 
  Flame, 
  Play, 
  Clock, 
  Trophy, 
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  XCircle,
  RotateCcw,
  TrophyIcon,
  Timer
} from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { doc, updateDoc, increment, setDoc, getDoc } from "firebase/firestore";

// Custom Waves icon for the Flood scenario
function WavesIcon(props: any) {
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

const DRILL_SCENARIOS = [
  {
    id: "flood-drill",
    title: "City Flood Crisis",
    description: "Navigate a rapidly flooding downtown area. Coordinate with emergency services and reach higher ground.",
    difficulty: "Hard",
    xp: 1200,
    duration: "15 min",
    icon: WavesIcon,
    image: "https://picsum.photos/seed/drill-flood/800/600",
    color: "blue",
    steps: [
      {
        situation: "Heavy rainfall has caused the local river to breach its banks. Water is beginning to seep into the street outside. What is your first priority?",
        options: [
          { text: "Move electronics and valuable documents to the second floor.", correct: true, feedback: "Correct! Protecting vital items early prevents loss before evacuation becomes necessary." },
          { text: "Drive to the supermarket to stock up on more supplies.", correct: false, feedback: "Incorrect. Driving during an active flood is dangerous and can lead to being trapped in your vehicle." },
          { text: "Call emergency services to ask for a status update.", correct: false, feedback: "Incorrect. Emergency lines should be kept clear for life-threatening situations. Monitor local news instead." }
        ]
      },
      {
        situation: "The local authorities have issued a mandatory evacuation order for your zone. The main road is covered in several inches of moving water. How do you proceed?",
        options: [
          { text: "Walk through the water carefully using a stick for balance.", correct: false, feedback: "Incorrect. Just 6 inches of moving water can knock an adult off their feet. Never walk through floodwater." },
          { text: "Use your SUV to drive through, as it has high ground clearance.", correct: false, feedback: "Incorrect. Most vehicles can be swept away in just 12-24 inches of water. Roads may also be washed out underneath." },
          { text: "Identify the pre-planned evacuation route on higher ground.", correct: true, feedback: "Correct! Always follow designated evacuation routes which are surveyed for safety." }
        ]
      }
    ]
  },
  {
    id: "quake-drill",
    title: "School Earthquake",
    description: "An unexpected tremor hits during school hours. Lead your classmates through drop, cover, and hold-on protocols.",
    difficulty: "Medium",
    xp: 800,
    duration: "10 min",
    icon: Zap,
    image: "https://picsum.photos/seed/drill-quake/800/600",
    color: "orange",
    steps: [
      {
        situation: "You are in the middle of a science lab when the ground starts shaking violently. Glassware is on the tables. What do you do immediately?",
        options: [
          { text: "Run for the nearest exit as fast as possible.", correct: false, feedback: "Incorrect. Running during shaking is the most common way to get injured by falling objects." },
          { text: "Drop, Cover, and Hold On under a sturdy lab table.", correct: true, feedback: "Correct! This protects you from falling objects and keeps you stable during the movement." },
          { text: "Stand in a doorway for structural support.", correct: false, feedback: "Incorrect. Doorways in modern buildings are not stronger than other parts and offer no protection from flying debris." }
        ]
      },
      {
        situation: "The shaking has stopped. There is a smell of gas in the hallway and the fire alarm is sounding. How do you evacuate?",
        options: [
          { text: "Take the elevator to reach the ground floor quickly.", correct: false, feedback: "Incorrect. Elevators can lose power or malfunction during seismic events, trapping you inside." },
          { text: "Wait in the classroom for a teacher or first responder.", correct: false, feedback: "Incorrect. If there is a gas smell or fire hazard, you must evacuate to a safe outdoor assembly area." },
          { text: "Use the stairs and cover your nose/mouth while moving to the assembly point.", correct: true, feedback: "Correct! Stairs are the safest exit, and covering your face helps if dust or smoke is present." }
        ]
      }
    ]
  },
  {
    id: "fire-drill",
    title: "Home Fire Escape",
    description: "Smoke detectors are blaring at 2 AM. Find your primary and secondary escape routes while staying low.",
    difficulty: "Easy",
    xp: 400,
    duration: "5 min",
    icon: Flame,
    image: "https://picsum.photos/seed/drill-fire/800/600",
    color: "red",
    steps: [
      {
        situation: "You wake up to the smoke alarm. The room is filling with smoke. What is your first physical action?",
        options: [
          { text: "Stand up and run to the window to see where the fire is.", correct: false, feedback: "Incorrect. Smoke and toxic gases rise; the cleanest air is near the floor. You must stay low." },
          { text: "Roll out of bed and crawl on your hands and knees.", correct: true, feedback: "Correct! Staying low helps you breathe better and see more clearly in a smoke-filled environment." },
          { text: "Grab your laptop and phone before leaving.", correct: false, feedback: "Incorrect. In a fire, every second counts. Never stop to gather personal belongings." }
        ]
      },
      {
        situation: "You reach your bedroom door. It is closed. Before opening it, what must you do?",
        options: [
          { text: "Open it slightly to peek into the hallway.", correct: false, feedback: "Incorrect. Opening the door could let in a rush of heat and smoke (backdraft)." },
          { text: "Feel the door and doorknob with the back of your hand.", correct: true, feedback: "Correct! If the door is hot, the fire is right outside. Use your secondary exit (like a window) instead." },
          { text: "Shout for help through the door.", correct: false, feedback: "Incorrect. Shouting can cause you to inhale more smoke. Focus on testing the exit first." }
        ]
      }
    ]
  },
];

export default function VirtualDrillsPage() {
  const [activeScenario, setActiveScenario] = useState<any>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);

  const startDrill = (scenario: any) => {
    setActiveScenario(scenario);
    setCurrentStepIndex(0);
    setSelectedOptionIndex(null);
    setScore(0);
    setIsCompleted(false);
    setStartTime(Date.now());
  };

  const handleOptionSelect = (index: number) => {
    if (selectedOptionIndex !== null) return;
    
    setSelectedOptionIndex(index);
    if (activeScenario?.steps?.[currentStepIndex]?.options?.[index]?.correct) {
      setScore(prev => prev + 1);
    }
  };

  const earnedXP = useMemo(() => {
    if (!activeScenario || !activeScenario.steps?.length) return 0;
    const accuracy = score / activeScenario.steps.length;
    return Math.floor(activeScenario.xp * accuracy);
  }, [score, activeScenario]);

  const accuracyRate = useMemo(() => {
    if (!activeScenario || !activeScenario.steps?.length) return 0;
    return score / activeScenario.steps.length;
  }, [score, activeScenario]);

  const syncProgressToFirestore = async (xpValue: number, accuracy: number) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const userRef = doc(db, "users", user.uid);
      const leaderboardRef = doc(db, "leaderboard", user.uid);
      
      const readinessBoost = Math.round(accuracy * 8);

      const updateData = {
        xp: increment(xpValue),
        readiness: increment(readinessBoost)
      };

      await updateDoc(userRef, updateData).catch(async (e) => {
          await setDoc(userRef, {
            displayName: user.displayName || user.email?.split('@')[0],
            xp: xpValue,
            readiness: readinessBoost,
            email: user.email
          });
      });
      
      try {
        await updateDoc(leaderboardRef, {
          xp: increment(xpValue),
          readiness: increment(readinessBoost)
        });
      } catch (e) {
        await setDoc(leaderboardRef, {
          userId: user.uid,
          name: user.displayName || user.email?.split('@')[0] || "Anonymous",
          xp: xpValue,
          readiness: readinessBoost,
          photoURL: user.photoURL || ""
        });
      }
    } catch (error) {
      console.error("Error syncing progress to Firestore:", error);
    }
  };

  const nextStep = async () => {
    if (activeScenario && currentStepIndex + 1 < activeScenario.steps.length) {
      setCurrentStepIndex(prev => prev + 1);
      setSelectedOptionIndex(null);
    } else {
      setIsCompleted(true);
      setEndTime(Date.now());
      
      if (earnedXP > 0) {
        await syncProgressToFirestore(earnedXP, accuracyRate);
      }
    }
  };

  const timeTaken = useMemo(() => {
    if (!startTime || !endTime) return "0s";
    const seconds = Math.floor((endTime - startTime) / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  }, [startTime, endTime]);

  if (activeScenario && !isCompleted) {
    const currentStep = activeScenario.steps[currentStepIndex];
    const totalSteps = activeScenario.steps.length;
    const progress = ((currentStepIndex + 1) / totalSteps) * 100;

    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold font-headline text-foreground">{activeScenario.title}</h2>
            <p className="text-muted-foreground dark:text-zinc-400 text-sm flex items-center gap-2">
              <Gamepad2 className="h-4 w-4" /> Step {currentStepIndex + 1} of {totalSteps}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setActiveScenario(null)} className="rounded-xl font-bold border-border dark:border-zinc-800">
            Exit Drill
          </Button>
        </div>

        <Progress value={progress} className="h-2 bg-muted dark:bg-zinc-800 rounded-full" />

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <Card className="md:col-span-3 border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white dark:bg-zinc-900">
            <div className="h-64 relative">
              <Image 
                src={activeScenario.image} 
                alt="Drill scene" 
                fill 
                className="object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <Badge className="mb-2 bg-white/20 backdrop-blur-md border-none text-white uppercase font-black text-[10px]">
                  Scenario Context
                </Badge>
                <p className="font-bold text-lg leading-tight">{currentStep?.situation}</p>
              </div>
            </div>
            <CardContent className="p-8 space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground dark:text-zinc-500 mb-4">Select your action:</h3>
              <div className="space-y-3">
                {currentStep?.options?.map((option: any, idx: number) => {
                  const isSelected = selectedOptionIndex === idx;
                  const showCorrect = selectedOptionIndex !== null && option.correct;
                  const showWrong = isSelected && !option.correct;

                  return (
                    <button
                      key={idx}
                      disabled={selectedOptionIndex !== null}
                      onClick={() => handleOptionSelect(idx)}
                      className={`w-full p-5 rounded-2xl border-2 text-left transition-all flex items-center justify-between group ${
                        isSelected 
                          ? option.correct 
                            ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10" 
                            : "border-red-500 bg-red-50 dark:bg-red-500/10"
                          : selectedOptionIndex !== null 
                            ? option.correct ? "border-emerald-500/30 opacity-70" : "border-border dark:border-zinc-800 opacity-50"
                            : "border-border dark:border-zinc-800 hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10"
                      }`}
                    >
                      <span className={`font-bold ${isSelected ? "text-foreground" : "text-muted-foreground dark:text-zinc-400 group-hover:text-primary"}`}>
                        {option.text}
                      </span>
                      {showCorrect && <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0 ml-4" />}
                      {showWrong && <XCircle className="h-6 w-6 text-red-500 shrink-0 ml-4" />}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="md:col-span-2 space-y-6">
            <Card className="border-none shadow-xl rounded-[2rem] bg-slate-900 dark:bg-zinc-950 text-white p-8">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/50 mb-4">AI Advisor Feedback</h3>
              {selectedOptionIndex !== null ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                  <div className={`p-4 rounded-2xl ${
                    currentStep?.options?.[selectedOptionIndex]?.correct 
                      ? "bg-emerald-500/20 text-emerald-400" 
                      : "bg-red-500/20 text-red-400"
                  }`}>
                    <p className="font-bold leading-relaxed">
                      {currentStep?.options?.[selectedOptionIndex]?.feedback}
                    </p>
                  </div>
                  <Button 
                    onClick={nextStep}
                    className="w-full h-14 bg-white text-slate-900 hover:bg-white/90 rounded-2xl font-black shadow-xl"
                  >
                    {currentStepIndex + 1 === totalSteps ? "Finish Drill" : "Next Situation"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center opacity-40">
                  <ShieldAlert className="h-12 w-12 mb-4" />
                  <p className="font-medium">Waiting for your decision...</p>
                </div>
              )}
            </Card>

            <div className="bg-primary/5 dark:bg-primary/10 border border-primary/10 rounded-3xl p-6 space-y-4">
               <div className="flex items-center gap-3">
                 <div className="bg-primary p-2 rounded-xl text-white">
                   <Zap className="h-4 w-4" />
                 </div>
                 <span className="font-black text-sm uppercase tracking-tight text-foreground">Active Rewards</span>
               </div>
               <div className="flex justify-between items-center">
                 <p className="text-sm font-medium text-muted-foreground dark:text-zinc-400">Accuracy Score</p>
                 <p className="font-black text-primary">{Math.round((score / totalSteps) * 100)}%</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isCompleted && activeScenario) {
    return (
      <div className="max-w-2xl mx-auto space-y-10 py-12 animate-in zoom-in-95 duration-500">
        <div className="text-center space-y-4">
          <div className="mx-auto w-24 h-24 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-emerald-200 mb-6 rotate-12">
            <TrophyIcon className="h-12 w-12" />
          </div>
          <h1 className="text-5xl font-black font-headline text-foreground">Drill Completed!</h1>
          <p className="text-muted-foreground dark:text-zinc-400 text-xl font-medium">Excellent work, Responder. Your readiness has increased.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-xl rounded-[2rem] bg-white dark:bg-zinc-900 p-6 text-center space-y-2">
            <CheckCircle2 className="h-6 w-6 text-emerald-500 mx-auto" />
            <p className="text-2xl font-black text-foreground">{score}/{activeScenario.steps?.length || 0}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground dark:text-zinc-500">Correct Answers</p>
          </Card>
          <Card className="border-none shadow-xl rounded-[2rem] bg-white dark:bg-zinc-900 p-6 text-center space-y-2">
            <Timer className="h-6 w-6 text-blue-500 mx-auto" />
            <p className="text-2xl font-black text-foreground">{timeTaken}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground dark:text-zinc-500">Time Taken</p>
          </Card>
          <Card className="border-none shadow-xl rounded-[2rem] bg-primary text-white p-6 text-center space-y-2">
            <Zap className="h-6 w-6 text-white/80 mx-auto" />
            <p className="text-2xl font-black">+{earnedXP}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/60">XP Earned</p>
          </Card>
        </div>

        <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 p-6 rounded-[2rem] text-center">
            <p className="text-emerald-700 dark:text-emerald-400 font-bold mb-1">Readiness Level Boosted!</p>
            <p className="text-emerald-600 dark:text-emerald-500/80 text-sm font-medium">Your global readiness score increased by +{Math.round(accuracyRate * 8)}%</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={() => startDrill(activeScenario)}
            variant="outline"
            className="flex-1 h-14 rounded-2xl font-black text-lg border-2 border-border dark:border-zinc-800 text-foreground"
          >
            <RotateCcw className="mr-2 h-5 w-5" /> Retry Drill
          </Button>
          <Button 
            onClick={() => setActiveScenario(null)}
            className="flex-1 h-14 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black text-lg shadow-xl shadow-primary/20"
          >
            Back to All Drills
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-[0.2em] text-xs">
            <Gamepad2 className="h-4 w-4" /> Interactive Simulations
          </div>
          <h1 className="text-4xl font-bold font-headline tracking-tight text-foreground">Virtual Drills</h1>
          <p className="text-muted-foreground dark:text-zinc-400 text-lg max-w-2xl">
            Test your split-second decision-making skills in high-stakes environments. Practice makes permanent.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 p-2 rounded-2xl shadow-sm border border-border dark:border-zinc-800">
          <div className="bg-primary/10 p-2 rounded-xl">
            <Trophy className="h-5 w-5 text-primary" />
          </div>
          <div className="pr-4">
            <p className="text-[10px] text-muted-foreground dark:text-zinc-500 uppercase font-black">Community Achievement</p>
            <p className="text-lg font-bold text-foreground">Verified Responder</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {DRILL_SCENARIOS.map((scenario) => {
          const Icon = scenario.icon;
          return (
            <Card key={scenario.id} className="group overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-300 rounded-[2.5rem] bg-white dark:bg-zinc-900 flex flex-col">
              <div className="h-48 relative overflow-hidden">
                <Image 
                  src={scenario.image} 
                  alt={scenario.title} 
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700" 
                  data-ai-hint={`${scenario.title.toLowerCase()} disaster`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute top-6 left-6">
                  <Badge variant="secondary" className="bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md text-foreground dark:text-zinc-100 font-black uppercase text-[10px] px-3 py-1 rounded-full border-none shadow-sm">
                    {scenario.difficulty}
                  </Badge>
                </div>
                <div className="absolute bottom-6 left-6 text-white flex items-center gap-2">
                  <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </div>
              
              <CardHeader className="flex-1 px-8 pt-8">
                <CardTitle className="text-2xl font-bold font-headline group-hover:text-primary transition-colors text-foreground">
                  {scenario.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground dark:text-zinc-400 mt-2 font-medium line-clamp-3">
                  {scenario.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6 px-8 pb-8 pt-0">
                <div className="flex items-center justify-between border-t border-border dark:border-zinc-800 pt-6">
                  <div className="flex items-center gap-2">
                    <div className="bg-emerald-500/10 p-1.5 rounded-lg">
                      <Zap className="h-4 w-4 text-emerald-500 fill-emerald-500" />
                    </div>
                    <span className="text-sm font-black text-foreground">{scenario.xp} XP</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground dark:text-zinc-500">
                    <Clock className="h-4 w-4" />
                    <span className="text-xs font-bold">{scenario.duration}</span>
                  </div>
                </div>

                <Button 
                  onClick={() => startDrill(scenario)}
                  className="w-full bg-primary hover:bg-primary/90 text-white rounded-2xl h-14 font-black shadow-xl shadow-primary/20 group/btn transition-all active:scale-95"
                >
                  Start Drill
                  <Play className="ml-2 h-4 w-4 fill-white group-hover/btn:scale-110 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          );
        })}

        {/* Locked Advanced Drill */}
        <Card className="border-2 border-dashed border-muted dark:border-zinc-800 bg-muted/20 dark:bg-zinc-900/20 rounded-[2.5rem] flex flex-col items-center justify-center p-10 text-center space-y-4 opacity-70">
           <div className="h-20 w-20 rounded-3xl bg-white dark:bg-zinc-800 flex items-center justify-center shadow-sm">
              <ShieldAlert className="h-10 w-10 text-muted-foreground dark:text-zinc-500" />
           </div>
           <div>
             <h3 className="font-bold text-xl font-headline text-foreground">Wildfire Evacuation</h3>
             <p className="text-sm text-muted-foreground dark:text-zinc-500 max-w-[220px] mx-auto">Requires Level 10 Certification to unlock this multi-stage simulation.</p>
           </div>
           <Button disabled variant="outline" className="rounded-xl font-bold h-12 px-8 bg-white/50 dark:bg-zinc-800/50 dark:border-zinc-700">
             Locked Simulation
           </Button>
        </Card>
      </div>
    </div>
  );
}
