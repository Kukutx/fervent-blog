"use client";

import {
  GithubAuthProvider,
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { firebaseAuth, isFirebaseReady } from "@/lib/firebase";

type AuthContextValue = {
  user: User | null;
  initializing: boolean;
  isConfigured: boolean;
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
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    const configured = isFirebaseReady();
    setIsConfigured(configured);

    if (!configured) {
      setInitializing(false);
      return;
    }

    try {
      const auth = firebaseAuth();
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        setUser(firebaseUser);
        setInitializing(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Firebase Auth初始化失败:", error);
      setInitializing(false);
    }
  }, []);

  const loginWithGithub = async () => {
    if (!isFirebaseReady()) {
      throw new Error(
        "Firebase未配置。请访问 /firebase-setup 查看配置指南。",
      );
    }
    const auth = firebaseAuth();
    const provider = new GithubAuthProvider();
    provider.setCustomParameters({ allow_signup: "false" });
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    if (!isFirebaseReady()) {
      return;
    }
    const auth = firebaseAuth();
    await signOut(auth);
  };

  const value = useMemo(
    () => ({ user, initializing, isConfigured, loginWithGithub, logout }),
    [user, initializing, isConfigured],
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
