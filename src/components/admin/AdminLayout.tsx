import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Package, Folder, Building2, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

const navItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/admin" },
  { icon: Package, label: "Services", href: "/admin/services" },
  { icon: Folder, label: "Categories", href: "/admin/categories" },
  { icon: Building2, label: "Companies", href: "/admin/companies" },
];

export function AdminLayout({ children, title, description }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur-md">
        <div className="container-padded flex h-14 items-center justify-between sm:h-16">
          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </Link>
            <div className="h-5 w-px bg-border sm:h-6" />
            <Link to="/admin" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-destructive sm:h-8 sm:w-8">
                <span className="text-[10px] font-bold text-destructive-foreground sm:text-xs">SL</span>
              </div>
              <span className="text-sm font-semibold text-foreground sm:text-base">Admin</span>
            </Link>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="hidden text-sm text-muted-foreground lg:inline max-w-[150px] truncate">
              {profile?.full_name || profile?.email}
            </span>
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={signOut} className="text-xs sm:text-sm">
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container-padded py-4 sm:py-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
          {/* Sidebar */}
          <aside className="lg:w-56 xl:w-64">
            <nav className="flex flex-row gap-1.5 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors whitespace-nowrap sm:px-4 sm:py-3",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Main */}
          <main className="min-w-0 flex-1">
            <div className="mb-4 sm:mb-6">
              <h1 className="text-xl font-bold text-foreground sm:text-2xl">{title}</h1>
              {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
            </div>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
