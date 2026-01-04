// src/components/ErrorBoundary.tsx
import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-destructive/5 to-red-500/10 p-4">
          <div className="max-w-md w-full">
            <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-destructive to-red-500 mb-6 animate-pulse shadow-2xl shadow-destructive/30">
                <AlertTriangle className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-black mb-3 bg-gradient-to-r from-destructive to-red-500 bg-clip-text text-transparent">
                Oops! Something went wrong
              </h1>
              <p className="text-muted-foreground font-bold text-lg">
                We encountered an unexpected error
              </p>
            </div>

            <div className="bg-card border-2 border-destructive/30 rounded-3xl p-6 shadow-2xl mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              <p className="text-sm text-muted-foreground font-mono bg-secondary/50 p-4 rounded-lg overflow-auto max-h-32">
                {this.state.error?.message || 'Unknown error'}
              </p>
            </div>

            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              <button
                onClick={this.handleReset}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-purple-500 text-white font-black text-lg hover:opacity-90 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3"
              >
                <RefreshCw className="w-6 h-6" />
                Reload Page
              </button>

              <button
                onClick={this.handleGoHome}
                className="w-full py-4 rounded-2xl border-2 border-input bg-background hover:bg-accent text-foreground font-black text-lg hover:border-primary transition-all flex items-center justify-center gap-3"
              >
                <Home className="w-6 h-6" />
                Go to Home
              </button>
            </div>

            <p className="text-center text-xs text-muted-foreground mt-6">
              If this problem persists, please contact support
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}