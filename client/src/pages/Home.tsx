import { Link } from "wouter";
import { Trophy, Shield, Users, TrendingUp, Zap, Award, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 bg-gradient-to-br from-primary/10 via-background to-background overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
              <Trophy className="h-4 w-4" />
              India's Trusted Fantasy Cricket Platform
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
              Play Fantasy Cricket
              <span className="text-primary block mt-2">100% Free & Legal</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Build your dream cricket team, compete with friends, and showcase your cricket knowledge. No entry fees,
              pure skill-based entertainment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/register">
                <a>
                  <Button size="lg" className="text-lg px-8">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>
              </Link>
              <Link href="/how-to-play">
                <a>
                  <Button size="lg" variant="outline" className="text-lg px-8">
                    Learn How To Play
                  </Button>
                </a>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Choose SHAMSHABAD?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the best fantasy cricket platform with real-time updates, fair play, and complete transparency.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-border hover:border-primary transition-all hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How To Play Section */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How To Play</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started in 4 simple steps and start playing fantasy cricket today.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {howToPlaySteps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-card rounded-lg p-6 border border-border hover:border-primary transition-all h-full">
                  <div className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
                {index < howToPlaySteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ArrowRight className="h-6 w-6 text-primary" />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/how-to-play">
              <a>
                <Button size="lg" variant="outline">
                  View Detailed Guide
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Trust & Safety</h2>
              <p className="text-lg text-muted-foreground">
                Your safety and fair play are our top priorities. We follow all Indian regulations.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-border">
                <CardContent className="p-6">
                  <CheckCircle2 className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Age Verification</h3>
                  <p className="text-muted-foreground">
                    Strict 18+ age verification during registration. We ensure responsible gaming for adults only.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="p-6">
                  <CheckCircle2 className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Geo-Compliance</h3>
                  <p className="text-muted-foreground">
                    Automatic blocking of restricted states (Telangana, Andhra Pradesh, Assam, Odisha) as per Indian
                    law.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="p-6">
                  <CheckCircle2 className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Data Security</h3>
                  <p className="text-muted-foreground">
                    Your personal information is encrypted and protected. We never share your data with third parties.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="p-6">
                  <CheckCircle2 className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Fair Play</h3>
                  <p className="text-muted-foreground">
                    Transparent scoring system with real-time API data. No manipulation, no fake data, 100% authentic.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 to-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Ready To Play Fantasy Cricket?</h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of cricket fans already playing on India's most trusted free-to-play fantasy cricket
              platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/register">
                <a>
                  <Button size="lg" className="text-lg px-8">
                    Create Free Account
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>
              </Link>
              <Link href="/contact">
                <a>
                  <Button size="lg" variant="outline" className="text-lg px-8">
                    Contact Support
                  </Button>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
