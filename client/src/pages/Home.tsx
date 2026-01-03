import { Trophy, Users, Shield, TrendingUp, Zap, Award, ArrowRight, Clock, Star, Play, ChevronRight, LayoutDashboard, CalendarDays, Target, Calendar } from "lucide-react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useCountdown } from "@/hooks/useCountdown";
import { formatIST } from "@/lib/timezone";
import { LiveMatches } from "@/components/LiveMatches";
import { UpcomingMatches } from "@/components/UpcomingMatches";
import { CompletedMatches } from "@/components/CompletedMatches";

export default function Home() {
  // Use custom auth hook that checks localStorage immediately
  const { isAuthenticated, user, handleLogout } = useAuth();
  
  // Fetch comprehensive matches including all domestic and local tournaments
  const { data: currentMatches, isLoading: matchesLoading } = trpc.cricket.getAllMatches.useQuery(undefined, {
    refetchInterval: 15000,
  });
  
  // Fetch user's teams if logged in
  const { data: userTeams } = trpc.team.getMyTeams.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Filter matches by actual status from Cricket API
  const allMatches = currentMatches || [];
  
  // Detect match status based on matchStarted/matchEnded boolean fields
  const liveMatches = allMatches.filter((m: any) => m.ms === 'live' || (m.matchStarted && !m.matchEnded));
  const completedMatches = allMatches.filter((m: any) => m.ms === 'result' || m.matchEnded);
  
  // Sort upcoming matches by date/time (earliest first)
  const upcomingMatches = allMatches
    .filter((m: any) => m.ms === 'fixture' || (!m.matchStarted && !m.matchEnded))
    .sort((a: any, b: any) => {
      const dateA = new Date(a.dateTimeGMT || "").getTime();
      const dateB = new Date(b.dateTimeGMT || "").getTime();
      return dateA - dateB;
    });
  
  // Show first 6 of each category
  const displayUpcoming = upcomingMatches.slice(0, 6);
  const displayLive = liveMatches.slice(0, 6);
  const displayCompleted = completedMatches.slice(0, 6);
  
  // Get next upcoming match for countdown - memoize to prevent infinite loop
  const nextUpcomingMatch = upcomingMatches.length > 0 ? upcomingMatches[0] : null;
  const nextMatchDate = useMemo(() => {
    if (!nextUpcomingMatch) return null;
    const dateStr = nextUpcomingMatch.dateTimeGMT || "";
    return dateStr ? new Date(dateStr) : null;
  }, [nextUpcomingMatch?.id]); // Use match ID as dependency to prevent recreating Date object on every render
  const countdown = useCountdown(nextMatchDate);

  const features = [
    {
      icon: Trophy,
      title: "100% Free To Play",
      description: "No entry fees, no hidden charges. Play fantasy cricket for pure entertainment and skill development.",
      color: "text-[oklch(0.65_0.2_45)]",
      bgColor: "bg-[oklch(0.65_0.2_45)]/10",
    },
    {
      icon: Shield,
      title: "100% Legal & Compliant",
      description: "Fully compliant with Indian fantasy sports regulations. Safe, secure, and transparent platform.",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Users,
      title: "Real-Time Data",
      description: "Live match updates, real-time scores, and instant fantasy points calculation from official sources.",
      color: "text-[oklch(0.75_0.15_85)]",
      bgColor: "bg-[oklch(0.75_0.15_85)]/10",
    },
    {
      icon: TrendingUp,
      title: "Skill-Based Gaming",
      description: "Test your cricket knowledge and strategic thinking. Build winning teams based on player performance.",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Zap,
      title: "Instant Updates",
      description: "Get live match scores, player statistics, and fantasy points updates in real-time.",
      color: "text-[oklch(0.65_0.2_45)]",
      bgColor: "bg-[oklch(0.65_0.2_45)]/10",
    },
    {
      icon: Award,
      title: "Fair Play Guaranteed",
      description: "Transparent scoring system with no manipulation. Every player gets equal opportunity to win.",
      color: "text-[oklch(0.75_0.15_85)]",
      bgColor: "bg-[oklch(0.75_0.15_85)]/10",
    },
  ];

  const howToPlaySteps = [
    {
      step: "1",
      title: "Sign Up",
      description: "Create your free account in seconds. Age 18+ required.",
      icon: Users,
    },
    {
      step: "2",
      title: "Select Match",
      description: "Choose from upcoming cricket matches across all formats.",
      icon: Trophy,
    },
    {
      step: "3",
      title: "Build Team",
      description: "Select 11 players within budget. Choose captain & vice-captain.",
      icon: Star,
    },
    {
      step: "4",
      title: "Track Points",
      description: "Watch live as your players earn fantasy points during the match.",
      icon: TrendingUp,
    },
  ];

  // Stats removed - no mock data

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
    <Card className="hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/50 group overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge
                variant={type === "live" ? "destructive" : type === "upcoming" ? "default" : "secondary"}
                className={`text-xs ${type === "live" ? "animate-pulse" : ""}`}
              >
                {type === "live" && "🔴 LIVE"}
                {type === "upcoming" && "📅 Upcoming"}
                {type === "completed" && "✅ Completed"}
              </Badge>
              <span className="text-xs text-muted-foreground font-medium">{match.matchType?.toUpperCase()}</span>
            </div>
            <h3 className="font-semibold text-sm mb-1 line-clamp-1 group-hover:text-primary transition-colors">{match.name}</h3>
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
                    <img src={team.img} alt={team.shortname} className="w-6 h-6 rounded-full object-cover ring-2 ring-border" />
                  )}
                  <span className="font-medium text-sm">{team.shortname || team.name}</span>
                </div>
                {match.score && match.score[idx] && (
                  <span className="text-sm font-bold text-primary">
                    {match.score[idx].r}/{match.score[idx].w} ({match.score[idx].o})
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Match Status */}
          <div className="pt-3 border-t border-border/50">
            <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{match.status}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                <Clock className="inline h-3 w-3 mr-1" />
                {formatMatchDate(match.dateTimeGMTTimeGMTTimeGMT)}
              </span>
              {match.fantasyEnabled && (
                <Button size="sm" className="h-7 text-xs" asChild>
                  <Link href={`/team-builder/${match.id}`}>
                    {type === "upcoming" ? "Create Team" : "View Details"}
                    <ChevronRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={handleLogout}
      />
      
      {/* Hero Section with Stadium Image */}
      <section className="relative pt-20 min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero-stadium.webp" 
            alt="Cricket Stadium" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        </div>
        
        <div className="container relative z-10 py-20">
          {isAuthenticated ? (
            /* Personalized Hero for Logged-in Users */
            <div className="max-w-4xl space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium border border-white/20">
                <Trophy className="h-4 w-4 text-[oklch(0.65_0.2_45)]" />
                Welcome back, {user?.name || 'Champion'}!
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
                Ready to Play?
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[oklch(0.55_0.16_145)] to-[oklch(0.65_0.2_45)]">
                  {upcomingMatches.length} Matches Await!
                </span>
              </h1>
              
              
              {/* Live Countdown Timer */}
              {nextUpcomingMatch && !countdown.isExpired && (
                <div className="bg-gradient-to-r from-primary/20 to-[oklch(0.65_0.2_45)]/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="h-5 w-5 text-[oklch(0.65_0.2_45)]" />
                    <span className="text-white/90 text-sm font-medium">Next Match Starts In</span>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    <div className="text-center">
                      <div className="text-3xl md:text-4xl font-bold text-white">{countdown.days}</div>
                      <div className="text-xs text-white/70 mt-1">Days</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl md:text-4xl font-bold text-white">{countdown.hours}</div>
                      <div className="text-xs text-white/70 mt-1">Hours</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl md:text-4xl font-bold text-white">{countdown.minutes}</div>
                      <div className="text-xs text-white/70 mt-1">Minutes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl md:text-4xl font-bold text-white">{countdown.seconds}</div>
                      <div className="text-xs text-white/70 mt-1">Seconds</div>
                    </div>
                  </div>
                  <p className="text-sm text-white/80 mt-3 line-clamp-1">{nextUpcomingMatch.name}</p>
                  <p className="text-xs text-white/60 mt-1">{formatIST(nextUpcomingMatch.dateTimeGMT || "")}</p>
                </div>
              )}

              {/* Quick Stats for Logged-in User */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-5 w-5 text-[oklch(0.65_0.2_45)]" />
                    <span className="text-white/70 text-sm">My Teams</span>
                  </div>
                  <p className="text-3xl font-bold text-white">{userTeams?.length || 0}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-5 w-5 text-red-400" />
                    <span className="text-white/70 text-sm">Live Now</span>
                  </div>
                  <p className="text-3xl font-bold text-white">{liveMatches.length}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center gap-2 mb-2">
                    <CalendarDays className="h-5 w-5 text-primary" />
                    <span className="text-white/70 text-sm">Upcoming</span>
                  </div>
                  <p className="text-3xl font-bold text-white">{upcomingMatches.length}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-5 w-5 text-[oklch(0.75_0.15_85)]" />
                    <span className="text-white/70 text-sm">Total Points</span>
                  </div>
                  <p className="text-3xl font-bold text-white">
                    {userTeams?.reduce((sum: number, team: any) => sum + (team.totalPoints || 0), 0) || 0}
                  </p>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="flex flex-col sm:flex-row items-start gap-4 pt-4">
                <Button size="lg" className="h-14 px-8 text-lg bg-gradient-to-r from-primary to-[oklch(0.55_0.16_145)] hover:opacity-90 transition-opacity" asChild>
                  <Link href="/dashboard">
                    <LayoutDashboard className="mr-2 h-5 w-5" />
                    Go to Dashboard
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-white/30 text-white hover:bg-white/10 bg-white/5" asChild>
                  <Link href="/contests">
                    <Trophy className="mr-2 h-5 w-5" />
                    Browse Contests
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            /* Default Hero for Non-logged-in Users */
            <div className="max-w-3xl space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium border border-white/20">
                <Trophy className="h-4 w-4 text-[oklch(0.65_0.2_45)]" />
                India's Trusted Fantasy Cricket Platform
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight">
                Play Fantasy Cricket
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[oklch(0.55_0.16_145)] to-[oklch(0.65_0.2_45)]">
                  100% Free & Legal
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-white/80 max-w-2xl leading-relaxed">
                Build your dream cricket team, compete with friends, and showcase your cricket knowledge. No entry fees, pure skill-based entertainment.
              </p>
              
              <div className="flex flex-col sm:flex-row items-start gap-4 pt-4">
                <Button size="lg" className="h-14 px-8 text-lg bg-gradient-to-r from-primary to-[oklch(0.55_0.16_145)] hover:opacity-90 transition-opacity" asChild>
                  <Link href="/register">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-white/30 text-white hover:bg-white/10 bg-white/5" asChild>
                  <Link href="/how-to-play">
                    <Play className="mr-2 h-5 w-5" />
                    Learn How To Play
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>



      {/* Action Banner with Batsman Image */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero-batsman.webp" 
            alt="Cricket Action" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent"></div>
        </div>
        
        <div className="container relative z-10">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Build Your
              <br />
              <span className="text-[oklch(0.65_0.2_45)]">Dream Team?</span>
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Select your favorite players, assign captain and vice-captain, and watch your fantasy points grow with every boundary and wicket!
            </p>
            <Button size="lg" className="h-14 px-8 text-lg bg-[oklch(0.65_0.2_45)] hover:bg-[oklch(0.6_0.2_45)] text-white" asChild>
              <Link href="/dashboard">
                Start Building Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How To Play Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Simple Steps</Badge>
            <h2 className="text-4xl font-bold mb-4">How To Play</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get started in minutes with our easy-to-follow process
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howToPlaySteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative group">
                  <div className="text-center">
                    <div className="relative inline-flex mb-6">
                      <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-[oklch(0.55_0.16_145)] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Icon className="h-10 w-10 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-[oklch(0.65_0.2_45)] flex items-center justify-center text-white font-bold text-sm shadow-md">
                        {step.step}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                  
                  {index < howToPlaySteps.length - 1 && (
                    <div className="hidden lg:block absolute top-10 left-full w-full">
                      <ChevronRight className="h-8 w-8 text-border mx-auto" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="container">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Why Choose Us</Badge>
            <h2 className="text-4xl font-bold mb-4">Platform Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the best fantasy cricket platform with these amazing features
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-border/50 hover:border-primary/50 hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-8">
                    <div className={`h-14 w-14 rounded-xl ${feature.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <Icon className={`h-7 w-7 ${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Live, Upcoming, and Completed Matches Sections */}
      <section className="py-20 px-4 bg-background">
        <div className="container space-y-16">
          <LiveMatches />
          <UpcomingMatches />
          <CompletedMatches />
        </div>
      </section>

      {/* Team Celebration CTA */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero-team.webp" 
            alt="Team Celebration" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/40"></div>
        </div>
        
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Join Thousands of Cricket Fans
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Create your account today and start playing fantasy cricket for free. No hidden charges, no entry fees - just pure cricket entertainment!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="h-14 px-8 text-lg bg-gradient-to-r from-primary to-[oklch(0.55_0.16_145)]" asChild>
                <Link href="/register">
                  Create Free Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-white/30 text-white hover:bg-white/10 bg-white/5" asChild>
                <Link href="/about">
                  Learn More About Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>



      <Footer />
    </div>
  );
}
