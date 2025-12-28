import { Trophy, Users, Target, Award, TrendingUp, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function FantasyCricket() {
  const rules = [
    "Select 11 players from both teams combined within the credit budget",
    "Team must include 1-4 Wicket-keepers, 3-6 Batsmen, 1-4 All-rounders, and 3-6 Bowlers",
    "Choose 1 Captain (2x points) and 1 Vice-Captain (1.5x points)",
    "Team must be submitted before the match starts",
    "Points are awarded based on real match performance",
    "No changes allowed once the match begins",
    "Multiple teams can be created for the same match",
    "All data is sourced from official cricket APIs in real-time",
  ];

  const playerRoles = [
    {
      icon: Shield,
      role: "Wicket-Keeper (WK)",
      description: "Players who keep wickets and usually bat. Earn points for catches, stumpings, and batting performance.",
      min: 1,
      max: 4,
    },
    {
      icon: Target,
      role: "Batsman (BAT)",
      description: "Specialist batsmen who score runs. Earn points for runs, boundaries, and milestone bonuses (50s, 100s).",
      min: 3,
      max: 6,
    },
    {
      icon: Users,
      role: "All-Rounder (AR)",
      description: "Players who contribute in both batting and bowling. Can earn points from both disciplines.",
      min: 1,
      max: 4,
    },
    {
      icon: TrendingUp,
      role: "Bowler (BOWL)",
      description: "Specialist bowlers who take wickets. Earn points for wickets, maidens, and economy bonuses.",
      min: 3,
      max: 6,
    },
  ];

  const scoringDetails = [
    { category: "Batting", items: [
      { action: "Run", points: "+1" },
      { action: "Boundary (4s)", points: "+1 bonus" },
      { action: "Six (6s)", points: "+2 bonus" },
      { action: "50 runs", points: "+8 bonus" },
      { action: "100 runs", points: "+16 bonus" },
      { action: "Duck (out for 0)", points: "-2" },
    ]},
    { category: "Bowling", items: [
      { action: "Wicket", points: "+25" },
      { action: "4 wickets", points: "+8 bonus" },
      { action: "5 wickets", points: "+16 bonus" },
      { action: "Maiden over", points: "+12" },
    ]},
    { category: "Fielding", items: [
      { action: "Catch", points: "+8" },
      { action: "Stumping", points: "+12" },
      { action: "Direct run-out", points: "+12" },
      { action: "Indirect run-out", points: "+6" },
    ]},
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="py-16 px-4 bg-gradient-to-br from-primary/10 to-background">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <Trophy className="h-16 w-16 text-primary mx-auto" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">Fantasy Cricket</h1>
              <p className="text-lg text-muted-foreground">
                Build your dream team, compete with others, and showcase your cricket knowledge
              </p>
            </div>
          </div>
        </section>

        {/* What is Fantasy Cricket */}
        <section className="py-16 px-4">
          <div className="container max-w-4xl">
            <h2 className="text-3xl font-bold text-foreground mb-6">What is Fantasy Cricket?</h2>
            <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
              <p>
                Fantasy Cricket is a skill-based online game where you create virtual teams of real cricket players
                and earn points based on their actual performance in live matches. It's a game of strategy, knowledge,
                and cricket expertise.
              </p>
              <p>
                Unlike traditional betting or gambling, fantasy cricket is purely skill-based. Your success depends on
                your ability to analyze player form, understand match conditions, and make strategic decisions about
                team composition and captaincy choices.
              </p>
              <p>
                SHAMSHABAD offers a 100% free-to-play fantasy cricket platform where you can enjoy the thrill of team
                building and competition without any entry fees or financial risks.
              </p>
            </div>
          </div>
        </section>

        {/* Rules */}
        <section className="py-16 px-4 bg-secondary/30">
          <div className="container max-w-4xl">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Rules & Regulations</h2>
            <Card className="border-border">
              <CardContent className="p-6">
                <ul className="space-y-3">
                  {rules.map((rule, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-muted-foreground">{rule}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Player Roles */}
        <section className="py-16 px-4">
          <div className="container">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Player Roles Explained</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {playerRoles.map((role, index) => {
                const Icon = role.icon;
                return (
                  <Card key={index} className="border-border">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-foreground mb-1">{role.role}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{role.description}</p>
                          <div className="text-xs text-primary font-medium">
                            Required: {role.min}-{role.max} players
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Scoring System */}
        <section className="py-16 px-4 bg-secondary/30">
          <div className="container max-w-5xl">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Detailed Scoring System</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {scoringDetails.map((category, idx) => (
                <Card key={idx} className="border-border">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-4 text-center">{category.category}</h3>
                    <div className="space-y-2">
                      {category.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-secondary/50 rounded">
                          <span className="text-sm text-muted-foreground">{item.action}</span>
                          <span className="text-sm font-semibold text-primary">{item.points}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-6 p-4 bg-primary/10 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Remember:</strong> Captain gets 2x points and Vice-Captain gets 1.5x points on all actions
              </p>
            </div>
          </div>
        </section>

        {/* Team Composition */}
        <section className="py-16 px-4">
          <div className="container max-w-4xl">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Team Composition Rules</h2>
            <Card className="border-border">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">Total Players: 11</h3>
                    <p className="text-muted-foreground">
                      You must select exactly 11 players from both teams combined. The distribution must follow the
                      role requirements mentioned above.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">Credit Budget: 100</h3>
                    <p className="text-muted-foreground">
                      Each player has a credit value. Your total team cost must not exceed 100 credits. Balance your
                      team with a mix of premium and value players.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">Players per Team: 7 max</h3>
                    <p className="text-muted-foreground">
                      You can select a maximum of 7 players from a single team. This ensures balanced team composition
                      from both sides.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">Captain & Vice-Captain</h3>
                    <p className="text-muted-foreground">
                      Mandatory selection of 1 Captain (2x points) and 1 Vice-Captain (1.5x points). Choose wisely as
                      this decision significantly impacts your total score.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Live Scoring */}
        <section className="py-16 px-4 bg-secondary/30">
          <div className="container max-w-4xl text-center">
            <Award className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-foreground mb-4">Real-Time Live Scoring</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Watch your fantasy team's points update in real-time as the actual cricket match progresses. Our platform
              uses official cricket data APIs to ensure 100% accurate and transparent scoring.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-border">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Instant Updates</h3>
                  <p className="text-sm text-muted-foreground">
                    Points are calculated and updated instantly after every ball
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Transparent Data</h3>
                  <p className="text-sm text-muted-foreground">
                    All data sourced from official APIs, no manipulation possible
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Detailed Breakdown</h3>
                  <p className="text-sm text-muted-foreground">
                    View player-wise points breakdown and performance analysis
                  </p>
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
