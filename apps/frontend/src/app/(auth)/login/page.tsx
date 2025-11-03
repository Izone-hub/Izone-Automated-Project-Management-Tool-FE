'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Github, Mail } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, password }); // Replace with API call later
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 gap-x-0">
      <div className="flex items-center justify-center p-2 ">
        <div className="relative w-full h-full flex items-center justify-center">
        
          <Image
             src="/login.png.jpg" 
             alt="Login Illustration"
             fill
             className="object-cover rounded-3xl"
             priority
          />
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center p-4 md:p-4"
      >
        <div className="bg-white rounded-2xl p-8 space-y-6  w-full max-w-lg">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Welcome Back!</h1>
            <p className="text-muted-foreground">Sign in to your account to continue</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="test@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0"
                >
                  {showPassword ? <Eye size={14} /> : <EyeOff size={14} />}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember">Remember me</Label>
              </div>
              <a href="#" className="text-sm text-blue-600 hover:underline ">
                Forgot Password?
              </a>
            </div>

            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>

          <div className="relative my-4 flex items-center">
            <span className="absolute left-0 w-full border-t"></span>
            <span className="relative px-2 bg-white text-muted-foreground mx-auto">
              or continue with
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="w-full flex items-center justify-center gap-2">
              <Github className="h-4 w-4" /> Github
            </Button>
            <Button variant="outline" className="w-full flex items-center justify-center gap-2">
              <Mail className="h-4 w-4" /> Google
            </Button>
          </div>

          <div className="text-center text-sm mt-4">
            Don’t have an account?{" "}
            <a href="/signup" className="text-blue-600 hover:underline">
              Sign up
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}