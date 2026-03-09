
"use client";

import React, { useEffect, useState } from "react";
import { 
  collection, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  limit 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Users, 
  FileText, 
  CheckCircle2, 
  TrendingUp, 
  Loader2, 
  AlertCircle,
  Zap,
  Activity
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface StudentStats {
  id: string;
  displayName?: string;
  name?: string;
  email: string;
  readiness: number;
  xp: number;
  photoURL?: string;
}

export default function FacultyOverview() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    completionRate: 0,
    certifications: 0,
    riskReports: 0
  });
  const [recentStudents, setRecentStudents] = useState<StudentStats[]>([]);

  useEffect(() => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("role", "==", "student"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const studentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as StudentStats[];

      const total = studentsData.length;
      const avgReadiness = total > 0 
        ? Math.round(studentsData.reduce((sum, s) => sum + (s.readiness || 0), 0) / total) 
        : 0;
      const certs = studentsData.filter(s => (s.readiness || 0) >= 80).length;
      const risks = studentsData.filter(s => (s.readiness || 0) < 40).length;

      setStats({
        totalStudents: total,
        completionRate: avgReadiness,
        certifications: certs,
        riskReports: risks
      });

      const sorted = [...studentsData].sort((a, b) => (b.xp || 0) - (a.xp || 0)).slice(0, 5);
      setRecentStudents(sorted);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-10 w-10 text-emerald-600 animate-spin" />
        <p className="font-headline font-bold text-muted-foreground animate-pulse">Synchronizing Faculty Data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold font-headline text-foreground">Faculty Dashboard</h1>
        <p className="text-muted-foreground dark:text-zinc-400">Monitor student progress and manage safety curriculum.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-none shadow-lg rounded-2xl overflow-hidden group dark:bg-zinc-900">
          <CardHeader className="pb-2">
            <CardDescription className="uppercase text-[10px] font-black tracking-widest text-muted-foreground dark:text-zinc-500 flex items-center justify-between">
              Total Students <Users className="h-3 w-3 text-emerald-600" />
            </CardDescription>
            <CardTitle className="text-4xl font-black text-foreground">{stats.totalStudents}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-emerald-600 dark:text-emerald-500 font-bold flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> Active Enrollment
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-lg rounded-2xl overflow-hidden dark:bg-zinc-900">
          <CardHeader className="pb-2">
            <CardDescription className="uppercase text-[10px] font-black tracking-widest text-muted-foreground dark:text-zinc-500 flex items-center justify-between">
              Avg. Readiness <Activity className="h-3 w-3 text-blue-600" />
            </CardDescription>
            <CardTitle className="text-4xl font-black text-foreground">{stats.completionRate}%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-1.5 w-full bg-muted dark:bg-zinc-800 rounded-full overflow-hidden mt-1">
              <div className="h-full bg-blue-500" style={{ width: `${stats.completionRate}%` }} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg rounded-2xl overflow-hidden dark:bg-zinc-900">
          <CardHeader className="pb-2">
            <CardDescription className="uppercase text-[10px] font-black tracking-widest text-muted-foreground dark:text-zinc-500 flex items-center justify-between">
              Certifications <CheckCircle2 className="h-3 w-3 text-primary" />
            </CardDescription>
            <CardTitle className="text-4xl font-black text-foreground">{stats.certifications}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-primary font-bold">Readiness ≥ 80%</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg rounded-2xl overflow-hidden dark:bg-zinc-900">
          <CardHeader className="pb-2">
            <CardDescription className="uppercase text-[10px] font-black tracking-widest text-muted-foreground dark:text-zinc-500 flex items-center justify-between">
              Risk Reports <AlertCircle className="h-3 w-3 text-red-500" />
            </CardDescription>
            <CardTitle className="text-4xl font-black text-red-600 dark:text-red-500">{stats.riskReports}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-red-500 font-bold">Action Required</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <Card className="border-none shadow-xl rounded-[2rem] bg-white dark:bg-zinc-900 overflow-hidden">
            <CardHeader className="border-b dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 p-8">
              <CardTitle className="font-headline flex items-center gap-2 text-foreground">
                <Users className="h-5 w-5 text-emerald-600" /> Recent Student Activity
              </CardTitle>
              <CardDescription className="dark:text-zinc-400">Top performing students by cumulative training XP.</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-4">
                {recentStudents.length > 0 ? (
                  recentStudents.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-4 bg-muted/20 dark:bg-zinc-800/50 hover:bg-muted/40 dark:hover:bg-zinc-800/80 transition-colors rounded-2xl border border-transparent hover:border-emerald-100 dark:hover:border-emerald-900">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 ring-2 ring-emerald-600/10">
                          <AvatarImage src={student.photoURL || `https://picsum.photos/seed/${student.id}/100/100`} />
                          <AvatarFallback className="bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 font-bold">
                            {(student.displayName || student.name || student.email).substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-sm text-slate-900 dark:text-zinc-100">{student.displayName || student.name || "Student"}</p>
                          <div className="flex items-center gap-3">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground dark:text-zinc-500 flex items-center gap-1">
                              <Zap className="h-3 w-3 text-primary fill-primary" /> {student.xp?.toLocaleString()} XP
                            </p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-500 flex items-center gap-1">
                              <Activity className="h-3 w-3" /> {student.readiness}% Readiness
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        student.readiness >= 80 ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 
                        student.readiness < 40 ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      }`}>
                         <CheckCircle2 className="h-4 w-4" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center text-muted-foreground dark:text-zinc-500">
                    <Users className="h-10 w-10 mx-auto mb-2 opacity-20" />
                    <p className="font-bold">No student data found.</p>
                  </div>
                )}
              </div>
            </CardContent>
         </Card>

         <Card className="border-none shadow-xl rounded-[2rem] bg-white dark:bg-zinc-900 overflow-hidden">
            <CardHeader className="border-b dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 p-8">
              <CardTitle className="font-headline flex items-center gap-2 text-foreground">
                <TrendingUp className="h-5 w-5 text-emerald-600" /> Class Performance Trends
              </CardTitle>
              <CardDescription className="dark:text-zinc-400">Aggregate metrics across active student population.</CardDescription>
            </CardHeader>
            <CardContent className="p-12 flex flex-col items-center justify-center text-center space-y-4 h-[300px]">
              <div className="relative h-32 w-32 flex items-center justify-center">
                 <svg className="h-full w-full transform -rotate-90">
                   <circle
                     cx="64"
                     cy="64"
                     r="58"
                     stroke="currentColor"
                     strokeWidth="12"
                     fill="transparent"
                     className="text-slate-100 dark:text-zinc-800"
                   />
                   <circle
                     cx="64"
                     cy="64"
                     r="58"
                     stroke="currentColor"
                     strokeWidth="12"
                     fill="transparent"
                     strokeDasharray={364.4}
                     strokeDashoffset={364.4 - (364.4 * stats.completionRate) / 100}
                     className="text-emerald-500 transition-all duration-1000 ease-out"
                   />
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-foreground">
                    <span className="text-3xl font-black">{stats.completionRate}%</span>
                    <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Target Score</span>
                 </div>
              </div>
              <p className="text-sm font-medium text-muted-foreground dark:text-zinc-400 max-w-xs">
                Your class is currently performing at a <strong className="text-foreground">{stats.completionRate}%</strong> average readiness level. 
                Keep assigning drills to reach the 80% certification goal.
              </p>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
