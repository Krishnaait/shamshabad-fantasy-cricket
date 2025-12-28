import { AlertTriangle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Disclaimer() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20">
        <section className="py-16 px-4 bg-gradient-to-br from-primary/10 to-background">
          <div className="container max-w-3xl text-center space-y-4">
            <AlertTriangle className="h-16 w-16 text-primary mx-auto" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">Disclaimer & Compliances</h1>
            <p className="text-lg text-muted-foreground">Last Updated: December 28, 2025</p>
          </div>
        </section>
        <section className="py-16 px-4">
          <div className="container max-w-4xl prose prose-lg max-w-none">
            <div className="space-y-8 text-muted-foreground">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">General Disclaimer</h2>
                <p>SHAMSHABAD Fantasy Cricket is a free-to-play, skill-based entertainment platform. It is not gambling, betting, or a game of chance. No real money is involved in any aspect of gameplay.</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Legal Compliance</h2>
                <p>SHAMSHABAD-MD INDIA PRIVATE LIMITED operates in full compliance with Indian laws and regulations regarding fantasy sports. We adhere to all applicable central and state legislation.</p>
                <p className="mt-4"><strong className="text-foreground">Company Details:</strong><br/>
                Legal Name: SHAMSHABAD-MD INDIA PRIVATE LIMITED<br/>
                CIN: U80301UP2020PTC129281<br/>
                GST: 09ABDCS7462D1Z7<br/>
                PAN: ABDCS7462D<br/>
                Registered Address: C/O SHAMSHABAD CONVENT SCHOOL, 1st Floor, Sitaram Complex, Naya Bansh Road, Shamshabad, Agra, Uttar Pradesh – 283125</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Age Restriction</h2>
                <p>This platform is strictly for users 18 years of age or older. We implement age verification during registration and reserve the right to request additional proof of age at any time.</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Geographic Restrictions</h2>
                <p>Users from the following states are prohibited from using this platform as per state-specific regulations: Telangana, Andhra Pradesh, Assam, and Odisha. We use IP-based geo-location to enforce these restrictions.</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Game of Skill</h2>
                <p>Fantasy cricket on SHAMSHABAD is recognized as a game of skill under Indian law. Success depends on cricket knowledge, statistical analysis, strategic thinking, and team management abilities - not luck or chance.</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">No Financial Transactions</h2>
                <p>SHAMSHABAD does not involve any monetary deposits, entry fees, or cash prizes. There are no financial transactions of any kind. Users cannot win or lose money on this platform.</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Data Accuracy</h2>
                <p>We source cricket data from official APIs and strive for accuracy. However, we do not guarantee 100% accuracy of real-time data. In case of data discrepancies, official cricket board records shall be considered final.</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Platform Availability</h2>
                <p>We strive to maintain 24/7 platform availability but do not guarantee uninterrupted service. We may suspend services for maintenance, updates, or due to circumstances beyond our control.</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Third-Party Content</h2>
                <p>Our platform may contain links to third-party websites or services. We are not responsible for the content, privacy practices, or availability of these external sites.</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Responsible Gaming</h2>
                <p>We promote responsible gaming practices. Users should play for entertainment only and maintain a healthy balance with other life activities. We provide self-exclusion tools and support resources.</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Dispute Resolution</h2>
                <p>Any disputes arising from use of this platform shall be resolved through arbitration in Agra, Uttar Pradesh, in accordance with Indian Arbitration and Conciliation Act, 1996.</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Regulatory Compliance</h2>
                <p>We comply with: Information Technology Act, 2000; Consumer Protection Act, 2019; Indian Contract Act, 1872; and all applicable fantasy sports regulations and guidelines issued by relevant authorities.</p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Contact for Compliance</h2>
                <p>For compliance-related queries, contact: compliance@shamshabad.com</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
