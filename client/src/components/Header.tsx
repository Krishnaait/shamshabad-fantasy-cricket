import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Trophy, User, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface HeaderProps {
  isAuthenticated?: boolean;
  user?: { name?: string | null; email?: string | null };
  onLogout?: () => void;
}

export default function Header({ isAuthenticated = false, user, onLogout }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/how-to-play", label: "How To Play" },
    { href: "/fantasy-cricket", label: "Fantasy" },
    { href: "/responsible-gaming", label: "Responsible Gaming" },
    { href: "/fair-play", label: "Fair Play" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact" },
  ];

  const isActive = (href: string) => location === href;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur-md shadow-lg" : "bg-background shadow-sm"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-18 lg:h-20">
          {/* Logo - Responsive sizing */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img 
              src="/logo.webp" 
              alt="SHAMSHABAD Fantasy Cricket" 
              className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 object-contain flex-shrink-0" 
            />
            <div className="flex flex-col">
              <span className="text-base sm:text-lg md:text-xl font-bold text-foreground leading-tight">
                SHAMSHABAD
              </span>
              <span className="text-[10px] sm:text-xs text-muted-foreground -mt-0.5">
                Fantasy Cricket
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Hidden on mobile/tablet */}
          <nav className="hidden xl:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`px-2.5 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap ${
                  isActive(link.href)
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <User className="h-3.5 w-3.5" />
                    <span className="max-w-[100px] lg:max-w-[150px] truncate">
                      {user.name || user.email?.split("@")[0] || "User"}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center w-full cursor-pointer">
                      <Trophy className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center w-full cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout} className="text-destructive cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/login">
                    Login
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/register">
                    Sign Up
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button - Using Sheet for better mobile UX */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild className="md:hidden xl:hidden">
              <Button
                variant="ghost"
                size="sm"
                className="p-2 h-auto"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[350px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Trophy className="h-6 w-6 text-primary" />
                  <span>Menu</span>
                </SheetTitle>
              </SheetHeader>

              {/* Mobile Navigation */}
              <nav className="flex flex-col gap-1 mt-6">
                {navLinks.map((link) => (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    className={`px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive(link.href)
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Mobile Auth Section */}
              <div className="mt-6 pt-6 border-t border-border flex flex-col gap-2">
                {isAuthenticated && user ? (
                  <>
                    <div className="px-4 py-2 mb-2">
                      <p className="text-sm font-medium text-foreground">
                        {user.name || "User"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                    <Button variant="outline" className="w-full justify-start gap-2" asChild>
                      <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                        <Trophy className="h-4 w-4" />
                        Dashboard
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2" asChild>
                      <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
                        <User className="h-4 w-4" />
                        Profile
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                      onClick={() => {
                        onLogout?.();
                        setIsMenuOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                        Login
                      </Link>
                    </Button>
                    <Button className="w-full" asChild>
                      <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                        Sign Up
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>

          {/* Tablet Navigation Button (for screens between md and xl) */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild className="hidden md:flex xl:hidden">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1"
                aria-label="Toggle menu"
              >
                <Menu className="h-4 w-4" />
                <span className="text-sm">Menu</span>
              </Button>
            </SheetTrigger>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
