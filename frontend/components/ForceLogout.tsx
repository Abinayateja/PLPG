"use client";

import { useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

const ForceLogout = () => {
  useEffect(() => {
    signOut(auth);
  }, []);

  return null;
};

export default ForceLogout;