import { BookOpen, Lightbulb, Target, AlertCircle, Trophy, Users, DollarSign, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function HowToPlay() {
  const quickSteps = [
    {
      step: 1,
      title: "Create Account",
      description: "Sign up with your email and verify you're 18+. It's completely free!",
    },
    {
      step: 2,
      title: "Choose Match",
      description: "Browse upcoming cricket matches across all formats (T20, ODI, Test).",
    },
    {
      step: 3,
      title: "Build Your Team",
      description: "Select 11 players within the budget. Choose 1 captain (2x points) and 1 vice-captain (1.5x points).",
    },
    {
      step: 4,
      title: "Track Live Points",
      description: "Watch your team earn points in real-time as the match progresses.",
    },
  ];

  const proTips = [
    {
      icon: Target,
      title: "Study Recent Form",
      description: "Always check player's recent performances, not just career stats. Form matters more than reputation.",
    },
    {
      icon: Users,
      title: "Balance Your Team",
      description: "Don't overload on batsmen or bowlers. A balanced team with all-rounders performs better.",
    },
    {
      icon: Trophy,
      title: "Captain Selection",
      description: "Choose your captain wisely - they earn 2x points. Pick players likely to perform well in match conditions.",
    },
    {
      icon: Lightbulb,
      title: "Pitch & Weather",
      description: "Consider pitch conditions and weather. Spinners thrive on turning tracks, pacers on green pitches.",
    },
    {
      icon: DollarSign,
      title: "Budget Management",
      description: "Don't spend all credits on stars. Mix premium players with value picks for a balanced budget.",
    },
    {
      icon: Award,
      title: "Match-ups Matter",
      description: "Consider player vs team history. Some players consistently perform well against specific opponents.",
    },
  ];

  const strategies = [
    {
      title: "Opening Batsmen Strategy",
      description: "Pick at least one opener who faces more balls and has higher chances of scoring runs. Openers get more opportunities to accumulate points through boundaries and strike rate bonuses.",
    },
    {
      title: "All-Rounder Advantage",
      description: "All-rounders are gold in fantasy cricket. They can earn points through both batting and bowling, giving you double opportunities. Always include 2-3 quality all-rounders in your team.",
    },
    {
      title: "Wicket-Keeper Selection",
      description: "Choose wicket-keepers who bat in top order. They earn points for catches/stumpings plus batting, making them valuable picks. Avoid keepers who bat at 7 or below.",
    },
    {
      title: "Bowler Mix",
      description: "Include both pace and spin bowlers based on pitch conditions. In T20s, death bowlers are crucial. In Tests and ODIs, opening bowlers get more opportunities for wickets.",
    },
    {
      title: "Captain & Vice-Captain",
      description: "This is the most crucial decision. Captain gets 2x points, vice-captain gets 1.5x. Choose players with high ceiling (potential for big scores). Don't always go with the obvious choice - differential captains can give you an edge.",
    },
    {
      title: "Differential Picks",
      description: "Include 1-2 less popular players who you think will perform. If they do well, you'll gain significant advantage over others who picked the same popular players.",
    },
  ];

  const scoringRules = [
    { action: "Run scored", points: "1 point per run" },
    { action: "Boundary (4s)", points: "1 bonus point" },
    { action: "Six (6s)", points: "2 bonus points" },
    { action: "Half-century (50 runs)", points: "8 bonus points" },
    { action: "Century (100 runs)", points: "16 bonus points" },
    { action: "Wicket taken", points: "25 points" },
    { action: "Catch taken", points: "8 points" },
    { action: "Stumping", points: "12 points" },
    { action: "Run-out (direct)", points: "12 points" },
    { action: "Run-out (indirect)", points: "6 points" },
    { action: "Maiden over", points: "12 points" },
    { action: "Duck (batsman)", points: "-2 points" },
  ];

  const mistakes = [
    {
      title: "Ignoring Team News",
      description: "Always check team announcements before finalizing your team. Last-minute changes can ruin your strategy. Players who don't play earn zero points.",
    },
    {
      title: "Picking Too Many Players from One Team",
      description: "If that team performs poorly, your entire fantasy team suffers. Spread your picks across both teams for better risk management.",
    },
    {
      title: "Overlooking All-Rounders",
      description: "Many beginners focus only on star batsmen and bowlers. All-rounders provide dual opportunities to score points and are often undervalued.",
    },
    {
      title: "Not Considering Match Format",
      description: "T20 strategies differ from ODI and Test strategies. In T20s, aggressive players are valuable. In Tests, consistent performers matter more.",
    },
    {
      title: "Following the Crowd",
      description: "Picking the same players as everyone else won't help you climb leaderboards. You need differential picks to stand out.",
    },
    {
      title: "Ignoring Recent Form",
      description: "A player's reputation doesn't guarantee points. Always prioritize recent form over past glory. Check last 5-10 matches performance.",
    },
    {
      title: "Poor Captain Choice",
      description: "Captaincy decision can make or break your team. Don't captain defensive players or those batting at 6-7. Choose aggressive players with high scoring potential.",
    },
    {
      title: "Not Using Full Budget",
      description: "Leaving credits unused is a waste. Every credit can contribute to better players. Use your full budget wisely.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="py-16 px-4 bg-gradient-to-br from-primary/10 to-background">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <BookOpen className="h-16 w-16 text-primary mx-auto" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">How To Play Fantasy Cricket</h1>
              <p className="text-lg text-muted-foreground">
                Master the art of fantasy cricket with our comprehensive guide, pro tips, and winning strategies.
              </p>
            </div>
          </div>
        </section>

        {/* Quick Guide */}
        <section className="py-16 px-4">
          <div className="container">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Quick Start Guide</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {quickSteps.map((step) => (
                <Card key={step.step} className="border-border hover:border-primary transition-all">
                  <CardContent className="p-6">
                    <div className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mb-4">
                      {step.step}
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                    <p className="text-muted-foreground text-sm">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Detailed Gameplay */}
        <section className="py-16 px-4 bg-secondary/30">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground mb-8">Detailed Gameplay Explanation</h2>
              <div className="space-y-6 text-muted-foreground">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Step 1: Registration & Account Setup</h3>
                  <p className="leading-relaxed">
                    Begin by creating your free account on SHAMSHABAD. You'll need to provide your email, create a
                    password, and verify that you're 18 years or older. We also verify your location to ensure
                    compliance with Indian regulations. Users from Telangana, Andhra Pradesh, Assam, and Odisha cannot
                    participate due to state-specific restrictions.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Step 2: Browse Available Matches</h3>
                  <p className="leading-relaxed">
                    Once logged in, you'll see a list of upcoming cricket matches across all formats - T20, ODI, and
                    Test matches. Each match shows the teams playing, venue, date, and time. Choose any match you want
                    to create a fantasy team for. You can create teams for multiple matches simultaneously.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Step 3: Team Selection Process</h3>
                  <p className="leading-relaxed mb-3">
                    This is where strategy comes in. You need to select 11 players from both teams combined, within a
                    fixed credit budget (usually 100 credits). Each player has a credit value based on their skill and
                    recent form. Your team must include:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>1-4 Wicket-keepers (at least 1 required)</li>
                    <li>3-6 Batsmen (at least 3 required)</li>
                    <li>1-4 All-rounders (at least 1 required)</li>
                    <li>3-6 Bowlers (at least 3 required)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Step 4: Captain & Vice-Captain</h3>
                  <p className="leading-relaxed">
                    After selecting 11 players, you must choose one captain and one vice-captain. Your captain earns 2x
                    points, and vice-captain earns 1.5x points. This multiplier applies to all points they earn during
                    the match, making this decision crucial for your team's success.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Step 5: Submit & Track</h3>
                  <p className="leading-relaxed">
                    Once satisfied with your team, submit it before the match starts. You can create multiple teams for
                    the same match (if allowed in the contest). During the match, track your team's performance in
                    real-time as players earn points based on their actual performance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pro Tips */}
        <section className="py-16 px-4">
          <div className="container">
            <div className="text-center mb-12">
              <Lightbulb className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-foreground mb-4">Pro Tips for Success</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Learn from experienced players and improve your fantasy cricket skills.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {proTips.map((tip, index) => {
                const Icon = tip.icon;
                return (
                  <Card key={index} className="border-border hover:border-primary transition-all">
                    <CardContent className="p-6">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">{tip.title}</h3>
                      <p className="text-muted-foreground text-sm">{tip.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Strategies */}
        <section className="py-16 px-4 bg-secondary/30">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Winning Strategies</h2>
              <Accordion type="single" collapsible className="space-y-4">
                {strategies.map((strategy, index) => (
                  <AccordionItem key={index} value={`strategy-${index}`} className="border border-border rounded-lg px-6">
                    <AccordionTrigger className="text-lg font-semibold text-foreground hover:text-primary">
                      {strategy.title}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pt-2">
                      {strategy.description}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Scoring System */}
        <section className="py-16 px-4">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Scoring System</h2>
              <Card className="border-border">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {scoringRules.map((rule, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-secondary/30 rounded-lg">
                        <span className="text-foreground font-medium">{rule.action}</span>
                        <span className="text-primary font-semibold">{rule.points}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">Note:</strong> Captain points are multiplied by 2x and
                      Vice-Captain points by 1.5x. Strike rate and economy bonuses may apply based on performance.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Mistakes to Avoid */}
        <section className="py-16 px-4 bg-secondary/30">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-foreground mb-4">Common Mistakes to Avoid</h2>
                <p className="text-lg text-muted-foreground">
                  Learn from these common pitfalls to improve your fantasy cricket performance.
                </p>
              </div>
              <div className="space-y-6">
                {mistakes.map((mistake, index) => (
                  <Card key={index} className="border-border">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-destructive font-bold">{index + 1}</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-2">{mistake.title}</h3>
                          <p className="text-muted-foreground">{mistake.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
