import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Menu, X, LogOut, ChevronDown, Heart, UserCircle, LayoutDashboard, ShieldCheck, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Categories", href: "/categories" },
  { label: "About", href: "/about" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [headerQuery, setHeaderQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, isAdmin, isProvider, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);


  const initials = profile?.full_name
    ? profile.full_name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur-md transition-shadow",
        scrolled && "shadow-sm"
      )}
    >
      <div className="container-padded">
        <div className="flex h-14 items-center justify-between sm:h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary sm:h-9 sm:w-9">
              <span className="text-sm font-bold text-primary-foreground sm:text-lg">SL</span>
            </div>
            <span className="text-lg font-bold text-foreground sm:text-xl">
              ServiceLink
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href || (link.href !== "/" && location.pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "relative rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-1.5 md:flex">
            {/* Inline search */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (headerQuery.trim()) {
                  navigate(`/search?q=${encodeURIComponent(headerQuery.trim())}`);
                  setHeaderQuery("");
                }
              }}
              className="relative"
            >
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search services, companies, or categories..."
                value={headerQuery}
                onChange={(e) => setHeaderQuery(e.target.value)}
                className="h-8 w-56 rounded-md border-border bg-secondary/50 pl-8 pr-3 text-xs placeholder:text-muted-foreground focus-visible:ring-1 lg:w-72"
              />
            </form>
            <ThemeToggle />

            {user ? (
              <div className="flex items-center gap-2">

                {/* User avatar dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-1.5 px-1.5">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52">
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium text-foreground truncate">{profile?.full_name || "Account"}</p>
                      <p className="text-xs text-muted-foreground truncate">{profile?.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    {isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    {isProvider && !isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link to="/dashboard" className="flex items-center gap-2">
                          <LayoutDashboard className="h-4 w-4" />
                          Company Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center gap-2">
                        <UserCircle className="h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/saved" className="flex items-center gap-2">
                        <Heart className="h-4 w-4" />
                        Saved Services
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut} className="flex items-center gap-2">
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile right side */}
          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t bg-card md:hidden animate-slide-up">
          <div className="container-padded py-3">
            {/* User info banner if logged in */}
            {user && (
              <div className="mb-3 flex items-center gap-3 rounded-lg bg-secondary/50 p-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="text-xs bg-primary/10 text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{profile?.full_name || "Account"}</p>
                  <p className="text-xs text-muted-foreground truncate">{profile?.email}</p>
                </div>
              </div>
            )}

            {/* Mobile search */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (headerQuery.trim()) {
                  navigate(`/search?q=${encodeURIComponent(headerQuery.trim())}`);
                  setHeaderQuery("");
                  setIsMenuOpen(false);
                }
              }}
              className="relative mb-3"
            >
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search services, companies, or categories..."
                value={headerQuery}
                onChange={(e) => setHeaderQuery(e.target.value)}
                className="h-10 w-full rounded-lg border-border bg-secondary/50 pl-9 pr-3 text-sm placeholder:text-muted-foreground"
              />
            </form>

            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={cn(
                      "rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-secondary"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}

              <hr className="my-2 border-border" />

              {user ? (
                  <>
                   {isAdmin && (
                     <Link to="/admin" className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-foreground hover:bg-secondary">
                       <ShieldCheck className="h-4 w-4" />
                       Admin Dashboard
                     </Link>
                   )}
                   {isProvider && !isAdmin && (
                     <Link to="/dashboard" className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-foreground hover:bg-secondary">
                       <LayoutDashboard className="h-4 w-4" />
                       Company Dashboard
                     </Link>
                   )}
                   <Link to="/profile" className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-foreground hover:bg-secondary">
                     <UserCircle className="h-4 w-4" />
                     Profile
                   </Link>
                   <Link to="/saved" className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-foreground hover:bg-secondary">
                     <Heart className="h-4 w-4" />
                     Saved Services
                   </Link>
                   <Link to="/settings" className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-foreground hover:bg-secondary">
                     <Settings className="h-4 w-4" />
                     Settings
                   </Link>
                   <button
                     onClick={() => { signOut(); setIsMenuOpen(false); }}
                     className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-left text-sm font-medium text-destructive hover:bg-destructive/5"
                   >
                     <LogOut className="h-4 w-4" />
                     Sign Out
                   </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="rounded-lg px-4 py-2.5 text-sm font-medium text-foreground hover:bg-secondary">
                    Sign In
                  </Link>
                  <Link to="/register">
                    <Button className="mt-1 w-full">Get Started</Button>
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
