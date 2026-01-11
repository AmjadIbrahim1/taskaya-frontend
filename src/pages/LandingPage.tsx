// src/pages/LandingPage.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store";
import {
  CheckCircle2,
  Zap,
  Shield,
  Sparkles,
  ArrowRight,
  Calendar,
  Clock,
  Target,
} from "lucide-react";

export function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/app", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleGetStarted = () => {
    navigate("/auth/register");
  };

  const handleLogin = () => {
    navigate("/auth/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-purple-500/10">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-700">
            <span className="text-3xl">📝</span>
            <h1 className="text-2xl font-black bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent">
              Taskaya
            </h1>
          </div>

          <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-700">
            <button
              onClick={handleLogin}
              className="px-6 py-2.5 rounded-xl font-bold text-foreground hover:bg-accent transition-all"
            >
              Login
            </button>
            <button
              onClick={handleGetStarted}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-purple-500 text-white font-bold hover:opacity-90 transition-all shadow-lg"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-8 animate-in zoom-in duration-500 delay-100">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-primary">
                Your Productivity Companion
              </span>
            </div>

            <h1 className="text-6xl md:text-7xl font-black mb-6 leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              <span className="bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                Organize Your Tasks
              </span>
              <br />
              <span className="text-foreground">Boost Your Day</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              Simple, powerful, and beautiful task management that helps you
              stay focused and get things done. No complexity, just results.
            </p>

            <button
              onClick={handleGetStarted}
              className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-primary via-purple-500 to-primary text-white font-black text-lg hover:opacity-90 transition-all shadow-2xl shadow-primary/30 flex items-center gap-3 mx-auto animate-in zoom-in duration-500 delay-400 bg-[length:200%_auto] animate-gradient"
            >
              Start Free Today
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
            <div className="group p-8 rounded-3xl bg-card border-2 border-transparent hover:border-primary/30 transition-all duration-300 hover:-translate-y-2 shadow-lg hover:shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-black text-foreground mb-3">
                Stay Organized
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Keep all your tasks in one place with smart categorization and
                priority management.
              </p>
            </div>

            <div className="group p-8 rounded-3xl bg-card border-2 border-transparent hover:border-primary/30 transition-all duration-300 hover:-translate-y-2 shadow-lg hover:shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-600">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-black text-foreground mb-3">
                Work Faster
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Lightning-fast interface that helps you capture ideas and
                complete tasks quickly.
              </p>
            </div>

            <div className="group p-8 rounded-3xl bg-card border-2 border-transparent hover:border-primary/30 transition-all duration-300 hover:-translate-y-2 shadow-lg hover:shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-black text-foreground mb-3">
                Secure & Private
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Your data is encrypted and protected with industry-standard security.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-20 animate-in fade-in zoom-in duration-700 delay-800">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Calendar className="w-6 h-6 text-primary" />
                <p className="text-4xl font-black text-foreground">Smart</p>
              </div>
              <p className="text-muted-foreground font-bold">
                Deadline Tracking
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-6 h-6 text-primary" />
                <p className="text-4xl font-black text-foreground">Instant</p>
              </div>
              <p className="text-muted-foreground font-bold">Real-time Sync</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Target className="w-6 h-6 text-primary" />
                <p className="text-4xl font-black text-foreground">Focus</p>
              </div>
              <p className="text-muted-foreground font-bold">Priority System</p>
            </div>
          </div>

          <div className="text-center bg-gradient-to-br from-primary/10 to-purple-500/10 border-2 border-primary/30 rounded-3xl p-12 animate-in fade-in zoom-in duration-700 delay-900">
            <h2 className="text-4xl font-black text-foreground mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of productive people who trust Taskaya to manage
              their daily tasks.
            </p>
            <button
              onClick={handleGetStarted}
              className="group px-10 py-5 rounded-2xl bg-gradient-to-r from-primary via-purple-500 to-primary text-white font-black text-xl hover:opacity-90 transition-all shadow-2xl shadow-primary/30 inline-flex items-center gap-3 bg-[length:200%_auto] animate-gradient"
            >
              Create Free Account
              <ArrowRight className="w-7 h-7 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      <footer className="border-t py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 Taskaya. Built with ❤️ for productivity lovers.
          </p>
        </div>
      </footer>

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