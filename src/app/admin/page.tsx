
"use client";

import React, { useEffect, useState } from "react";
import { 
  Activity, 
  Server, 
  ShieldCheck, 
  Globe, 
  Loader2, 
  ShieldAlert, 
  Users, 
  Database, 
  Settings, 
  BarChart3, 
  LogOut,
  Search,
  Filter,
  Edit2,
  Shield,
  Zap,
  CheckCircle2,
  Cpu,
  Clock,
  HardDrive,
  Signal,
  History,
  Save,
  Lock,
  Smartphone,
  ShieldQuestion,
  ToggleLeft
} from "lucide-react";
import { 
  collection, 
  onSnapshot, 
  doc, 
  updateDoc, 
  query, 
  orderBy,
  limit,
  getDoc,
  setDoc,
  getCountFromServer,
  where,
  getDocs
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { useTranslation } from "@/components/language-provider";

type ViewType = 'health' | 'users' | 'infra' | 'settings';

interface UserProfile {
  id: string;
  displayName?: string;
  name?: string;
  email: string;
  role: "student" | "faculty" | "admin";
  xp: number;
  readiness: number;
  photoURL?: string;
}

interface SystemLog {
  id: string;
  event: string;
  type: 'info' | 'warning' | 'error';
  timestamp: any;
}

interface PlatformSettings {
  platformName: string;
  maxXP: number;
  defaultReadiness: number;
  maintenanceMode: boolean;
  leaderboardEnabled: boolean;
  allowRegistration: boolean;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { toast } = useToast();
  const [currentView, setCurrentView] = useState<ViewType>('health');
  
  // Data State
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    studentCount: 0,
    facultyCount: 0,
    adminCount: 0,
    avgReadiness: 0,
    lastSync: "",
    isLoading: true
  });

  // Settings State
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>({
    platformName: "SafeLearn Enterprise",
    maxXP: 10000,
    defaultReadiness: 10,
    maintenanceMode: false,
    leaderboardEnabled: true,
    allowRegistration: true,
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // User Management State
  const [searchQuery, setSearchQuery] = useState("");
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editRole, setEditRole] = useState<string>("");
  const [editXP, setEditXP] = useState<number>(0);
  const [editReadiness, setEditReadiness] = useState<number>(0);
  const [isSavingUser, setIsSavingUser] = useState(false);

  // Latency simulation (browser specific)
  const [latency, setLatency] = useState("24ms");

  useEffect(() => {
    // Initial sync time
    setStats(prev => ({ ...prev, lastSync: new Date().toLocaleTimeString() }));
    
    // Latency simulation
    setLatency(`${Math.floor(Math.random() * 45) + 20}ms`);

    const usersRef = collection(db, "users");
    const q = query(usersRef, orderBy("role", "asc"));

    const unsubscribeUsers = onSnapshot(q, (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserProfile[];
      
      const totalUsers = usersData.length;
      const students = usersData.filter(u => u.role === 'student');
      const faculty = usersData.filter(u => u.role === 'faculty');
      const admins = usersData.filter(u => u.role === 'admin');
      
      const studentCount = students.length;
      const totalReadiness = students.reduce((sum, u) => sum + (u.readiness || 0), 0);
      const avgReadiness = studentCount > 0 ? Math.round(totalReadiness / studentCount) : 0;

      setUsers(usersData);
      setStats({
        totalUsers,
        studentCount,
        facultyCount: faculty.length,
        adminCount: admins.length,
        avgReadiness,
        lastSync: new Date().toLocaleTimeString(),
        isLoading: false
      });
    });

    const logsRef = collection(db, "system_logs");
    const logsQ = query(logsRef, orderBy("timestamp", "desc"), limit(10));
    
    const unsubscribeLogs = onSnapshot(logsQ, (snapshot) => {
      const logsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SystemLog[];
      setLogs(logsData);
    });

    // Load Platform Settings
    const loadSettings = async () => {
      try {
        const settingsDoc = await getDoc(doc(db, "platform_settings", "config"));
        if (settingsDoc.exists()) {
          setPlatformSettings(settingsDoc.data() as PlatformSettings);
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    };
    loadSettings();

    return () => {
      unsubscribeUsers();
      unsubscribeLogs();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/login/admin");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const openEditDialog = (user: UserProfile) => {
    setEditingUser(user);
    setEditRole(user.role);
    setEditXP(user.xp || 0);
    setEditReadiness(user.readiness || 0);
    setIsEditDialogOpen(true);
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    setIsSavingUser(true);
    try {
      const userRef = doc(db, "users", editingUser.id);
      await updateDoc(userRef, {
        role: editRole,
        xp: Number(editXP),
        readiness: Number(editReadiness)
      });
      toast({ title: "User Updated", description: `Successfully updated ${editingUser.email}` });
      setIsEditDialogOpen(false);
    } catch (error) {
      toast({ variant: "destructive", title: "Update Failed" });
    } finally {
      setIsSavingUser(false);
    }
  };

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    try {
      await setDoc(doc(db, "platform_settings", "config"), platformSettings);
      toast({ 
        title: "Configuration Saved", 
        description: "Global platform settings have been updated successfully.",
        className: "bg-emerald-500 text-white"
      });
    } catch (error) {
      toast({ 
        variant: "destructive", 
        title: "Save Failed", 
        description: "Could not update platform configuration." 
      });
    } finally {
      setIsSavingSettings(false);
    }
  };

  const filteredUsers = users.filter(user => 
    (user.displayName || user.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderContent = () => {
    if (stats.isLoading) {
      return (
        <div className="h-[60vh] w-full flex flex-col items-center justify-center">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
          <p className="mt-4 font-headline font-bold text-slate-400 uppercase tracking-widest text-xs">Synchronizing Intelligence...</p>
        </div>
      );
    }

    switch (currentView) {
      case 'health':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-4xl font-black font-headline text-slate-900 dark:text-white">{t('platformAnalytics')}</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Global infrastructure and user governance dashboard.</p>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-4 py-2 rounded-full text-xs font-bold border border-emerald-100 dark:border-emerald-500/20 flex items-center gap-2">
                 <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                 {t('allSystemsOperational')}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Active Nodes", val: stats.totalUsers.toString(), icon: Server, color: "text-blue-600 dark:text-blue-400" },
                { label: "Network Readiness", val: `${stats.avgReadiness}%`, icon: Activity, color: "text-emerald-600 dark:text-emerald-400" },
                { label: "Security Events", val: "0", icon: ShieldCheck, color: "text-primary dark:text-primary" },
                { label: "Global Reach", val: stats.studentCount.toString(), icon: Globe, color: "text-purple-600 dark:text-purple-400" },
              ].map((stat, i) => (
                <Card key={i} className="border-none shadow-sm hover:shadow-md transition-all">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardDescription className="uppercase text-[10px] font-black tracking-widest">{stat.label}</CardDescription>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <CardTitle className="text-2xl font-black">{stat.val}</CardTitle>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2 border-none shadow-sm rounded-3xl">
                <CardHeader>
                  <CardTitle className="font-headline">Traffic Overview</CardTitle>
                  <CardDescription>Visualizing real-time request patterns across all regions.</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center bg-slate-50 dark:bg-slate-900/50 rounded-2xl m-6 border border-dashed border-slate-200 dark:border-slate-800">
                   <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Interactive Heatmap Loading...</p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm rounded-3xl">
                <CardHeader>
                  <CardTitle className="font-headline">Admin Notifications</CardTitle>
                  <CardDescription>System maintenance and audit logs.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      "Database backup completed (2h ago)",
                      "New faculty account verified (4h ago)",
                      "SSL Certificates auto-renewed (12h ago)",
                      "Node-04 maintenance scheduled"
                    ].map((log, i) => (
                      <div key={i} className="flex gap-3 text-sm font-medium border-l-2 border-slate-200 dark:border-slate-800 pl-4 py-1">
                        <span className="text-slate-400">#</span>
                        {log}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'users':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="text-4xl font-black font-headline text-slate-900 dark:text-white">{t('userGovernance')}</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Manage permissions, training progress, and system access.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    placeholder="Search by name or email..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm focus-visible:ring-primary/20"
                  />
                </div>
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Card className="border-none shadow-xl rounded-[2.5rem] bg-white dark:bg-slate-900/50 overflow-hidden">
              <CardHeader className="p-8 border-b dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/80">
                <CardTitle className="text-xl font-bold font-headline flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" /> Verified Accounts
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-slate-50/80 dark:bg-slate-900/40">
                    <TableRow className="hover:bg-transparent border-slate-100 dark:border-slate-800">
                      <TableHead className="pl-8 font-black uppercase text-[10px] tracking-widest text-slate-500">Identity</TableHead>
                      <TableHead className="font-black uppercase text-[10px] tracking-widest text-slate-500">Role</TableHead>
                      <TableHead className="font-black uppercase text-[10px] tracking-widest text-slate-500 text-center">XP</TableHead>
                      <TableHead className="font-black uppercase text-[10px] tracking-widest text-slate-500 text-center">Readiness</TableHead>
                      <TableHead className="pr-8 text-right font-black uppercase text-[10px] tracking-widest text-slate-500">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id} className="group border-slate-50 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                        <TableCell className="pl-8 py-6">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={user.photoURL || `https://picsum.photos/seed/${user.id}/100/100`} />
                              <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-bold text-slate-900 dark:text-slate-100">{user.displayName || user.name || "User"}</p>
                              <p className="text-xs text-slate-500">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest inline-flex ${
                            user.role === 'admin' ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900' : 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400'
                          }`}>
                            {user.role}
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-bold text-slate-700 dark:text-zinc-300">
                           <div className="flex items-center justify-center gap-1">
                             <Zap className="h-3 w-3 text-primary fill-primary" /> {user.xp || 0}
                           </div>
                        </TableCell>
                        <TableCell className="text-center font-bold text-emerald-600 dark:text-emerald-400">
                          {user.readiness || 0}%
                        </TableCell>
                        <TableCell className="pr-8 text-right">
                          <Button variant="ghost" size="sm" onClick={() => openEditDialog(user)} className="rounded-xl font-bold">
                            <Edit2 className="h-4 w-4 mr-2" /> Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );

      case 'infra':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div>
              <h1 className="text-4xl font-black font-headline text-slate-900 dark:text-white">{t('infrastructure')}</h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Real-time monitoring of core platform services and database health.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Authentication", val: "Online", icon: ShieldCheck, color: "text-emerald-500", detail: "Firebase Auth v11" },
                { label: "Firestore DB", val: "Online", icon: Database, color: "text-blue-500", detail: "Regional multi-master" },
                { label: "API Latency", val: latency, icon: Signal, color: "text-orange-500", detail: "Global average" },
                { label: "Active Sessions", val: stats.totalUsers.toString(), icon: Users, color: "text-primary", detail: "Authenticated nodes" },
              ].map((service, i) => (
                <Card key={i} className="border-none shadow-sm hover:shadow-md transition-all">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardDescription className="uppercase text-[10px] font-black tracking-widest">{service.label}</CardDescription>
                    <service.icon className={`h-4 w-4 ${service.color}`} />
                  </CardHeader>
                  <CardContent>
                    <CardTitle className="text-2xl font-black">{service.val}</CardTitle>
                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tight">{service.detail}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="border-none shadow-xl rounded-[2rem] bg-white dark:bg-slate-900/50 overflow-hidden">
                <CardHeader className="p-8 border-b dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/80">
                  <CardTitle className="text-xl font-bold font-headline flex items-center gap-2">
                    <HardDrive className="h-5 w-5 text-primary" /> Database Health
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-1">
                      <p className="text-xs font-black uppercase text-slate-400 tracking-widest">Total Population</p>
                      <p className="text-3xl font-black">{stats.totalUsers}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-black uppercase text-slate-400 tracking-widest">Faculty Nodes</p>
                      <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{stats.facultyCount}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-black uppercase text-slate-400 tracking-widest">Student Nodes</p>
                      <p className="text-3xl font-black text-blue-600 dark:text-blue-400">{stats.studentCount}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-black uppercase text-slate-400 tracking-widest">Admin Controllers</p>
                      <p className="text-3xl font-black text-primary">{stats.adminCount}</p>
                    </div>
                  </div>
                  <div className="pt-6 border-t dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-500">
                    <span className="flex items-center gap-2"><Clock className="h-3 w-3" /> Last Data Sync</span>
                    <span className="text-slate-900 dark:text-white">{stats.lastSync}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-xl rounded-[2rem] bg-white dark:bg-slate-900/50 overflow-hidden">
                <CardHeader className="p-8 border-b dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/80">
                  <CardTitle className="text-xl font-bold font-headline flex items-center gap-2">
                    <History className="h-5 w-5 text-primary" /> System Logs
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  {logs.length > 0 ? (
                    <div className="space-y-4">
                      {logs.map((log) => (
                        <div key={log.id} className="flex gap-4 items-start border-b border-slate-50 dark:border-slate-800 pb-4 last:border-0 last:pb-0">
                          <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
                            log.type === 'error' ? 'bg-red-500' : 
                            log.type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
                          }`} />
                          <div className="space-y-0.5">
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{log.event}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">{new Date(log.timestamp?.toDate()).toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-[200px] flex flex-col items-center justify-center text-center space-y-2">
                      <Cpu className="h-10 w-10 text-slate-200 dark:text-slate-800" />
                      <p className="text-sm font-bold text-slate-400">No recent activity logs found</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-10 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-4xl font-black font-headline text-slate-900 dark:text-white">{t('settings')}</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Configure global learning parameters and system thresholds.</p>
              </div>
              <Button 
                onClick={handleSaveSettings} 
                disabled={isSavingSettings}
                className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black shadow-xl shadow-primary/20 transition-all active:scale-95"
              >
                {isSavingSettings ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Save className="h-5 w-5 mr-2" /> Save Configuration</>}
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Platform Config */}
              <Card className="border-none shadow-xl rounded-[2.5rem] bg-white dark:bg-slate-900/50 overflow-hidden">
                <CardHeader className="p-8 border-b dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/80">
                  <CardTitle className="text-xl font-bold font-headline flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" /> Core Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest ml-1">Platform Identity</Label>
                    <Input 
                      value={platformSettings.platformName}
                      onChange={(e) => setPlatformSettings(prev => ({...prev, platformName: e.target.value}))}
                      className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none font-bold text-lg focus-visible:ring-primary/20"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-widest ml-1">Global Max XP</Label>
                      <Input 
                        type="number"
                        value={platformSettings.maxXP}
                        onChange={(e) => setPlatformSettings(prev => ({...prev, maxXP: parseInt(e.target.value) || 0}))}
                        className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none font-bold focus-visible:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-widest ml-1">New User Readiness %</Label>
                      <Input 
                        type="number"
                        min="0" max="100"
                        value={platformSettings.defaultReadiness}
                        onChange={(e) => setPlatformSettings(prev => ({...prev, defaultReadiness: parseInt(e.target.value) || 0}))}
                        className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none font-bold focus-visible:ring-primary/20"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Feature Toggles */}
              <Card className="border-none shadow-xl rounded-[2.5rem] bg-white dark:bg-slate-900/50 overflow-hidden">
                <CardHeader className="p-8 border-b dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/80">
                  <CardTitle className="text-xl font-bold font-headline flex items-center gap-2">
                    <ToggleLeft className="h-5 w-5 text-primary" /> Feature Governance
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base font-bold">System Maintenance Mode</Label>
                      <p className="text-xs text-slate-400 font-medium">Disable student access for system upgrades.</p>
                    </div>
                    <Switch 
                      checked={platformSettings.maintenanceMode}
                      onCheckedChange={(val) => setPlatformSettings(prev => ({...prev, maintenanceMode: val}))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base font-bold">Global Leaderboard</Label>
                      <p className="text-xs text-slate-400 font-medium">Enable competitive ranking across all nodes.</p>
                    </div>
                    <Switch 
                      checked={platformSettings.leaderboardEnabled}
                      onCheckedChange={(val) => setPlatformSettings(prev => ({...prev, leaderboardEnabled: val}))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base font-bold">Open Registration</Label>
                      <p className="text-xs text-slate-400 font-medium">Allow new students to join via self-service.</p>
                    </div>
                    <Switch 
                      checked={platformSettings.allowRegistration}
                      onCheckedChange={(val) => setPlatformSettings(prev => ({...prev, allowRegistration: val}))}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Security Policy */}
              <Card className="border-none shadow-xl rounded-[2.5rem] bg-white dark:bg-slate-900/50 overflow-hidden lg:col-span-2">
                <CardHeader className="p-8 border-b dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/80">
                  <CardTitle className="text-xl font-bold font-headline flex items-center gap-2">
                    <Lock className="h-5 w-5 text-primary" /> Security Policy Enforcement
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/80 flex items-start gap-4 border border-slate-100 dark:border-slate-800">
                      <div className="bg-blue-100 dark:bg-blue-500/20 p-3 rounded-2xl text-blue-600 dark:text-blue-400">
                        <Smartphone className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-sm">Session Timeout</p>
                        <p className="text-xs text-slate-500 font-medium">Active sessions expire after 2 hours of inactivity.</p>
                      </div>
                    </div>
                    <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/80 flex items-start gap-4 border border-slate-100 dark:border-slate-800">
                      <div className="bg-emerald-100 dark:bg-emerald-500/20 p-3 rounded-2xl text-emerald-600 dark:text-emerald-400">
                        <ShieldQuestion className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-sm">Password Policy</p>
                        <p className="text-xs text-slate-500 font-medium">Minimum 12 characters with multi-factor entropy.</p>
                      </div>
                    </div>
                    <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/80 flex items-start gap-4 border border-slate-100 dark:border-slate-800">
                      <div className="bg-orange-100 dark:bg-orange-500/20 p-3 rounded-2xl text-orange-600 dark:text-orange-400">
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-sm">2FA Enforcement</p>
                        <p className="text-xs text-slate-500 font-medium">Mandatory for all Administrator and Faculty roles.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50 dark:bg-background">
        <Sidebar className="border-r border-slate-200 dark:border-slate-800 bg-slate-900 text-white">
          <SidebarHeader className="p-6">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <span className="font-headline text-2xl font-bold text-white">Admin Panel</span>
            </div>
          </SidebarHeader>

          <SidebarContent className="px-4">
            <SidebarMenu>
              {[
                { id: 'health', label: t('facultyOverview'), icon: BarChart3 },
                { id: 'users', label: t('userGovernance'), icon: Users },
                { id: 'infra', label: t('infrastructure'), icon: Database },
                { id: 'settings', label: t('settings'), icon: Settings },
              ].map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    onClick={() => setCurrentView(item.id as ViewType)}
                    className={`flex items-center gap-3 w-full transition-all ${
                      currentView === item.id ? 'bg-primary text-white shadow-lg' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="p-4 border-t border-slate-800 mt-auto">
             <div className="bg-slate-800 p-4 rounded-2xl flex items-center gap-3">
              <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                <AvatarImage src={`https://picsum.photos/seed/admin/100/100`} />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold truncate text-white uppercase">Administrator</p>
                <button onClick={handleLogout} className="text-xs text-slate-400 flex items-center gap-1 hover:text-red-400">
                   <LogOut className="h-3 w-3" /> {t('signOut')}
                </button>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <header className="h-16 border-b dark:border-slate-800 bg-background/80 backdrop-blur-md flex items-center px-8 shadow-sm">
            <SidebarTrigger className="md:hidden mr-4" />
            <h2 className="font-headline font-bold text-slate-800 dark:text-slate-400 uppercase tracking-widest text-xs">SafeLearn Enterprise Admin</h2>
            <div className="ml-auto flex items-center gap-4">
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-8 bg-slate-50 dark:bg-background/50">
            <div className="max-w-7xl mx-auto">{renderContent()}</div>
          </main>
        </div>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="rounded-[2.5rem] border-none shadow-2xl max-w-md p-8 bg-white dark:bg-slate-900">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black font-headline">Adjust User Profile</DialogTitle>
            <DialogDescription className="font-medium text-slate-500">
              Modifying data for <span className="text-slate-900 dark:text-slate-100 font-bold">{editingUser?.email}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-6">
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest">Access Privileges</Label>
              <Select value={editRole} onValueChange={setEditRole}>
                <SelectTrigger className="h-12 rounded-2xl bg-slate-50 dark:bg-slate-950 border-none">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student Account</SelectItem>
                  <SelectItem value="faculty">Faculty Member</SelectItem>
                  <SelectItem value="admin">System Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest">Training XP</Label>
                <Input 
                  type="number" 
                  value={editXP}
                  onChange={(e) => setEditXP(parseInt(e.target.value) || 0)}
                  className="h-12 rounded-2xl bg-slate-50 dark:bg-slate-950 border-none font-bold"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest">Readiness %</Label>
                <Input 
                  type="number" 
                  min="0" max="100"
                  value={editReadiness}
                  onChange={(e) => setEditReadiness(parseInt(e.target.value) || 0)}
                  className="h-12 rounded-2xl bg-slate-50 dark:bg-slate-950 border-none font-bold"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setIsEditDialogOpen(false)} className="rounded-2xl h-12">Cancel</Button>
            <Button onClick={handleUpdateUser} disabled={isSavingUser} className="rounded-2xl h-12 bg-primary hover:bg-primary/90 text-white font-black">
              {isSavingUser ? <Loader2 className="h-5 w-5 animate-spin" /> : "Commit Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
