"use client";

import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { useAuth } from "../../../context/AuthContext";

function LoginPage() {
  const { login, user, loading:golbalLoading } = useAuth();
  const [curstate, setCurstate] = useState<string>("idle");
  const [errormsg, setErrormsg] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const redirectUrl: string = "/dashboard/kanban";

  useLayoutEffect(() => {
    if (golbalLoading != "loading" && user) {
      router.push(redirectUrl); // Redirect to login if  authenticated
    }
  }, [user, router, golbalLoading]);

  useEffect(() => {
    if (curstate === "success") {
      router.push(redirectUrl);
    }
  }, [curstate, router]);

  async function handleForm(e: React.SyntheticEvent) {
    e.preventDefault();
    setLoading(true);
    setErrormsg(null);

    try {
      await login(email, password);
      setCurstate("success");
    } catch (error) {
      console.error("Login failed:", error);
      setErrormsg("Login failed. Please check your credentials.");
      setCurstate("idle");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[100vh] flex flex-col justify-center bg-[#ffebc4] bg-[linear-gradient(180deg,#ffebc4,#fd9)]">
      <Card className="sm:w-[400px] sm:mx-auto mx-3 my-3 shadow-2xl border-[#00000055]">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Login</CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            Get Access to Your Account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleForm} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {errormsg && (
              <div className="mt-4 text-center text-md text-red-900">
                <Alert variant="destructive" className="border-none">{errormsg}</Alert>
              </div>
            )}
            <Button type="submit" className="w-full text-md" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
          <div className="mt-4 text-center text-md">
            {`Don't have an account? `}
            <button
              className="underline"
              onClick={() => router.push("/auth/signup")}
            >
              Sign up
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginPage;
