import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Mail, Lock, User, Calendar, MapPin, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const RESTRICTED_STATES = ["Telangana", "Andhra Pradesh", "Assam", "Odisha"];

export default function Register() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    dob: "",
    state: "",
    agreeTerms: false,
    agreeAge: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [validations, setValidations] = useState({
    age: false,
    location: false,
    password: false,
  });

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const validateForm = () => {
    // Check all required fields
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.dob || !formData.state) {
      setError("Please fill in all required fields");
      return false;
    }

    // Check age
    const age = calculateAge(formData.dob);
    if (age < 18) {
      setError("You must be at least 18 years old to register");
      return false;
    }

    // Check geo-restriction
    if (RESTRICTED_STATES.includes(formData.state)) {
      setError(`Sorry, users from ${formData.state} are not allowed to register due to state regulations`);
      return false;
    }

    // Check password match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    // Check password strength
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }

    // Check agreements
    if (!formData.agreeTerms || !formData.agreeAge) {
      setError("Please agree to the terms and age verification");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Implement actual registration API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate registration success
      toast.success("Registration successful! Please log in.");
      setLocation("/login");
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDobChange = (dob: string) => {
    setFormData({ ...formData, dob });
    if (dob) {
      const age = calculateAge(dob);
      setValidations({ ...validations, age: age >= 18 });
    }
  };

  const handleStateChange = (state: string) => {
    setFormData({ ...formData, state });
    if (state) {
      setValidations({ ...validations, location: !RESTRICTED_STATES.includes(state) });
    }
  };

  const handlePasswordChange = (password: string) => {
    setFormData({ ...formData, password });
    setValidations({ ...validations, password: password.length >= 8 });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20 px-4 py-12 bg-gradient-to-br from-primary/5 to-background">
        <div className="container max-w-2xl">
          <Card className="border-border shadow-lg">
            <CardHeader className="space-y-1 text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <User className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">Create Your Account</CardTitle>
              <CardDescription>
                Join SHAMSHABAD and start building your dream cricket teams
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

                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="pl-10"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
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

                {/* Date of Birth */}
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth * (Must be 18+)</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="dob"
                      type="date"
                      value={formData.dob}
                      onChange={(e) => handleDobChange(e.target.value)}
                      className="pl-10"
                      required
                      disabled={isLoading}
                      max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                    />
                    {formData.dob && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {validations.age ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-destructive" />
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* State */}
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <select
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleStateChange(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-foreground"
                      required
                      disabled={isLoading}
                    >
                      <option value="">Select your state</option>
                      <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                      <option value="Andhra Pradesh">Andhra Pradesh (Restricted)</option>
                      <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                      <option value="Assam">Assam (Restricted)</option>
                      <option value="Bihar">Bihar</option>
                      <option value="Chandigarh">Chandigarh</option>
                      <option value="Chhattisgarh">Chhattisgarh</option>
                      <option value="Dadra and Nagar Haveli">Dadra and Nagar Haveli</option>
                      <option value="Daman and Diu">Daman and Diu</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Goa">Goa</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Haryana">Haryana</option>
                      <option value="Himachal Pradesh">Himachal Pradesh</option>
                      <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                      <option value="Jharkhand">Jharkhand</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Kerala">Kerala</option>
                      <option value="Ladakh">Ladakh</option>
                      <option value="Lakshadweep">Lakshadweep</option>
                      <option value="Madhya Pradesh">Madhya Pradesh</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Manipur">Manipur</option>
                      <option value="Meghalaya">Meghalaya</option>
                      <option value="Mizoram">Mizoram</option>
                      <option value="Nagaland">Nagaland</option>
                      <option value="Odisha">Odisha (Restricted)</option>
                      <option value="Puducherry">Puducherry</option>
                      <option value="Punjab">Punjab</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Sikkim">Sikkim</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Telangana">Telangana (Restricted)</option>
                      <option value="Tripura">Tripura</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="Uttarakhand">Uttarakhand</option>
                      <option value="West Bengal">West Bengal</option>
                    </select>
                    {formData.state && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {validations.location ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-destructive" />
                        )}
                      </div>
                    )}
                  </div>
                  {formData.state && RESTRICTED_STATES.includes(formData.state) && (
                    <p className="text-sm text-destructive">
                      Sorry, registration from {formData.state} is not allowed due to state regulations.
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password * (Min 8 characters)</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      className="pl-10"
                      required
                      disabled={isLoading}
                    />
                    {formData.password && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {validations.password ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-destructive" />
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Re-enter your password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="pl-10"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Agreements */}
                <div className="space-y-4 pt-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="agreeAge"
                      checked={formData.agreeAge}
                      onCheckedChange={(checked) => setFormData({ ...formData, agreeAge: checked as boolean })}
                      disabled={isLoading}
                    />
                    <label htmlFor="agreeAge" className="text-sm text-muted-foreground leading-tight cursor-pointer">
                      I confirm that I am 18 years of age or older
                    </label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="agreeTerms"
                      checked={formData.agreeTerms}
                      onCheckedChange={(checked) => setFormData({ ...formData, agreeTerms: checked as boolean })}
                      disabled={isLoading}
                    />
                    <label htmlFor="agreeTerms" className="text-sm text-muted-foreground leading-tight cursor-pointer">
                      I agree to the{" "}
                      <Link href="/terms">
                        <a className="text-primary hover:underline">Terms & Conditions</a>
                      </Link>
                      {" "}and{" "}
                      <Link href="/privacy">
                        <a className="text-primary hover:underline">Privacy Policy</a>
                      </Link>
                    </label>
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Already have an account?
                    </span>
                  </div>
                </div>

                <Link href="/login">
                  <a>
                    <Button type="button" variant="outline" className="w-full" size="lg">
                      Sign In
                    </Button>
                  </a>
                </Link>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
