import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "@tanstack/react-router";
import {
  ChevronRight,
  CreditCard,
  Edit2,
  LogOut,
  MapPin,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { motion } from "motion/react";
import { UserRole } from "../backend.d";
import { BottomNav } from "../components/BottomNav";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useCallerProfile, useGetOrdersForVendor } from "../hooks/useQueries";

const MENU_ITEMS = [
  {
    icon: CreditCard,
    label: "Payment Methods",
    desc: "Manage your payment options",
  },
  {
    icon: MapPin,
    label: "Manage Address",
    desc: "Update shipping & billing address",
  },
  {
    icon: Settings,
    label: "Account Settings",
    desc: "Privacy, notifications and more",
  },
];

export function ProfilePage() {
  const navigate = useNavigate();
  const { identity, clear } = useInternetIdentity();
  const { data: profile, isLoading } = useCallerProfile();
  const principal = identity?.getPrincipal() ?? null;
  const { data: orders = [] } = useGetOrdersForVendor(principal);

  const initials = profile?.businessName
    ? profile.businessName
        .split(" ")
        .map((w: string) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "??";

  function handleLogout() {
    clear();
    navigate({ to: "/auth" });
  }

  return (
    <div className="app-shell pb-20">
      <div className="bg-navy px-4 pt-10 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-display font-bold text-xl text-white">Profile</h1>
          <Button
            data-ocid="profile.edit_button"
            size="sm"
            variant="ghost"
            className="text-white/80 hover:text-white hover:bg-white/10 rounded-xl"
            onClick={() => {}}
          >
            <Edit2 size={15} className="mr-1" /> Edit
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-4"
        >
          <div className="w-16 h-16 rounded-2xl bg-gold flex items-center justify-center shadow-lg">
            <span className="font-display font-bold text-navy text-xl">
              {initials}
            </span>
          </div>
          <div>
            {isLoading ? (
              <div className="space-y-1.5">
                <div className="h-4 w-32 bg-white/20 rounded shimmer" />
                <div className="h-3 w-20 bg-white/20 rounded shimmer" />
              </div>
            ) : (
              <>
                <p className="text-white font-bold text-lg leading-tight">
                  {profile?.businessName ?? "Guest User"}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <Badge className="bg-gold/20 text-gold-light border-0 text-[10px] px-2">
                    <ShieldCheck size={10} className="mr-0.5" />
                    {profile?.role === UserRole.manufacturer
                      ? "Manufacturer"
                      : "Vendor"}
                  </Badge>
                </div>
              </>
            )}
          </div>
        </motion.div>

        <div className="mt-5 grid grid-cols-3 gap-1">
          {[
            { label: "Orders", value: orders.length.toString() },
            { label: "Favorites", value: "12" },
            { label: "Reviews", value: "4.9 ★" },
          ].map(({ label, value }) => (
            <div key={label} className="text-center py-2">
              <p className="text-white font-bold text-lg">{value}</p>
              <p className="text-white/60 text-xs">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 space-y-2">
        {MENU_ITEMS.map(({ icon: Icon, label, desc }, i) => (
          <motion.button
            key={label}
            type="button"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="w-full flex items-center gap-3 p-4 bg-white rounded-xl shadow-xs hover:shadow-card transition-shadow"
          >
            <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
              <Icon size={17} className="text-navy" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-foreground">{label}</p>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
            <ChevronRight size={16} className="text-muted-foreground" />
          </motion.button>
        ))}

        <Separator className="my-3" />

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-4 bg-white rounded-xl shadow-xs hover:bg-red-50 transition-colors"
        >
          <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
            <LogOut size={17} className="text-destructive" />
          </div>
          <span className="text-sm font-semibold text-destructive">
            Log Out
          </span>
        </button>
      </div>

      <div className="text-center py-4 text-xs text-muted-foreground">
        © {new Date().getFullYear()}. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
          className="underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          caffeine.ai
        </a>
      </div>

      <BottomNav />
    </div>
  );
}
