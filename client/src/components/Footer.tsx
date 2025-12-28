import { Link } from "wouter";
import { Trophy, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: "/about", label: "About Us" },
    { href: "/how-to-play", label: "How To Play" },
    { href: "/fantasy-cricket", label: "Fantasy Cricket" },
    { href: "/responsible-gaming", label: "Responsible Gaming" },
  ];

  const legalLinks = [
    { href: "/terms", label: "Terms & Conditions" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/disclaimer", label: "Disclaimer & Compliances" },
    { href: "/fair-play", label: "Fair Play" },
  ];

  const supportLinks = [
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact Us" },
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-8 w-8 text-primary" />
              <div className="flex flex-col">
                <span className="text-lg font-bold text-foreground">SHAMSHABAD</span>
                <span className="text-xs text-muted-foreground -mt-1">Fantasy Cricket</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              India's Trusted Platform for Skill-Based Cricket Fun. Free to Play, 100% Legal & Transparent.
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <a className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {link.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <a className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {link.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Contact */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Support</h3>
            <ul className="space-y-2 mb-4">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <a className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {link.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="space-y-2">
              <a
                href="mailto:support@shamshabad.com"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4" />
                support@shamshabad.com
              </a>
              <a
                href="tel:+911234567890"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="h-4 w-4" />
                +91 123 456 7890
              </a>
            </div>
          </div>
        </div>

        {/* Company Information */}
        <div className="border-t border-border pt-8 mb-8">
          <h3 className="font-semibold text-foreground mb-4">Company Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <p className="font-medium text-foreground mb-2">Legal Name</p>
              <p>SHAMSHABAD-MD INDIA PRIVATE LIMITED</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-2">CIN</p>
              <p>U80301UP2020PTC129281</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-2">GST</p>
              <p>09ABDCS7462D1Z7</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-2">PAN</p>
              <p>ABDCS7462D</p>
            </div>
            <div className="md:col-span-2">
              <p className="font-medium text-foreground mb-2 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Registered Address
              </p>
              <p>
                C/O SHAMSHABAD CONVENT SCHOOL, 1st Floor, Sitaram Complex,
                <br />
                Naya Bansh Road, Shamshabad, Agra, Uttar Pradesh – 283125
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimers */}
        <div className="border-t border-border pt-8 space-y-4">
          <div className="bg-secondary/50 rounded-lg p-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Age Restriction:</strong> Users must be 18 years or older to
              participate. This platform is strictly for entertainment purposes only.
            </p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Geo-Restrictions:</strong> Users from Telangana, Andhra Pradesh,
              Assam, and Odisha are not allowed to participate as per Indian fantasy sports regulations.
            </p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Disclaimer:</strong> This is a Free-To-Play platform. We strictly
              follow Indian Rules and Fantasy Sports regulations. This is a game of skill and not gambling.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border pt-8 mt-8">
          <p className="text-center text-sm text-muted-foreground">
            © {currentYear} SHAMSHABAD-MD INDIA PRIVATE LIMITED. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
