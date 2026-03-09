
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
   BookOpen, 
  Gamepad2, 
  LayoutDashboard, 
  Trophy, 
  ShieldAlert, 
  LogOut,
  Bell,
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
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { useTranslation } from "@/components/language-provider";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  const navItems = [
    { name: t("overview"), href: "/dashboard", icon: LayoutDashboard },
    { name: t("learningModules"), href: "/dashboard/learning-modules", icon: BookOpen },
    { name: t("virtualDrills"), href: "/dashboard/virtual-drills", icon: Gamepad2 },
    { name: t("riskTool"), href: "/dashboard/risk-tool", icon: ShieldAlert },
    { name: t("leaderboard"), href: "/dashboard/leaderboard", icon: Trophy },
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);

          if (!userDoc.exists()) {
            router.replace("/login/student");
            return;
          }

          const userData = userDoc.data();
          const role = (userData.role || "student").toLowerCase();

          if (role !== "student") {
            router.replace("/login/student");
          } else {
            setUserRole(role);
            setCurrentUser(user);
            setIsAuthorized(true);
            setIsLoading(false);
          }
        } catch (error) {
          console.error("Authorization check failed:", error);
          router.replace("/login/student");
        }
      } else {
        router.replace("/login/student");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/login/student");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (isLoading || !isAuthorized) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-background space-y-4">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="font-headline font-bold text-muted-foreground animate-pulse">Verifying Student Access...</p>
      </div>
    );
  }

  const userDisplayName = currentUser?.displayName || currentUser?.email?.split('@')[0] || "User";

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background text-foreground transition-colors duration-300">
        <Sidebar className="border-r border-border shadow-sm">
          <SidebarHeader className="p-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg group-hover:scale-110 transition-transform">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <span className="font-headline text-2xl font-bold tracking-tight text-foreground">
                SafeLearn
              </span>
            </Link>
          </SidebarHeader>

          <SidebarContent className="px-4">
            <SidebarGroup>
              <SidebarGroupLabel className="font-headline text-xs uppercase tracking-widest px-2 py-4">{t('menu')}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={pathname === item.href}
                        tooltip={item.name}
                        className={`h-11 transition-all duration-200 ${
                          pathname === item.href 
                            ? "bg-primary/10 text-primary font-semibold border-l-4 border-primary rounded-l-none" 
                            : "hover:bg-muted"
                        }`}
                      >
                        <Link href={item.href} className="flex items-center gap-3 w-full">
                          <item.icon className={`h-5 w-5 ${pathname === item.href ? "text-primary" : "text-muted-foreground"}`} />
                          <span className="font-medium">{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-4 border-t border-border mt-auto">
            <div className="bg-muted/50 p-4 rounded-2xl flex items-center gap-3">
              <Avatar className="h-10 w-10 ring-2 ring-primary/20 ring-offset-2">
                <AvatarImage src={`https://picsum.photos/seed/${currentUser?.uid}/100/100`} />
                <AvatarFallback>{userDisplayName.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold truncate text-foreground">{userDisplayName}</p>
                <p className="text-xs text-muted-foreground truncate capitalize">{userRole} Account</p>
              </div>
              <button 
                onClick={handleLogout}
                className="text-muted-foreground hover:text-destructive transition-colors p-2"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-30">
            <div className="flex items-center gap-4 flex-1">
              <SidebarTrigger className="md:hidden" />
            </div>
            <div className="flex items-center gap-4">
              <LanguageToggle />
              <ThemeToggle />
              <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 h-2 w-2 bg-primary rounded-full ring-2 ring-background"></span>
              </Button>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto bg-background/50 p-6 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
