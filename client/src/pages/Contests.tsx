import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Users, Calendar, Clock, TrendingUp, Award, Star, Zap } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { MatchCardSkeletonGrid } from "@/components/MatchCardSkeleton";
import { useAuth } from "@/hooks/useAuth";

export default function Contests() {
  const [, setLocation] = useLocation();
  
  // Use custom auth hook that checks localStorage immediately
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
    const { data: matchContests = [] } = trpc.contest.getByMatch.useQuery(
      { matchId: match.id },
      { enabled: !!match.id }
    );
    
    // Use real contest data from API
    const contests = matchContests.length > 0 ? matchContests : [];
    
    // Placeholder for when no contests exist
    const placeholderContests = [
      {
        id: `${match.id}-mega`,
        name: "Mega Contest",
        entryFee: 0,
        prizePool: "Practice",
        spots: 10000,
        spotsLeft: Math.floor(Math.random() * 5000) + 3000,
        winners: 5000,
        icon: Trophy,
        color: "text-chart-3"
      },
      {
        id: `${match.id}-practice`,
        name: "Practice Contest",
        entryFee: 0,
        prizePool: "Practice",
        spots: 5000,
        spotsLeft: Math.floor(Math.random() * 3000) + 1000,
        winners: 2500,
        icon: Star,
        color: "text-primary"
      },
      {
        id: `${match.id}-beginner`,
        name: "Beginner Friendly",
        entryFee: 0,
        prizePool: "Practice",
        spots: 2000,
        spotsLeft: Math.floor(Math.random() * 1000) + 500,
        winners: 1000,
        icon: Zap,
        color: "text-accent"
      }
    ];
    
    // Use placeholder if no real contests found
    const displayContests = contests.length > 0 ? contests : placeholderContests;

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
          {displayContests.map((contest: any) => {
            const Icon = contest.icon || Trophy;
            const spots = contest.spots || 1000;
            const spotsLeft = contest.spotsLeft || Math.floor(Math.random() * 500) + 100;
            const fillPercentage = ((spots - spotsLeft) / spots) * 100;
            const color = contest.color || "text-primary";
            const winners = contest.winners || 500;
            
            return (
              <div
                key={contest.id}
                className="p-3 border border-border/50 rounded-lg hover:border-primary/30 transition-smooth bg-gradient-to-r from-card to-muted/20"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${color}`} />
                    <span className="font-medium text-sm">{contest.name}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {contest.prizePool || contest.entryFee || "Free"}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {spotsLeft.toLocaleString()} spots left
                    </span>
                    <span>{winners.toLocaleString()} winners</span>
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
              Free Contests
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Join <span className="text-sporty-gradient">Contests</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Compete with thousands of players in free practice contests. Build your dream team and climb the leaderboards!
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
                Upcoming ({upcomingMatches.length})
              </TabsTrigger>
              <TabsTrigger value="live" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Live ({liveMatches.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-6">
              {matchesLoading ? (
                <MatchCardSkeletonGrid count={6} />
              ) : upcomingMatches.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Upcoming Contests</h3>
                    <p className="text-muted-foreground">Check back soon for new contests!</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingMatches.slice(0, 12).map((match: any) => (
                    <ContestCard key={match.id} match={match} type="upcoming" />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="live" className="space-y-6">
              {matchesLoading ? (
                <MatchCardSkeletonGrid count={6} />
              ) : liveMatches.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Live Contests</h3>
                    <p className="text-muted-foreground">Check upcoming contests to join!</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {liveMatches.slice(0, 12).map((match: any) => (
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
