
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Users, 
  FileText, 
  LayoutDashboard, 
  ShieldAlert, 
  LogOut,
  Loader2
} from "lucide-react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { useTranslation } from "@/components/language-provider";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function FacultyLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);

          if (!userDoc.exists()) {
            router.replace("/login/faculty");
            return; 
          }

          const userData = userDoc.data();
          const role = (userData.role || "").toLowerCase();

          if (role !== "faculty") {
            router.replace("/login/faculty");
          } else {
            setUserRole(role);
            setCurrentUser(user);
            setIsAuthorized(true);
            setIsLoading(false);
          }
        } catch (error) {
          console.error("Authorization check failed:", error);
          router.replace("/login/faculty");
        }
      } else {
        router.replace("/login/faculty");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/login/faculty");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (isLoading || !isAuthorized) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-background space-y-4">
        <Loader2 className="h-10 w-10 text-emerald-600 animate-spin" />
        <p className="font-headline font-bold text-muted-foreground animate-pulse">Verifying Faculty Access...</p>
      </div>
    );
  }

  const facultyName = currentUser?.displayName || currentUser?.email?.split('@')[0] || "Faculty Member";

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar className="border-r border-border shadow-sm">
          <SidebarHeader className="p-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-10 w-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <span className="font-headline text-2xl font-bold tracking-tight">SafeLearn</span>
            </Link>
          </SidebarHeader>

          <SidebarContent className="px-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={t('facultyOverview')}>
                  <Link href="/faculty" className="flex items-center gap-3 h-11">
                    <LayoutDashboard className="h-5 w-5" />
                    <span className="font-medium">{t('facultyOverview')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={t('myStudents')}>
                  <Link href="/faculty/students" className="flex items-center gap-3 h-11">
                    <Users className="h-5 w-5" />
                    <span className="font-medium">{t('myStudents')}</span>
                  </Link>
                </SidebarMenuButton>
                </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={t('courseContent')}>
                  <Link href="/faculty/content" className="flex items-center gap-3 h-11">
                    <FileText className="h-5 w-5" />
                    <span className="font-medium">{t('courseContent')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="p-4 border-t mt-auto">
             <div className="bg-muted/50 p-4 rounded-2xl flex items-center gap-3">
              <Avatar className="h-10 w-10 ring-2 ring-emerald-600/20 ring-offset-2">
                <AvatarImage src={`https://picsum.photos/seed/${currentUser?.uid}/100/100`} />
                <AvatarFallback>{facultyName.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold truncate capitalize">{facultyName}</p>
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{userRole} Portal</p>
              </div>
              <button 
                onClick={handleLogout} 
                className="text-muted-foreground hover:text-destructive transition-colors p-1"
                title="Logout"
              >
                 <LogOut className="h-4 w-4" />
              </button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md flex items-center px-8 sticky top-0 z-30 justify-between">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="md:hidden" />
              <h2 className="font-headline font-bold text-foreground">Faculty Portal</h2>
            </div>
            <div className="flex items-center gap-4">
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-muted/20">
            <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
