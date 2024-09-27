"use client";

import { ReactNode, useEffect, useLayoutEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { TaskProvider } from "@/context/TaskContext";
import Header from "@/components/Header";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { user, refresh } = useAuth();
  const router = useRouter();

  //   useLayoutEffect(() => {
  //     const checkAuth = async () => {
  //       if (!user) {
  //         await refresh(); // Attempt to refresh token and get user
  //       }
  //     };

  //     checkAuth();
  //   }, [user, refresh]);

  //   useLayoutEffect(() => {
  //     if (!user) {
  //       router.push("/auth/login"); // Redirect to login if not authenticated
  //     }
  //   }, [user, router]);

  return (
    <TaskProvider>
      <Header />
      <div>{children}</div>
    </TaskProvider>
  );
};

export default DashboardLayout;
