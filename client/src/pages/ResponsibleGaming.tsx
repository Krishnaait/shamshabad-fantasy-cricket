import { Heart, Shield, AlertTriangle, CheckCircle2, Users, Clock, HelpCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function ResponsibleGaming() {
  const commitments = [
    "Provide a safe and transparent gaming environment",
    "Enforce strict age verification (18+ only)",
    "Promote awareness about responsible gaming practices",
    "Offer self-exclusion and account control tools",
    "Maintain 100% free-to-play model to prevent financial harm",
    "Provide easy access to support resources",
  ];

  const healthyHabits = [
    { icon: Clock, title: "Set Time Limits", description: "Decide how much time you'll spend before you start playing" },
    { icon: Users, title: "Balance Activities", description: "Maintain a healthy balance between gaming and other life activities" },
    { icon: Heart, title: "Play for Fun", description: "Remember that fantasy cricket is entertainment, not a source of income" },
    { icon: Shield, title: "Stay Informed", description: "Understand the rules, scoring system, and how the platform works" },
  ];

  const warningSignsData = [
    "Spending more time on fantasy cricket than intended",
    "Neglecting personal or professional responsibilities",
    "Feeling anxious or irritable when not playing",
    "Using fantasy cricket as an escape from problems",
    "Lying to others about time spent on the platform",
    "Difficulty controlling or stopping gaming behavior",
    "Experiencing negative impacts on relationships",
    "Feeling guilty or regretful after playing",
  ];

  const selfAssessmentQuestions = [
    "Do you play fantasy cricket for longer than you intended?",
    "Has your gaming affected your work or studies?",
    "Do you feel the need to play more frequently?",
    "Have you tried to cut down but couldn't?",
    "Do you neglect other activities to play fantasy cricket?",
    "Has anyone expressed concern about your gaming?",
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="py-16 px-4 bg-gradient-to-br from-primary/10 to-background">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <Heart className="h-16 w-16 text-primary mx-auto" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">Responsible Gaming</h1>
              <p className="text-lg text-muted-foreground">
                Your well-being is our priority. Play responsibly and enjoy fantasy cricket as entertainment.
              </p>
            </div>
          </div>
        </section>

        {/* Our Commitment */}
        <section className="py-16 px-4">
          <div className="container max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold text-foreground">Our Commitment to Your Well-being</h2>
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              At SHAMSHABAD, we are deeply committed to promoting responsible gaming. We believe that fantasy cricket
              should be an enjoyable, skill-based entertainment activity that enhances your love for the game, not a
              source of stress or harm.
            </p>
            <Card className="border-border">
              <CardContent className="p-6">
                <ul className="space-y-3">
                  {commitments.map((commitment, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{commitment}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* This is NOT Gambling */}
        <section className="py-16 px-4 bg-secondary/30">
          <div className="container max-w-4xl">
            <h2 className="text-3xl font-bold text-foreground mb-6 text-center">This is NOT Gambling</h2>
            <Card className="border-primary/50 border-2">
              <CardContent className="p-8">
                <div className="space-y-4 text-muted-foreground">
                  <p className="text-lg">
                    <strong className="text-foreground">SHAMSHABAD is a 100% Free-To-Play platform.</strong> There are
                    no entry fees, no cash prizes, and no financial transactions involved in gameplay.
                  </p>
                  <p>
                    Fantasy cricket on our platform is a game of skill, not chance. Success depends on your cricket
                    knowledge, strategic thinking, and analytical abilities - not luck or gambling.
                  </p>
                  <p>
                    We strictly comply with all Indian laws and regulations regarding fantasy sports. Our platform is
                    designed purely for entertainment and skill development.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* What is Responsible Gaming */}
        <section className="py-16 px-4">
          <div className="container max-w-4xl">
            <h2 className="text-3xl font-bold text-foreground mb-6">What is Responsible Gaming?</h2>
            <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
              <p>
                Responsible gaming means playing fantasy cricket in a way that is fun, controlled, and doesn't
                negatively impact your life, relationships, or well-being. It involves:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Playing for entertainment and enjoyment, not as a primary activity</li>
                <li>Setting and respecting personal time limits</li>
                <li>Maintaining balance with other life responsibilities</li>
                <li>Being aware of your gaming behavior and its effects</li>
                <li>Seeking help if gaming becomes problematic</li>
                <li>Understanding that fantasy cricket is a game of skill, not a money-making opportunity</li>
              </ul>
            </div>
          </div>
        </section>

        {/* How to Play Responsibly */}
        <section className="py-16 px-4 bg-secondary/30">
          <div className="container max-w-4xl">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">How to Play in a Responsible Manner</h2>
            <div className="space-y-6">
              <Card className="border-border">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-3">1. Set Time Limits</h3>
                  <p className="text-muted-foreground">
                    Decide in advance how much time you'll spend on the platform each day or week. Use alarms or
                    reminders to help you stick to your limits. Take regular breaks during gaming sessions.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-3">2. Prioritize Real Life</h3>
                  <p className="text-muted-foreground">
                    Never let fantasy cricket interfere with work, studies, family time, or other important
                    responsibilities. If you find yourself choosing gaming over important activities, it's time to
                    reassess.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-3">3. Play for the Right Reasons</h3>
                  <p className="text-muted-foreground">
                    Play because you enjoy cricket and want to test your knowledge, not to escape problems or fill
                    emotional voids. Fantasy cricket should enhance your life, not become a coping mechanism.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-3">4. Stay Informed</h3>
                  <p className="text-muted-foreground">
                    Understand how fantasy cricket works, including rules, scoring, and the skill-based nature of the
                    game. Knowledge helps you play more responsibly and enjoyably.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-3">5. Monitor Your Behavior</h3>
                  <p className="text-muted-foreground">
                    Regularly assess your gaming habits. Are you playing more than intended? Is it affecting your mood
                    or relationships? Be honest with yourself and make adjustments as needed.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Healthy Gaming Habits */}
        <section className="py-16 px-4">
          <div className="container">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Healthy Gaming Habits</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {healthyHabits.map((habit, index) => {
                const Icon = habit.icon;
                return (
                  <Card key={index} className="border-border">
                    <CardContent className="p-6 text-center">
                      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">{habit.title}</h3>
                      <p className="text-sm text-muted-foreground">{habit.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Self-Assessment Tool */}
        <section className="py-16 px-4 bg-secondary/30">
          <div className="container max-w-4xl">
            <div className="text-center mb-8">
              <HelpCircle className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-foreground mb-4">Self-Assessment Tool</h2>
              <p className="text-lg text-muted-foreground">
                Answer these questions honestly to assess your gaming behavior
              </p>
            </div>
            <Card className="border-border">
              <CardContent className="p-8">
                <div className="space-y-4">
                  {selfAssessmentQuestions.map((question, index) => (
                    <div key={index} className="p-4 bg-secondary/50 rounded-lg">
                      <p className="text-muted-foreground">{question}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">If you answered "yes" to 3 or more questions,</strong> you may
                    want to reconsider your gaming habits and seek support if needed.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Account Controls */}
        <section className="py-16 px-4">
          <div className="container max-w-4xl">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Account Controls and Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-border">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-3">Self-Exclusion</h3>
                  <p className="text-muted-foreground mb-4">
                    Temporarily or permanently block your account if you feel you need a break from fantasy cricket.
                  </p>
                  <Link href="/profile">
                    <a>
                      <Button variant="outline" className="w-full">Manage in Profile</Button>
                    </a>
                  </Link>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-3">Activity Monitoring</h3>
                  <p className="text-muted-foreground mb-4">
                    Track your gaming activity, time spent, and teams created to stay aware of your habits.
                  </p>
                  <Link href="/dashboard">
                    <a>
                      <Button variant="outline" className="w-full">View Dashboard</Button>
                    </a>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Support Resources */}
        <section className="py-16 px-4 bg-secondary/30">
          <div className="container max-w-4xl">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Support Resources</h2>
            <Card className="border-border">
              <CardContent className="p-8">
                <p className="text-muted-foreground mb-6">
                  If you or someone you know is struggling with gaming behavior, help is available:
                </p>
                <div className="space-y-4">
                  <div className="p-4 bg-secondary/50 rounded-lg">
                    <h3 className="font-semibold text-foreground mb-2">SHAMSHABAD Support Team</h3>
                    <p className="text-sm text-muted-foreground">Email: support@shamshabad.com</p>
                  </div>
                  <div className="p-4 bg-secondary/50 rounded-lg">
                    <h3 className="font-semibold text-foreground mb-2">National Helpline for Mental Health</h3>
                    <p className="text-sm text-muted-foreground">Call: 1800-599-0019 (Toll-Free)</p>
                  </div>
                  <div className="p-4 bg-secondary/50 rounded-lg">
                    <h3 className="font-semibold text-foreground mb-2">Professional Counseling</h3>
                    <p className="text-sm text-muted-foreground">
                      Consider speaking with a mental health professional if gaming is affecting your life
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* For Parents */}
        <section className="py-16 px-4">
          <div className="container max-w-4xl">
            <h2 className="text-3xl font-bold text-foreground mb-6">For Parents and Guardians</h2>
            <Card className="border-border">
              <CardContent className="p-8">
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Age Restriction:</strong> SHAMSHABAD is strictly for users 18
                    years and older. We enforce age verification during registration.
                  </p>
                  <p>
                    <strong className="text-foreground">Monitor Usage:</strong> If you're concerned about a young
                    adult's gaming habits, have open conversations about responsible gaming and set family guidelines.
                  </p>
                  <p>
                    <strong className="text-foreground">Education:</strong> Help young adults understand that fantasy
                    cricket is entertainment, not a career or income source. Encourage balanced activities.
                  </p>
                  <p>
                    <strong className="text-foreground">Seek Help:</strong> If you notice warning signs of problematic
                    gaming behavior, don't hesitate to seek professional guidance.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Warning Signs */}
        <section className="py-16 px-4 bg-secondary/30">
          <div className="container max-w-4xl">
            <div className="text-center mb-8">
              <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-foreground mb-4">Warning Signs of Problematic Gaming</h2>
              <p className="text-lg text-muted-foreground">
                Be aware of these signs that gaming may be becoming a problem
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {warningSignsData.map((sign, index) => (
                <Card key={index} className="border-destructive/30">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{sign}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-8 text-center">
              <p className="text-muted-foreground mb-4">
                If you recognize these signs in yourself or someone else, it's important to take action and seek
                support.
              </p>
              <Link href="/contact">
                <a>
                  <Button size="lg">Contact Support</Button>
                </a>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
