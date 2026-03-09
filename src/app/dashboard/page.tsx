"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Trophy, 
  Zap, 
  BookOpen, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Award,
  Gamepad2,
  Bell,
  History,
  ArrowUpRight,
  ShieldAlert,
  Info
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { DISASTER_MODULES } from "@/lib/mock-data";
import Link from "next/link";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";

const RECENT_ACTIVITIES = [
  { title: "Completed Fire Safety Quiz", time: "2 hours ago", xp: "+150", icon: CheckCircle2, iconColor: "text-emerald-500" },
  { title: "Started Flood Survival Module", time: "5 hours ago", xp: "+50", icon: Clock, iconColor: "text-blue-500" },
  { title: "Earned Beginner Responder Badge", time: "Yesterday", xp: "+500", icon: Award, iconColor: "text-primary" },
  { title: "Joined Earthquake Scenario", time: "2 days ago", xp: "+100", icon: Gamepad2, iconColor: "text-orange-500" },
];

const EXTENDED_HISTORY = [
  ...RECENT_ACTIVITIES,
  { title: "Shared Risk Assessment with Community", time: "3 days ago", xp: "+200", icon: ArrowUpRight, iconColor: "text-blue-600" },
  { title: "Passed Seismic Safety Final Exam", time: "4 days ago", xp: "+300", icon: Trophy, iconColor: "text-yellow-600" },
  { title: "Verified Emergency Contact Info", time: "1 week ago", xp: "+25", icon: CheckCircle2, iconColor: "text-emerald-500" },
  { title: "First Login Achievement", time: "1 week ago", xp: "+100", icon: Award, iconColor: "text-primary" },
];

const BROADCAST_HISTORY = [
  { title: "Regional Earthquake Simulation", date: "Today, 10:00 AM", status: "Active", type: "Drill", color: "text-red-600", bgColor: "bg-red-50 dark:bg-red-500/10", icon: ShieldAlert },
  { title: "Monsoon Preparedness Update", date: "Oct 24, 2023", status: "Completed", type: "Alert", color: "text-blue-600", bgColor: "bg-blue-50 dark:bg-blue-500/10", icon: Info },
  { title: "Campus Fire Safety Inspection", date: "Oct 20, 2023", status: "Resolved", type: "Notice", color: "text-emerald-600", bgColor: "bg-emerald-50 dark:bg-emerald-500/10", icon: CheckCircle2 },
  { title: "Emergency Contact System Test", date: "Oct 15, 2023", status: "Completed", type: "System", color: "text-slate-600", bgColor: "bg-slate-50 dark:bg-slate-500/10", icon: Zap },
];

