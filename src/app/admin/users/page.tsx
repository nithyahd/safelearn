
"use client";

import React, { useEffect, useState } from "react";
import { 
  collection, 
  onSnapshot, 
  doc, 
  updateDoc, 
  query, 
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
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  Edit2, 
  Search, 
  Shield, 
  Zap, 
  Activity, 
  Loader2,
  Filter
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  // Form State for editing
  const [editRole, setEditRole] = useState<string>("");
  const [editXP, setEditXP] = useState<number>(0);
  const [editReadiness, setEditReadiness] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, orderBy("role", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserProfile[];
      setUsers(usersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const openEditDialog = (user: UserProfile) => {
    setEditingUser(user);
    setEditRole(user.role);
    setEditXP(user.xp || 0);
    setEditReadiness(user.readiness || 0);
    setIsEditDialogOpen(true);
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    setIsSaving(true);

    try {
      const userRef = doc(db, "users", editingUser.id);
      await updateDoc(userRef, {
        role: editRole,
        xp: Number(editXP),
        readiness: Number(editReadiness)
      });

      toast({
        title: "User Updated",
        description: `Successfully updated profile for ${editingUser.displayName || editingUser.email}`,
      });
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "An error occurred while saving user data.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const filteredUsers = users.filter(user => 
    (user.displayName?.toLowerCase() || user.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="font-headline font-bold text-slate-500 animate-pulse">Loading Governance Data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black font-headline text-slate-900">User Governance</h1>
          <p className="text-slate-500 font-medium">Manage permissions, training progress, and system access.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search by name or email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 bg-white border-slate-200 rounded-2xl shadow-sm focus-visible:ring-primary/20"
            />
          </div>
          <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl bg-white border-slate-200 shadow-sm">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
        <CardHeader className="p-8 border-b bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold font-headline flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" /> Verified Accounts
              </CardTitle>
              <CardDescription className="font-medium mt-1">Total of {users.length} registered users found in database.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/80">
              <TableRow className="hover:bg-transparent border-slate-100">
                <TableHead className="pl-8 font-black uppercase text-[10px] tracking-widest text-slate-500">User Identity</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest text-slate-500">System Role</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest text-slate-500 text-center">XP</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest text-slate-500 text-center">Readiness</TableHead>
                <TableHead className="pr-8 text-right font-black uppercase text-[10px] tracking-widest text-slate-500">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} className="group border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <TableCell className="pl-8 py-6">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10 ring-2 ring-slate-100 ring-offset-2">
                          <AvatarImage src={user.photoURL || `https://picsum.photos/seed/${user.id}/100/100`} />
                          <AvatarFallback className="bg-primary/10 text-primary font-bold">
                            {(user.displayName || user.name || user.email).substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-primary transition-colors">
                            {user.displayName || user.name || "Unnamed User"}
                          </p>
                          <p className="text-xs text-slate-500 font-medium">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        user.role === 'admin' ? 'bg-slate-900 text-white' :
                        user.role === 'faculty' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        <Shield className="h-3 w-3" />
                        {user.role}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1 font-bold text-slate-700">
                        <Zap className="h-3 w-3 text-primary fill-primary" />
                        {user.xp?.toLocaleString() || 0}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1 font-bold text-emerald-600">
                        <Activity className="h-3 w-3" />
                        {user.readiness || 0}%
                      </div>
                    </TableCell>
                    <TableCell className="pr-8 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => openEditDialog(user)}
                        className="rounded-xl hover:bg-primary/10 hover:text-primary font-bold transition-all"
                      >
                        <Edit2 className="h-4 w-4 mr-2" /> Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-slate-400 font-medium">
                    No users matching your criteria were found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="rounded-[2.5rem] border-none shadow-2xl max-w-md p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black font-headline">Adjust User Profile</DialogTitle>
            <DialogDescription className="font-medium text-slate-500">
              Modifying data for <span className="text-slate-900 font-bold">{editingUser?.displayName || editingUser?.email}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-6">
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest ml-1">Access Privileges</Label>
              <Select value={editRole} onValueChange={setEditRole}>
                <SelectTrigger className="h-12 rounded-2xl bg-slate-50 border-none shadow-inner focus:ring-primary/20">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-100">
                  <SelectItem value="student">Student Account</SelectItem>
                  <SelectItem value="faculty">Faculty Member</SelectItem>
                  <SelectItem value="admin">System Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest ml-1">Training XP</Label>
                <div className="relative">
                  <Zap className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                  <Input 
                    type="number" 
                    value={editXP}
                    onChange={(e) => setEditXP(parseInt(e.target.value) || 0)}
                    className="h-12 pl-12 rounded-2xl bg-slate-50 border-none shadow-inner focus-visible:ring-primary/20 font-bold"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest ml-1">Readiness %</Label>
                <div className="relative">
                  <Activity className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                  <Input 
                    type="number" 
                    min="0"
                    max="100"
                    value={editReadiness}
                    onChange={(e) => setEditReadiness(parseInt(e.target.value) || 0)}
                    className="h-12 pl-12 rounded-2xl bg-slate-50 border-none shadow-inner focus-visible:ring-primary/20 font-bold"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button 
              variant="ghost" 
              onClick={() => setIsEditDialogOpen(false)}
              className="rounded-2xl h-12 px-6 font-bold"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateUser}
              disabled={isSaving}
              className="rounded-2xl h-12 px-8 bg-primary hover:bg-primary/90 text-white font-black shadow-xl shadow-primary/20"
            >
              {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : "Commit Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
