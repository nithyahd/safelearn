
"use client";

import React, { useEffect, useState } from "react";
import { 
  collection, 
  onSnapshot, 
  query, 
  where, 
  doc, 
  updateDoc,
  orderBy
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Users, 
  Search, 
  Edit2, 
  Zap, 
  Activity, 
  Trophy, 
  Loader2,
  Filter,
  Eye
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

interface Student {
  id: string;
  displayName?: string;
  name?: string;
  email: string;
  xp: number;
  readiness: number;
  photoURL?: string;
  rank?: number;
}

export default function MyStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const [editXP, setEditXP] = useState<number>(0);
  const [editReadiness, setEditReadiness] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("role", "==", "student"), orderBy("xp", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const studentsData = snapshot.docs.map((doc, index) => ({
        id: doc.id,
        rank: index + 1,
        ...doc.data()
      })) as Student[];
      setStudents(studentsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const openEditDialog = (student: Student) => {
    setEditingStudent(student);
    setEditXP(student.xp || 0);
    setEditReadiness(student.readiness || 0);
    setIsEditDialogOpen(true);
  };

  const handleUpdateStudent = async () => {
    if (!editingStudent) return;
    setIsSaving(true);

    try {
      const studentRef = doc(db, "users", editingStudent.id);
      await updateDoc(studentRef, {
        xp: Number(editXP),
        readiness: Number(editReadiness)
      });

      toast({
        title: "Student Updated",
        description: `Successfully adjusted training stats for ${editingStudent.displayName || editingStudent.email}`,
      });
      setIsEditDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Error updating student records.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const filteredStudents = students.filter(s => 
    (s.displayName || s.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-10 w-10 text-emerald-600 animate-spin" />
        <p className="font-headline font-bold text-slate-500 dark:text-zinc-400 animate-pulse">Loading Student Roster...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black font-headline text-slate-900 dark:text-zinc-100">My Students</h1>
          <p className="text-slate-500 dark:text-zinc-400 font-medium">Monitor and manage the disaster preparedness levels of your class.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-zinc-500" />
            <Input 
              placeholder="Search by name or email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 rounded-2xl shadow-sm focus-visible:ring-emerald-600/20"
            />
          </div>
          <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 shadow-sm">
            <Filter className="h-4 w-4 text-foreground" />
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-xl rounded-[2.5rem] bg-white dark:bg-zinc-900 overflow-hidden">
        <CardHeader className="p-8 border-b dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50">
          <CardTitle className="text-xl font-bold font-headline flex items-center gap-2 text-foreground">
            <Users className="h-5 w-5 text-emerald-600" /> Student Population
          </CardTitle>
          <CardDescription className="font-medium dark:text-zinc-400">Total of {students.length} students enrolled in your program.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/80 dark:bg-zinc-900/20">
              <TableRow className="hover:bg-transparent border-slate-100 dark:border-zinc-800">
                <TableHead className="pl-8 font-black uppercase text-[10px] tracking-widest text-slate-500 dark:text-zinc-500">Rank</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest text-slate-500 dark:text-zinc-500">Student</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest text-slate-500 dark:text-zinc-500 text-center">XP</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest text-slate-500 dark:text-zinc-500 text-center">Readiness</TableHead>
                <TableHead className="pr-8 text-right font-black uppercase text-[10px] tracking-widest text-slate-500 dark:text-zinc-500">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <TableRow key={student.id} className="group border-slate-50 dark:border-zinc-800 hover:bg-emerald-50/30 dark:hover:bg-emerald-500/10 transition-colors">
                    <TableCell className="pl-8 font-bold text-slate-400 dark:text-zinc-500">
                       <div className={`h-8 w-8 rounded-full flex items-center justify-center ${student.rank === 1 ? 'bg-yellow-400 text-yellow-900' : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400'}`}>
                         #{student.rank}
                       </div>
                    </TableCell>
                    <TableCell className="py-6">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10 ring-2 ring-emerald-600/10">
                          <AvatarImage src={student.photoURL || `https://picsum.photos/seed/${student.id}/100/100`} />
                          <AvatarFallback className="bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 font-bold uppercase">
                            {(student.displayName || student.name || student.email).substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-zinc-100 group-hover:text-emerald-600 transition-colors">
                            {student.displayName || student.name || "Unnamed Student"}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">{student.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-bold text-slate-700 dark:text-zinc-300">
                      <div className="flex items-center justify-center gap-1">
                        <Zap className="h-3 w-3 text-primary fill-primary" />
                        {student.xp?.toLocaleString() || 0}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1 font-bold text-emerald-600 dark:text-emerald-500">
                        <Activity className="h-3 w-3" />
                        {student.readiness || 0}%
                      </div>
                    </TableCell>
                    <TableCell className="pr-8 text-right space-x-2">
                      <Button variant="ghost" size="sm" className="rounded-xl font-bold text-slate-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400">
                        <Eye className="h-4 w-4 mr-2" /> View
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => openEditDialog(student)}
                        className="rounded-xl font-bold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-all"
                      >
                        <Edit2 className="h-4 w-4 mr-2" /> Update
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-slate-400 dark:text-zinc-500 font-medium">
                    No students found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="rounded-[2.5rem] border-none shadow-2xl max-w-md p-8 bg-white dark:bg-zinc-900">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black font-headline text-foreground">Update Training Progress</DialogTitle>
            <DialogDescription className="font-medium text-slate-500 dark:text-zinc-400">
              Adjusting metrics for <span className="text-slate-900 dark:text-zinc-100 font-bold">{editingStudent?.displayName || editingStudent?.email}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-6 text-foreground">
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest ml-1">Current XP</Label>
              <div className="relative">
                <Zap className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                <Input 
                  type="number" 
                  value={editXP}
                  onChange={(e) => setEditXP(parseInt(e.target.value) || 0)}
                  className="h-12 pl-12 rounded-2xl bg-slate-50 dark:bg-zinc-950 border-none shadow-inner focus-visible:ring-emerald-600/20 font-bold dark:text-zinc-100"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest ml-1">Readiness Percentage</Label>
              <div className="relative">
                <Activity className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                <Input 
                  type="number" 
                  min="0" max="100"
                  value={editReadiness}
                  onChange={(e) => setEditReadiness(parseInt(e.target.value) || 0)}
                  className="h-12 pl-12 rounded-2xl bg-slate-50 dark:bg-zinc-950 border-none shadow-inner focus-visible:ring-emerald-600/20 font-bold dark:text-zinc-100"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setIsEditDialogOpen(false)} className="rounded-2xl h-12 px-6 font-bold text-foreground">
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateStudent}
              disabled={isSaving}
              className="rounded-2xl h-12 px-8 bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-xl shadow-emerald-600/20"
            >
              {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : "Commit Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
