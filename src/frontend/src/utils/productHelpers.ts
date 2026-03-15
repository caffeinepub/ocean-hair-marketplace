import { ProductCategory } from "../backend.d";

export function getCategoryGradientClass(category: ProductCategory): string {
  const map: Partial<Record<ProductCategory, string>> = {
    [ProductCategory.curlyWig]: "cat-curly",
    [ProductCategory.blondeWig]: "cat-blonde",
    [ProductCategory.boneStraight]: "cat-bone",
    [ProductCategory.bodyWave]: "cat-body",
    [ProductCategory.deepWave]: "cat-deep",
    [ProductCategory.frontalWig]: "cat-frontal",
    [ProductCategory.bundle12Inch]: "cat-bundle",
    [ProductCategory.bundle14Inch]: "cat-bundle",
    [ProductCategory.bundle16Inch]: "cat-bundle",
    [ProductCategory.bundle18Inch]: "cat-bundle",
    [ProductCategory.bundle20Inch]: "cat-bundle",
    [ProductCategory.supplyBundle]: "cat-bundle",
    [ProductCategory.closure12Inch]: "cat-closure",
    [ProductCategory.closure14Inch]: "cat-closure",
    [ProductCategory.closure16Inch]: "cat-closure",
    [ProductCategory.closure18Inch]: "cat-closure",
    [ProductCategory.closure20Inch]: "cat-closure",
    [ProductCategory.closureWig]: "cat-closure",
    [ProductCategory.bobWig]: "cat-frontal",
  };
  return map[category] ?? "cat-default";
}

export function getCategoryLabel(category: ProductCategory): string {
  const map: Partial<Record<ProductCategory, string>> = {
    [ProductCategory.curlyWig]: "Curly Wig",
    [ProductCategory.blondeWig]: "Blonde Wig",
    [ProductCategory.boneStraight]: "Bone Straight",
    [ProductCategory.bodyWave]: "Body Wave",
    [ProductCategory.deepWave]: "Deep Wave",
    [ProductCategory.frontalWig]: "Frontal Wig",
    [ProductCategory.closureWig]: "Closure Wig",
    [ProductCategory.bobWig]: "Bob Wig",
    [ProductCategory.bundle12Inch]: 'Bundle 12"',
    [ProductCategory.bundle14Inch]: 'Bundle 14"',
    [ProductCategory.bundle16Inch]: 'Bundle 16"',
    [ProductCategory.bundle18Inch]: 'Bundle 18"',
    [ProductCategory.bundle20Inch]: 'Bundle 20"',
    [ProductCategory.supplyBundle]: "Supply Bundle",
    [ProductCategory.closure12Inch]: 'Closure 12"',
    [ProductCategory.closure14Inch]: 'Closure 14"',
    [ProductCategory.closure16Inch]: 'Closure 16"',
    [ProductCategory.closure18Inch]: 'Closure 18"',
    [ProductCategory.closure20Inch]: 'Closure 20"',
  };
  return map[category] ?? category;
}

export function formatPrice(cents: bigint): string {
  return `$${(Number(cents) / 100).toFixed(0)}`;
}

export function getCategoryImage(category: ProductCategory): string {
  const map: Partial<Record<ProductCategory, string>> = {
    [ProductCategory.curlyWig]:
      "/assets/generated/product-curly-wig.dim_400x400.jpg",
    [ProductCategory.blondeWig]:
      "/assets/generated/product-blonde-wig.dim_400x400.jpg",
    [ProductCategory.boneStraight]:
      "/assets/generated/product-bone-straight.dim_400x400.jpg",
    [ProductCategory.bodyWave]:
      "/assets/generated/product-body-wave.dim_400x400.jpg",
    [ProductCategory.deepWave]:
      "/assets/generated/product-wave-wig.dim_400x400.jpg",
    [ProductCategory.frontalWig]:
      "/assets/generated/product-wave-wig.dim_400x400.jpg",
  };
  return map[category] ?? "";
}
