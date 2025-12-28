import { Target, Eye, Heart, Shield, Users, TrendingUp, CheckCircle2, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AboutUs() {
  const pillars = [
    {
      icon: Shield,
      title: "Integrity",
      description: "We maintain the highest standards of honesty and transparency in all our operations.",
    },
    {
      icon: Users,
      title: "Community",
      description: "Building a strong community of cricket enthusiasts who share the passion for the game.",
    },
    {
      icon: TrendingUp,
      title: "Innovation",
      description: "Constantly improving our platform with latest technology and user feedback.",
    },
    {
      icon: Heart,
      title: "Responsibility",
      description: "Promoting responsible gaming and ensuring a safe environment for all users.",
    },
  ];

  const differentiators = [
    "100% Free-To-Play model with no hidden charges",
    "Real-time data from official cricket APIs",
    "Transparent scoring system with detailed breakdowns",
    "Strict compliance with Indian fantasy sports regulations",
    "Age verification and geo-restriction enforcement",
    "24/7 customer support for all users",
    "Regular platform updates and improvements",
    "Fair play guarantee with anti-cheating measures",
  ];

  const learnings = [
    "Cricket strategy and team composition",
    "Player performance analysis and statistics",
    "Match situation assessment and decision making",
    "Budget management and resource allocation",
    "Risk management and strategic planning",
    "Real-time data interpretation and analysis",
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="py-16 px-4 bg-gradient-to-br from-primary/10 to-background">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">About SHAMSHABAD</h1>
              <p className="text-lg text-muted-foreground">
                India's Most Trusted Free-To-Play Fantasy Cricket Platform
              </p>
            </div>
          </div>
        </section>

        {/* Who We Are */}
        <section className="py-16 px-4">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <Users className="h-8 w-8 text-primary" />
                <h2 className="text-3xl font-bold text-foreground">Who We Are</h2>
              </div>
              <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
                <p>
                  SHAMSHABAD is a pioneering fantasy cricket platform operated by SHAMSHABAD-MD INDIA PRIVATE LIMITED,
                  dedicated to providing cricket enthusiasts across India with a completely free, legal, and
                  entertaining way to engage with their favorite sport.
                </p>
                <p>
                  Founded with the vision of making fantasy cricket accessible to everyone, we have built a platform
                  that combines cutting-edge technology with a deep understanding of cricket and Indian regulations. Our
                  platform is designed to be a safe space where cricket fans can test their knowledge, build dream
                  teams, and compete with fellow enthusiasts without any financial barriers.
                </p>
                <p>
                  We are committed to maintaining the highest standards of integrity, transparency, and responsible
                  gaming. Our team works tirelessly to ensure that every user has a fair, enjoyable, and educational
                  experience on our platform.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 px-4 bg-secondary/30">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              <Card className="border-border">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Target className="h-8 w-8 text-primary" />
                    <h2 className="text-2xl font-bold text-foreground">Our Mission</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    To democratize fantasy cricket in India by providing a completely free, legal, and transparent
                    platform that allows cricket fans to showcase their knowledge and strategic thinking. We aim to
                    create an inclusive community where skill and passion for cricket are the only requirements for
                    participation.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Eye className="h-8 w-8 text-primary" />
                    <h2 className="text-2xl font-bold text-foreground">Our Vision</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    To become India's most trusted and loved fantasy cricket platform, recognized for our commitment to
                    fair play, user safety, and community building. We envision a future where millions of cricket fans
                    can enjoy fantasy cricket as a skill-based entertainment activity that enhances their love for the
                    game.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Our Pillars */}
        <section className="py-16 px-4">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Our Core Pillars</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                The fundamental values that guide everything we do at SHAMSHABAD.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pillars.map((pillar, index) => {
                const Icon = pillar.icon;
                return (
                  <Card key={index} className="border-border hover:border-primary transition-all">
                    <CardContent className="p-6 text-center">
                      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">{pillar.title}</h3>
                      <p className="text-muted-foreground text-sm">{pillar.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Do's and Don'ts */}
        <section className="py-16 px-4 bg-secondary/30">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Do's and Don'ts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="border-border">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-primary mb-4 flex items-center gap-2">
                      <CheckCircle2 className="h-6 w-6" />
                      Do's
                    </h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        Play responsibly and for entertainment only
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        Verify your age (18+) during registration
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        Read and understand the rules before playing
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        Report any suspicious activity immediately
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        Keep your account credentials secure
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        Respect other players and maintain fair play
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="border-border">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-destructive mb-4 flex items-center gap-2">
                      <Shield className="h-6 w-6" />
                      Don'ts
                    </h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-destructive mt-0.5 flex-shrink-0">✗</span>
                        Don't share your account with others
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-destructive mt-0.5 flex-shrink-0">✗</span>
                        Don't use automated bots or scripts
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-destructive mt-0.5 flex-shrink-0">✗</span>
                        Don't create multiple accounts
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-destructive mt-0.5 flex-shrink-0">✗</span>
                        Don't manipulate or exploit the system
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-destructive mt-0.5 flex-shrink-0">✗</span>
                        Don't participate if you're under 18
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-destructive mt-0.5 flex-shrink-0">✗</span>
                        Don't access from restricted states
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* What Makes Us Different */}
        <section className="py-16 px-4">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <Award className="h-8 w-8 text-primary" />
                <h2 className="text-3xl font-bold text-foreground">What Makes Us Different?</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {differentiators.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-secondary/30 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* What You'll Learn */}
        <section className="py-16 px-4 bg-secondary/30">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground mb-4 text-center">What You'll Learn With Us</h2>
              <p className="text-lg text-muted-foreground text-center mb-8">
                Playing fantasy cricket on SHAMSHABAD helps you develop valuable skills and knowledge.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {learnings.map((learning, index) => (
                  <Card key={index} className="border-border">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{learning}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Company Information */}
        <section className="py-16 px-4">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Company Information</h2>
              <Card className="border-border">
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Legal Name</h3>
                      <p className="text-muted-foreground">SHAMSHABAD-MD INDIA PRIVATE LIMITED</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">CIN</h3>
                      <p className="text-muted-foreground">U80301UP2020PTC129281</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">GST Number</h3>
                      <p className="text-muted-foreground">09ABDCS7462D1Z7</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">PAN</h3>
                      <p className="text-muted-foreground">ABDCS7462D</p>
                    </div>
                    <div className="md:col-span-2">
                      <h3 className="font-semibold text-foreground mb-2">Registered Address</h3>
                      <p className="text-muted-foreground">
                        C/O SHAMSHABAD CONVENT SCHOOL, 1st Floor, Sitaram Complex,
                        <br />
                        Naya Bansh Road, Shamshabad, Agra, Uttar Pradesh – 283125
                      </p>
                    </div>
                  </div>
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
