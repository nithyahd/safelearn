"use client";

import React from "react";
import Link from "next/link";
import { 
  ShieldAlert, 
  User, 
  GraduationCap, 
  ShieldCheck,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginSelectionPage() {
  const portals = [
    {
      title: "Student Portal",
      description: "Access your learning modules and virtual drills.",
      href: "/login/student",
      icon: GraduationCap,
      color: "bg-primary",
      shadow: "shadow-primary/20"
    },
    {
      title: "Faculty Portal",
      description: "Monitor student progress and manage curriculum.",
      href: "/login/faculty",
      icon: User,
      color: "bg-emerald-600",
      shadow: "shadow-emerald-600/20"
    },
    {
      title: "Admin Panel",
      description: "Manage system infrastructure and global settings.",
      href: "/login/admin",
      icon: ShieldCheck,
      color: "bg-slate-900 dark:bg-zinc-800",
      shadow: "shadow-slate-900/20"
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F5F2] dark:bg-zinc-950 p-6 relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-4xl relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center mb-12 space-y-4">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg transition-transform group-hover:scale-110">
              <ShieldAlert className="h-7 w-7" />
            </div>
            <span className="font-headline text-3xl font-bold tracking-tight text-foreground">
              SafeLearn
            </span>
          </Link>
          <h1 className="text-4xl font-bold font-headline text-foreground">Welcome to SafeLearn</h1>
          <p className="text-muted-foreground dark:text-zinc-400 font-medium text-lg">Please select your login portal to continue.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {portals.map((portal) => (
            <Link key={portal.href} href={portal.href} className="group">
              <Card className="h-full border-none shadow-xl rounded-[2.5rem] bg-white dark:bg-zinc-900 overflow-hidden transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl">
                <CardHeader className="pt-10 px-8 text-center">
                  <div className={`mx-auto h-16 w-16 rounded-2xl ${portal.color} flex items-center justify-center text-white mb-6 shadow-lg ${portal.shadow}`}>
                    <portal.icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl font-bold font-headline text-foreground">{portal.title}</CardTitle>
                  <CardDescription className="font-medium mt-2 dark:text-zinc-400">{portal.description}</CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-10 text-center">
                  <div className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-primary group-hover:gap-4 transition-all">
                    Login Now <ArrowRight className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm font-medium text-muted-foreground dark:text-zinc-500">
            Don't have an account? <Link href="/register" className="text-primary font-bold hover:underline">Register your school</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