export default function DashboardOverview() {
  const [loading, setLoading] = useState(true);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isBroadcastHistoryOpen, setIsBroadcastHistoryOpen] = useState(false);
  const [userData, setUserData] = useState<any>({
    readiness: 0,
    modulesCompleted: 0,
    quizzesPassed: 0,
    rank: 999,
    totalXP: 0,
    xp: 0
  });
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    let unsubscribeDoc: (() => void) | undefined;
    
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      // Clean up previous user listener if it exists
      if (unsubscribeDoc) {
        unsubscribeDoc();
        unsubscribeDoc = undefined;
      }

      if (currentUser) {
        setUser(currentUser);
        const userDocRef = doc(db, "users", currentUser.uid);
        unsubscribeDoc = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          }
          setLoading(false);
        }, (error) => {
          console.error("Error fetching user data:", error);
          setLoading(false);
        });
      } else {
        setLoading(false);
        setUser(null);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeDoc) unsubscribeDoc();
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-10 w-64 rounded-xl" />
            <Skeleton className="h-4 w-48 rounded-lg" />
          </div>
          <Skeleton className="h-16 w-40 rounded-2xl" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-3xl" />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-48 rounded-lg" />
              <Skeleton className="h-8 w-24 rounded-lg" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-64 rounded-3xl" />
              <Skeleton className="h-64 rounded-3xl" />
            </div>
            <Skeleton className="h-48 rounded-3xl" />
          </div>
          <div className="space-y-8">
            <Skeleton className="h-8 w-40 rounded-lg" />
            <Skeleton className="h-[400px] rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  const userName = user?.displayName || user?.email?.split('@')[0] || "User";
  const displayXP = userData?.totalXP ?? userData?.xp ?? 0;
  const displayReadiness = userData?.readiness ?? 0;

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground font-headline">Welcome back, {userName}!</h1>
          <p className="text-muted-foreground dark:text-zinc-400 mt-1">Ready to boost your disaster preparedness today?</p>
        </div>
        <div className="flex items-center gap-3 bg-white/50 dark:bg-zinc-900/50 p-2 rounded-2xl shadow-sm border border-border">
          <div className="bg-secondary/20 p-2 rounded-xl">
            <Trophy className="h-5 w-5 text-primary" />
          </div>
          <div className="pr-4">
            <p className="text-xs text-muted-foreground dark:text-zinc-500 uppercase tracking-wider font-bold">Total XP</p>
            <p className="text-lg font-bold text-foreground">{displayXP.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-none shadow-xl shadow-primary/5 dark:bg-zinc-900 overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <Award className="h-16 w-16 text-primary" />
          </div>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-bold uppercase tracking-widest text-primary">Readiness</CardDescription>
            <CardTitle className="text-3xl font-bold text-foreground">{displayReadiness}%</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={displayReadiness} className="h-2 bg-muted dark:bg-zinc-800 mt-2" />
            <p className="text-xs text-muted-foreground dark:text-zinc-400 mt-3 flex items-center gap-1 font-medium">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="text-emerald-500">+12%</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl shadow-secondary/5 dark:bg-zinc-900 overflow-hidden">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-bold uppercase tracking-widest text-secondary-foreground dark:text-yellow-500">Modules</CardDescription>
            <CardTitle className="text-3xl font-bold text-foreground">{userData?.modulesCompleted ?? 0}/6</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={((userData?.modulesCompleted ?? 0) / 6) * 100} className="h-2 bg-muted dark:bg-zinc-800 mt-2" />
            <p className="text-xs text-muted-foreground dark:text-zinc-400 mt-3 font-medium flex items-center gap-2">
              <CheckCircle2 className="h-3 w-3" />
              {6 - (userData?.modulesCompleted ?? 0)} left to complete
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl shadow-blue-500/5 dark:bg-zinc-900 overflow-hidden">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-bold uppercase tracking-widest text-blue-500">Quizzes Passed</CardDescription>
            <CardTitle className="text-3xl font-bold text-foreground">{userData?.quizzesPassed ?? 0}</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="flex gap-1 mt-2">
               {[1,2,3,4,5,6].map(i => <div key={i} className={`h-2 flex-1 rounded-full ${i <= ((userData?.quizzesPassed ?? 0) % 7) ? 'bg-blue-500' : 'bg-muted dark:bg-zinc-800'}`} />)}
             </div>
             <p className="text-xs text-muted-foreground dark:text-zinc-400 mt-3 font-medium">Progress to next badge</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl shadow-orange-500/5 dark:bg-zinc-900 overflow-hidden">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-bold uppercase tracking-widest text-orange-500">Global Rank</CardDescription>
            <CardTitle className="text-3xl font-bold text-foreground">#{userData?.rank ?? '---'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex -space-x-2 mt-2">
               {[1,2,3].map(i => (
                 <div key={i} className="h-6 w-6 rounded-full border-2 border-background dark:border-zinc-900 bg-muted dark:bg-zinc-800 overflow-hidden relative">
                   <Image 
                    src={`https://picsum.photos/seed/${i*5}/40/40`} 
                    alt="user" 
                    fill 
                    className="object-cover"
                   />
                 </div>
               ))}
               <div className="h-6 w-6 rounded-full border-2 border-background dark:border-zinc-900 bg-primary/20 text-[10px] flex items-center justify-center font-bold text-primary">
                 +12
               </div>
            </div>
            <p className="text-xs text-muted-foreground dark:text-zinc-400 mt-3 font-medium">Top {(userData?.rank ?? 999) < 500 ? "5%" : "20%"}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold font-headline text-foreground">Continue Learning</h2>
            <Link href="/dashboard/learning-modules">
              <Button variant="ghost" className="text-primary hover:text-primary/80 dark:text-primary dark:hover:text-primary/70 font-bold">
                View All <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {DISASTER_MODULES.slice(0, 2).map((module) => (
              <Card key={module.id} className="group overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-300 rounded-3xl dark:bg-zinc-900 dark:border-zinc-800 border">
                <div className="h-40 relative">
                  <Image 
                    src={module.image} 
                    alt={module.title} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white ${module.color === 'red' ? 'bg-red-500' : 'bg-blue-500'}`}>
                    {module.type}
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors text-foreground">{module.title}</CardTitle>
                  <CardDescription className="line-clamp-2 dark:text-zinc-400">{module.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm mb-4">
                    <span className="flex items-center gap-1.5 font-medium text-muted-foreground dark:text-zinc-500">
                      <BookOpen className="h-4 w-4" /> {module.lessons} Lessons
                    </span>
                    <span className="flex items-center gap-1.5 font-bold text-primary">
                      <Zap className="h-4 w-4" /> {module.xp} XP
                    </span>
                  </div>
                  <Progress value={45} className="h-1.5 bg-muted dark:bg-zinc-800 mb-4" />
                  <Link href={`/dashboard/modules/${module.id}`}>
                    <Button className="w-full bg-primary hover:bg-primary/90 rounded-2xl h-12 font-bold shadow-lg shadow-primary/20">
                      Resume Module
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-none shadow-xl bg-gradient-to-br from-primary to-orange-400 text-white rounded-3xl">
             <CardContent className="p-8 flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 space-y-4 text-center md:text-left">
                  <h3 className="text-3xl font-bold font-headline">New Scenario: City Flood Crisis</h3>
                  <p className="text-white/80 font-medium">Test your skills in our latest virtual disaster drill. Make critical decisions to save lives in a rapidly developing flood scenario.</p>
                  <Link href="/dashboard/virtual-drills">
                    <Button variant="secondary" className="bg-white text-primary hover:bg-white/90 rounded-2xl h-12 px-8 font-bold shadow-xl">
                      Launch Drill Simulation
                    </Button>
                  </Link>
                </div>
                <div className="h-48 w-48 relative animate-pulse flex items-center justify-center">
                   <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl" />
                   <Gamepad2 className="h-24 w-24 relative z-10 text-white" />
                </div>
             </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <h2 className="text-2xl font-bold font-headline text-foreground">Recent Activity</h2>
          <Card className="border-none shadow-xl rounded-3xl dark:bg-zinc-900">
            <CardContent className="p-6">
              <div className="space-y-6">
                {RECENT_ACTIVITIES.map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className={`p-2 rounded-xl bg-muted/50 dark:bg-zinc-800 ${activity.iconColor}`}>
                      <activity.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="text-sm font-bold text-foreground">{activity.title}</p>
                        <p className="text-xs font-bold text-primary">{activity.xp} XP</p>
                      </div>
                      <p className="text-xs text-muted-foreground dark:text-zinc-500 mt-0.5">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full mt-8 rounded-2xl h-11 border-border/50 dark:border-zinc-800 text-muted-foreground dark:text-zinc-400 font-bold hover:bg-primary/5 hover:text-primary transition-all">
                    View Activity History
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-[2.5rem] border-none shadow-2xl max-w-lg p-8 dark:bg-zinc-950">
                  <DialogHeader className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-primary/10 p-2 rounded-xl text-primary">
                        <History className="h-5 w-5" />
                      </div>
                      <DialogTitle className="text-2xl font-black font-headline text-foreground">Training History</DialogTitle>
                    </div>
                    <DialogDescription className="font-medium text-muted-foreground dark:text-zinc-400">
                      A complete record of your disaster preparedness milestones and achievements.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    {EXTENDED_HISTORY.map((activity, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-muted/20 dark:bg-zinc-900 border border-transparent hover:border-primary/10 transition-all group">
                        <div className={`p-3 rounded-xl bg-white dark:bg-zinc-800 shadow-sm group-hover:scale-110 transition-transform ${activity.iconColor}`}>
                          <activity.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{activity.title}</p>
                            <span className="text-xs font-black text-primary bg-primary/5 px-2 py-0.5 rounded-full">{activity.xp} XP</span>
                          </div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground dark:text-zinc-500 mt-1 flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t dark:border-zinc-800 flex items-center justify-between">
                    <Button onClick={() => setIsHistoryOpen(false)} className="rounded-xl font-bold bg-primary hover:bg-primary/90 ml-auto text-white">
                      Close Log
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl bg-secondary/10 dark:bg-yellow-500/5 border border-secondary/20 dark:border-yellow-500/10 rounded-3xl overflow-hidden">
             <CardHeader className="bg-secondary/20 dark:bg-yellow-500/10 pb-4">
               <CardTitle className="text-sm uppercase tracking-widest font-bold text-secondary-foreground dark:text-yellow-500 flex items-center gap-2">
                 <Bell className="h-4 w-4" /> Emergency Broadcasts
               </CardTitle>
             </CardHeader>
             <CardContent className="p-6">
               <div className="bg-white/80 dark:bg-zinc-900/80 p-4 rounded-2xl border-l-4 border-red-500 shadow-sm mb-4">
                  <p className="text-xs font-bold text-red-500 mb-1 uppercase">DRILL - 10:00 AM</p>
                  <p className="text-sm font-bold text-foreground mb-1">Regional Earthquake Simulation</p>
                  <p className="text-xs text-muted-foreground dark:text-zinc-400">All students in Zone B must practice evacuation protocols.</p>
               </div>

               <Dialog open={isBroadcastHistoryOpen} onOpenChange={setIsBroadcastHistoryOpen}>
                <DialogTrigger asChild>
                  <button className="text-primary p-0 h-auto font-bold text-sm hover:text-primary/80 transition-colors">
                    View History Log
                  </button>
                </DialogTrigger>
                <DialogContent className="rounded-[2.5rem] border-none shadow-2xl max-w-lg p-8 dark:bg-zinc-950">
                  <DialogHeader className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-primary/10 p-2 rounded-xl text-primary">
                        <Bell className="h-5 w-5" />
                      </div>
                      <DialogTitle className="text-2xl font-black font-headline text-foreground">Broadcast Archive</DialogTitle>
                    </div>
                    <DialogDescription className="font-medium text-muted-foreground dark:text-zinc-400">
                      Review past safety alerts, drills, and official community announcements.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    {BROADCAST_HISTORY.map((broadcast, idx) => {
                      const Icon = broadcast.icon;
                      return (
                        <div key={idx} className="flex items-start gap-4 p-5 rounded-2xl bg-muted/20 dark:bg-zinc-900 border border-transparent hover:border-primary/10 transition-all group">
                          <div className={`p-3 rounded-xl bg-white dark:bg-zinc-800 shadow-sm group-hover:scale-110 transition-transform ${broadcast.color}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{broadcast.title}</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground dark:text-zinc-500 mt-1">{broadcast.date}</p>
                              </div>
                              <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${broadcast.bgColor} ${broadcast.color}`}>
                                {broadcast.status}
                              </span>
                            </div>
                            <div className="mt-3 inline-flex items-center gap-1.5 px-2 py-0.5 bg-slate-900/5 dark:bg-white/5 rounded text-[8px] font-bold uppercase tracking-tight text-slate-500 dark:text-zinc-400">
                               System {broadcast.type}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-8 pt-6 border-t dark:border-zinc-800 text-right">
                    <Button onClick={() => setIsBroadcastHistoryOpen(false)} className="rounded-xl font-bold bg-primary hover:bg-primary/90 text-white">
                      Close Archive
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
             </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
