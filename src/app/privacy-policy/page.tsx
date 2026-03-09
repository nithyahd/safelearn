import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
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
          Privacy Policy
        </h1>
        
        <div className="space-y-12 text-muted-foreground dark:text-zinc-400 leading-relaxed text-lg">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground dark:text-white font-headline">1. Information We Collect</h2>
            <p>
              At SafeLearn, we collect minimal information necessary to provide a personalized learning experience. This includes basic account identifiers such as your name, email address, and learning progress data. We focus on academic performance and preparedness metrics to help you improve your disaster response skills.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground dark:text-white font-headline">2. How We Use Your Data</h2>
            <p>
              Your data is primarily used to track your module completion, calculate your preparedness scores, and manage your achievements on the global leaderboard. We utilize anonymized data for platform analytics to improve our educational content. Your email may be used for critical emergency broadcast alerts.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground dark:text-white font-headline">3. Data Protection & Security</h2>
            <p>
              We implement industry-standard security measures to maintain the safety of your personal information. Your data is stored using secure cloud infrastructure. We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties without your consent.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground dark:text-white font-headline">4. Cookies and Tracking</h2>
            <p>
              We use functional cookies to maintain your login session and remember your preferences. These cookies are essential for the operation of the platform and the tracking of your learning progress across different modules and drills.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground dark:text-white font-headline">5. Contact Information</h2>
            <p>
              If you have any questions regarding this privacy policy, the practices of this site, or your dealings with this platform, please contact our privacy compliance team at privacy@safelearn.example.com.
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
