"use client";

import {
  GithubAuthProvider,
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { firebaseAuth } from "@/lib/firebase";

type AuthContextValue = {
  user: User | null;
  initializing: boolean;
  loginWithGithub: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({
  children,
}: {
  readonly children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const auth = firebaseAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setInitializing(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGithub = async () => {
    const auth = firebaseAuth();
    const provider = new GithubAuthProvider();
    provider.setCustomParameters({ allow_signup: "false" });
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    const auth = firebaseAuth();
    await signOut(auth);
  };

  const value = useMemo(
    () => ({ user, initializing, loginWithGithub, logout }),
    [user, initializing],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
