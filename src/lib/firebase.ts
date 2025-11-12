import { FirebaseApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

type FirebaseConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
};

let firebaseApp: FirebaseApp | undefined;
let isFirebaseConfigured = false;

const getFirebaseConfig = (): FirebaseConfig | null => {
  const config: FirebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
    messagingSenderId:
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
  };

  // 检查是否所有必需的配置都已设置
  const missingKeys = Object.entries(config)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingKeys.length > 0) {
    if (typeof window !== "undefined") {
      console.warn(
        `⚠️ Firebase配置不完整。缺失的配置项: ${missingKeys.join(", ")}`,
      );
      console.warn(
        "💡 请访问 /firebase-setup 查看配置指南，或检查 .env.local 文件",
      );
    }
    return null;
  }

  isFirebaseConfigured = true;
  return config;
};

export const getFirebaseApp = (): FirebaseApp | null => {
  // 如果已经初始化，直接返回
  if (firebaseApp) {
    return firebaseApp;
  }

  // 如果已经有应用实例，使用它
  if (getApps().length > 0) {
    firebaseApp = getApps()[0];
    return firebaseApp;
  }

  // 获取配置
  const config = getFirebaseConfig();
  if (!config) {
    return null;
  }

  try {
    firebaseApp = initializeApp(config);
    return firebaseApp;
  } catch (error) {
    console.error("Firebase初始化失败:", error);
    return null;
  }
};

export const isFirebaseReady = (): boolean => {
  return isFirebaseConfigured && getFirebaseApp() !== null;
};

export const firebaseAuth = () => {
  const app = getFirebaseApp();
  if (!app) {
    throw new Error(
      "Firebase未配置。请访问 /firebase-setup 查看配置指南。",
    );
  }
  return getAuth(app);
};

export const firestore = () => {
  const app = getFirebaseApp();
  if (!app) {
    throw new Error(
      "Firebase未配置。请访问 /firebase-setup 查看配置指南。",
    );
  }
  return getFirestore(app);
};
