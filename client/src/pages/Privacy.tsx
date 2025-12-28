import { Shield } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20">
        <section className="py-16 px-4 bg-gradient-to-br from-primary/10 to-background">
          <div className="container max-w-3xl text-center space-y-4">
            <Shield className="h-16 w-16 text-primary mx-auto" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">Privacy Policy</h1>
            <p className="text-lg text-muted-foreground">Last Updated: December 28, 2025</p>
          </div>
        </section>
        <section className="py-16 px-4">
          <div className="container max-w-4xl prose prose-lg max-w-none">
            <div className="space-y-8 text-muted-foreground">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">1. Information We Collect</h2>
                <p>We collect information you provide directly: name, email address, date of birth, and location data for compliance purposes. We also collect usage data: IP address, browser type, device information, and gameplay activity.</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">2. How We Use Your Information</h2>
                <p>We use your information to: provide and maintain our services, verify age and location for compliance, communicate with you about updates and support, improve our platform and user experience, and detect and prevent fraud or abuse.</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">3. Data Sharing</h2>
                <p>We do not sell your personal information to third parties. We may share data with: service providers who assist in platform operations, law enforcement when required by law, and business partners only with your explicit consent.</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">4. Data Security</h2>
                <p>We implement industry-standard security measures to protect your data, including encryption, secure servers, regular security audits, and access controls. However, no method of transmission over the internet is 100% secure.</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">5. Your Rights</h2>
                <p>You have the right to: access your personal data, request correction of inaccurate data, request deletion of your account and data, opt-out of marketing communications, and withdraw consent at any time.</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">6. Cookies and Tracking</h2>
                <p>We use cookies and similar technologies to enhance user experience, remember preferences, analyze usage patterns, and maintain session security. You can control cookie settings through your browser.</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">7. Children's Privacy</h2>
                <p>Our platform is not intended for users under 18 years of age. We do not knowingly collect personal information from minors. If we discover such data, we will delete it immediately.</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">8. Data Retention</h2>
                <p>We retain your personal data for as long as your account is active or as needed to provide services. After account deletion, we may retain certain data for legal compliance and fraud prevention purposes.</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">9. Changes to Privacy Policy</h2>
                <p>We may update this Privacy Policy from time to time. We will notify you of significant changes via email or platform notification. Continued use after changes constitutes acceptance.</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Contact Information</h2>
                <p>For privacy-related questions or requests, contact us at: privacy@shamshabad.com</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
