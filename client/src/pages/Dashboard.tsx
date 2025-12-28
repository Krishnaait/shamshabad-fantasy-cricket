import { useState, useEffect } from "react";;
import { Link, useLocation } from "wouter";
import { Trophy, Calendar, Clock, Users, TrendingUp, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

export default function Dashboard() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { data: matches, isLoading: matchesLoading } = trpc.cricket.getCurrentMatches.useQuery();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = getLoginUrl();
    }
  }, [loading, isAuthenticated]);

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

  const stats = [
    { label: "Teams Created", value: "0", icon: Users },
    { label: "Matches Played", value: "0", icon: Trophy },
    { label: "Total Points", value: "0", icon: TrendingUp },
  ];

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
                {matches.slice(0, 6).map((match: any) => (
                  <Card key={match.match_id} className="border-border hover:border-primary transition-all">
                    <CardHeader>
                      <CardTitle className="text-lg">{match.title || "Cricket Match"}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="text-center flex-1">
                          <p className="font-semibold text-foreground">{match.teama?.short_name || "Team A"}</p>
                        </div>
                        <div className="px-4">
                          <p className="text-sm text-muted-foreground">vs</p>
                        </div>
                        <div className="text-center flex-1">
                          <p className="font-semibold text-foreground">{match.teamb?.short_name || "Team B"}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{match.date_start || "TBD"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{match.venue || "Venue TBD"}</span>
                        </div>
                      </div>

                      <Button className="w-full" size="sm">
                        Create Team
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
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
                </CardContent>
              </Card>
              <Link href="/how-to-play">
                <a>
                  <Card className="border-border hover:border-primary transition-all cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">How To Play</h3>
                      <p className="text-sm text-muted-foreground">Learn strategies and tips</p>
                    </CardContent>
                  </Card>
                </a>
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
