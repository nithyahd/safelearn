
"use client";

import React, { useEffect, useState } from "react";
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  query,
  setDoc,
  getDocs
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription,
  DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  BookOpen, 
  Plus, 
  Edit2, 
  Trash2, 
  Zap, 
  Clock, 
  Loader2, 
  Flame, 
  Activity,
  Waves
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DISASTER_MODULES } from "@/lib/mock-data";

interface CourseModule {
  id: string;
  title: string;
  description: string;
  type: string;
  difficulty: "Easy" | "Medium" | "Hard";
  lessons: number;
  xp: number;
  image?: string;
}

export default function CourseContentPage() {
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<CourseModule | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "Fire",
    difficulty: "Easy",
    lessons: 1,
    xp: 100
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const modulesRef = collection(db, "courseModules");
    
    const unsubscribe = onSnapshot(modulesRef, (snapshot) => {
      const modulesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CourseModule[];
      
      setModules(modulesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSeedData = async () => {
    setLoading(true);
    try {
      const modulesRef = collection(db, "courseModules");
      for (const module of DISASTER_MODULES) {
        await addDoc(modulesRef, {
          title: module.title,
          description: module.description,
          type: module.type,
          difficulty: "Medium",
          lessons: module.lessons,
          xp: module.xp,
          image: module.image
        });
      }
      toast({ title: "Modules Seeded", description: "Default learning curriculum has been initialized." });
    } catch (e) {
      toast({ variant: "destructive", title: "Seeding Failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveModule = async () => {
    setIsSaving(true);
    try {
      const modulesRef = collection(db, "courseModules");
      if (editingModule) {
        await updateDoc(doc(db, "courseModules", editingModule.id), formData);
        toast({ title: "Module Updated" });
      } else {
        await addDoc(modulesRef, {
          ...formData,
          image: `https://picsum.photos/seed/${formData.title}/800/600`
        });
        toast({ title: "Module Created" });
      }
      setIsAddDialogOpen(false);
      setEditingModule(null);
      setFormData({ title: "", description: "", type: "Fire", difficulty: "Easy", lessons: 1, xp: 100 });
    } catch (error) {
      toast({ variant: "destructive", title: "Action Failed" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteModule = async (id: string) => {
    if (!confirm("Are you sure you want to delete this module?")) return;
    try {
      await deleteDoc(doc(db, "courseModules", id));
      toast({ title: "Module Deleted" });
    } catch (e) {
      toast({ variant: "destructive", title: "Delete Failed" });
    }
  };

  const openEdit = (module: CourseModule) => {
    setEditingModule(module);
    setFormData({
      title: module.title,
      description: module.description,
      type: module.type,
      difficulty: module.difficulty,
      lessons: module.lessons,
      xp: module.xp
    });
    setIsAddDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-10 w-10 text-emerald-600 animate-spin" />
        <p className="font-headline font-bold text-slate-500 dark:text-zinc-400">Synchronizing Curriculum...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black font-headline text-slate-900 dark:text-zinc-100">Course Content</h1>
          <p className="text-slate-500 dark:text-zinc-400 font-medium">Create and manage interactive disaster preparedness modules.</p>
        </div>
        <div className="flex items-center gap-3">
          {modules.length === 0 && (
            <Button variant="outline" onClick={handleSeedData} className="rounded-2xl h-12 px-6 border-dashed border-border dark:border-zinc-800 text-foreground">
              Initialize Defaults
            </Button>
          )}
          <Button 
            onClick={() => {
              setEditingModule(null);
              setFormData({ title: "", description: "", type: "Fire", difficulty: "Easy", lessons: 1, xp: 100 });
              setIsAddDialogOpen(true);
            }}
            className="rounded-2xl h-12 px-8 bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-xl shadow-emerald-600/20"
          >
            <Plus className="h-5 w-5 mr-2" /> Add Module
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {modules.map((module) => (
          <Card key={module.id} className="group border-none shadow-xl rounded-[2.5rem] bg-white dark:bg-zinc-900 overflow-hidden flex flex-col">
            <div className="h-40 relative">
              <img src={module.image || `https://picsum.photos/seed/${module.id}/800/600`} alt={module.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute top-4 right-4 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-zinc-100">
                {module.difficulty}
              </div>
            </div>
            <CardHeader className="p-8 flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-1.5 rounded-lg ${
                  module.type === 'Fire' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 
                  module.type === 'Flood' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                }`}>
                  {module.type === 'Fire' ? <Flame className="h-3.5 w-3.5" /> : 
                   module.type === 'Flood' ? <Waves className="h-3.5 w-3.5" /> : <Zap className="h-3.5 w-3.5" />}
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500">{module.type} Module</span>
              </div>
              <CardTitle className="text-xl font-bold font-headline mb-2 text-foreground">{module.title}</CardTitle>
              <CardDescription className="line-clamp-2 font-medium dark:text-zinc-400">{module.description}</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-6">
              <div className="flex items-center justify-between text-sm font-bold border-t dark:border-zinc-800 pt-4">
                <div className="flex items-center gap-2 text-slate-500 dark:text-zinc-400">
                  <BookOpen className="h-4 w-4" /> {module.lessons} Lessons
                </div>
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-500">
                  <Zap className="h-4 w-4 fill-emerald-600" /> {module.xp} XP
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={() => openEdit(module)} variant="outline" className="flex-1 rounded-xl font-bold border-border dark:border-zinc-800 text-foreground">
                  <Edit2 className="h-4 w-4 mr-2" /> Edit
                </Button>
                <Button onClick={() => handleDeleteModule(module.id)} variant="ghost" className="rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="rounded-[2.5rem] border-none shadow-2xl max-w-lg p-8 bg-white dark:bg-zinc-900 text-foreground">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black font-headline">
              {editingModule ? "Modify Module" : "New Training Module"}
            </DialogTitle>
            <DialogDescription className="font-medium text-slate-500 dark:text-zinc-400">
              Define the curriculum parameters for student learning.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest ml-1 text-foreground">Module Title</Label>
              <Input 
                value={formData.title}
                onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
                className="h-12 rounded-2xl bg-slate-50 dark:bg-zinc-950 border-none font-bold text-foreground"
                placeholder="e.g., Advanced Home Fire Safety"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest ml-1 text-foreground">Category</Label>
                <Select value={formData.type} onValueChange={(val) => setFormData(prev => ({...prev, type: val}))}>
                  <SelectTrigger className="h-12 rounded-2xl bg-slate-50 dark:bg-zinc-950 border-none text-foreground">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-zinc-900 border-zinc-800">
                    <SelectItem value="Fire">Fire Safety</SelectItem>
                    <SelectItem value="Flood">Flood Awareness</SelectItem>
                    <SelectItem value="Earthquake">Earthquake Readiness</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest ml-1 text-foreground">Difficulty</Label>
                <Select value={formData.difficulty} onValueChange={(val: any) => setFormData(prev => ({...prev, difficulty: val}))}>
                  <SelectTrigger className="h-12 rounded-2xl bg-slate-50 dark:bg-zinc-950 border-none text-foreground">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-zinc-900 border-zinc-800">
                    <SelectItem value="Easy">Beginner (Easy)</SelectItem>
                    <SelectItem value="Medium">Intermediate (Medium)</SelectItem>
                    <SelectItem value="Hard">Advanced (Hard)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest ml-1 text-foreground">Lessons</Label>
                <Input 
                  type="number"
                  value={formData.lessons}
                  onChange={(e) => setFormData(prev => ({...prev, lessons: parseInt(e.target.value) || 0}))}
                  className="h-12 rounded-2xl bg-slate-50 dark:bg-zinc-950 border-none font-bold text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest ml-1 text-foreground">XP Reward</Label>
                <Input 
                  type="number"
                  value={formData.xp}
                  onChange={(e) => setFormData(prev => ({...prev, xp: parseInt(e.target.value) || 0}))}
                  className="h-12 rounded-2xl bg-slate-50 dark:bg-zinc-950 border-none font-bold text-foreground"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest ml-1 text-foreground">Description</Label>
              <Input 
                value={formData.description}
                onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                className="h-12 rounded-2xl bg-slate-50 dark:bg-zinc-950 border-none font-medium text-foreground"
                placeholder="Brief summary of module contents..."
              />
            </div>
          </div>

          <DialogFooter className="gap-2 pt-4">
            <Button variant="ghost" onClick={() => setIsAddDialogOpen(false)} className="rounded-2xl h-12 px-6 font-bold text-foreground">
              Cancel
            </Button>
            <Button 
              onClick={handleSaveModule}
              disabled={isSaving || !formData.title}
              className="rounded-2xl h-12 px-8 bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-xl shadow-emerald-600/20"
            >
              {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : editingModule ? "Update Module" : "Create Module"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
