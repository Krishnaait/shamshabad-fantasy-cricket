import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Trophy, Calendar, Clock, Users, TrendingUp, ArrowRight, Eye, Edit, Trash2, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl, isOAuthConfigured } from "@/const";
import { toast } from "sonner";

export default function Dashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();
  
  // Fetch matches
  const { data: matches, isLoading: matchesLoading } = trpc.cricket.getCurrentMatches.useQuery();
  
  // Fetch user's teams
  const { data: myTeams, isLoading: teamsLoading, refetch: refetchTeams } = trpc.team.getMyTeams.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  // Delete team mutation
  const deleteTeamMutation = trpc.team.deleteTeam.useMutation({
    onSuccess: () => {
      toast.success("Team deleted successfully!");
      refetchTeams();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete team");
    },
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // Use wouter navigation for fallback login page, window.location for OAuth
      const loginUrl = getLoginUrl();
      if (loginUrl.startsWith('/')) {
        setLocation(loginUrl);
      } else {
        window.location.href = loginUrl;
      }
    }
  }, [loading, isAuthenticated, setLocation]);

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

  if (!isAuthenticated) {
    return null;
  }

  // Calculate real stats from user's teams
  const teamsCreated = myTeams?.length || 0;
  const totalPoints = myTeams?.reduce((sum, team) => sum + (team.totalPoints || 0), 0) || 0;
  const matchesPlayed = new Set(myTeams?.map(team => team.matchId)).size || 0;

  const stats = [
    { label: "Teams Created", value: teamsCreated.toString(), icon: Users },
    { label: "Matches Played", value: matchesPlayed.toString(), icon: Trophy },
    { label: "Total Points", value: totalPoints.toString(), icon: TrendingUp },
  ];

  const handleDeleteTeam = (teamId: number) => {
    if (confirm("Are you sure you want to delete this team?")) {
      deleteTeamMutation.mutate({ teamId });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20">
        {/* Welcome Section */}
        <section className="py-12 px-4 bg-gradient-to-br from-primary/10 to-background">
          <div className="container">
            <div className="max-w-4xl">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Welcome back, {user?.name || "Player"}!
              </h1>
              <p className="text-lg text-muted-foreground">
                Ready to build your dream cricket team? Select a match below to get started.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-8 px-4">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index} className="border-border">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                          <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                        </div>
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* My Teams Section */}
        {myTeams && myTeams.length > 0 && (
          <section className="py-8 px-4">
            <div className="container">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">My Teams</h2>
                <Badge variant="secondary">{myTeams.length} {myTeams.length === 1 ? 'Team' : 'Teams'}</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myTeams.slice(0, 6).map((team: any) => (
                  <Card key={team.id} className="border-border hover:border-primary transition-all">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{team.teamName}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            Match ID: {team.matchId}
                          </p>
                        </div>
                        <Badge 
                          variant={team.status === 'confirmed' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {team.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Total Points:</span>
                        <span className="font-bold text-foreground">{team.totalPoints || 0}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Rank:</span>
                        <span className="font-bold text-foreground">#{team.rank || '-'}</span>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => setLocation(`/team/${team.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
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

              {myTeams.length > 6 && (
                <div className="mt-6 text-center">
                  <Button variant="outline">
                    View All Teams ({myTeams.length})
                  </Button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Upcoming Matches */}
        <section className="py-8 px-4 pb-16">
          <div className="container">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Upcoming Matches</h2>
              <Button variant="outline" size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                View All
              </Button>
            </div>

            {matchesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="border-border">
                    <CardContent className="p-6">
                      <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-secondary rounded w-3/4"></div>
                        <div className="h-8 bg-secondary rounded"></div>
                        <div className="h-4 bg-secondary rounded w-1/2"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : matches && Array.isArray(matches) && matches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Show all matches since API currently has no future matches */}
                {matches.slice(0, 6).map((match: any) => {
                  const matchId = match.id || match.match_id;
                  const userTeamsForMatch = myTeams?.filter((team: any) => team.matchId === matchId) || [];
                  const hasTeam = userTeamsForMatch.length > 0;

                  return (
                    <Card key={matchId} className="border-border hover:border-primary transition-all">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg">{match.name || match.title || "Cricket Match"}</CardTitle>
                          {hasTeam && (
                            <Badge variant="secondary" className="text-xs">
                              {userTeamsForMatch.length} {userTeamsForMatch.length === 1 ? 'Team' : 'Teams'}
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="text-center flex-1">
                            <p className="font-semibold text-foreground">
                              {match.teamInfo?.[0]?.shortname || match.teama?.short_name || "Team A"}
                            </p>
                          </div>
                          <div className="px-4">
                            <p className="text-sm text-muted-foreground">vs</p>
                          </div>
                          <div className="text-center flex-1">
                            <p className="font-semibold text-foreground">
                              {match.teamInfo?.[1]?.shortname || match.teamb?.short_name || "Team B"}
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{match.dateTimeGMT || match.date_start || "TBD"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{match.venue || "Venue TBD"}</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {hasTeam ? (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                onClick={() => setLocation(`/team/${userTeamsForMatch[0].id}`)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Team
                              </Button>
                              <Button
                                size="sm"
                                className="flex-1"
                                onClick={() => setLocation(`/team-builder/${matchId}`)}
                              >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Team
                              </Button>
                            </>
                          ) : (
                            <Button
                              className="w-full"
                              size="sm"
                              onClick={() => setLocation(`/team-builder/${matchId}`)}
                            >
                              Create Team
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="border-border">
                <CardContent className="p-12 text-center">
                  <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No Upcoming Matches</h3>
                  <p className="text-muted-foreground">
                    Check back soon for new matches to create your fantasy teams!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="py-12 px-4 bg-secondary/30">
          <div className="container">
            <h2 className="text-2xl font-bold text-foreground mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-border hover:border-primary transition-all cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Trophy className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">My Teams</h3>
                  <p className="text-sm text-muted-foreground">View and manage your fantasy teams</p>
                  <p className="text-2xl font-bold text-primary mt-2">{teamsCreated}</p>
                </CardContent>
              </Card>
              <Link href="/how-to-play">
                <Card className="border-border hover:border-primary transition-all cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">How To Play</h3>
                    <p className="text-sm text-muted-foreground">Learn strategies and tips</p>
                  </CardContent>
                </Card>
              </Link>
              <Card className="border-border hover:border-primary transition-all cursor-pointer">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Leaderboards</h3>
                  <p className="text-sm text-muted-foreground">See top performers</p>
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
