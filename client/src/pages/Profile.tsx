import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { User, Mail, Calendar, MapPin, Edit, Save, X, Trophy, TrendingUp, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Profile() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    state: "",
  });

  // Fetch user's teams for statistics
  const { data: myTeams } = trpc.team.getMyTeams.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  // Update profile mutation
  const updateProfileMutation = trpc.auth.updateProfile.useMutation({
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      setIsEditing(false);
      window.location.reload(); // Refresh to get updated user data
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update profile");
    },
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      const loginUrl = getLoginUrl();
      if (loginUrl.startsWith('/')) {
        setLocation(loginUrl);
      } else {
        window.location.href = loginUrl;
      }
    }
  }, [loading, isAuthenticated, setLocation]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        state: user.state || "",
      });
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  // Calculate statistics
  const teamsCreated = myTeams?.length || 0;
  const totalPoints = myTeams?.reduce((sum, team) => sum + (team.totalPoints || 0), 0) || 0;
  const matchesPlayed = new Set(myTeams?.map(team => team.matchId)).size || 0;
  const bestRank = myTeams?.reduce((best, team) => {
    if (team.rank && (best === 0 || team.rank < best)) return team.rank;
    return best;
  }, 0) || 0;

  const stats = [
    { label: "Teams Created", value: teamsCreated.toString(), icon: Users, color: "text-primary" },
    { label: "Matches Played", value: matchesPlayed.toString(), icon: Trophy, color: "text-[oklch(0.65_0.2_45)]" },
    { label: "Total Points", value: totalPoints.toString(), icon: TrendingUp, color: "text-primary" },
    { label: "Best Rank", value: bestRank > 0 ? `#${bestRank}` : "N/A", icon: Trophy, color: "text-[oklch(0.65_0.2_45)]" },
  ];

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];

  const handleSave = () => {
    updateProfileMutation.mutate({
      name: formData.name,
      phone: formData.phone || undefined,
      state: formData.state || undefined,
    });
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      state: user.state || "",
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20 pb-16">
        {/* Hero Section */}
        <section className="py-12 px-4 bg-gradient-to-br from-primary/10 to-background">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                My Profile
              </h1>
              <p className="text-lg text-muted-foreground">
                Manage your account information and view your fantasy cricket stats
              </p>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="py-8 px-4">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-6">Your Statistics</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <Card key={index} className="border-border">
                      <CardContent className="p-4 md:p-6">
                        <div className="text-center">
                          <div className="h-10 w-10 md:h-12 md:w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                            <Icon className={`h-5 w-5 md:h-6 md:w-6 ${stat.color}`} />
                          </div>
                          <p className="text-2xl md:text-3xl font-bold text-foreground mb-1">{stat.value}</p>
                          <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Profile Information */}
        <section className="py-8 px-4">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <Card className="border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl">Personal Information</CardTitle>
                    {!isEditing ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancel}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleSave}
                          disabled={updateProfileMutation.isPending}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Full Name
                    </Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <p className="text-foreground font-medium">{user.name || "Not provided"}</p>
                    )}
                  </div>

                  {/* Email (Read-only) */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Address
                    </Label>
                    <p className="text-foreground font-medium">{user.email}</p>
                    <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Phone Number
                    </Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Enter your phone number"
                      />
                    ) : (
                      <p className="text-foreground font-medium">{user.phone || "Not provided"}</p>
                    )}
                  </div>

                  {/* State */}
                  <div className="space-y-2">
                    <Label htmlFor="state" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      State
                    </Label>
                    {isEditing ? (
                      <Select
                        value={formData.state}
                        onValueChange={(value) => setFormData({ ...formData, state: value })}
                      >
                        <SelectTrigger id="state">
                          <SelectValue placeholder="Select your state" />
                        </SelectTrigger>
                        <SelectContent>
                          {indianStates.map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-foreground font-medium">{user.state || "Not provided"}</p>
                    )}
                  </div>

                  {/* Account Info */}
                  <div className="pt-4 border-t border-border">
                    <h3 className="text-lg font-semibold mb-4">Account Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Account Role</p>
                        <p className="font-medium text-foreground capitalize">
                          {user.role}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">User ID</p>
                        <p className="font-medium text-foreground">
                          #{user.id}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
