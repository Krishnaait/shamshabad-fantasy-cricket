import { useEffect, useState, useMemo } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Trophy, Users, Target, LogOut, Eye, Trash2, Calendar, MapPin, Filter, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useInterval } from "@/hooks/useInterval";

// Type for user teams
interface UserTeam {
  id: number;
  userId: number;
  contestId: number | null;
  matchId: string;
  teamName: string;
  captain: string | null;
  viceCaptain: string | null;
  totalPoints: number | null;
  rank: number | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [dateFilter, setDateFilter] = useState<string>("all");
  
  // Get current user - this is our ONLY auth check
  const { data: user, isLoading: userLoading } = trpc.auth.me.useQuery();
  
  // Get user's teams
  const { data: teams, isLoading: teamsLoading, refetch: refetchTeams } = trpc.team.getMyTeams.useQuery(undefined, {
    enabled: !!user,
  });
  
  // Get matches - use getCurrentMatches which includes both current and upcoming series matches
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const { data: matches, isLoading: matchesLoading, refetch: refetchMatches } = trpc.cricket.getCurrentMatches.useQuery();
  
  // Auto-refresh matches every 30 seconds if enabled
  useInterval(() => {
    if (autoRefreshEnabled) {
      refetchMatches();
    }
  }, autoRefreshEnabled ? 30000 : null);
  
  // Logout mutation
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      toast.success("Logged out successfully");
      // Invalidate auth cache and redirect
      window.location.href = "/login";
    },
  });
  
  // Delete team mutation
  const deleteTeamMutation = trpc.team.deleteTeam.useMutation({
    onSuccess: () => {
      toast.success("Team deleted successfully");
      refetchTeams();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete team");
    },
  });
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!userLoading && !user) {
      setLocation("/login");
    }
  }, [user, userLoading, setLocation]);
  
  // Helper function to get date category (defined before useMemo)
  const getDateCategory = (dateStr: string) => {
    const matchDate = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    // Reset time for comparison
    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    nextWeek.setHours(0, 0, 0, 0);
    matchDate.setHours(0, 0, 0, 0);
    
    if (matchDate.getTime() === today.getTime()) return "today";
    if (matchDate.getTime() === tomorrow.getTime()) return "tomorrow";
    if (matchDate <= nextWeek) return "this_week";
    return "later";
  };
  
  // Categorize matches (must be before early returns for hooks consistency)
  // Use 'ms' field from Cricket API: fixture=upcoming, live=live, result=completed
  const liveMatches = useMemo(() => matches?.filter(m => m.ms === "live") || [], [matches]);
  const completedMatches = useMemo(() => matches?.filter(m => m.ms === "result") || [], [matches]);
  
  // Filter upcoming matches based on date filter
  const upcomingMatches = useMemo(() => {
    const upcoming = matches?.filter(m => m.ms === "fixture") || [];
    
    if (dateFilter === "all") return upcoming;
    
    return upcoming.filter(m => {
      const category = getDateCategory(m.dateTimeGMT || m.date);
      return category === dateFilter;
    });
  }, [matches, dateFilter]);
  
  // Get counts for each filter category
  const filterCounts = useMemo(() => {
    const upcoming = matches?.filter(m => m.ms === "fixture") || [];
    return {
      all: upcoming.length,
      today: upcoming.filter(m => getDateCategory(m.dateTimeGMT || m.date) === "today").length,
      tomorrow: upcoming.filter(m => getDateCategory(m.dateTimeGMT || m.date) === "tomorrow").length,
      this_week: upcoming.filter(m => getDateCategory(m.dateTimeGMT || m.date) === "this_week").length,
      later: upcoming.filter(m => getDateCategory(m.dateTimeGMT || m.date) === "later").length,
    };
  }, [matches]);
  
  // Show loading state
  if (userLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-green-50 to-orange-50">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  // If no user, return null (useEffect will redirect)
  if (!user) {
    return null;
  }
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  const handleDeleteTeam = (teamId: number) => {
    if (confirm("Are you sure you want to delete this team?")) {
      deleteTeamMutation.mutate({ teamId });
    }
  };
  
  // Calculate stats
  const teamsCreated = (teams as UserTeam[] | undefined)?.length || 0;
  const totalPoints = (teams as UserTeam[] | undefined)?.reduce((sum: number, team: UserTeam) => sum + (team.totalPoints || 0), 0) || 0;
  const matchesPlayed = new Set((teams as UserTeam[] | undefined)?.map((team: UserTeam) => team.matchId)).size || 0;
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-orange-50">
      <Header 
        isAuthenticated={!!user} 
        user={user ? { name: user.name, email: user.email } : undefined}
        onLogout={handleLogout}
      />
      
      <main className="flex-1 pt-20 pb-12">
        {/* Welcome Section */}
        <section className="py-8 px-4 bg-gradient-to-r from-green-600 to-orange-500 text-white">
          <div className="container">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  Welcome back, {user.name || user.email}!
                </h1>
                <p className="text-lg opacity-90">
                  Ready to build your dream cricket team?
                </p>
              </div>
              <Button
                variant="secondary"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
              >
                {logoutMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <LogOut className="h-4 w-4 mr-2" />
                )}
                Logout
              </Button>
            </div>
          </div>
        </section>
        
        {/* Stats Cards */}
        <section className="py-8 px-4">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Teams Created</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{teamsCreated}</div>
                  <p className="text-xs text-muted-foreground">
                    Your fantasy teams
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Matches Played</CardTitle>
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{matchesPlayed}</div>
                  <p className="text-xs text-muted-foreground">
                    Unique matches
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Points</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalPoints}</div>
                  <p className="text-xs text-muted-foreground">
                    Across all teams
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{upcomingMatches.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Matches available
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* My Teams Section */}
        <section className="py-8 px-4">
          <div className="container">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>My Teams</CardTitle>
                    <CardDescription>
                      Your created fantasy cricket teams
                    </CardDescription>
                  </div>
                  {teams && teams.length > 0 && (
                    <Badge variant="secondary">{teams.length} {teams.length === 1 ? 'Team' : 'Teams'}</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {teamsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                  </div>
                ) : teams && teams.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {teams.map((team: UserTeam) => (
                      <Card key={team.id} className="hover:shadow-lg transition-shadow border-2">
                        <CardHeader>
                          <CardTitle className="text-lg">{team.teamName}</CardTitle>
                          <CardDescription className="text-xs">
                            Match ID: {team.matchId}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Points:</span>
                            <span className="font-bold">{team.totalPoints || 0}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Created:</span>
                            <span className="text-xs">{new Date(team.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                              onClick={() => setLocation(`/team/${team.id}`)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteTeam(team.id)}
                              disabled={deleteTeamMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg mb-2">No teams created yet</p>
                    <p className="text-gray-500 text-sm mb-6">Create your first fantasy team to get started</p>
                    <Button onClick={() => setLocation("/")}>
                      Browse Matches
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
        


      </main>
      
      <Footer />
    </div>
  );
}
