"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User, getRedirectResult } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
}

const ADMIN_EMAILS = ["tellexaiofficial@gmail.com"];

const AuthContext = createContext<AuthContextType>({ user: null, isAdmin: false, loading: true });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Handle redirect results for iOS Safari support
    const handleRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          // User already captured by onAuthStateChanged, but this ensures we handle the result
          console.log("Redirect result user:", result.user.email);
        }
      } catch (error) {
        console.error("Error handling redirect result:", error);
      }
    };

    handleRedirect();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        setUser(currentUser);
        
        // Automatically create or fetch user doc in Firestore
        const userRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userRef);
        
        if (!userDoc.exists()) {
          const isAdminUser = ADMIN_EMAILS.includes(currentUser.email || "");
          await setDoc(userRef, {
            uid: currentUser.uid,
            email: currentUser.email,
            isAdmin: isAdminUser,
            createdAt: serverTimestamp(),
          });
          setIsAdmin(isAdminUser);
        } else {
          const isAdminUser = ADMIN_EMAILS.includes(currentUser.email || "");
          // Safety: If they are in the admin list but the doc doesn't have the flag, update it!
          if (isAdminUser && !userDoc.data().isAdmin) {
            await updateDoc(userRef, { isAdmin: true });
            setIsAdmin(true);
          } else {
            setIsAdmin(userDoc.data().isAdmin || false);
          }
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

