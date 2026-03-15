import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, Search, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import type { Product } from "../backend.d";
import { BottomNav } from "../components/BottomNav";
import { ProductCard } from "../components/ProductCard";
import { useActor } from "../hooks/useActor";
import {
  useCallerProfile,
  useGetAllProducts,
  useSearchProducts,
  useSeedData,
} from "../hooks/useQueries";

const FEATURED_MANUFACTURERS = [
  { name: "VietHair Premium", badge: "Verified", gradient: "cat-deep" },
  { name: "Silk & Shine Co.", badge: "Top Seller", gradient: "cat-body" },
  { name: "RawHair Factory", badge: "Verified", gradient: "cat-bone" },
  { name: "GloryWigs Ltd.", badge: "New", gradient: "cat-curly" },
];

export function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [seeded, setSeeded] = useState(false);
  const { data: allProducts, isLoading } = useGetAllProducts();
  const { data: searchResults } = useSearchProducts(searchTerm);
  const { data: profile } = useCallerProfile();
  const seedData = useSeedData();
  const { actor } = useActor();
  const doSeed = seedData.mutate;

  useEffect(() => {
    if (actor && !seeded) {
      setSeeded(true);
      doSeed();
    }
  }, [actor, seeded, doSeed]);

  const displayProducts: Product[] = searchTerm
    ? (searchResults ?? [])
    : (allProducts ?? []);

  return (
    <div className="app-shell pb-20">
      <div className="sticky top-0 z-40 bg-navy px-4 pt-10 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src="/assets/generated/ocean-hair-logo-transparent.dim_200x200.png"
            alt="Ocean Hair"
            className="w-8 h-8 object-contain"
          />
          <span className="font-display font-bold text-white text-lg tracking-wide">
            OCEAN HAIR
          </span>
        </div>
        <button type="button" className="relative p-2">
          <Bell size={22} className="text-white" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gold rounded-full" />
        </button>
      </div>

      <div className="px-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 mb-4"
        >
          <h2 className="text-xl font-display font-bold text-foreground">
            Hello, {profile?.businessName ?? "there"} 👋
          </h2>
          <p className="text-muted-foreground text-sm mt-0.5">
            Verified Suppliers &amp; Wholesale Deals
          </p>
        </motion.div>

        <div className="relative mb-5">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            data-ocid="home.search_input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search wigs, bundles, closures..."
            className="pl-9 h-11 rounded-xl bg-white border-border text-sm"
          />
        </div>

        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm text-foreground">
              Featured Manufacturers
            </h3>
            <span className="text-xs text-gold-dark font-medium cursor-pointer">
              See all
            </span>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
            {FEATURED_MANUFACTURERS.map((mfr, i) => (
              <motion.div
                key={mfr.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex-shrink-0 w-36"
              >
                <div
                  className={`${mfr.gradient} rounded-xl p-3 flex flex-col items-center gap-2`}
                >
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-white text-xl">🏭</span>
                  </div>
                  <p className="text-white text-xs font-semibold text-center leading-tight">
                    {mfr.name}
                  </p>
                  <span className="flex items-center gap-0.5 text-[10px] text-white/80">
                    <ShieldCheck size={10} className="text-gold-light" />{" "}
                    {mfr.badge}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm text-foreground">
              Trending Wigs &amp; Bundles
            </h3>
            <span className="text-xs text-gold-dark font-medium cursor-pointer">
              See all
            </span>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-xl overflow-hidden">
                  <Skeleton className="w-full aspect-square shimmer" />
                  <div className="p-2.5 space-y-1.5">
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : displayProducts.length === 0 ? (
            <div
              data-ocid="home.products.empty_state"
              className="text-center py-12 text-muted-foreground"
            >
              <p className="text-4xl mb-3">💇</p>
              <p className="text-sm">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {displayProducts.map((p, i) => (
                <ProductCard key={p.id.toString()} product={p} index={i + 1} />
              ))}
            </div>
          )}
        </section>
      </div>

      <BottomNav />
    </div>
  );
}
