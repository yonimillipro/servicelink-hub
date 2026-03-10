import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Mail, Lock, User, AlertCircle, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = loginSchema.extend({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  confirmPassword: z.string(),
  role: z.enum(["user", "provider"]),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type AuthMode = "login" | "register" | "forgot-password";

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signIn, signUp, isLoading: authLoading, roles: userRoles } = useAuth();

  const [mode, setMode] = useState<AuthMode>(() => {
    if (location.pathname === "/register") return "register";
    if (location.pathname === "/forgot-password") return "forgot-password";
    return "login";
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"user" | "provider">("user");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { roles } = useAuth();

  useEffect(() => {
    if (user && !authLoading) {
      const from = (location.state as { from?: Location })?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
      } else if (roles.includes("admin")) {
        navigate("/admin", { replace: true });
      } else if (roles.includes("provider")) {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [user, authLoading, roles, navigate, location.state]);

  useEffect(() => {
    if (location.pathname === "/register") setMode("register");
    else if (location.pathname === "/forgot-password") setMode("forgot-password");
    else setMode("login");
  }, [location.pathname]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      if (mode === "forgot-password") {
        const emailValidation = z.string().email("Please enter a valid email address").safeParse(email);
        if (!emailValidation.success) {
          setError(emailValidation.error.errors[0].message);
          setIsSubmitting(false);
          return;
        }

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/login`,
        });

        if (error) {
          setError(error.message);
        } else {
          setSuccess("If an account exists with that email, a password reset link has been sent.");
        }
      } else if (mode === "login") {
        const validation = loginSchema.safeParse({ email, password });
        if (!validation.success) {
          setError(validation.error.errors[0].message);
          setIsSubmitting(false);
          return;
        }

        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            setError("Invalid email or password. Please try again.");
          } else if (error.message.includes("Email not confirmed")) {
            setError("Please verify your email address before signing in.");
          } else {
            setError(error.message);
          }
        }
      } else if (mode === "register") {
        const validation = registerSchema.safeParse({
          email, password, fullName, confirmPassword, role,
        });
        if (!validation.success) {
          setError(validation.error.errors[0].message);
          setIsSubmitting(false);
          return;
        }

        const { error } = await signUp(email, password, fullName, role);
        if (error) {
          if (error.message.includes("already registered")) {
            setError("An account with this email already exists. Please sign in instead.");
          } else {
            setError(error.message);
          }
        } else {
          setSuccess("Check your email for a verification link to complete your registration.");
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const PasswordToggle = ({ show, onToggle }: { show: boolean; onToggle: () => void }) => (
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
      aria-label={show ? "Hide password" : "Show password"}
    >
      {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 px-4 py-12">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
              <span className="text-lg font-bold text-primary-foreground">SL</span>
            </div>
            <CardTitle className="text-2xl">
              {mode === "login" && "Welcome Back"}
              {mode === "register" && "Create Account"}
              {mode === "forgot-password" && "Reset Password"}
            </CardTitle>
            <CardDescription>
              {mode === "login" && "Sign in to your ServiceLink account"}
              {mode === "register" && "Join ServiceLink today"}
              {mode === "forgot-password" && "Enter your email to reset your password"}
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-success/30 bg-success/10 text-success">
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              {mode === "register" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>I want to</Label>
                    <RadioGroup value={role} onValueChange={(v) => setRole(v as "user" | "provider")} className="grid grid-cols-2 gap-3">
                      <Label
                        htmlFor="role-user"
                        className={`flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 p-4 text-center transition-colors ${
                          role === "user" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                        }`}
                      >
                        <RadioGroupItem value="user" id="role-user" className="sr-only" />
                        <span className="text-2xl">🔍</span>
                        <span className="text-sm font-medium">Find Services</span>
                        <span className="text-xs text-muted-foreground">Browse & contact providers</span>
                      </Label>
                      <Label
                        htmlFor="role-provider"
                        className={`flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 p-4 text-center transition-colors ${
                          role === "provider" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                        }`}
                      >
                        <RadioGroupItem value="provider" id="role-provider" className="sr-only" />
                        <span className="text-2xl">💼</span>
                        <span className="text-sm font-medium">Offer Services</span>
                        <span className="text-xs text-muted-foreground">List & manage services</span>
                      </Label>
                    </RadioGroup>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {mode !== "forgot-password" && (
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <PasswordToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
                  </div>
                </div>
              )}

              {mode === "register" && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <PasswordToggle show={showConfirmPassword} onToggle={() => setShowConfirmPassword(!showConfirmPassword)} />
                  </div>
                </div>
              )}

              {mode === "login" && (
                <div className="text-right">
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === "login" && "Sign In"}
                {mode === "register" && "Create Account"}
                {mode === "forgot-password" && "Send Reset Link"}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                {mode === "login" ? (
                  <>
                    Don't have an account?{" "}
                    <Link to="/register" className="text-primary hover:underline">Sign up</Link>
                  </>
                ) : mode === "register" ? (
                  <>
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary hover:underline">Sign in</Link>
                  </>
                ) : (
                  <Link to="/login" className="text-primary hover:underline">Back to sign in</Link>
                )}
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
