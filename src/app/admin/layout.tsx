
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, limit } from "firebase/firestore";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const usersRef = collection(db, "users");
          const q = query(usersRef, where("email", "==", user.email), limit(1));
          const querySnapshot = await getDocs(q);

          if (querySnapshot.empty) {
            router.replace("/login/admin");
            return;
          }

          const userData = querySnapshot.docs[0].data();
          const role = (userData.role || "").toLowerCase();

          if (role !== "admin") {
            router.replace("/login/admin");
          } else {
            setIsAuthorized(true);
            setIsLoading(false);
          }
        } catch (error) {
          console.error("Authorization check failed:", error);
          router.replace("/login/admin");
        }
      } else {
        router.replace("/login/admin");
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (isLoading || !isAuthorized) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-background text-foreground">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="mt-4 font-headline font-bold text-muted-foreground">Verifying Admin Access...</p>
      </div>
    );
  }

  return <>{children}</>;
}
