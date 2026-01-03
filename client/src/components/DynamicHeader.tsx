import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "wouter";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut, User, Settings } from "lucide-react";
import { trpc } from "@/lib/trpc";

export function DynamicHeader() {
  const { user, isLoading } = useAuth();
  const [, navigate] = useRouter() as unknown as [string, (path: string) => void];
  const logout = trpc.auth.logout.useMutation({
    onSuccess: () => {
      navigate("/");
      window.location.reload();
    },
  });

  return (
    <header className="sticky top-0 z-50 bg-gray-950 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <img src="/logo.webp" alt="SHAMSHABAD" className="h-10 w-10" />
          <span className="text-xl font-bold text-white">SHAMSHABAD</span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="/" className="text-gray-300 hover:text-white transition">Home</a>
          <a href="/about" className="text-gray-300 hover:text-white transition">About</a>
          <a href="/how-to-play" className="text-gray-300 hover:text-white transition">How To Play</a>
          <a href="/fantasy" className="text-gray-300 hover:text-white transition">Fantasy</a>
          <a href="/faq" className="text-gray-300 hover:text-white transition">FAQ</a>
          <a href="/contact" className="text-gray-300 hover:text-white transition">Contact</a>
        </nav>

        {/* Auth Section */}
        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="h-10 w-24 bg-gray-800 rounded animate-pulse" />
          ) : user ? (
            // Authenticated User
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <User className="w-4 h-4" />
                  {user.name || "User"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                  <Settings className="w-4 h-4 mr-2" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => logout.mutate()}
                  className="text-red-500 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // Unauthenticated User
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => navigate("/login")}
                className="text-white border-gray-600 hover:bg-gray-900"
              >
                Login
              </Button>
              <Button
                onClick={() => navigate("/register")}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Register
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
