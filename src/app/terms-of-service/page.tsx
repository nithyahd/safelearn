import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#F9F5F2] dark:bg-zinc-950 font-body text-foreground">
      <header className="px-6 lg:px-12 h-20 flex items-center justify-between sticky top-0 z-50 bg-background/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-border/50 dark:border-zinc-800">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg transition-transform group-hover:scale-110">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <span className="font-headline text-2xl font-bold tracking-tight text-foreground">
            SafeLearn
          </span>
        </Link>
      </header>

      <main className="max-w-4xl mx-auto py-20 px-6">
        <Link href="/" className="inline-flex items-center text-primary font-bold mb-8 hover:underline group">
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to Home
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-10 tracking-tight text-foreground">
          Terms of Service
        </h1>
        
        <div className="space-y-12 text-muted-foreground dark:text-zinc-400 leading-relaxed text-lg">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground dark:text-white font-headline">1. Acceptance of Terms</h2>
            <p>
              By accessing and using the SafeLearn platform, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, you are prohibited from using the platform. These terms apply to all students, teachers, and administrators who use our services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground dark:text-white font-headline">2. Use of the Platform</h2>
            <p>
              SafeLearn is an educational platform designed for disaster preparedness. You agree to use the platform only for lawful educational purposes. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground dark:text-white font-headline">3. User Conduct</h2>
            <p>
              Users are expected to engage respectfully with the platform and other community members. Any attempt to disrupt the platform's security, misrepresent preparedness data, or engage in unauthorized access to administrative tools will result in immediate account termination.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground dark:text-white font-headline">4. Intellectual Property</h2>
            <p>
              All educational content, including modules, quiz questions, drill simulations, and visual designs, are the property of SafeLearn or its content providers. Users are granted a limited, non-exclusive license to use these resources for personal or classroom education.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground dark:text-white font-headline">5. Limitation of Liability</h2>
            <p>
              While SafeLearn provides information based on established disaster safety protocols, we are not responsible for real-world outcomes during actual disaster events. The platform is an educational tool and does not replace professional emergency training or official local government directives.
            </p>
          </section>
        </div>
      </main>

      <footer className="bg-white dark:bg-zinc-950 border-t border-border dark:border-zinc-800 py-12 px-6 lg:px-12 mt-20">
         <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-md">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <span className="font-headline text-xl font-bold tracking-tight text-foreground">
                SafeLearn
              </span>
            </Link>
            <p className="text-sm text-muted-foreground dark:text-zinc-500 font-medium">© 2024 SafeLearn. All rights reserved.</p>
         </div>
      </footer>
    </div>
  );
}
