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
  GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function StudentLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const role = userDoc.data().role;
            if (role === "student") {
              router.replace("/dashboard");
              return; 
            }
          }
        } catch (err) {
          console.error("Auth initialization check failed:", err);
        }
      }
      setIsInitializing(false);
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

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        await signOut(auth);
        setError("User profile not found in database.");
        setIsLoading(false);
        return;
      }

      const role = userDoc.data().role;

      if (role !== "student") {
        await signOut(auth);
        setError(`Access Denied: You are registered as ${role}. Please use the correct portal.`);
        setIsLoading(false);
        return;
      }

      localStorage.setItem("userRole", role);
      router.replace("/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      setError("Invalid student credentials or unauthorized access.");
      setIsLoading(false);
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9F5F2] dark:bg-zinc-950 space-y-4">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="font-headline font-bold text-muted-foreground dark:text-zinc-500">Authenticating...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F5F2] dark:bg-zinc-950 p-6 relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 space-y-4">
          <Link href="/login" className="inline-flex items-center gap-2 group">
            <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg transition-transform group-hover:scale-110">
              <ShieldAlert className="h-7 w-7" />
            </div>
            <span className="font-headline text-3xl font-bold tracking-tight text-foreground">
              SafeLearn
            </span>
          </Link>
          <div className="flex flex-col items-center">
             <div className="px-4 py-1.5 bg-primary/10 rounded-full text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2 mb-2">
               <GraduationCap className="h-3 w-3" /> Student Portal
             </div>
             <h1 className="text-2xl font-bold font-headline text-foreground">Student Login</h1>
          </div>
        </div>

        <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white dark:bg-zinc-900 overflow-hidden">
          <CardHeader className="pt-10 px-8">
            <CardTitle className="text-xl font-bold font-headline text-foreground">Sign In</CardTitle>
            <CardDescription className="font-medium dark:text-zinc-400">Enter your student credentials.</CardDescription>
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
                <Label htmlFor="username" className="text-xs font-black uppercase tracking-widest ml-1 text-foreground">Email or Username</Label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground dark:text-zinc-500 group-focus-within:text-primary transition-colors">
                    <User className="h-5 w-5" />
                  </div>
                  <Input 
                    id="username"
                    type="text"
                    placeholder="student@safelearn.com"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-14 pl-12 rounded-2xl bg-muted/30 dark:bg-zinc-950 border-none shadow-inner focus-visible:ring-primary/20 text-lg transition-all dark:text-zinc-100"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-foreground">Password</Label>
                </div>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground dark:text-zinc-500 group-focus-within:text-primary transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input 
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-14 pl-12 pr-12 rounded-2xl bg-muted/30 dark:bg-zinc-950 border-none shadow-inner focus-visible:ring-primary/20 text-lg transition-all dark:text-zinc-100"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground dark:text-zinc-500 hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-xl shadow-primary/20 active:scale-95 transition-all"
              >
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <>
                    Continue Training
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="bg-muted/30 dark:bg-zinc-950/50 px-8 py-6 flex justify-center">
            <Link href="/login" className="text-sm font-bold text-muted-foreground dark:text-zinc-500 hover:text-primary transition-colors">
              Back to Portal Selection
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
