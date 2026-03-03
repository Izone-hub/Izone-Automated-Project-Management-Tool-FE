
'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Github, Mail } from "lucide-react";
import Image from "next/image";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      // Only email and password are sent
      await login({
        email: data.email,
        password: data.password,
      });
    } catch (error) {
      // Error handled in useAuth
    }
  };

  const handleClickSignUp = () => {
    console.log('clickSignUp');
    try {
      router.push('/signup');
      return true;
    } catch (error) {
      console.error('error in clickSignUp', error);
      return false;
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-0 min-h-screen">
      {/* Image Section */}
      <div className="hidden md:flex items-center justify-center p-4">
        <div className="relative w-full h-full min-h-[600px] rounded-3xl overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100">
          <Image
            src="/mask-group.png"
            alt="Login Illustration"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 0vw, 50vw"
          />
        </div>
      </div>

      {/* Form Section */}
      <div className="flex items-center justify-center p-4 md:p-8">
        <div className="bg-card text-card-foreground border shadow-sm rounded-2xl p-8 space-y-6 w-full max-w-lg">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Welcome Back!</h1>
            <p className="text-muted-foreground">Sign in to your account to continue</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="test@example.com"
                {...register("email")}
                aria-invalid={errors.email ? "true" : "false"}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password")}
                  aria-invalid={errors.password ? "true" : "false"}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="cursor-pointer">
                  Remember me
                </Label>
              </div>
              <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                Forgot Password?
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="relative my-6 flex items-center">
            <div className="absolute left-0 right-0 top-1/2 h-px bg-border"></div>
            <span className="relative px-4 bg-card text-sm text-muted-foreground">
              or continue with
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="w-full flex items-center justify-center gap-2">
              <Github className="h-4 w-4" /> Github
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => {
                const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
                window.location.href = `${base}/auth/google/login`;
              }}
            >
              <Mail className="h-4 w-4" /> Google
            </Button>
          </div>

          <div className="text-center text-sm mt-4">
            Don't have an account?{" "}
            <button
              onClick={() => handleClickSignUp()}
              className="text-blue-600 hover:text-blue-700 hover:underline transition-colors cursor-pointer"
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}




