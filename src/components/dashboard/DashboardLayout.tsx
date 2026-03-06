import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Package, MessageSquare, Building2, ChevronLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

const navItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: Package, label: "My Services", href: "/dashboard/services" },
  { icon: MessageSquare, label: "Inquiries", href: "/dashboard/inquiries" },
  { icon: Building2, label: "Company", href: "/dashboard/company" },
];

export function DashboardLayout({ children, title, description }: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur-md">
        <div className="container-padded flex h-14 items-center justify-between sm:h-16">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </button>
            <div className="h-5 w-px bg-border sm:h-6" />
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary sm:h-8 sm:w-8">
                <span className="text-[10px] font-bold text-primary-foreground sm:text-xs">SL</span>
              </div>
              <span className="text-sm font-semibold text-foreground sm:text-base">Dashboard</span>
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
            <div className="mt-3 hidden lg:block sm:mt-4">
              <Link to="/dashboard/services/add">
                <Button className="w-full gap-2" size="sm">
                  <Plus className="h-4 w-4" /> Add New Service
                </Button>
              </Link>
            </div>
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

      {/* Mobile FAB */}
      <Link
        to="/dashboard/services/add"
        className="fixed bottom-20 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg lg:hidden transition-transform active:scale-95"
      >
        <Plus className="h-5 w-5" />
      </Link>
    </div>
  );
}
