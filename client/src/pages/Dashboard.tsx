import { useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trophy, Users, Target, LogOut, Eye, Trash2, Calendar, MapPin } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Type for user teams
interface UserTeam {
  id: number;
  teamName: string;
  matchId: string;
  totalPoints?: number;
  createdAt: string;
}

export default function Dashboard() {
  const [, setLocation] = useLocation();
  
  // Get current user - this is our ONLY auth check
  const { data: user, isLoading: userLoading } = trpc.auth.me.useQuery();
  
  // Get user's teams
  const { data: teams, isLoading: teamsLoading, refetch: refetchTeams } = trpc.team.getUserTeams.useQuery(undefined, {
    enabled: !!user,
  });
  
  // Get matches - use getCurrentMatches which includes both current and upcoming series matches
  const { data: matches, isLoading: matchesLoading } = trpc.cricket.getCurrentMatches.useQuery();
  
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
  
  // Categorize matches
  const liveMatches = matches?.filter(m => m.matchStarted && !m.matchEnded) || [];
  const upcomingMatches = matches?.filter(m => !m.matchStarted) || [];
  const completedMatches = matches?.filter(m => m.matchEnded) || [];
  
  // Calculate stats
  const teamsCreated = teams?.length || 0;
  const totalPoints = teams?.reduce((sum: number, team: UserTeam) => sum + (team.totalPoints || 0), 0) || 0;
  const matchesPlayed = new Set(teams?.map((team: UserTeam) => team.matchId)).size || 0;
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-orange-50">
      <Header />
      
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
        
        {/* Live Matches Section */}
        {liveMatches.length > 0 && (
          <section className="py-8 px-4">
            <div className="container">
              <Card className="border-red-500/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse"></div>
                      <CardTitle>Live Matches</CardTitle>
                    </div>
                    <Badge variant="destructive">{liveMatches.length} Live</Badge>
                  </div>
                  <CardDescription>
                    Matches currently in progress
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {liveMatches.map((match) => (
                      <Card key={match.id} className="border-red-500/30 bg-gradient-to-br from-red-50 to-orange-50">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-base">{match.name}</CardTitle>
                            <Badge variant="destructive" className="text-xs animate-pulse">
                              🔴 LIVE
                            </Badge>
                          </div>
                          <CardDescription className="text-xs">
                            {match.venue} • {match.matchType}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-sm text-gray-700 mb-3">
                            {match.status}
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full"
                            onClick={() => setLocation(`/team-builder/${match.id}`)}
                            disabled
                          >
                            Match Started
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}
        
        {/* Upcoming Matches Section */}
        <section className="py-8 px-4">
          <div className="container">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Upcoming Matches</CardTitle>
                    <CardDescription>
                      Create your fantasy team for these matches
                    </CardDescription>
                  </div>
                  {upcomingMatches.length > 0 && (
                    <Badge variant="secondary">{upcomingMatches.length} Available</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {matchesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                  </div>
                ) : upcomingMatches.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {upcomingMatches.slice(0, 6).map((match) => {
                      const userTeamsForMatch = teams?.filter((team: UserTeam) => team.matchId === match.id) || [];
                      const hasTeam = userTeamsForMatch.length > 0;
                      
                      return (
                        <Card key={match.id} className="hover:shadow-lg transition-shadow border-2">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <CardTitle className="text-base">{match.name}</CardTitle>
                              {hasTeam && (
                                <Badge variant="secondary" className="text-xs">
                                  {userTeamsForMatch.length} {userTeamsForMatch.length === 1 ? 'Team' : 'Teams'}
                                </Badge>
                              )}
                            </div>
                            <CardDescription className="text-xs">
                              {match.matchType}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="h-4 w-4" />
                              <span className="text-xs">{new Date(match.dateTimeGMT).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin className="h-4 w-4" />
                              <span className="text-xs line-clamp-1">{match.venue}</span>
                            </div>
                            <div className="flex gap-2">
                              {hasTeam ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex-1"
                                  onClick={() => setLocation(`/team/${userTeamsForMatch[0].id}`)}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  View Team
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  className="flex-1"
                                  onClick={() => setLocation(`/team-builder/${match.id}`)}
                                >
                                  Create Team
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg mb-2">No upcoming matches</p>
                    <p className="text-gray-500 text-sm">Check back soon for new matches</p>
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
