
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ShieldAlert, 
  Eye, 
  EyeOff, 
  Loader2, 
  Lock, 
  User, 
  ArrowRight,
  AlertCircle,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.email) {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", user.email));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          if (userData.role?.toLowerCase() === "admin") {
            router.push("/admin");
          }
        }
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const email = username.includes("@") ? username : `${username}@safelearn.com`;
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.email) throw new Error("User email not found");

      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", user.email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        await signOut(auth);
        setError("Access Denied: Admin profile not found.");
        setIsLoading(false);
        return;
      }

      const userData = querySnapshot.docs[0].data();
      const role = userData.role?.toLowerCase();

      if (role !== "admin") {
        await signOut(auth);
        setError("Access Denied: This portal is for administrators only.");
        setIsLoading(false);
        return;
      }

      localStorage.setItem("userRole", "admin");
      router.push("/admin");
    } catch (err: any) {
      console.error("Login error:", err);
      setError("Invalid admin credentials");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center mb-8 space-y-4">
          <Link href="/login" className="inline-flex items-center gap-2 group">
            <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110">
              <ShieldAlert className="h-7 w-7" />
            </div>
            <span className="font-headline text-3xl font-bold tracking-tight text-white">
              SafeLearn
            </span>
          </Link>
          <div className="flex flex-col items-center">
             <div className="px-4 py-1.5 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-300 flex items-center gap-2 mb-2">
               <ShieldCheck className="h-3 w-3" /> System Administration
             </div>
             <h1 className="text-2xl font-bold font-headline text-white">Administrator Login</h1>
          </div>
        </div>

        <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white dark:bg-zinc-900 overflow-hidden">
          <CardHeader className="pt-10 px-8">
            <CardTitle className="text-xl font-bold font-headline text-slate-900 dark:text-zinc-100">Secure Access</CardTitle>
            <CardDescription className="font-medium dark:text-zinc-400">Identity verification required.</CardDescription>
          </CardHeader>
          
          <CardContent className="px-8 pb-8 pt-4">
            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <Alert variant="destructive" className="rounded-2xl bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="font-bold">{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="username" className="text-xs font-black uppercase tracking-widest ml-1 text-slate-900 dark:text-zinc-200">Admin ID</Label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground dark:text-zinc-500 group-focus-within:text-slate-900 dark:group-focus-within:text-zinc-100 transition-colors">
                    <User className="h-5 w-5" />
                  </div>
                  <Input 
                    id="username"
                    type="text"
                    placeholder="Enter admin email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-14 pl-12 rounded-2xl bg-muted/30 dark:bg-zinc-950 border-none shadow-inner focus-visible:ring-slate-900/20 dark:focus-visible:ring-zinc-800/50 text-lg transition-all dark:text-zinc-100"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-zinc-200">Password</Label>
                </div>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground dark:text-zinc-500 group-focus-within:text-slate-900 dark:group-focus-within:text-zinc-100 transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input 
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-14 pl-12 pr-12 rounded-2xl bg-muted/30 dark:bg-zinc-950 border-none shadow-inner focus-visible:ring-slate-900/20 dark:focus-visible:ring-zinc-800/50 text-lg transition-all dark:text-zinc-100"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground dark:text-zinc-500 hover:text-slate-900 dark:hover:text-zinc-100 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-14 rounded-2xl bg-slate-950 hover:bg-slate-900 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white font-black text-lg shadow-xl shadow-slate-950/20 active:scale-95 transition-all"
              >
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <>
                    Initialize Admin Session
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="bg-muted/30 dark:bg-zinc-950/50 px-8 py-6 flex justify-center">
            <Link href="/login" className="text-sm font-bold text-muted-foreground dark:text-zinc-500 hover:text-slate-900 dark:hover:text-zinc-100 transition-colors">
              Back to Portal Selection
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
