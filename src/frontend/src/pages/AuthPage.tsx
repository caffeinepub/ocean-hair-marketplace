import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { UserRole } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useCallerProfile, useCreateProfile } from "../hooks/useQueries";

export function AuthPage() {
  const navigate = useNavigate();
  const { login, identity, isLoggingIn } = useInternetIdentity();
  const { data: profile, isLoading: profileLoading } = useCallerProfile();
  const createProfile = useCreateProfile();
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [pendingRole, setPendingRole] = useState<UserRole | null>(null);

  useEffect(() => {
    if (identity && !profileLoading) {
      if (profile) {
        navigate({ to: "/home" });
      } else if (pendingRole) {
        setSelectedRole(pendingRole);
        setShowRoleModal(true);
      }
    }
  }, [identity, profile, profileLoading, navigate, pendingRole]);

  function handleSignup(role: UserRole) {
    setPendingRole(role);
    login();
  }

  function handleLogin() {
    setPendingRole(null);
    login();
  }

  async function handleCreateProfile() {
    if (!businessName.trim() || !selectedRole) return;
    await createProfile.mutateAsync({
      businessName: businessName.trim(),
      role: selectedRole,
      avatarUrl: "",
      createdAt: BigInt(Date.now()),
    });
    setShowRoleModal(false);
    navigate({ to: "/home" });
  }

  return (
    <div className="min-h-dvh bg-background flex flex-col">
      <div className="bg-navy px-6 pt-12 pb-10 rounded-b-3xl shadow-lg">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-3"
        >
          <img
            src="/assets/generated/ocean-hair-logo-transparent.dim_200x200.png"
            alt="Ocean Hair"
            className="w-16 h-16 object-contain"
          />
          <h1 className="font-display text-2xl font-bold text-white">
            OCEAN HAIR
          </h1>
          <p className="text-gold-light text-xs tracking-wide">
            Wholesale B2B Marketplace
          </p>
        </motion.div>
      </div>

      <div className="flex-1 px-6 py-8 flex flex-col gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-xl font-display font-bold text-foreground mb-1">
            Welcome to OCEAN HAIR
          </h2>
          <p className="text-muted-foreground text-sm">
            Join thousands of vendors and manufacturers
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-3"
        >
          <Button
            data-ocid="auth.vendor_signup_button"
            className="w-full h-12 bg-gold hover:bg-gold-dark text-navy font-semibold rounded-xl text-sm"
            onClick={() => handleSignup(UserRole.vendor)}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Sign Up as Vendor
          </Button>
          <Button
            data-ocid="auth.manufacturer_signup_button"
            variant="outline"
            className="w-full h-12 border-navy text-navy font-semibold rounded-xl text-sm hover:bg-navy hover:text-white"
            onClick={() => handleSignup(UserRole.manufacturer)}
            disabled={isLoggingIn}
          >
            Sign Up as Manufacturer
          </Button>
        </motion.div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-muted-foreground text-xs">
            Already have an account?
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col gap-4"
        >
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Email</Label>
            <Input
              type="email"
              placeholder="your@email.com"
              className="h-11 rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Password</Label>
            <Input
              type="password"
              placeholder="••••••••"
              className="h-11 rounded-xl"
            />
          </div>
          <Button
            data-ocid="auth.login_button"
            className="w-full h-12 bg-navy hover:bg-navy-light text-white font-semibold rounded-xl"
            onClick={handleLogin}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Log In
          </Button>
        </motion.div>
      </div>

      <Dialog open={showRoleModal} onOpenChange={setShowRoleModal}>
        <DialogContent
          data-ocid="auth.role_dialog"
          className="max-w-[340px] rounded-2xl"
        >
          <DialogHeader>
            <DialogTitle className="font-display">
              Set Up Your Business
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label>Business Name</Label>
              <Input
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Luxury Hair Co."
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Your Role</Label>
              <div className="flex gap-2">
                <button
                  type="button"
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
                    selectedRole === UserRole.vendor
                      ? "border-gold bg-gold/10 text-gold-dark"
                      : "border-border text-muted-foreground"
                  }`}
                  onClick={() => setSelectedRole(UserRole.vendor)}
                >
                  Vendor
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
                    selectedRole === UserRole.manufacturer
                      ? "border-navy bg-navy/10 text-navy"
                      : "border-border text-muted-foreground"
                  }`}
                  onClick={() => setSelectedRole(UserRole.manufacturer)}
                >
                  Manufacturer
                </button>
              </div>
            </div>
            <Button
              className="w-full bg-navy hover:bg-navy-light text-white rounded-xl h-11"
              onClick={handleCreateProfile}
              disabled={
                !businessName.trim() || !selectedRole || createProfile.isPending
              }
            >
              {createProfile.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Create Profile
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
