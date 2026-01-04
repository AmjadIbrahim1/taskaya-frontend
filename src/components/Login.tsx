// src/components/Login.tsx - OPTIMIZED: Instant redirect after login
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store";
import { Eye, EyeOff, LogIn, Loader2, ArrowLeft } from "lucide-react";

interface LoginProps {
  onSwitchToRegister: () => void;
  onBack: () => void;
}

export function Login({ onSwitchToRegister, onBack }: LoginProps) {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setGeneralError("");

    // Validate with basic checks
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors({ email: "Please enter a valid email address" });
      return;
    }

    if (!password || password.length < 6) {
      setErrors({ password: "Password must be at least 6 characters" });
      return;
    }

    setIsLoading(true);
    try {
      // OPTIMIZED: Login and immediately navigate
      await login(email, password);

      // INSTANT REDIRECT - No setTimeout, no delays
      navigate("/", { replace: true });
    } catch (err: any) {
      console.error("Login error:", err);
      setGeneralError(
        err?.message ||
          "Invalid credentials. Please check your email and password."
      );
      setIsLoading(false); // Only set loading false on error
    }
    // Note: We don't set isLoading(false) on success to avoid re-render before navigation
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-purple-500/10 p-4">
      <div className="w-full max-w-md">
        <button
          onClick={onBack}
          disabled={isLoading}
          className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all disabled:opacity-50"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-bold">Back to options</span>
        </button>

        <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-purple-500 mb-6 animate-in zoom-in duration-500 delay-150 shadow-2xl shadow-primary/30">
            <span className="text-4xl">📝</span>
          </div>
          <h1 className="text-5xl font-black mb-3">
            <span className="bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              Welcome Back! 👋
            </span>
          </h1>
          <p className="text-muted-foreground font-bold text-lg">
            Sign in to your account
          </p>
        </div>

        <div className="bg-card border-2 rounded-3xl p-8 shadow-2xl shadow-primary/10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {generalError && (
              <div className="p-4 rounded-2xl bg-destructive/10 border-2 border-destructive/30 text-destructive font-bold text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                ⚠️ {generalError}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-black text-foreground">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-5 py-4 rounded-2xl bg-background border-2 ${
                  errors.email ? "border-destructive" : "border-input"
                } focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all duration-200 placeholder:text-muted-foreground font-bold shadow-lg`}
                placeholder="you@example.com"
                disabled={isLoading}
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-destructive text-sm font-bold">
                  {errors.email}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-5 py-4 pr-14 rounded-2xl bg-background border-2 ${
                    errors.password ? "border-destructive" : "border-input"
                  } focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all duration-200 placeholder:text-muted-foreground font-bold shadow-lg`}
                  placeholder="Enter your password"
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-all hover:scale-110"
                  disabled={isLoading}
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
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary via-purple-500 to-primary text-white font-black text-lg hover:opacity-90 active:scale-95 transition-all duration-200 shadow-2xl shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 bg-[length:200%_auto] animate-gradient"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-6 h-6" />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm font-bold text-muted-foreground">
              Don't have an account?{" "}
              <button
                onClick={onSwitchToRegister}
                className="text-primary font-black hover:underline transition-all"
                disabled={isLoading}
              >
                Sign up 🚀
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
