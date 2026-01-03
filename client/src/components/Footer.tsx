import { Link } from "wouter";
import { Trophy, Mail, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

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
      <div className="container mx-auto px-4 py-8 sm:py-10 md:py-12">
        {/* Main Footer Grid - Responsive columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Brand Section */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2">
              <img src="/logo.webp" alt="SHAMSHABAD" className="h-10 w-10 sm:h-12 sm:w-12 object-contain flex-shrink-0" />
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-bold text-foreground">SHAMSHABAD</span>
                <span className="text-[10px] sm:text-xs text-muted-foreground -mt-1">Fantasy Cricket</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              India's Trusted Platform for Skill-Based Cricket Fun. Free to Play, 100% Legal & Transparent.
            </p>
            {/* Social Media Icons - Responsive sizing */}
            <div className="flex gap-2 sm:gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 sm:p-2 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 sm:p-2 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 sm:p-2 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 sm:p-2 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-sm sm:text-base text-foreground mb-3 sm:mb-4">Quick Links</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-sm sm:text-base text-foreground mb-3 sm:mb-4">Legal</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Contact */}
          <div>
            <h3 className="font-semibold text-sm sm:text-base text-foreground mb-3 sm:mb-4">Support</h3>
            <ul className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="space-y-2">
              <a
                href="mailto:support@shamshabad.com"
                className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="break-all">support@shamshabad.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Company Information - Responsive grid */}
        <div className="border-t border-border pt-6 sm:pt-8 mb-6 sm:mb-8">
          <h3 className="font-semibold text-sm sm:text-base text-foreground mb-3 sm:mb-4">Company Information</h3>
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
            <div>
              <p className="font-medium text-foreground mb-1 sm:mb-2">Legal Name</p>
              <p className="break-words">SHAMSHABAD-MD INDIA PRIVATE LIMITED</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1 sm:mb-2">CIN</p>
              <p className="break-all">U80301UP2020PTC129281</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1 sm:mb-2">GST</p>
              <p className="break-all">09ABDCS7462D1Z7</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1 sm:mb-2">PAN</p>
              <p className="break-all">ABDCS7462D</p>
            </div>
            <div className="xs:col-span-2 md:col-span-2 lg:col-span-4">
              <p className="font-medium text-foreground mb-1 sm:mb-2 flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                Registered Address
              </p>
              <p className="leading-relaxed">
                C/O SHAMSHABAD CONVENT SCHOOL, 1st Floor, Sitaram Complex,
                Naya Bansh Road, Shamshabad, Agra, Uttar Pradesh – 283125
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimers - Responsive spacing */}
        <div className="border-t border-border pt-6 sm:pt-8 space-y-3 sm:space-y-4">
          <div className="bg-secondary/50 rounded-lg p-3 sm:p-4">
            <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Age Restriction:</strong> Users must be 18 years or older to
              participate. This platform is strictly for entertainment purposes only.
            </p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-3 sm:p-4">
            <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Geo-Restrictions:</strong> Users from Telangana, Andhra Pradesh,
              Assam, and Odisha are not allowed to participate as per Indian fantasy sports regulations.
            </p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-3 sm:p-4">
            <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Disclaimer:</strong> This is a Free-To-Play platform. We strictly
              follow Indian Rules and Fantasy Sports regulations. This is a game of skill and not gambling.
            </p>
          </div>
        </div>

        {/* Copyright - Responsive text */}
        <div className="border-t border-border pt-6 sm:pt-8 mt-6 sm:mt-8">
          <p className="text-center text-[10px] sm:text-xs md:text-sm text-muted-foreground">
            © {currentYear} SHAMSHABAD-MD INDIA PRIVATE LIMITED. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
