import { Link, useLocation } from "@tanstack/react-router";
import { Home, MessageCircle, Package, ShoppingBag, User } from "lucide-react";

const navItems = [
  { to: "/home", label: "Home", icon: Home, ocid: "nav.home_link" },
  {
    to: "/products",
    label: "Products",
    icon: Package,
    ocid: "nav.products_link",
  },
  {
    to: "/orders",
    label: "Orders",
    icon: ShoppingBag,
    ocid: "nav.orders_link",
  },
  { to: "/chat", label: "Chat", icon: MessageCircle, ocid: "nav.chat_link" },
  { to: "/profile", label: "Profile", icon: User, ocid: "nav.profile_link" },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="bottom-nav fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-border z-50">
      <div className="flex items-center justify-around h-16">
        {navItems.map(({ to, label, icon: Icon, ocid }) => {
          const active =
            location.pathname === to || location.pathname.startsWith(`${to}/`);
          return (
            <Link
              key={to}
              to={to}
              data-ocid={ocid}
              className="flex flex-col items-center gap-0.5 px-3 py-2 min-w-0 flex-1"
            >
              <Icon
                size={22}
                className={active ? "text-navy" : "text-muted-foreground"}
                strokeWidth={active ? 2.5 : 1.8}
              />
              <span
                className={`text-[10px] font-medium ${active ? "text-navy" : "text-muted-foreground"}`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
