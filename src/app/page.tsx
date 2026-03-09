
"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  ShieldAlert, 
  ChevronRight, 
  Gamepad2, 
  BookOpen, 
  Trophy, 
  Users,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  Bell,
  LayoutDashboard
} from "lucide-react";
import { useTranslation } from "@/components/language-provider";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";

export default function LandingPage() {
  const { t } = useTranslation();
  const router = useRouter();

  // Prefetch critical routes to make transitions instantaneous
  useEffect(() => {
    router.prefetch('/dashboard');
    router.prefetch('/dashboard/learning-modules');
    router.prefetch('/dashboard/virtual-drills');
    router.prefetch('/login');
  }, [router]);

  return (
    <div className="flex flex-col min-h-screen bg-background dark:bg-zinc-950">
      <header className="px-6 lg:px-12 h-20 flex items-center justify-between sticky top-0 z-50 bg-background/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-border/50">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg transition-transform group-hover:scale-110">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <span className="font-headline text-2xl font-bold tracking-tight text-foreground">
            SafeLearn
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-muted-foreground dark:text-zinc-400">
          <Link href="#features" className="text-sm font-semibold hover:text-primary transition-colors">{t('features')}</Link>
          <Link href="/login" className="text-sm font-semibold hover:text-primary transition-colors">{t('curriculum')}</Link>
          <Link href="/login" className="text-sm font-semibold hover:text-primary transition-colors">{t('virtualDrills')}</Link>
          <Link href="/dashboard" className="text-sm font-semibold hover:text-primary transition-colors">{t('dashboard')}</Link>
        </nav>
        <div className="flex items-center gap-4">
          <LanguageToggle />
          <ThemeToggle />
          <Link href="/login">
            <Button variant="ghost" className="font-bold hidden sm:flex dark:text-zinc-100">{t('logIn')}</Button>
          </Link>
          <Link href="/register">
            <Button className="bg-primary hover:bg-primary/90 text-white font-bold rounded-full px-6 shadow-lg shadow-primary/20">{t('getStarted')}</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
             <div className="absolute top-1/4 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
             <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
          </div>
          
          <div className="container mx-auto px-6 lg:px-12 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/20 border border-secondary/30 rounded-full text-primary font-bold text-xs uppercase tracking-widest animate-bounce">
                <Trophy className="h-4 w-4" /> Gamified disaster preparedness
              </div>
              <h1 className="text-5xl md:text-7xl font-bold font-headline leading-[1.1] tracking-tight text-foreground">
                {t('heroTitle').split('.')[0]}. <br />
                <span className="text-primary">{t('heroTitle').split('.')[1]}</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground dark:text-zinc-400 max-w-2xl mx-auto font-medium">
                {t('heroSubtitle')}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link href="/register">
                  <Button size="lg" className="h-14 px-10 bg-primary hover:bg-primary/90 rounded-2xl font-bold text-lg shadow-2xl shadow-primary/25">
                    {t('getStarted')} <ChevronRight className="ml-2" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="h-14 px-10 rounded-2xl font-bold text-lg border-2 hover:bg-muted dark:hover:bg-zinc-800 dark:border-zinc-800 transition-all dark:text-zinc-100">
                    {t('virtualDrills')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-muted/30 dark:bg-zinc-900/30">
          <div className="container mx-auto px-6 lg:px-12 text-center">
            <h2 className="text-3xl md:text-5xl font-bold font-headline mb-4 text-foreground">{t('featuresTitle')}</h2>
            <p className="text-muted-foreground dark:text-zinc-400 max-w-2xl mx-auto mb-16 font-medium">{t('featuresSubtitle')}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: t('interactiveCurriculum'), desc: t('interactiveCurriculumDesc'), icon: BookOpen, color: "bg-blue-500", href: "/login" },
                { title: t('simulatedDrills'), desc: t('simulatedDrillsDesc'), icon: Gamepad2, color: "bg-primary", href: "/login" },
                { title: t('aiAssessment'), desc: t('aiAssessmentDesc'), icon: Zap, color: "bg-emerald-500", href: "/login" },
                { title: t('leaderboardTitle'), desc: t('leaderboardDesc'), icon: Trophy, color: "bg-yellow-500", href: "/login" },
                { title: t('adminTitle'), desc: t('adminDesc'), icon: LayoutDashboard, color: "bg-slate-600", href: "/login/admin" },
                { title: t('broadcastTitle'), desc: t('broadcastDesc'), icon: Bell, color: "bg-red-500", href: "/login" }
              ].map((feature, i) => (
                <Link key={i} href={feature.href} className="group">
                  <div className="h-full p-10 rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-border dark:border-zinc-800 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col text-left">
                    <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-black/10 group-hover:scale-110 transition-transform`}>
                      <feature.icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-bold font-headline mb-4 text-foreground group-hover:text-primary transition-colors">{feature.title}</h3>
                    <p className="text-muted-foreground dark:text-zinc-400 font-medium leading-relaxed mb-6 flex-1">{feature.desc}</p>
                    <div className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-primary group-hover:gap-4 transition-all">
                      Learn More <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="bg-primary rounded-[3rem] p-12 md:p-20 text-center text-white shadow-2xl shadow-primary/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />
              </div>
              <div className="relative z-10 space-y-8">
                <h2 className="text-4xl md:text-6xl font-bold font-headline">{t('ctaTitle')}</h2>
                <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto font-medium">
                  {t('ctaSubtitle')}
                </p>
                <div className="flex flex-col items-center gap-4 pt-4">
                  <Link href="/register">
                    <Button size="lg" className="bg-white text-primary hover:bg-white/90 h-16 px-12 rounded-2xl font-bold text-xl shadow-xl transition-all active:scale-95">
                      {t('ctaButton')}
                    </Button>
                  </Link>
                  <p className="text-sm font-bold text-white/60 uppercase tracking-widest">{t('ctaNoCreditCard')}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white dark:bg-zinc-950 border-t border-border dark:border-zinc-800 py-12">
        <div className="container mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-md">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <span className="font-headline text-xl font-bold tracking-tight text-foreground">
              SafeLearn
            </span>
          </Link>
          
          <p className="text-sm text-muted-foreground dark:text-zinc-500 font-medium">
            © {new Date().getFullYear()} SafeLearn. {t('footerRights')}
          </p>

          <div className="flex items-center gap-6 text-sm font-medium text-muted-foreground dark:text-zinc-500">
            <Link href="/privacy-policy" className="hover:text-primary transition-colors">
              {t('privacyPolicy')}
            </Link>
            <Link href="/terms-of-service" className="hover:text-primary transition-colors">
              {t('termsOfService')}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
