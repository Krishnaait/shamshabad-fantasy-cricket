import { useState } from "react";
import { Search, HelpCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          q: "What is SHAMSHABAD Fantasy Cricket?",
          a: "SHAMSHABAD is a 100% free-to-play fantasy cricket platform where you can create virtual teams of real cricket players and earn points based on their actual match performance. It's a skill-based game that tests your cricket knowledge and strategic thinking."
        },
        {
          q: "Is it really free? Are there any hidden charges?",
          a: "Yes, it's completely free! There are no entry fees, no hidden charges, and no in-app purchases. We don't ask for any payment information. SHAMSHABAD is purely for entertainment and skill development."
        },
        {
          q: "Who can play on SHAMSHABAD?",
          a: "Anyone who is 18 years or older and not residing in Telangana, Andhra Pradesh, Assam, or Odisha can play. These restrictions are in place to comply with Indian fantasy sports regulations."
        },
        {
          q: "How do I create an account?",
          a: "Click on 'Sign Up' button, provide your email, create a password, verify your age (18+), and confirm your location. You'll receive a verification email to activate your account."
        }
      ]
    },
    {
      category: "Gameplay",
      questions: [
        {
          q: "How do I create a fantasy team?",
          a: "Select a match from the upcoming matches list, then choose 11 players within the 100 credit budget. Your team must include 1-4 WKs, 3-6 Batsmen, 1-4 All-rounders, and 3-6 Bowlers. Finally, select a captain (2x points) and vice-captain (1.5x points)."
        },
        {
          q: "Can I edit my team after submitting?",
          a: "You can edit your team until the match starts. Once the match begins, no changes are allowed. Make sure to finalize your team before the deadline!"
        },
        {
          q: "How are points calculated?",
          a: "Points are awarded based on real match performance: runs scored, wickets taken, catches, stumpings, and more. Captain gets 2x points and vice-captain gets 1.5x points. Check our 'Fantasy Cricket' page for detailed scoring rules."
        },
        {
          q: "Can I create multiple teams for the same match?",
          a: "Yes, you can create multiple teams for the same match to try different strategies and player combinations."
        }
      ]
    },
    {
      category: "Rules & Scoring",
      questions: [
        {
          q: "What happens if a player doesn't play in the match?",
          a: "If a player in your team doesn't play in the actual match, they will score 0 points. Always check team announcements before the match starts."
        },
        {
          q: "How does the captain multiplier work?",
          a: "Your captain earns 2x points on all their actions (runs, wickets, catches, etc.). Vice-captain earns 1.5x points. Choose wisely as this significantly impacts your total score!"
        },
        {
          q: "Are there negative points?",
          a: "Yes, batsmen who get out for a duck (0 runs) receive -2 points. This is the only negative scoring in the system."
        },
        {
          q: "When are points updated?",
          a: "Points are updated in real-time as the match progresses. You can track your team's performance live during the match."
        }
      ]
    },
    {
      category: "Account & Security",
      questions: [
        {
          q: "How do I reset my password?",
          a: "Click on 'Forgot Password' on the login page. You'll need to provide your email and date of birth for verification. We'll send a password reset link to your registered email."
        },
        {
          q: "Can I have multiple accounts?",
          a: "No, multiple accounts are strictly prohibited and violate our Fair Play policy. Users found with multiple accounts will face penalties including permanent bans."
        },
        {
          q: "Is my personal information safe?",
          a: "Yes, we use industry-standard encryption and security measures to protect your data. We never share your personal information with third parties. Read our Privacy Policy for details."
        },
        {
          q: "How do I delete my account?",
          a: "Go to your Profile settings and select 'Delete Account'. Note that this action is permanent and cannot be undone. All your data will be removed from our systems."
        }
      ]
    },
    {
      category: "Compliance & Legal",
      questions: [
        {
          q: "Is fantasy cricket legal in India?",
          a: "Yes, fantasy cricket is legal in India as it's recognized as a game of skill, not gambling. However, some states have restrictions, which is why we block users from Telangana, Andhra Pradesh, Assam, and Odisha."
        },
        {
          q: "Why can't I play from certain states?",
          a: "Telangana, Andhra Pradesh, Assam, and Odisha have specific regulations that restrict fantasy sports. We comply with these state laws by blocking access from these regions."
        },
        {
          q: "Is this gambling?",
          a: "No, SHAMSHABAD is not gambling. It's a 100% free-to-play skill-based game with no money involved. There are no entry fees and no cash prizes. It's purely for entertainment."
        },
        {
          q: "Do I need to pay taxes on anything?",
          a: "Since there are no cash prizes or financial transactions on SHAMSHABAD, there are no tax implications. It's completely free entertainment."
        }
      ]
    },
    {
      category: "Technical Issues",
      questions: [
        {
          q: "The website is not loading properly. What should I do?",
          a: "Try clearing your browser cache, using a different browser, or checking your internet connection. If the problem persists, contact our support team at support@shamshabad.com."
        },
        {
          q: "My points are not updating. What's wrong?",
          a: "Points usually update within seconds of actual match events. If there's a delay, it might be due to API sync issues. Wait a few minutes and refresh. If the problem continues, report it to support."
        },
        {
          q: "I can't submit my team. What should I do?",
          a: "Ensure your team meets all requirements: exactly 11 players, within budget, correct role distribution, captain and vice-captain selected. If everything is correct and it still doesn't work, contact support."
        },
        {
          q: "Which browsers are supported?",
          a: "SHAMSHABAD works best on latest versions of Chrome, Firefox, Safari, and Edge. We also support mobile browsers on iOS and Android devices."
        }
      ]
    }
  ];

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      faq =>
        faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="py-16 px-4 bg-gradient-to-br from-primary/10 to-background">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <HelpCircle className="h-16 w-16 text-primary mx-auto" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">Frequently Asked Questions</h1>
              <p className="text-lg text-muted-foreground">
                Find answers to common questions about SHAMSHABAD Fantasy Cricket
              </p>
            </div>
          </div>
        </section>

        {/* Search */}
        <section className="py-8 px-4">
          <div className="container max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-8 px-4 pb-16">
          <div className="container max-w-4xl">
            {filteredFaqs.length > 0 ? (
              <div className="space-y-8">
                {filteredFaqs.map((category, idx) => (
                  <div key={idx}>
                    <h2 className="text-2xl font-bold text-foreground mb-4">{category.category}</h2>
                    <Accordion type="single" collapsible className="space-y-4">
                      {category.questions.map((faq, index) => (
                        <AccordionItem
                          key={index}
                          value={`${idx}-${index}`}
                          className="border border-border rounded-lg px-6"
                        >
                          <AccordionTrigger className="text-left text-foreground hover:text-primary">
                            {faq.q}
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground pt-2">
                            {faq.a}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                ))}
              </div>
            ) : (
              <Card className="border-border">
                <CardContent className="p-12 text-center">
                  <HelpCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No results found</h3>
                  <p className="text-muted-foreground">
                    Try different keywords or browse all categories above
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Still Need Help */}
        <section className="py-16 px-4 bg-secondary/30">
          <div className="container max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Still Need Help?</h2>
            <p className="text-muted-foreground mb-6">
              Can't find the answer you're looking for? Our support team is here to help!
            </p>
            <a href="/contact">
              <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                Contact Support
              </button>
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
