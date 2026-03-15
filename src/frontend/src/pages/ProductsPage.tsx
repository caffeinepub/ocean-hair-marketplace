import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "motion/react";
import { useState } from "react";
import { ProductCategory } from "../backend.d";
import { BottomNav } from "../components/BottomNav";
import { ProductCard } from "../components/ProductCard";
import {
  useGetAllProducts,
  useGetProductsByCategory,
} from "../hooks/useQueries";

const CATEGORIES: Array<{ key: ProductCategory | null; label: string }> = [
  { key: null, label: "All" },
  { key: ProductCategory.curlyWig, label: "Curly Wigs" },
  { key: ProductCategory.blondeWig, label: "Blonde Wigs" },
  { key: ProductCategory.boneStraight, label: "Bone Straight" },
  { key: ProductCategory.bodyWave, label: "Body Wave" },
  { key: ProductCategory.deepWave, label: "Deep Wave" },
  { key: ProductCategory.frontalWig, label: "Frontal Wigs" },
  { key: ProductCategory.bundle20Inch, label: "Bundles" },
  { key: ProductCategory.closureWig, label: "Closures" },
];

export function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState<ProductCategory | null>(
    null,
  );
  const { data: allProducts, isLoading: loadingAll } = useGetAllProducts();
  const { data: categoryProducts, isLoading: loadingCat } =
    useGetProductsByCategory(activeCategory);

  const products = activeCategory
    ? (categoryProducts ?? [])
    : (allProducts ?? []);
  const isLoading = activeCategory ? loadingCat : loadingAll;

  return (
    <div className="app-shell pb-20">
      <div className="sticky top-0 z-40 bg-navy px-4 pt-10 pb-4">
        <h1 className="font-display font-bold text-xl text-white">Products</h1>
      </div>

      <div className="px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
        {CATEGORIES.map(({ key, label }) => (
          <button
            key={label}
            type="button"
            data-ocid="products.filter.tab"
            onClick={() => setActiveCategory(key)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
              activeCategory === key
                ? "bg-navy text-white border-navy"
                : "bg-white text-foreground border-border hover:border-navy"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="px-4">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-xl overflow-hidden">
                <Skeleton className="w-full aspect-square shimmer" />
                <div className="p-2.5 space-y-1.5">
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div
            data-ocid="products.empty_state"
            className="text-center py-16 text-muted-foreground"
          >
            <p className="text-5xl mb-4">📦</p>
            <p className="font-medium">No products in this category</p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-2 gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {products.map((p, i) => (
              <ProductCard key={p.id.toString()} product={p} index={i + 1} />
            ))}
          </motion.div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
