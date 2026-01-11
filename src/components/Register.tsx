// src/components/Register.tsx - React Hook Form + Zod Validation
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store";
import { Eye, EyeOff, UserPlus, Loader2, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface RegisterProps {
  onSwitchToLogin: () => void;
  onBack: () => void;
}

const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, "Email is required")
      .min(5, "Email must be at least 5 characters")
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password is too long (max 100 characters)")
      .regex(/[a-zA-Z]/, "Password must contain at least one letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^a-zA-Z0-9]/,
        "Password must contain at least one special character (!@#$%^&*)"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export function Register({ onSwitchToLogin, onBack }: RegisterProps) {
  const navigate = useNavigate();
  const { register: registerUser } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      console.log("📝 Registration Form Submit");
      console.log("   Email:", data.email);
      console.log("   Password Length:", data.password.length);

      await registerUser(data.email, data.password);
      console.log("✅ Registration successful!");
      navigate("/", { replace: true });
    } catch (err: any) {
      console.error("❌ Registration error:", err);

      let errorMessage = "Registration failed. Please try again.";

      if (err?.message) {
        errorMessage = err.message;

        if (errorMessage.includes("Validation failed")) {
          errorMessage = "Please check your email and password format";
        } else if (errorMessage.includes("already exists")) {
          setError("email", {
            type: "server",
            message: "This email is already registered",
          });
          return;
        }
      }

      setError("root", { type: "server", message: errorMessage });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-purple-500/10 p-4">
      <div className="w-full max-w-md">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all disabled:opacity-50"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-bold">Back to options</span>
        </button>

        <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-purple-500 mb-6 animate-in zoom-in duration-500 delay-150 shadow-2xl shadow-primary/30">
            <span className="text-4xl">✨</span>
          </div>
          <h1 className="text-5xl font-black mb-3">
            <span className="bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              Join Taskaya! 🚀
            </span>
          </h1>
          <p className="text-muted-foreground font-bold text-lg">
            Create your account to get started
          </p>
        </div>

        <div className="bg-card border-2 rounded-3xl p-8 shadow-2xl shadow-primary/10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 backdrop-blur-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {errors.root?.message && (
              <div className="p-4 rounded-2xl bg-destructive/10 border-2 border-destructive/30 text-destructive font-bold text-sm animate-in fade-in">
                ⚠️ {errors.root.message}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-black text-foreground">
                Email Address
              </label>
              <input
                type="email"
                {...register("email")}
                className={`w-full px-5 py-4 rounded-2xl bg-background border-2 ${
                  errors.email ? "border-destructive" : "border-input"
                } focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all font-bold shadow-lg`}
                placeholder="you@example.com"
                disabled={isSubmitting}
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-destructive text-sm font-bold">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-foreground">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className={`w-full px-5 py-4 pr-14 rounded-2xl bg-background border-2 ${
                    errors.password ? "border-destructive" : "border-input"
                  } focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all font-bold shadow-lg`}
                  placeholder="At least 8 characters"
                  disabled={isSubmitting}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-all hover:scale-110"
                  disabled={isSubmitting}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-destructive text-sm font-bold">
                  {errors.password.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                💡 Must include: letter, number, and special character
                (!@#$%^&*)
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-foreground">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword")}
                  className={`w-full px-5 py-4 pr-14 rounded-2xl bg-background border-2 ${
                    errors.confirmPassword
                      ? "border-destructive"
                      : "border-input"
                  } focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all font-bold shadow-lg`}
                  placeholder="Confirm your password"
                  disabled={isSubmitting}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-all hover:scale-110"
                  disabled={isSubmitting}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-destructive text-sm font-bold">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary via-purple-500 to-primary text-white font-black text-lg hover:opacity-90 active:scale-95 transition-all shadow-2xl disabled:opacity-50 flex items-center justify-center gap-3 bg-[length:200%_auto] animate-gradient"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus className="w-6 h-6" />
                  Sign Up
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm font-bold text-muted-foreground">
              Already have an account?{" "}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-primary font-black hover:underline transition-all"
                disabled={isSubmitting}
              >
                Sign in 👋
              </button>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}
