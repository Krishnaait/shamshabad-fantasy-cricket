import { FileText } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20">
        <section className="py-16 px-4 bg-gradient-to-br from-primary/10 to-background">
          <div className="container max-w-3xl text-center space-y-4">
            <FileText className="h-16 w-16 text-primary mx-auto" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">Terms & Conditions</h1>
            <p className="text-lg text-muted-foreground">Last Updated: December 28, 2025</p>
          </div>
        </section>
        <section className="py-16 px-4">
          <div className="container max-w-4xl prose prose-lg max-w-none">
            <div className="space-y-8 text-muted-foreground">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
                <p>By accessing and using SHAMSHABAD Fantasy Cricket platform, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">2. Eligibility</h2>
                <p>You must be at least 18 years old to use this platform. You must not be a resident of Telangana, Andhra Pradesh, Assam, or Odisha. By registering, you confirm that you meet these eligibility criteria.</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">3. Account Registration</h2>
                <p>You must provide accurate, current, and complete information during registration. You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account.</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">4. User Conduct</h2>
                <p>You agree not to: create multiple accounts, use automated bots or scripts, engage in cheating or manipulation, share your account with others, or violate any applicable laws or regulations.</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">5. Free-To-Play Model</h2>
                <p>SHAMSHABAD is a 100% free-to-play platform. There are no entry fees, no cash prizes, and no financial transactions involved in gameplay. This platform is for entertainment purposes only.</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">6. Intellectual Property</h2>
                <p>All content, features, and functionality on this platform are owned by SHAMSHABAD-MD INDIA PRIVATE LIMITED and are protected by copyright, trademark, and other intellectual property laws.</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">7. Termination</h2>
                <p>We reserve the right to suspend or terminate your account at any time for violations of these terms or for any other reason at our sole discretion.</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">8. Limitation of Liability</h2>
                <p>SHAMSHABAD shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the platform.</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">9. Changes to Terms</h2>
                <p>We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the modified terms.</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">10. Governing Law</h2>
                <p>These terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Agra, Uttar Pradesh.</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Contact Information</h2>
                <p>For questions about these Terms & Conditions, contact us at: legal@shamshabad.com</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
