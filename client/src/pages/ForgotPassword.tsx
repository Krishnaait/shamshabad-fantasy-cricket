import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Mail, Calendar, Lock, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ForgotPassword() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<"verify" | "reset">("verify");
  const [formData, setFormData] = useState({
    email: "",
    dob: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.dob) {
      setError("Please provide both email and date of birth");
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Implement actual verification API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate verification success
      setStep("reset");
      toast.success("Identity verified! Please set your new password.");
    } catch (err) {
      setError("Email and date of birth do not match our records. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.newPassword || !formData.confirmPassword) {
      setError("Please fill in both password fields");
      return;
    }

    if (formData.newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Implement actual password reset API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate reset success
      toast.success("Password reset successful! Please log in with your new password.");
      setLocation("/login");
    } catch (err) {
      setError("Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20 flex items-center justify-center px-4 py-12 bg-gradient-to-br from-primary/5 to-background">
        <div className="w-full max-w-md">
          <Card className="border-border shadow-lg">
            <CardHeader className="space-y-1 text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">
                {step === "verify" ? "Forgot Password?" : "Set New Password"}
              </CardTitle>
              <CardDescription>
                {step === "verify"
                  ? "Verify your identity to reset your password"
                  : "Create a new password for your account"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {step === "verify" ? (
                <form onSubmit={handleVerify} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="pl-10"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="dob"
                        type="date"
                        value={formData.dob}
                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                        className="pl-10"
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Enter the date of birth associated with your account
                    </p>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Verify Identity"
                    )}
                  </Button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Remember your password?
                      </span>
                    </div>
                  </div>

                  <Link href="/login">
                    <a>
                      <Button type="button" variant="outline" className="w-full" size="lg">
                        Back to Login
                      </Button>
                    </a>
                  </Link>
                </form>
              ) : (
                <form onSubmit={handleReset} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Alert className="bg-green-500/10 border-green-500/50">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <AlertDescription className="text-green-700 dark:text-green-400">
                      Identity verified for: {formData.email}
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder="Enter new password (min 8 characters)"
                        value={formData.newPassword}
                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                        className="pl-10"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Re-enter new password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="pl-10"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Resetting password...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </Button>
                </form>
              )}

              <div className="mt-6 p-4 bg-secondary/30 rounded-lg">
                <p className="text-xs text-muted-foreground text-center">
                  Need help?{" "}
                  <Link href="/contact">
                    <a className="text-primary hover:underline">Contact Support</a>
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
