import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Loader2,
  MessageCircle,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useGetProduct, usePlaceOrder } from "../hooks/useQueries";
import {
  formatPrice,
  getCategoryGradientClass,
  getCategoryImage,
  getCategoryLabel,
} from "../utils/productHelpers";

export function ProductDetailPage() {
  const { id } = useParams({ from: "/product/$id" });
  const navigate = useNavigate();
  const { data: product, isLoading } = useGetProduct(id ? BigInt(id) : null);
  const placeOrder = usePlaceOrder();
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [quantity, setQuantity] = useState("1");

  if (isLoading) {
    return (
      <div className="app-shell flex items-center justify-center min-h-dvh">
        <Loader2 className="animate-spin text-navy" size={32} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="app-shell flex flex-col items-center justify-center min-h-dvh gap-4">
        <p className="text-4xl">😔</p>
        <p className="text-muted-foreground">Product not found</p>
        <Button variant="outline" onClick={() => navigate({ to: "/products" })}>
          Back to Products
        </Button>
      </div>
    );
  }

  const gradientClass = getCategoryGradientClass(product.category);
  const fallbackImage = getCategoryImage(product.category);
  const imageUrl = product.imageUrl || fallbackImage;
  const manufacturerShort = product.manufacturerId.toString().slice(0, 8);

  async function handleOrder() {
    const qty = BigInt(Math.max(1, Number(quantity) || 1));
    try {
      await placeOrder.mutateAsync({ productId: product!.id, quantity: qty });
      toast.success("Order placed successfully!");
      setShowOrderModal(false);
      navigate({ to: "/orders" });
    } catch (_e) {
      toast.error("Failed to place order. Please log in.");
    }
  }

  return (
    <div className="app-shell">
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-border px-4 py-3 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate({ to: "/products" })}
          className="p-1"
        >
          <ArrowLeft size={20} className="text-foreground" />
        </button>
        <h1 className="font-semibold text-sm flex-1 truncate">
          {product.name}
        </h1>
      </div>

      <div className="w-full aspect-square">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className={`w-full h-full ${gradientClass} flex items-center justify-center`}
          >
            <span className="text-white/60 text-8xl">💇</span>
          </div>
        )}
      </div>

      <div className="px-4 py-5 space-y-4">
        <div>
          <Badge className="mb-2 bg-muted text-muted-foreground text-[10px]">
            {getCategoryLabel(product.category)}
          </Badge>
          <h2 className="font-display font-bold text-xl text-foreground">
            {product.name}
          </h2>
          <p className="text-gold-dark font-bold text-xl mt-1">
            From {formatPrice(product.priceFromCents)} per piece
          </p>
        </div>

        <div className="flex items-center gap-2 p-3 bg-muted rounded-xl">
          <ShoppingBag size={16} className="text-navy" />
          <span className="text-sm text-foreground">
            Minimum Order: <strong>{Number(product.moq)} pieces</strong>
          </span>
        </div>

        {product.lengthOptions.length > 0 && (
          <div>
            <p className="text-sm font-medium text-foreground mb-2">
              Available Lengths
            </p>
            <div className="flex flex-wrap gap-2">
              {product.lengthOptions.map((l) => (
                <span
                  key={l}
                  className="px-3 py-1 rounded-full border border-border text-xs font-medium text-foreground bg-white"
                >
                  {l}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 p-3 bg-white border border-border rounded-xl">
          <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center">
            <span className="text-white text-sm">🏭</span>
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Manufacturer</p>
            <p className="text-sm font-semibold text-foreground">
              {manufacturerShort}...
            </p>
          </div>
          <ShieldCheck size={16} className="text-gold" />
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            data-ocid="product.chat_button"
            variant="outline"
            className="flex-1 h-12 rounded-xl border-navy text-navy font-semibold"
            onClick={() =>
              navigate({
                to: "/chat",
                search: {
                  productId: product.id.toString(),
                  sellerId: product.manufacturerId.toString(),
                },
              })
            }
          >
            <MessageCircle size={16} className="mr-2" /> Chat with Supplier
          </Button>
          <Button
            data-ocid="product.order_now.button"
            className="flex-1 h-12 rounded-xl bg-gold hover:bg-gold-dark text-navy font-bold"
            onClick={() => setShowOrderModal(true)}
          >
            Order Now
          </Button>
        </div>
      </div>

      <Dialog open={showOrderModal} onOpenChange={setShowOrderModal}>
        <DialogContent
          data-ocid="product.order_dialog"
          className="max-w-[340px] rounded-2xl"
        >
          <DialogHeader>
            <DialogTitle className="font-display">Place Order</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">{product.name}</p>
            <div className="space-y-1.5">
              <Label>Quantity (min. {Number(product.moq)} pcs)</Label>
              <Input
                type="number"
                min={Number(product.moq)}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="h-11 rounded-xl"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Total:{" "}
              <strong className="text-foreground">
                {formatPrice(
                  BigInt(
                    Math.round(
                      Number(product.priceFromCents) *
                        Math.max(1, Number(quantity) || 1),
                    ),
                  ),
                )}
              </strong>
            </p>
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              data-ocid="product.order_dialog.cancel_button"
              variant="outline"
              className="flex-1 rounded-xl"
              onClick={() => setShowOrderModal(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="product.order_dialog.confirm_button"
              className="flex-1 bg-navy rounded-xl text-white"
              onClick={handleOrder}
              disabled={placeOrder.isPending}
            >
              {placeOrder.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
