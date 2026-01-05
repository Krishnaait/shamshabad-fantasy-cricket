import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Users, Calendar, Clock, TrendingUp, Award, Star, Zap } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLocation } from "wouter";
import { MatchCardSkeletonGrid } from "@/components/MatchCardSkeleton";
import { useAuth } from "@/hooks/useAuth";

export default function Contests() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, user, handleLogout } = useAuth();
  
  const { data: currentMatches, isLoading: matchesLoading } = trpc.cricket.getAllMatches.useQuery();

  // Filter matches by status
  const allMatches = currentMatches || [];
  const liveMatches = allMatches.filter((m: any) => {
    const statusLower = (m.status || '').toLowerCase();
    return statusLower.includes('live') || 
           statusLower.includes('inning') || 
           (m.ms === 'live') ||
           (m.matchStarted && !m.matchEnded);
  });

  const upcomingMatches = allMatches.filter((m: any) => {
    return m.ms === 'fixture' || (!m.matchStarted && !m.matchEnded);
  });

  const formatMatchDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Kolkata",
    });
  };

  const ContestCard = ({ match, type }: { match: any; type: "live" | "upcoming" }) => {
    // Fetch real contests from API for this match
    const { data: matchContests = [], isLoading: contestsLoading } = trpc.contest.getByMatch.useQuery(
      { matchId: match.id },
      { enabled: !!match.id }
    );
    
    if (contestsLoading) {
      return (
        <Card className="border-border/50 animate-pulse">
          <CardHeader className="h-32 bg-muted/20"></CardHeader>
          <CardContent className="h-24"></CardContent>
        </Card>
      );
    }

    // If no real contests exist for this match, we don't show the match card in the contests page
    // to avoid showing mock data.
    if (matchContests.length === 0) {
      return null;
    }

    return (
      <Card className="hover-lift transition-smooth border-border/50 hover:border-primary/30 animate-fade-in">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  variant={type === "live" ? "destructive" : "default"}
                  className={`text-xs ${type === "live" ? "animate-pulse" : ""}`}
                >
                  {type === "live" ? "🔴 LIVE" : "📅 Upcoming"}
                </Badge>
                <span className="text-xs text-muted-foreground font-medium">{match.matchType?.toUpperCase()}</span>
              </div>
              <h3 className="font-semibold text-sm mb-1 line-clamp-1">{match.name}</h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatMatchDate(match.dateTimeGMT)}
              </p>
            </div>
          </div>

          {/* Teams */}
          <div className="flex items-center justify-between py-2 border-t border-border/50">
            {match.teamInfo?.slice(0, 2).map((team: any, idx: number) => (
              <div key={idx} className="flex items-center gap-2">
                {team.img && (
                  <img src={team.img} alt={team.shortname} className="w-6 h-6 rounded-full object-cover ring-2 ring-border" />
                )}
                <span className="font-medium text-sm">{team.shortname || team.name}</span>
              </div>
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-2">
          {matchContests.map((contest: any) => {
            const spots = contest.maxTeams || 1000;
            const spotsJoined = contest.totalTeams || 0;
            const spotsLeft = spots - spotsJoined;
            const fillPercentage = (spotsJoined / spots) * 100;
            
            return (
              <div
                key={contest.id}
                className="p-3 border border-border/50 rounded-lg hover:border-primary/30 transition-smooth bg-gradient-to-r from-card to-muted/20"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-primary" />
                    <span className="font-medium text-sm">{contest.name}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {contest.entryFee === 0 ? "Free" : `₹${contest.entryFee}`}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {spotsLeft.toLocaleString()} spots left
                    </span>
                    <span>Prize Pool: ₹{contest.prizePool}</span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${fillPercentage}%` }}
                    />
                  </div>

                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setLocation(`/team-builder/${match.id}`);
                    }}
                  >
                    Join Contest
                  </Button>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header 
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={handleLogout}
      />

      {/* Hero Section */}
      <section className="relative py-16 px-4 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-4">
              <Trophy className="h-3 w-3 mr-1" />
              Real Contests
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Join <span className="text-sporty-gradient">Contests</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Compete with thousands of players in real contests. Build your dream team and climb the leaderboards!
            </p>
          </div>
        </div>
      </section>

      {/* Contests Tabs */}
      <section className="py-8 px-4">
        <div className="container">
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
              <TabsTrigger value="upcoming" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Upcoming
              </TabsTrigger>
              <TabsTrigger value="live" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Live
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-6">
              {matchesLoading ? (
                <MatchCardSkeletonGrid count={6} />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingMatches.slice(0, 24).map((match: any) => (
                    <ContestCard key={match.id} match={match} type="upcoming" />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="live" className="space-y-6">
              {matchesLoading ? (
                <MatchCardSkeletonGrid count={6} />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {liveMatches.slice(0, 24).map((match: any) => (
                    <ContestCard key={match.id} match={match} type="live" />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
}
