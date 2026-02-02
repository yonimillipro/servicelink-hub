import { Link, useLocation } from "react-router-dom";
import { Home, Grid3X3, Search, User, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

export function BottomNav() {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Grid3X3, label: "Categories", href: "/categories" },
    { icon: Plus, label: "Post", href: user ? "/dashboard/services/add" : "/login", isMain: true },
    { icon: Search, label: "Search", href: "/services" },
    { icon: User, label: "Account", href: user ? "/dashboard" : "/login" },
  ];

  return (
    <nav className="bottom-nav md:hidden">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;

          if (item.isMain) {
            return (
              <Link
                key={item.href}
                to={item.href}
                className="flex -mt-4"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                  <item.icon className="h-6 w-6" />
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn("bottom-nav-item", isActive && "active")}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
