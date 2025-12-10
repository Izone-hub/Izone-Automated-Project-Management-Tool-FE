// 'use client';

// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Eye, EyeOff } from "lucide-react";
// import Image from "next/image";
// import { signupSchema, type SignupFormData } from "@/lib/validations/auth";
// import { useAuth } from "@/hooks/use-auth";
// import { SignupData } from "@/lib/api/auth";

// export default function SignupPage() {
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const { signup, isLoading } = useAuth();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<SignupFormData>({
//     resolver: zodResolver(signupSchema),
//   });

//   const onSubmit = async (data: SignupFormData) => {
//     try {
//       const { firstName, lastName, email, password } = data;

//       // 🔥 Clear old session BEFORE making API call
//       if (typeof window !== 'undefined') {
//         localStorage.removeItem('auth_token');
//         localStorage.removeItem('user');
//         localStorage.removeItem('lastWorkspaceId');
//       }

//       const signupData: SignupData = {
//         email,
//         Full_Name: `${firstName} ${lastName}`,
//         password, 
//       };
      
//       await signup(signupData);
//     } catch (error) {
//       // Error is handled by useAuth hook
//     }
//   };

//   return (
//     <div className="grid md:grid-cols-2 gap-0 min-h-screen">
//       {/* Image Section */}
//       <div className="hidden md:flex items-center justify-center p-4">
//         <div className="relative w-full h-full min-h-[600px] rounded-3xl overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100">
//           <Image
//             src="/mask-group.png" 
//             alt="Signup Illustration"
//             fill
//             className="object-cover"
//             priority
//             sizes="(max-width: 768px) 0vw, 50vw"
//           />
//         </div>
//       </div>
      
//       {/* Form Section */}
//       <div className="flex items-center justify-center p-4 md:p-8">
//         <div className="bg-white rounded-2xl p-8 space-y-6 w-full max-w-lg">
//           <div className="text-center space-y-2">
//             <h1 className="text-3xl font-bold tracking-tight">Create your Account</h1>
//             <p className="text-muted-foreground">Sign up to get started</p>
//           </div>

//           <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="firstName">First Name</Label>
//                 <Input
//                   id="firstName"
//                   type="text"
//                   placeholder="First Name"
//                   {...register("firstName")}
//                   aria-invalid={errors.firstName ? "true" : "false"}
//                 />
//                 {errors.firstName && (
//                   <p className="text-sm text-red-500">{errors.firstName.message}</p>
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="lastName">Last Name</Label>
//                 <Input
//                   id="lastName"
//                   type="text"
//                   placeholder="Last Name"
//                   {...register("lastName")}
//                   aria-invalid={errors.lastName ? "true" : "false"}
//                 />
//                 {errors.lastName && (
//                   <p className="text-sm text-red-500">{errors.lastName.message}</p>
//                 )}
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 placeholder="test@example.com"
//                 {...register("email")}
//                 aria-invalid={errors.email ? "true" : "false"}
//               />
//               {errors.email && (
//                 <p className="text-sm text-red-500">{errors.email.message}</p>
//               )}
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="password">Password</Label>
//               <div className="relative">
//                 <Input
//                   id="password"
//                   type={showPassword ? "text" : "password"}
//                   placeholder="Enter your password"
//                   {...register("password")}
//                   aria-invalid={errors.password ? "true" : "false"}
//                 />
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//                   aria-label={showPassword ? "Hide password" : "Show password"}
//                 >
//                   {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
//                 </Button>
//               </div>
//               {errors.password && (
//                 <p className="text-sm text-red-500">{errors.password.message}</p>
//               )}
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="confirmPassword">Confirm Password</Label>
//               <div className="relative">
//                 <Input
//                   id="confirmPassword"
//                   type={showConfirmPassword ? "text" : "password"}
//                   placeholder="Confirm your password"
//                   {...register("confirmPassword")}
//                   aria-invalid={errors.confirmPassword ? "true" : "false"}
//                 />
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                   className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//                   aria-label={showConfirmPassword ? "Hide password" : "Show password"}
//                 >
//                   {showConfirmPassword ? <Eye size={16} /> : <EyeOff size={16} />}
//                 </Button>
//               </div>
//               {errors.confirmPassword && (
//                 <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
//               )}
//             </div>

//             <Button type="submit" className="w-full" disabled={isLoading}>
//               {isLoading ? "Creating account..." : "Sign Up"}
//             </Button>
//           </form>

//           <div className="text-center text-sm mt-4">
//             Already have an account?{" "}
//             <Link 
//               href="/login" 
//               className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
//               prefetch={true}
//             >
//               Login
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



















'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { signupSchema, type SignupFormData } from "@/lib/validations/auth";
import { useAuth } from "@/hooks/use-auth";
import { SignupData } from "@/lib/api/auth";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signup, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      const { firstName, lastName, email, password } = data;

      // Check the values before sending
      console.log('Signup data being sent:', {
        email,
        full_name: `${firstName} ${lastName}`,
        password, // Make sure this is defined
      });

      const signupData: SignupData = {
        email,
        Full_Name: `${firstName} ${lastName}`,
        password, 
      };
       
      await signup(signupData);
    } catch (error) {
      // Error is handled by useAuth hook
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-0 min-h-screen">
      {/* Image Section */}
      <div className="hidden md:flex items-center justify-center p-4">
        <div className="relative w-full h-full min-h-[600px] rounded-3xl overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100">
          <Image
            src="/mask-group.png" 
            alt="Signup Illustration"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 0vw, 50vw"
          />
        </div>
      </div>
      
      {/* Form Section */}
      <div className="flex items-center justify-center p-4 md:p-8">
        <div className="bg-white rounded-2xl p-8 space-y-6 w-full max-w-lg">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Create your Account</h1>
            <p className="text-muted-foreground">Sign up to get started</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="First Name"
                  {...register("firstName")}
                  aria-invalid={errors.firstName ? "true" : "false"}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500">{errors.firstName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Last Name"
                  {...register("lastName")}
                  aria-invalid={errors.lastName ? "true" : "false"}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500">{errors.lastName.message}</p>
                )}
              </div>
            </div>

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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  {...register("confirmPassword")}
                  aria-invalid={errors.confirmPassword ? "true" : "false"}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                </Button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>

          <div className="text-center text-sm mt-4">
            Already have an account?{" "}
            <Link 
              href="/login" 
              className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
              prefetch={true}
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}