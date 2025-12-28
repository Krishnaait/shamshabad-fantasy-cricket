import { Shield, CheckCircle2, XCircle, AlertTriangle, Eye, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function FairPlay() {
  const principles = [
    {
      icon: Shield,
      title: "Transparency",
      description: "All scoring rules, player data, and match information are openly available. No hidden algorithms or manipulation.",
    },
    {
      icon: Eye,
      title: "Real-Time Data",
      description: "We use official cricket APIs to ensure 100% authentic data. Every point is calculated from verified sources.",
    },
    {
      icon: Lock,
      title: "Secure Platform",
      description: "Your account and data are protected. We use industry-standard security measures to prevent unauthorized access.",
    },
    {
      icon: CheckCircle2,
      title: "Equal Opportunity",
      description: "Every user has the same access to information, features, and opportunities. No preferential treatment.",
    },
  ];

  const prohibitedActions = [
    "Creating multiple accounts to gain unfair advantage",
    "Using automated bots or scripts to create teams",
    "Colluding with other users to manipulate results",
    "Exploiting bugs or glitches in the platform",
    "Sharing account credentials with others",
    "Using insider information not publicly available",
    "Manipulating or tampering with platform data",
    "Engaging in any form of cheating or fraud",
  ];

  const consequences = [
    { severity: "First Offense", action: "Warning and temporary suspension (7 days)" },
    { severity: "Second Offense", action: "Extended suspension (30 days) and team deletion" },
    { severity: "Third Offense", action: "Permanent account ban and IP block" },
    { severity: "Severe Violations", action: "Immediate permanent ban and legal action if applicable" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="py-16 px-4 bg-gradient-to-br from-primary/10 to-background">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <Shield className="h-16 w-16 text-primary mx-auto" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">Fair Play Policy</h1>
              <p className="text-lg text-muted-foreground">
                Ensuring integrity, transparency, and equal opportunity for all users
              </p>
            </div>
          </div>
        </section>

        {/* Our Commitment */}
        <section className="py-16 px-4">
          <div className="container max-w-4xl">
            <h2 className="text-3xl font-bold text-foreground mb-6">Our Commitment to Fair Play</h2>
            <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
              <p>
                At SHAMSHABAD, fair play is the foundation of our platform. We are committed to maintaining a level
                playing field where skill, knowledge, and strategy determine success - not cheating, manipulation, or
                unfair advantages.
              </p>
              <p>
                We employ advanced monitoring systems, regular audits, and strict enforcement policies to detect and
                prevent any violations of fair play. Our goal is to create a trustworthy environment where every user
                can compete with confidence.
              </p>
            </div>
          </div>
        </section>

        {/* Fair Play Principles */}
        <section className="py-16 px-4 bg-secondary/30">
          <div className="container">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Fair Play Principles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {principles.map((principle, index) => {
                const Icon = principle.icon;
                return (
                  <Card key={index} className="border-border">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-2">{principle.title}</h3>
                          <p className="text-sm text-muted-foreground">{principle.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Prohibited Actions */}
        <section className="py-16 px-4">
          <div className="container max-w-4xl">
            <div className="text-center mb-8">
              <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-foreground mb-4">Prohibited Actions</h2>
              <p className="text-lg text-muted-foreground">
                The following actions are strictly prohibited and will result in penalties
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {prohibitedActions.map((action, index) => (
                <Card key={index} className="border-destructive/30">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <XCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{action}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Enforcement */}
        <section className="py-16 px-4 bg-secondary/30">
          <div className="container max-w-4xl">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Enforcement and Consequences</h2>
            <Card className="border-border">
              <CardContent className="p-8">
                <p className="text-muted-foreground mb-6">
                  We take fair play violations seriously. Depending on the severity and frequency of violations, users
                  may face the following consequences:
                </p>
                <div className="space-y-4">
                  {consequences.map((item, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-secondary/50 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">{item.severity}</h3>
                        <p className="text-sm text-muted-foreground">{item.action}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Detection Systems */}
        <section className="py-16 px-4">
          <div className="container max-w-4xl">
            <h2 className="text-3xl font-bold text-foreground mb-6">How We Detect Violations</h2>
            <div className="space-y-6">
              <Card className="border-border">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-3">Automated Monitoring</h3>
                  <p className="text-muted-foreground">
                    Our systems continuously monitor user activity for suspicious patterns, including multiple accounts
                    from the same IP, unusual team creation patterns, and automated bot behavior.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-3">Manual Reviews</h3>
                  <p className="text-muted-foreground">
                    Our team conducts regular manual reviews of flagged accounts and reported violations. We investigate
                    thoroughly before taking action.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-3">User Reports</h3>
                  <p className="text-muted-foreground">
                    We encourage users to report suspicious activity. All reports are investigated confidentially and
                    appropriate action is taken.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Reporting */}
        <section className="py-16 px-4 bg-secondary/30">
          <div className="container max-w-4xl text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">Report Fair Play Violations</h2>
            <p className="text-lg text-muted-foreground mb-8">
              If you suspect any user is violating our fair play policy, please report it immediately. Your report will
              be kept confidential.
            </p>
            <Card className="border-border">
              <CardContent className="p-8">
                <p className="text-muted-foreground mb-6">
                  Email us at: <strong className="text-foreground">fairplay@shamshabad.com</strong>
                </p>
                <p className="text-sm text-muted-foreground">
                  Include as much detail as possible: username, date/time, description of the violation, and any
                  evidence you have. We will investigate and take appropriate action.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
