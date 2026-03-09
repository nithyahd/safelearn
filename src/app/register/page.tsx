"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ShieldAlert, 
  User, 
  Mail, 
  Lock, 
  ArrowRight, 
  Loader2, 
  AlertCircle,
  GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

export default function RegisterStudentPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.password) {
      setError("All fields are required.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Create Authentication User
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      const user = userCredential.user;

      // 2. Create user profile in Firestore
      // Using setDoc with doc(db, "users", user.uid) as requested
      await setDoc(doc(db, "users", user.uid), {
        name: formData.name,
        email: formData.email,
        role: "student",
        xp: 0,
        readiness: 0,
        createdAt: serverTimestamp(),
        // Additional fields required by dashboard components
        uid: user.uid,
        displayName: formData.name,
        modulesCompleted: 0,
        quizzesPassed: 0
      });

      toast({
        title: "Account Created",
        description: "Welcome to SafeLearn! Redirecting to student login...",
        className: "bg-emerald-500 text-white border-none"
      });

      // 3. Redirect to student login
      setTimeout(() => {
        router.push("/login/student");
      }, 2000);

    } catch (err: any) {
      console.error("Registration error:", err);
      let message = "An error occurred during registration. Please try again.";
      
      if (err.code === 'auth/email-already-in-use') {
        message = "This email is already in use.";
      } else if (err.code === 'auth/weak-password') {
        message = "The password is too weak.";
      } else if (err.code === 'auth/invalid-email') {
        message = "Please enter a valid email address.";
      }
      
      setError(message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F5F2] dark:bg-zinc-950 p-6 relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center mb-8 space-y-4">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg transition-transform group-hover:scale-110">
              <ShieldAlert className="h-7 w-7" />
            </div>
            <span className="font-headline text-3xl font-bold tracking-tight text-foreground">
              SafeLearn
            </span>
          </Link>
          <h1 className="text-2xl font-bold font-headline text-foreground">Create Student Account</h1>
          <p className="text-muted-foreground dark:text-zinc-400 font-medium">Join the network and start your readiness journey.</p>
        </div>

        <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white dark:bg-zinc-900 overflow-hidden">
          <CardHeader className="pt-10 px-8">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <GraduationCap className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Student Registration</span>
            </div>
            <CardTitle className="text-xl font-bold font-headline text-foreground">Personal Details</CardTitle>
            <CardDescription className="font-medium dark:text-zinc-400">Complete the form below to register.</CardDescription>
          </CardHeader>
          
          <CardContent className="px-8 pb-8 pt-4">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <Alert variant="destructive" className="rounded-2xl bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="font-bold">{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest ml-1 text-foreground">Full Name</Label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground dark:text-zinc-500 group-focus-within:text-primary transition-colors">
                    <User className="h-5 w-5" />
                  </div>
                  <Input 
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    className="h-14 pl-12 rounded-2xl bg-muted/30 dark:bg-zinc-950 border-none shadow-inner focus-visible:ring-primary/20 text-lg transition-all dark:text-zinc-100"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest ml-1 text-foreground">Email Address</Label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground dark:text-zinc-500 group-focus-within:text-primary transition-colors">
                    <Mail className="h-5 w-5" />
                  </div>
                  <Input 
                    id="email"
                    type="email"
                    placeholder="student@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="h-14 pl-12 rounded-2xl bg-muted/30 dark:bg-zinc-950 border-none shadow-inner focus-visible:ring-primary/20 text-lg transition-all dark:text-zinc-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest ml-1 text-foreground">Password</Label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground dark:text-zinc-500 group-focus-within:text-primary transition-colors">
                      <Lock className="h-4 w-4" />
                    </div>
                    <Input 
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className="h-12 pl-11 rounded-2xl bg-muted/30 dark:bg-zinc-950 border-none shadow-inner focus-visible:ring-primary/20 text-sm transition-all dark:text-zinc-100"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-xs font-black uppercase tracking-widest ml-1 text-foreground">Confirm</Label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground dark:text-zinc-500 group-focus-within:text-primary transition-colors">
                      <Lock className="h-4 w-4" />
                    </div>
                    <Input 
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="h-12 pl-11 rounded-2xl bg-muted/30 dark:bg-zinc-950 border-none shadow-inner focus-visible:ring-primary/20 text-sm transition-all dark:text-zinc-100"
                    />
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-14 mt-4 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-xl shadow-primary/20 active:scale-95 transition-all"
              >
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="bg-muted/30 dark:bg-zinc-950/50 px-8 py-6 flex flex-col gap-2">
            <p className="text-xs text-center text-muted-foreground dark:text-zinc-500 font-medium">
              By registering, you agree to our <Link href="/terms-of-service" className="text-primary hover:underline">Terms</Link> and <Link href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>.
            </p>
            <div className="pt-2 border-t dark:border-zinc-800 w-full text-center">
              <Link href="/login/student" className="text-sm font-bold text-muted-foreground dark:text-zinc-500 hover:text-primary transition-colors">
                Already have an account? Log In
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}