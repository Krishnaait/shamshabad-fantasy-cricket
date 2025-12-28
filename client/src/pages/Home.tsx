import { Trophy, Shield, Users, TrendingUp, Zap, Award, CheckCircle2, ArrowRight, Calendar, Clock, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";

export default function Home() {
  // Fetch real-time matches from Cricket API
  const { data: currentMatches, isLoading: matchesLoading } = trpc.cricket.getCurrentMatches.useQuery();

  // Filter matches by state
  const liveMatches = currentMatches?.filter(m => m.ms === "live") || [];
  const upcomingMatches = currentMatches?.filter(m => m.ms === "fixture") || [];
  const completedMatches = currentMatches?.filter(m => m.ms === "result") || [];

  const features = [
    {
      icon: Trophy,
      title: "100% Free To Play",
      description: "No entry fees, no hidden charges. Play fantasy cricket for pure entertainment and skill development.",
    },
    {
      icon: Shield,
      title: "100% Legal & Compliant",
      description: "Fully compliant with Indian fantasy sports regulations. Safe, secure, and transparent platform.",
    },
    {
      icon: Users,
      title: "Real-Time Data",
      description: "Live match updates, real-time scores, and instant fantasy points calculation from official sources.",
    },
    {
      icon: TrendingUp,
      title: "Skill-Based Gaming",
      description: "Test your cricket knowledge and strategic thinking. Build winning teams based on player performance.",
    },
    {
      icon: Zap,
      title: "Instant Updates",
      description: "Get live match scores, player statistics, and fantasy points updates in real-time.",
    },
    {
      icon: Award,
      title: "Fair Play Guaranteed",
      description: "Transparent scoring system with no manipulation. Every player gets equal opportunity to win.",
    },
  ];

  const howToPlaySteps = [
    {
      step: "1",
      title: "Sign Up",
      description: "Create your free account in seconds. Age 18+ required.",
    },
    {
      step: "2",
      title: "Select Match",
      description: "Choose from upcoming cricket matches across all formats.",
    },
    {
      step: "3",
      title: "Build Team",
      description: "Select 11 players within budget. Choose captain & vice-captain.",
    },
    {
      step: "4",
      title: "Track Points",
      description: "Watch live as your players earn fantasy points during the match.",
    },
  ];

  const stats = [
    { value: "10,000+", label: "Active Users" },
    { value: "500+", label: "Matches Covered" },
    { value: "100%", label: "Free To Play" },
    { value: "24/7", label: "Support Available" },
  ];

  const formatMatchDate = (dateTimeGMT: string) => {
    const date = new Date(dateTimeGMT);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const MatchCard = ({ match, type }: { match: any; type: "live" | "upcoming" | "completed" }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge
                variant={type === "live" ? "destructive" : type === "upcoming" ? "default" : "secondary"}
                className="text-xs"
              >
                {type === "live" && "🔴 LIVE"}
                {type === "upcoming" && "📅 Upcoming"}
                {type === "completed" && "✅ Completed"}
              </Badge>
              <span className="text-xs text-muted-foreground">{match.matchType?.toUpperCase()}</span>
            </div>
            <h3 className="font-semibold text-sm mb-1 line-clamp-1">{match.name}</h3>
            <p className="text-xs text-muted-foreground">{match.venue}</p>
          </div>
        </div>

        <div className="space-y-3">
          {/* Teams */}
          <div className="space-y-2">
            {match.teamInfo?.slice(0, 2).map((team: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {team.img && (
                    <img src={team.img} alt={team.shortname} className="w-6 h-6 rounded-full object-cover" />
                  )}
                  <span className="font-medium text-sm">{team.shortname || team.name}</span>
                </div>
                {match.score && match.score[idx] && (
                  <span className="text-sm font-semibold">
                    {match.score[idx].r}/{match.score[idx].w} ({match.score[idx].o})
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Match Status */}
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground mb-2">{match.status}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                <Clock className="inline h-3 w-3 mr-1" />
                {formatMatchDate(match.dateTimeGMT)}
              </span>
              {match.fantasyEnabled && (
                <Link href={`/dashboard`}>
                  <Button size="sm" variant="outline" className="h-7 text-xs">
                    {type === "upcoming" ? "Create Team" : "View Details"}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 bg-gradient-to-br from-primary/10 via-background to-background overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Trophy className="h-4 w-4" />
              India's Trusted Fantasy Cricket Platform
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Play Fantasy Cricket
              <br />
              <span className="text-primary">100% Free & Legal</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Build your dream cricket team, compete with friends, and showcase your cricket knowledge. No entry fees, pure skill-based entertainment.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/how-to-play">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Learn How To Play
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 bg-primary/5">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Matches Section */}
      {liveMatches.length > 0 && (
        <section className="py-16 px-4">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
                  <PlayCircle className="h-8 w-8 text-red-500 animate-pulse" />
                  Live Matches
                </h2>
                <p className="text-muted-foreground">Watch and track ongoing matches in real-time</p>
              </div>
              <Link href="/dashboard">
                <Button variant="outline">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            {matchesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-32 bg-muted rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {liveMatches.slice(0, 6).map((match: any) => (
                  <MatchCard key={match.id} match={match} type="live" />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Upcoming Matches Section */}
      {upcomingMatches.length > 0 && (
        <section className="py-16 px-4 bg-muted/30">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
                  <Calendar className="h-8 w-8 text-primary" />
                  Upcoming Matches
                </h2>
                <p className="text-muted-foreground">Create your fantasy teams for these matches</p>
              </div>
              <Link href="/dashboard">
                <Button variant="outline">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            {matchesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-32 bg-muted rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingMatches.slice(0, 6).map((match: any) => (
                  <MatchCard key={match.id} match={match} type="upcoming" />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Completed Matches Section */}
      {completedMatches.length > 0 && (
        <section className="py-16 px-4">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                  Completed Matches
                </h2>
                <p className="text-muted-foreground">View results and final fantasy points</p>
              </div>
              <Link href="/dashboard">
                <Button variant="outline">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            {matchesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-32 bg-muted rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedMatches.slice(0, 6).map((match: any) => (
                  <MatchCard key={match.id} match={match} type="completed" />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* No Matches Available */}
      {!matchesLoading && currentMatches && currentMatches.length === 0 && (
        <section className="py-16 px-4">
          <div className="container">
            <Card className="text-center py-12">
              <CardContent>
                <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Matches Available</h3>
                <p className="text-muted-foreground">Check back soon for upcoming cricket matches!</p>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose SHAMSHABAD?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience the best fantasy cricket platform with real-time data, legal compliance, and 100% free gameplay
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-border hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How To Play Section */}
      <section className="py-20 px-4">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How To Play</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get started with fantasy cricket in 4 simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howToPlaySteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/how-to-play">
              <Button size="lg" variant="outline">
                Learn More About Fantasy Cricket
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <Shield className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Trust & Safety</h2>
            <p className="text-lg text-muted-foreground mb-8">
              SHAMSHABAD is committed to providing a safe, legal, and responsible fantasy sports platform. We comply with all Indian regulations and promote responsible gaming practices.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Age 18+ Only</h3>
                  <p className="text-sm text-muted-foreground">Strict age verification process</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Geo-Compliant</h3>
                  <p className="text-sm text-muted-foreground">Restricted in regulated states</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">100% Free</h3>
                  <p className="text-sm text-muted-foreground">No money, no gambling</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready To Play Fantasy Cricket?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Join thousands of cricket fans and start building your dream team today!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Create Free Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  Learn More About Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
