
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  BookOpen, 
  Zap, 
  Flame, 
  ArrowRight,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  Loader2
} from "lucide-react";
import { DISASTER_MODULES } from "@/lib/mock-data";
import { Input as ShadcnInput } from "@/components/ui/input";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";

// Custom Waves icon for the Flood module
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

const IconMap: Record<string, any> = {
  Flame: Flame,
  Waves: WavesIcon,
  Zap: Zap,
};

interface ModuleProgress {
  completedLessons: number;
  totalLessons: number;
  status: 'not_started' | 'started' | 'completed';
  progress: number;
}

export default function LearningModulesPage() {
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("search") || searchParams.get("q") || "";
  
  const [moduleSearch, setModuleSearch] = useState(urlQuery);
  const [userProgress, setUserProgress] = useState<Record<string, ModuleProgress>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setModuleSearch(urlQuery);
  }, [urlQuery]);

  useEffect(() => {
    let unsubscribeProgress: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const progressRef = collection(db, "users", user.uid, "module_progress");
        unsubscribeProgress = onSnapshot(progressRef, (snapshot) => {
          const progressMap: Record<string, ModuleProgress> = {};
          
          snapshot.docs.forEach(doc => {
            const data = doc.data();
            const completed = data.completedLessons || 0;
            const total = data.totalLessons || 1;
            const progressValue = Math.round((completed / total) * 100);
            
            progressMap[doc.id] = {
              completedLessons: completed,
              totalLessons: total,
              progress: progressValue,
              status: completed === 0 ? 'not_started' : (completed === total ? 'completed' : 'started')
            };
          });
          
          setUserProgress(progressMap);
          setLoading(false);
        });
      } else {
        setLoading(false);
        if (unsubscribeProgress) unsubscribeProgress();
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProgress) unsubscribeProgress();
    };
  }, []);

  const filteredModules = DISASTER_MODULES.filter((module) =>
    module.title.toLowerCase().includes(moduleSearch.toLowerCase()) ||
    module.description.toLowerCase().includes(moduleSearch.toLowerCase()) ||
    module.type.toLowerCase().includes(moduleSearch.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold font-headline tracking-tight text-foreground">Learning Modules</h1>
          <p className="text-muted-foreground dark:text-zinc-400 text-lg">
            Master disaster preparedness through interactive, step-by-step curriculum.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <ShadcnInput 
              placeholder="Search modules..." 
              value={moduleSearch}
              onChange={(e) => setModuleSearch(e.target.value)}
              className="pl-9 h-11 bg-white dark:bg-zinc-900 border-none shadow-sm rounded-xl focus-visible:ring-primary/20 text-foreground"
            />
          </div>
          <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl bg-white dark:bg-zinc-900 border-none shadow-sm hover:bg-muted dark:hover:bg-zinc-800">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          [1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="rounded-[2.5rem] border-none shadow-xl bg-white dark:bg-zinc-900 overflow-hidden flex flex-col h-[400px]">
              <Skeleton className="h-48 w-full" />
              <div className="p-8 space-y-4">
                <Skeleton className="h-8 w-3/4 rounded-lg" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-5/6 rounded-md" />
                <div className="pt-4">
                  <Skeleton className="h-12 w-full rounded-2xl" />
                </div>
              </div>
            </Card>
          ))
        ) : filteredModules.length > 0 ? (
          filteredModules.map((module) => {
            const Icon = IconMap[module.icon] || BookOpen;
            const actualTotalLessons = module.lessonsList?.length || module.lessons;
            
            const progressData = userProgress[module.id] || {
              completedLessons: 0,
              totalLessons: actualTotalLessons,
              progress: 0,
              status: 'not_started'
            };

            const timeLeft = Math.max(0, (progressData.totalLessons - progressData.completedLessons) * 15);
            
            const getButtonText = (status: string) => {
              if (status === 'completed') return "Review Module";
              if (status === 'started') return "Resume Module";
              return "Start Module";
            };

            return (
              <Card key={module.id} className="group overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-300 rounded-[2.5rem] bg-white dark:bg-zinc-900 flex flex-col">
                <div className="h-48 relative overflow-hidden">
                  <Image 
                    src={module.image} 
                    alt={module.title} 
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className={`absolute top-6 right-6 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white ${
                    module.color === 'red' ? 'bg-red-500' : 
                    module.color === 'blue' ? 'bg-blue-500' : 
                    'bg-orange-500'
                  } shadow-lg shadow-black/20`}>
                    {module.type}
                  </div>
                  <div className="absolute bottom-6 left-6 text-white flex items-center gap-2">
                    <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-bold text-sm tracking-wide">{actualTotalLessons} Lessons</span>
                  </div>
                </div>
                
                <CardHeader className="flex-1 px-8 pt-8">
                  <CardTitle className="text-2xl font-bold font-headline group-hover:text-primary transition-colors leading-tight text-foreground">
                    {module.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground dark:text-zinc-400 mt-2 line-clamp-2 font-medium leading-relaxed">
                    {module.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6 px-8 pb-8 pt-0">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground dark:text-zinc-500">
                      <span>Progress</span>
                      <span className="text-primary font-black">{progressData.progress}%</span>
                    </div>
                    <Progress value={progressData.progress} className="h-2 bg-muted dark:bg-zinc-800 rounded-full" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 rounded-lg border border-primary/10">
                      <Zap className="h-4 w-4 text-primary fill-primary" />
                      <span className="text-sm font-black text-primary tracking-tight">{module.xp} XP</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground dark:text-zinc-500">
                      <Clock className="h-3.5 w-3.5" />
                      ~{timeLeft} min left
                    </div>
                  </div>

                  <Link href={`/dashboard/modules/${module.id}`} className="block">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-2xl h-14 font-black shadow-xl shadow-primary/20 group/btn transition-all active:scale-95">
                      {getButtonText(progressData.status)}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="col-span-full py-20 text-center">
            <div className="h-20 w-20 bg-muted/50 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold font-headline text-foreground">No modules found</h3>
            <p className="text-muted-foreground dark:text-zinc-500">Try adjusting your search keywords.</p>
          </div>
        )}

        {/* Locked Placeholder */}
        {!moduleSearch && !loading && (
          <Card className="border-2 border-dashed border-muted dark:border-zinc-800 bg-muted/20 dark:bg-zinc-900/40 rounded-[2.5rem] flex flex-col items-center justify-center p-10 text-center space-y-4 opacity-60">
             <div className="h-20 w-20 rounded-full bg-muted dark:bg-zinc-800 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-muted-foreground dark:text-zinc-600" />
             </div>
             <div>
               <h3 className="font-bold text-xl font-headline text-foreground">Advanced Recovery</h3>
               <p className="text-sm text-muted-foreground dark:text-zinc-500 max-w-[200px] mx-auto">Complete all 3 basic modules to unlock advanced certifications.</p>
             </div>
             <Button disabled variant="outline" className="rounded-xl font-bold h-12 px-8">Locked Content</Button>
          </Card>
        )}
      </div>
    </div>
  );
}
