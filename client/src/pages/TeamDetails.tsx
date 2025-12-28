import { useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { ArrowLeft, Trophy, Star, Edit, Trash2, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";

export default function TeamDetails() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, params] = useRoute("/team/:teamId");
  const [, setLocation] = useLocation();
  const teamId = params?.teamId ? parseInt(params.teamId) : 0;

  // Fetch team details
  const { data: teamData, isLoading: teamLoading } = trpc.team.getTeamDetails.useQuery(
    { teamId },
    { enabled: isAuthenticated && teamId > 0 }
  );

  // Delete team mutation
  const deleteTeamMutation = trpc.team.deleteTeam.useMutation({
    onSuccess: () => {
      toast.success("Team deleted successfully!");
      setLocation("/dashboard");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete team");
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

  if (loading || teamLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading team details...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !teamData) {
    return null;
  }

  const { team, players } = teamData;

  // Group players by role
  const playersByRole = {
    Wicketkeeper: players.filter((p) => p.role === "Wicketkeeper"),
    Batsman: players.filter((p) => p.role === "Batsman"),
    "All-Rounder": players.filter((p) => p.role === "All-Rounder"),
    Bowler: players.filter((p) => p.role === "Bowler"),
  };

  const captain = players.find((p) => p.isCaptain === 1);
  const viceCaptain = players.find((p) => p.isViceCaptain === 1);

  const handleDeleteTeam = () => {
    if (confirm("Are you sure you want to delete this team? This action cannot be undone.")) {
      deleteTeamMutation.mutate({ teamId });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20">
        {/* Header Section */}
        <section className="py-8 px-4 bg-gradient-to-br from-primary/10 to-background">
          <div className="container">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/dashboard")}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>

            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {team.teamName}
                </h1>
                <p className="text-lg text-muted-foreground">
                  Match ID: {team.matchId}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteTeam}
                  disabled={deleteTeamMutation.isPending}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Team
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Team Stats */}
        <section className="py-8 px-4">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl">
              <Card className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Points</p>
                      <p className="text-3xl font-bold text-foreground">{team.totalPoints || 0}</p>
                    </div>
                    <Trophy className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Rank</p>
                      <p className="text-3xl font-bold text-foreground">#{team.rank || '-'}</p>
                    </div>
                    <Star className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Players</p>
                      <p className="text-3xl font-bold text-foreground">{players.length}</p>
                    </div>
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Status</p>
                      <Badge variant={team.status === 'confirmed' ? 'default' : 'secondary'}>
                        {team.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Captain & Vice-Captain */}
        <section className="py-8 px-4">
          <div className="container">
            <h2 className="text-2xl font-bold text-foreground mb-6">Team Leaders</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
              {captain && (
                <Card className="border-primary/50 bg-primary/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-primary" />
                      Captain (2x Points)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-semibold text-foreground">{captain.playerName}</p>
                    <p className="text-sm text-muted-foreground">{captain.role}</p>
                    <p className="text-2xl font-bold text-primary mt-2">
                      {captain.points || 0} pts
                    </p>
                  </CardContent>
                </Card>
              )}

              {viceCaptain && (
                <Card className="border-secondary bg-secondary/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-secondary-foreground" />
                      Vice-Captain (1.5x Points)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-semibold text-foreground">{viceCaptain.playerName}</p>
                    <p className="text-sm text-muted-foreground">{viceCaptain.role}</p>
                    <p className="text-2xl font-bold text-secondary-foreground mt-2">
                      {viceCaptain.points || 0} pts
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>

        {/* Players by Role */}
        <section className="py-8 px-4 pb-16">
          <div className="container">
            <h2 className="text-2xl font-bold text-foreground mb-6">Team Squad</h2>
            
            {Object.entries(playersByRole).map(([role, rolePlayers]) => (
              rolePlayers.length > 0 && (
                <div key={role} className="mb-8">
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    {role}s ({rolePlayers.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {rolePlayers.map((player) => (
                      <Card key={player.id} className="border-border">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-semibold text-foreground flex items-center gap-2">
                                {player.playerName}
                                {player.isCaptain === 1 && (
                                  <Badge variant="default" className="text-xs">C</Badge>
                                )}
                                {player.isViceCaptain === 1 && (
                                  <Badge variant="secondary" className="text-xs">VC</Badge>
                                )}
                              </p>
                              <p className="text-sm text-muted-foreground">{player.role}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-primary">
                                {player.points || 0}
                              </p>
                              <p className="text-xs text-muted-foreground">points</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
