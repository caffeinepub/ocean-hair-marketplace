import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import type { Product } from "../backend.d";
import {
  formatPrice,
  getCategoryGradientClass,
  getCategoryImage,
} from "../utils/productHelpers";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 1 }: ProductCardProps) {
  const gradientClass = getCategoryGradientClass(product.category);
  const fallbackImage = getCategoryImage(product.category);
  const imageUrl = product.imageUrl || fallbackImage;

  return (
    <Link
      to="/product/$id"
      params={{ id: product.id.toString() }}
      data-ocid={`home.product.item.${index}`}
      className="block"
    >
      <div className="bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-200 hover:-translate-y-0.5">
        <div className="relative w-full aspect-square">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div
              className={`w-full h-full ${gradientClass} flex items-center justify-center`}
            >
              <span className="text-white/70 text-4xl">💇</span>
            </div>
          )}
          <Badge className="absolute top-2 left-2 bg-white/90 text-navy text-[10px] px-1.5 py-0.5 shadow-sm">
            MOQ {Number(product.moq)}
          </Badge>
        </div>
        <div className="p-2.5">
          <p className="text-xs font-semibold text-foreground truncate leading-tight">
            {product.name}
          </p>
          <p className="text-gold-dark font-bold text-sm mt-0.5">
            From {formatPrice(product.priceFromCents)}
          </p>
        </div>
      </div>
    </Link>
  );
}
