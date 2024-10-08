"use client";

import { ReactNode, useEffect, useLayoutEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { TaskProvider } from "@/context/TaskContext";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { user, refresh, loading } = useAuth();
  const router = useRouter();

  useLayoutEffect(() => {
    if (loading != "loading" && !user) {
      router.push("/auth/login"); // Redirect to login if not authenticated
    }
  }, [user, router, loading]);

  useLayoutEffect(() => {
    const checkAuth = async () => {
      if (!user) {
        await refresh(); // Attempt to refresh token and get user
      }
    };

    if (loading !== "loading") checkAuth();
  }, [user, refresh, loading]);

  return (
    <TaskProvider>
      <div>{children}</div>
    </TaskProvider>
  );
};

export default DashboardLayout;
