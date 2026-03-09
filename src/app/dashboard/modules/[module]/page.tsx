
"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  Zap, 
  Lightbulb,
  Cpu,
  Activity,
  Lock,
  ChevronRight,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DISASTER_MODULES } from "@/lib/mock-data";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, updateDoc, increment, getDoc } from "firebase/firestore";

export default function ModuleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const moduleId = (params.module as string) || "fire";
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [lessons, setLessons] = useState<any[]>([]);
  const [activeLessonId, setActiveLessonId] = useState(1);
  const [loading, setLoading] = useState(true);

  const module = DISASTER_MODULES.find(m => m.id === moduleId);

  // Initialize lessons on load and sync with Firestore
  useEffect(() => {
    const fetchProgress = async () => {
      const user = auth.currentUser;
      const baseLessons = module?.lessonsList || [];
      
      if (user && baseLessons.length > 0) {
        const progressDoc = await getDoc(doc(db, "users", user.uid, "module_progress", moduleId));
        if (progressDoc.exists()) {
          const completedCount = progressDoc.data().completedLessons || 0;
          setLessons(baseLessons.map((l, idx) => ({
            ...l,
            completed: idx < completedCount
          })));
          // Set active lesson to the first uncompleted one
          const nextLessonId = Math.min(completedCount + 1, baseLessons.length);
          setActiveLessonId(nextLessonId);
        } else {
          setLessons(baseLessons);
        }
      } else {
        setLessons(baseLessons);
      }
      setLoading(false);
    };
    
    fetchProgress();
  }, [moduleId, module]);

  const activeLesson = useMemo(() => {
    return lessons.find(l => l.id === activeLessonId) || lessons[0];
  }, [lessons, activeLessonId]);

  const completedCount = useMemo(() => lessons.filter(l => l.completed).length, [lessons]);
  const progressValue = useMemo(() => (completedCount / (lessons.length || 1)) * 100, [completedCount, lessons.length]);

  const handleLessonComplete = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const newLessons = lessons.map(lesson => 
      lesson.id === activeLessonId ? { ...lesson, completed: true } : lesson
    );
    
    setLessons(newLessons);
    const newCompletedCount = newLessons.filter(l => l.completed).length;

    try {
      // Update specific module progress
      const progressRef = doc(db, "users", user.uid, "module_progress", moduleId);
      await setDoc(progressRef, {
        completedLessons: newCompletedCount,
        totalLessons: lessons.length,
        lastUpdated: new Date()
      }, { merge: true });

      // Update global user stats
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        xp: increment(25),
        readiness: increment(2) // Small readiness boost per lesson
      });

      toast({
        title: "Lesson Completed!",
        description: `You've mastered "${activeLesson.title}". +25 XP`,
        className: "bg-emerald-500 text-white border-none",
      });

      // Automatically try to select the next lesson if it exists
      const nextLesson = newLessons.find(l => l.id === activeLessonId + 1);
      if (nextLesson) {
        setTimeout(() => {
          setActiveLessonId(activeLessonId + 1);
          setIsPlaying(true);
        }, 1500);
      }
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  const isLessonLocked = (lessonId: number) => {
    if (lessonId === 1) return false;
    const prevLesson = lessons.find(l => l.id === lessonId - 1);
    return !prevLesson?.completed;
  };

  if (loading || !module || lessons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="font-headline font-bold text-muted-foreground animate-pulse">Initializing simulation...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <Link 
        href="/dashboard/learning-modules" 
        className="inline-flex items-center gap-2 text-muted-foreground dark:text-zinc-400 hover:text-primary transition-colors font-bold text-sm"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Modules
      </Link>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white ${
              module.color === 'red' ? 'bg-red-500' : 
              module.color === 'blue' ? 'bg-blue-500' : 
              'bg-orange-500'
            }`}>
              {module.type} Module
            </span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground dark:text-zinc-500">
              <Clock className="h-3.5 w-3.5" />
              Est. {lessons.length * 15} mins total
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight text-foreground">{module.title}</h1>
          <p className="text-muted-foreground dark:text-zinc-400 text-lg max-w-3xl font-medium leading-relaxed">
            Current Lesson: <span className="text-foreground dark:text-white font-bold">{activeLesson?.title}</span>
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 p-4 rounded-3xl shadow-xl border border-border">
          <div className="bg-primary/10 p-3 rounded-2xl">
            <Zap className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground dark:text-zinc-500 uppercase tracking-widest font-black">Module XP Reward</p>
            <p className="text-2xl font-black text-primary">{module.xp} XP</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Simulation Section */}
          <div className="space-y-4">
            <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-slate-950 group relative aspect-video flex items-center justify-center">
              {isPlaying && activeLesson ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <iframe 
                    src={`${activeLesson.videoUrl}?autoplay=1&rel=0&enablejsapi=1`}
                    className="absolute inset-0 w-full h-full rounded-[2.5rem]"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    title={activeLesson.title}
                  />
                  
                  {/* AI HUD Elements Overlay */}
                  <div className="absolute top-8 left-8 z-20 flex flex-col gap-2 pointer-events-none">
                    <div className="flex items-center gap-2 px-3 py-1 bg-primary/40 backdrop-blur-md rounded-full border border-primary/50 text-[10px] font-bold text-white uppercase tracking-widest animate-pulse">
                      <Activity className="h-3 w-3" /> Simulation Active
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <Image 
                    src={module.image} 
                    alt="Simulation preview" 
                    fill
                    className="object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />
                  <div className="relative z-10 flex flex-col items-center gap-6 text-center px-8">
                    <Button 
                      size="icon" 
                      className="h-24 w-24 rounded-full bg-primary hover:bg-primary/90 text-white shadow-2xl scale-110 active:scale-100 transition-all border-4 border-white/10"
                      onClick={() => setIsPlaying(true)}
                    >
                      <Cpu className="h-10 w-10 animate-spin" style={{ animationDuration: '3s' }} />
                    </Button>
                    <div className="space-y-2">
                      <p className="text-white font-black text-sm uppercase tracking-[0.3em] animate-pulse">
                        Initialize Simulation
                      </p>
                      <h3 className="text-2xl font-bold font-headline text-white">{activeLesson?.title}</h3>
                    </div>
                  </div>
                </>
              )}
            </Card>
            
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-lg border border-border flex flex-col md:flex-row md:items-center justify-between gap-6">
               <div className="space-y-1 max-w-xl">
                 <h3 className="text-lg font-bold font-headline text-foreground">{activeLesson?.title}</h3>
                 <p className="text-muted-foreground dark:text-zinc-400 font-medium leading-relaxed text-sm">{activeLesson?.description}</p>
               </div>
               {isPlaying && !activeLesson.completed && (
                 <Button 
                  onClick={handleLessonComplete}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl h-12 px-8 font-black shadow-lg shadow-emerald-200 shrink-0"
                 >
                   <CheckCircle2 className="mr-2 h-5 w-5" /> Mark as Finished
                 </Button>
               )}
               {activeLesson.completed && (
                 <div className="flex items-center gap-2 px-6 py-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl border border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                    <CheckCircle2 className="h-5 w-5" /> Lesson Mastered
                 </div>
               )}
            </div>
          </div>

          {/* Lesson List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold font-headline px-2 text-foreground">Module Curriculum</h2>
            <div className="space-y-3">
              {lessons.map((lesson) => {
                const locked = isLessonLocked(lesson.id);
                const isActive = lesson.id === activeLessonId;
                
                return (
                  <div 
                    key={lesson.id} 
                    role="button"
                    tabIndex={locked ? -1 : 0}
                    onClick={() => {
                      if (!locked) {
                        setActiveLessonId(lesson.id);
                        setIsPlaying(true);
                      }
                    }}
                    className={`w-full flex items-center justify-between p-5 rounded-3xl border transition-all text-left ${
                      locked 
                        ? "bg-muted/30 dark:bg-zinc-900/40 border-muted dark:border-zinc-800 opacity-50 cursor-not-allowed" 
                        : isActive 
                          ? "bg-white dark:bg-zinc-900 border-primary shadow-lg scale-[1.01] ring-1 ring-primary/20 cursor-pointer" 
                          : "bg-white dark:bg-zinc-900 border-border hover:border-primary/30 cursor-pointer"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                        locked ? "bg-muted dark:bg-zinc-800 text-muted-foreground dark:text-zinc-500" :
                        lesson.completed ? "bg-emerald-500 text-white shadow-emerald-200 shadow-lg" :
                        isActive ? "bg-primary text-white shadow-lg" : "bg-muted dark:bg-zinc-800 text-muted-foreground dark:text-zinc-500"
                      }`}>
                        {locked ? <Lock className="h-4 w-4" /> : 
                         lesson.completed ? <CheckCircle2 className="h-5 w-5" /> : 
                         lesson.id}
                      </div>
                      <div>
                        <h4 className={`font-bold transition-colors ${isActive ? "text-primary" : "text-foreground"}`}>
                          {lesson.title}
                        </h4>
                        <p className="text-xs text-muted-foreground dark:text-zinc-500 font-medium flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {lesson.duration}
                        </p>
                      </div>
                    </div>
                    {isActive ? (
                      <div className="px-3 py-1 bg-primary/10 rounded-lg text-[10px] font-black text-primary uppercase tracking-widest">
                        Watching
                      </div>
                    ) : locked ? (
                      <div className="px-3 py-1 bg-muted dark:bg-zinc-800 rounded-lg text-[10px] font-black text-muted-foreground dark:text-zinc-500 uppercase tracking-widest">
                        Locked
                      </div>
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-muted/50 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <ChevronRight className="h-4 w-4 text-muted-foreground dark:text-zinc-500" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Progress Card */}
          <Card className="border-none shadow-xl rounded-[2.5rem] bg-white dark:bg-zinc-900">
            <CardHeader className="p-8">
              <CardTitle className="text-xl font-bold font-headline text-foreground">Course Progress</CardTitle>
              <CardDescription className="font-medium dark:text-zinc-400">Complete all lessons to earn your certificate</CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8 space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-black uppercase tracking-wider">
                  <span className="text-muted-foreground dark:text-zinc-500">Module Completion</span>
                  <span className="text-primary">{Math.round(progressValue)}%</span>
                </div>
                <Progress value={progressValue} className="h-3 bg-muted dark:bg-zinc-800 rounded-full" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/30 dark:bg-zinc-800/50 p-4 rounded-2xl text-center">
                  <p className="text-2xl font-black text-foreground">{completedCount}/{lessons.length}</p>
                  <p className="text-[10px] text-muted-foreground dark:text-zinc-500 font-bold uppercase">Finished</p>
                </div>
                <div className="bg-muted/30 dark:bg-zinc-800/50 p-4 rounded-2xl text-center">
                  <p className="text-2xl font-black text-foreground">{completedCount * 25}</p>
                  <p className="text-[10px] text-muted-foreground dark:text-zinc-500 font-bold uppercase">XP Gained</p>
                </div>
              </div>
              <Button 
                onClick={() => {
                   if (!isPlaying) setIsPlaying(true);
                }}
                disabled={progressValue === 100}
                className={`w-full rounded-2xl h-14 font-black shadow-xl transition-all ${
                  progressValue === 100 
                    ? "bg-emerald-500 text-white cursor-not-allowed opacity-80" 
                    : "bg-primary hover:bg-primary/90 text-white shadow-primary/20"
                }`}
              >
                {progressValue === 100 ? "Module Certified" : 
                 isPlaying ? "Simulation In-Progress" : "Continue Training"}
              </Button>
            </CardContent>
          </Card>

          {/* AI Recommendations */}
          <Card className="border-none shadow-xl rounded-[2.5rem] bg-gradient-to-br from-primary/10 to-orange-500/5 dark:from-primary/20 dark:to-orange-500/10 border border-primary/10 dark:bg-zinc-900">
            <CardHeader className="p-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-primary p-2 rounded-xl text-white shadow-lg">
                  <Lightbulb className="h-5 w-5" />
                </div>
                <CardTitle className="text-xl font-bold font-headline text-foreground">AI Preparedness Tips</CardTitle>
              </div>
              <CardDescription className="font-medium dark:text-zinc-400">Personalized for your {module.type} readiness.</CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8 space-y-4">
              {[
                "Practice your escape route at least twice a year.",
                "Ensure every family member knows the meeting spot.",
                "Check your kit batteries on the first of every month."
              ].map((tip, i) => (
                <div key={i} className="flex gap-3 items-start group">
                  <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary transition-colors">
                    <span className="text-[10px] font-black text-primary group-hover:text-white">{i+1}</span>
                  </div>
                  <p className="text-sm font-medium text-foreground dark:text-zinc-200 leading-snug">{tip}</p>
                </div>
              ))}
              <Link href="/dashboard/risk-tool" className="block pt-4">
                <Button variant="outline" className="w-full rounded-2xl h-12 border-primary/20 text-primary hover:bg-primary/5 font-bold">
                  Analyze Local Risk
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
