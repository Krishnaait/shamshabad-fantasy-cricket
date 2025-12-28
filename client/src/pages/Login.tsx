import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Mail, Lock, AlertCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Login() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Implement actual login API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate login success
      toast.success("Login successful!");
      setLocation("/dashboard");
    } catch (err) {
      setError("Invalid email or password. Please try again.");
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
              <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
              <CardDescription>
                Sign in to your SHAMSHABAD account to continue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
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
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="pl-10"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <Link href="/forgot-password">
                    <a className="text-primary hover:underline">
                      Forgot password?
                    </a>
                  </Link>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Don't have an account?
                    </span>
                  </div>
                </div>

                <Link href="/register">
                  <a>
                    <Button type="button" variant="outline" className="w-full" size="lg">
                      Create Account
                    </Button>
                  </a>
                </Link>
              </form>

              <div className="mt-6 p-4 bg-secondary/30 rounded-lg">
                <p className="text-xs text-muted-foreground text-center">
                  By signing in, you agree to our{" "}
                  <Link href="/terms">
                    <a className="text-primary hover:underline">Terms & Conditions</a>
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy">
                    <a className="text-primary hover:underline">Privacy Policy</a>
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Need help?{" "}
              <Link href="/contact">
                <a className="text-primary hover:underline">Contact Support</a>
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
