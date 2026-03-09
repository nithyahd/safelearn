
"use client";

import React, { useState, useEffect } from "react";
import { 
  Trophy, 
  Medal, 
  Crown, 
  TrendingUp, 
  Award,
  Search,
  Filter,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "next/navigation";
import { db, auth } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, limit } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function LeaderboardPage() {
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    // Optimized query with limit for faster initial load
    const usersRef = collection(db, "users");
    const q = query(usersRef, orderBy("xp", "desc"), limit(50));

    const unsubscribeStore = onSnapshot(q, (snapshot) => {
      const usersData = snapshot.docs.map((doc, index) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          displayName: data.displayName || data.name || data.email?.split('@')[0] || "Anonymous",
          displayXP: data.xp ?? data.totalXP ?? 0,
          displayReadiness: data.readiness ?? 0,
          rank: index + 1,
        };
      });
      setUsers(usersData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching users for leaderboard:", error);
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeStore();
    };
  }, []);

  useEffect(() => {
    setSearchQuery(urlQuery);
  }, [urlQuery]);
  
  const filteredData = users.filter((user) => 
    user.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const topThree = filteredData.slice(0, 3);
  const myRank = users.find(u => u.id === currentUser?.uid)?.rank || "---";

  if (loading) {
    return (
      <div className="space-y-10 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32 rounded-full" />
            <Skeleton className="h-10 w-64 rounded-xl" />
            <Skeleton className="h-4 w-96 rounded-lg" />
          </div>
          <Skeleton className="h-24 w-64 rounded-[2rem]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end pt-12">
          <Skeleton className="h-64 rounded-[2.5rem]" />
          <Skeleton className="h-80 rounded-[3rem]" />
          <Skeleton className="h-64 rounded-[2.5rem]" />
        </div>

        <Card className="rounded-[2.5rem] border-none shadow-xl bg-white dark:bg-zinc-900 overflow-hidden">
          <CardHeader className="p-8">
            <Skeleton className="h-8 w-48 rounded-lg" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-8 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-[0.2em] text-xs">
            <Trophy className="h-4 w-4" /> Global Rankings
          </div>
          <h1 className="text-4xl font-bold font-headline tracking-tight text-foreground">Community Leaderboard</h1>
          <p className="text-muted-foreground dark:text-zinc-400 text-lg max-w-2xl">
            Celebrating the most prepared responders in our network. Keep practicing to climb the ranks!
          </p>
        </div>
        
        <Card className="border-none shadow-xl bg-primary text-white p-6 rounded-[2rem] flex items-center gap-6">
          <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-white/80">Your Current Rank</p>
            <p className="text-3xl font-black">#{myRank}</p>
          </div>
        </Card>
      </div>

      {!searchQuery && filteredData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end pt-12">
          {topThree[1] && (
            <div className="order-2 md:order-1">
              <Card className="border-none shadow-xl rounded-[2.5rem] bg-white dark:bg-zinc-900 overflow-hidden relative group hover:-translate-y-2 transition-transform duration-300">
                <div className="absolute top-0 left-0 w-full h-2 bg-slate-300 dark:bg-zinc-700" />
                <CardContent className="pt-12 pb-8 flex flex-col items-center text-center space-y-4">
                  <div className="relative">
                    <Avatar className="h-24 w-24 ring-4 ring-slate-100 dark:ring-zinc-800 ring-offset-4 dark:ring-offset-zinc-900">
                      <AvatarImage src={topThree[1].photoURL || `https://picsum.photos/seed/${topThree[1].id}/100/100`} />
                      <AvatarFallback>{topThree[1].displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-slate-300 dark:bg-zinc-700 rounded-full border-4 border-white dark:border-zinc-900 flex items-center justify-center shadow-lg">
                      <Medal className="h-5 w-5 text-slate-600 dark:text-zinc-300" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-headline text-foreground">{topThree[1].displayName}</h3>
                    <p className="text-sm font-black text-primary uppercase tracking-tighter">{topThree[1].displayXP.toLocaleString()} XP</p>
                  </div>
                  <div className="px-4 py-1.5 bg-slate-50 dark:bg-zinc-800 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-400">
                    Rank #2
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {topThree[0] && (
            <div className="order-1 md:order-2">
              <Card className="border-none shadow-2xl rounded-[3rem] bg-white dark:bg-zinc-900 overflow-hidden relative group hover:-translate-y-4 transition-transform duration-500 scale-105">
                <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-yellow-400 to-orange-500" />
                <CardContent className="pt-16 pb-12 flex flex-col items-center text-center space-y-6">
                  <div className="relative">
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 animate-bounce">
                      <Crown className="h-10 w-10 text-yellow-500 fill-yellow-500" />
                    </div>
                    <Avatar className="h-32 w-32 ring-4 ring-yellow-400 ring-offset-4 dark:ring-offset-zinc-900 shadow-2xl">
                      <AvatarImage src={topThree[0].photoURL || `https://picsum.photos/seed/${topThree[0].id}/100/100`} />
                      <AvatarFallback>{topThree[0].displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 h-12 w-12 bg-yellow-400 rounded-full border-4 border-white dark:border-zinc-900 flex items-center justify-center shadow-lg">
                      <Trophy className="h-6 w-6 text-yellow-900" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black font-headline text-foreground">{topThree[0].displayName}</h3>
                    <p className="text-lg font-black text-primary uppercase tracking-tighter">{topThree[0].displayXP.toLocaleString()} XP</p>
                  </div>
                  <div className="px-6 py-2 bg-yellow-400 text-yellow-900 rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-yellow-200 dark:shadow-none">
                    Master Responder
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {topThree[2] && (
            <div className="order-3">
              <Card className="border-none shadow-xl rounded-[2.5rem] bg-white dark:bg-zinc-900 overflow-hidden relative group hover:-translate-y-2 transition-transform duration-300">
                <div className="absolute top-0 left-0 w-full h-2 bg-amber-700/30" />
                <CardContent className="pt-12 pb-8 flex flex-col items-center text-center space-y-4">
                  <div className="relative">
                    <Avatar className="h-24 w-24 ring-4 ring-amber-50 dark:ring-zinc-800 ring-offset-4 dark:ring-offset-zinc-900">
                      <AvatarImage src={topThree[2].photoURL || `https://picsum.photos/seed/${topThree[2].id}/100/100`} />
                      <AvatarFallback>{topThree[2].displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-amber-600/30 rounded-full border-4 border-white dark:border-zinc-900 flex items-center justify-center shadow-lg">
                      <Award className="h-5 w-5 text-amber-700" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-headline text-foreground">{topThree[2].displayName}</h3>
                    <p className="text-sm font-black text-primary uppercase tracking-tighter">{topThree[2].displayXP.toLocaleString()} XP</p>
                  </div>
                  <div className="px-4 py-1.5 bg-amber-50 dark:bg-amber-900/20 rounded-full text-[10px] font-black uppercase tracking-widest text-amber-700 dark:text-amber-500">
                    Rank #3
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}

      <Card className="border-none shadow-xl rounded-[2.5rem] bg-white dark:bg-zinc-900 overflow-hidden">
        <CardHeader className="p-8 border-b dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-bold font-headline text-foreground">Full Rankings</CardTitle>
            <CardDescription className="font-medium dark:text-zinc-400">Browsing all verified student accounts</CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                placeholder="Find a student..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 h-11 bg-muted/30 dark:bg-zinc-800/50 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium text-foreground"
              />
            </div>
            <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl bg-white dark:bg-zinc-900 border border-border/50 dark:border-zinc-800 shadow-sm hover:bg-muted dark:hover:bg-zinc-800">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30 dark:bg-zinc-800/20">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="w-24 pl-8 font-black uppercase text-[10px] tracking-widest">Rank</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest">Student</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest">Readiness</TableHead>
                <TableHead className="text-right pr-8 font-black uppercase text-[10px] tracking-widest">Total XP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((user) => (
                  <TableRow 
                    key={user.id} 
                    className={`group hover:bg-muted/10 dark:hover:bg-zinc-800/10 border-border/30 dark:border-zinc-800/30 transition-colors ${
                      user.id === currentUser?.uid ? "bg-primary/5 dark:bg-primary/10" : ""
                    }`}
                  >
                    <TableCell className="pl-8 py-6">
                      <span className={`h-8 w-8 rounded-full flex items-center justify-center font-black text-xs ${
                        user.rank === 1 ? 'bg-yellow-400 text-yellow-900 shadow-md' :
                        user.rank === 2 ? 'bg-slate-300 dark:bg-zinc-700 text-slate-700 dark:text-zinc-300 shadow-sm' :
                        user.rank === 3 ? 'bg-amber-600/20 dark:bg-amber-900/40 text-amber-800 dark:text-amber-500 shadow-sm' :
                        'text-muted-foreground dark:text-zinc-500'
                      }`}>
                        {user.rank}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <Avatar className={`h-10 w-10 border-2 border-background dark:border-zinc-900 shadow-sm ${
                          user.id === currentUser?.uid ? "ring-2 ring-primary" : "ring-2 ring-primary/5 dark:ring-primary/10"
                        }`}>
                          <AvatarImage src={user.photoURL || `https://picsum.photos/seed/${user.id}/100/100`} />
                          <AvatarFallback>{user.displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className={`font-bold transition-colors ${
                            user.id === currentUser?.uid ? "text-primary" : "text-foreground group-hover:text-primary"
                          }`}>
                            {user.displayName}
                            {user.id === currentUser?.uid && " (You)"}
                          </p>
                          <p className="text-[10px] text-muted-foreground dark:text-zinc-500 font-black uppercase tracking-widest">Student Account</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 bg-muted dark:bg-zinc-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                              style={{ width: `${user.displayReadiness}%` }} 
                            />
                        </div>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{user.displayReadiness}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <span className="font-black text-foreground dark:text-zinc-100 tabular-nums">{user.displayXP.toLocaleString()}</span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-muted-foreground dark:text-zinc-500 font-medium">
                    {users.length === 0 ? "No rankings available yet." : `No results found for "${searchQuery}"`}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
