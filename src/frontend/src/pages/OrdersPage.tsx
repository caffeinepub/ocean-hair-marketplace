import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle, Loader2, ShoppingBag, Truck } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { OrderStatus } from "../backend.d";
import { BottomNav } from "../components/BottomNav";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useCompleteOrder, useGetOrdersForVendor } from "../hooks/useQueries";
import { formatPrice } from "../utils/productHelpers";

const STATUS_ICONS = {
  [OrderStatus.pending]: ShoppingBag,
  [OrderStatus.shipped]: Truck,
  [OrderStatus.delivered]: CheckCircle,
};

export function OrdersPage() {
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal() ?? null;
  const { data: orders = [], isLoading } = useGetOrdersForVendor(principal);
  const completeOrder = useCompleteOrder();

  const pending = orders.filter((o) => o.status === OrderStatus.pending);
  const shipped = orders.filter((o) => o.status === OrderStatus.shipped);
  const delivered = orders.filter((o) => o.status === OrderStatus.delivered);

  async function handleComplete(orderId: bigint) {
    try {
      await completeOrder.mutateAsync(orderId);
      toast.success("Order marked as complete!");
    } catch {
      toast.error("Failed to update order");
    }
  }

  function OrderCard({
    order,
    idx,
    showComplete,
  }: { order: any; idx: number; showComplete?: boolean }) {
    const Icon = STATUS_ICONS[order.status as OrderStatus] ?? ShoppingBag;
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: idx * 0.05 }}
        data-ocid={`orders.item.${idx + 1}`}
        className="bg-white rounded-xl p-4 shadow-card border border-border"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
              <Icon size={18} className="text-navy" />
            </div>
            <div>
              <p className="font-semibold text-sm">Order #{Number(order.id)}</p>
              <p className="text-xs text-muted-foreground">
                Product #{Number(order.productId)}
              </p>
            </div>
          </div>
          <Badge
            className={`text-[10px] ${
              order.status === OrderStatus.delivered
                ? "bg-green-100 text-green-700"
                : order.status === OrderStatus.shipped
                  ? "bg-blue-100 text-blue-700"
                  : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {order.status}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">
              Qty: {Number(order.quantity)}
            </p>
            <p className="font-bold text-gold-dark">
              {formatPrice(order.totalCents)}
            </p>
          </div>
          {showComplete && (
            <Button
              size="sm"
              className="h-8 px-3 bg-navy text-white rounded-lg text-xs"
              onClick={() => handleComplete(order.id)}
              disabled={completeOrder.isPending}
            >
              {completeOrder.isPending ? (
                <Loader2 size={12} className="animate-spin mr-1" />
              ) : null}
              Complete
            </Button>
          )}
          {!showComplete && (
            <Button
              size="sm"
              variant="outline"
              className="h-8 px-3 rounded-lg text-xs border-navy text-navy"
            >
              Track Order
            </Button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="app-shell pb-20">
      <div className="sticky top-0 z-40 bg-navy px-4 pt-10 pb-4">
        <h1 className="font-display font-bold text-xl text-white">My Orders</h1>
      </div>

      <div className="px-4 py-4">
        <Tabs defaultValue="pending">
          <TabsList className="w-full grid grid-cols-3 bg-muted rounded-xl h-10">
            <TabsTrigger
              data-ocid="orders.pending_tab"
              value="pending"
              className="rounded-xl text-xs"
            >
              Pending ({pending.length})
            </TabsTrigger>
            <TabsTrigger
              data-ocid="orders.shipped_tab"
              value="shipped"
              className="rounded-xl text-xs"
            >
              Shipped ({shipped.length})
            </TabsTrigger>
            <TabsTrigger
              data-ocid="orders.delivered_tab"
              value="delivered"
              className="rounded-xl text-xs"
            >
              Delivered ({delivered.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-4 space-y-3">
            {isLoading ? (
              <div data-ocid="orders.loading_state">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-24 rounded-xl shimmer" />
                ))}
              </div>
            ) : pending.length === 0 ? (
              <div
                data-ocid="orders.pending.empty_state"
                className="text-center py-12 text-muted-foreground"
              >
                <ShoppingBag size={40} className="mx-auto mb-3 opacity-30" />
                <p>No pending orders</p>
              </div>
            ) : (
              pending.map((o, i) => (
                <OrderCard key={o.id.toString()} order={o} idx={i} />
              ))
            )}
          </TabsContent>

          <TabsContent value="shipped" className="mt-4 space-y-3">
            {isLoading ? (
              <Skeleton className="h-24 rounded-xl shimmer" />
            ) : shipped.length === 0 ? (
              <div
                data-ocid="orders.shipped.empty_state"
                className="text-center py-12 text-muted-foreground"
              >
                <Truck size={40} className="mx-auto mb-3 opacity-30" />
                <p>No shipped orders</p>
              </div>
            ) : (
              shipped.map((o, i) => (
                <OrderCard
                  key={o.id.toString()}
                  order={o}
                  idx={i}
                  showComplete
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="delivered" className="mt-4 space-y-3">
            {isLoading ? (
              <Skeleton className="h-24 rounded-xl shimmer" />
            ) : delivered.length === 0 ? (
              <div
                data-ocid="orders.delivered.empty_state"
                className="text-center py-12 text-muted-foreground"
              >
                <CheckCircle size={40} className="mx-auto mb-3 opacity-30" />
                <p>No delivered orders yet</p>
              </div>
            ) : (
              delivered.map((o, i) => (
                <OrderCard key={o.id.toString()} order={o} idx={i} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
}
