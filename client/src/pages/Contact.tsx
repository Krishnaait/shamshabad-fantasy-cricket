import { useState } from "react";
import { Mail, MapPin, Send, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success("Message sent successfully! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "support@shamshabad.com",
      link: "mailto:support@shamshabad.com",
    },
    {
      icon: MapPin,
      title: "Address",
      value: "C/O SHAMSHABAD CONVENT SCHOOL, 1st Floor, Sitaram Complex, Naya Bansh Road, Shamshabad, Agra, UP – 283125",
      link: null,
    },
  ];

  const supportCategories = [
    { title: "Technical Support", description: "Issues with website, login, or gameplay" },
    { title: "Account Help", description: "Password reset, account deletion, or profile issues" },
    { title: "Fair Play Concerns", description: "Report violations or suspicious activity" },
    { title: "General Inquiries", description: "Questions about rules, features, or policies" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="py-16 px-4 bg-gradient-to-br from-primary/10 to-background">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <Mail className="h-16 w-16 text-primary mx-auto" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">Contact Us</h1>
              <p className="text-lg text-muted-foreground">
                Have questions? We're here to help! Reach out to our support team.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <section className="py-16 px-4">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <Card key={index} className="border-border">
                    <CardContent className="p-6 text-center">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">{info.title}</h3>
                      {info.link ? (
                        <a
                          href={info.link}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-sm text-muted-foreground">{info.value}</p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Support Categories */}
        <section className="py-16 px-4 bg-secondary/30">
          <div className="container max-w-4xl">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">How Can We Help?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {supportCategories.map((category, index) => (
                <Card key={index} className="border-border">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-2">{category.title}</h3>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-16 px-4">
          <div className="container max-w-2xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">Send Us a Message</h2>
              <p className="text-muted-foreground">
                Fill out the form below and we'll get back to you within 24 hours
              </p>
            </div>
            <Card className="border-border">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                      Full Name *
                    </label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      Email Address *
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                      Subject *
                    </label>
                    <Input
                      id="subject"
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="What is this regarding?"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us more about your question or concern..."
                      rows={6}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>Sending...</>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Response Time */}
        <section className="py-16 px-4 bg-secondary/30">
          <div className="container max-w-4xl">
            <Card className="border-border">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Our Response Time</h3>
                    <p className="text-muted-foreground mb-4">
                      We strive to respond to all inquiries within 24 hours during business days. For urgent matters,
                      please mark your subject line with "URGENT" and we'll prioritize your request.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">Business Hours:</strong> Monday to Saturday, 9:00 AM - 6:00
                      PM IST
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
