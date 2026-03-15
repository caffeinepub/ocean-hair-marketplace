import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  BusinessProfile,
  Order,
  Product,
  ProductCategory,
  ProductMessage,
} from "../backend.d";
import { useActor } from "./useActor";

export function useGetAllProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProduct(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Product | null>({
    queryKey: ["product", id?.toString()],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getProduct(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useSearchProducts(term: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products", "search", term],
    queryFn: async () => {
      if (!actor) return [];
      if (!term.trim()) return actor.getAllProducts();
      return actor.searchProducts(term);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProductsByCategory(category: ProductCategory | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products", "category", category],
    queryFn: async () => {
      if (!actor) return [];
      if (!category) return actor.getAllProducts();
      return actor.getProductsByCategory(category);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCallerProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<BusinessProfile | null>({
    queryKey: ["profile", "caller"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetOrdersForVendor(vendorId: Principal | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Order[]>({
    queryKey: ["orders", "vendor", vendorId?.toString()],
    queryFn: async () => {
      if (!actor || !vendorId) return [];
      return actor.getOrdersForVendor(vendorId);
    },
    enabled: !!actor && !isFetching && !!vendorId,
  });
}

export function useGetMessages(productId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<ProductMessage[]>({
    queryKey: ["messages", productId?.toString()],
    queryFn: async () => {
      if (!actor || !productId) return [];
      return actor.getProductMessagesForProduct(productId);
    },
    enabled: !!actor && !isFetching && !!productId,
    refetchInterval: 3000,
  });
}

export function useSendMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      receiverId,
      productId,
      text,
    }: { receiverId: Principal; productId: bigint; text: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.sendProductMessage(receiverId, productId, text);
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({
        queryKey: ["messages", vars.productId.toString()],
      });
    },
  });
}

export function usePlaceOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      productId,
      quantity,
    }: { productId: bigint; quantity: bigint }) => {
      if (!actor) throw new Error("Not connected");
      return actor.placeOrder(productId, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useCompleteOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.completeOrder(orderId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useCreateProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: BusinessProfile) => {
      if (!actor) throw new Error("Not connected");
      return actor.createBusinessProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useSeedData() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async () => {
      if (!actor) return;
      return actor.seedData();
    },
  });
}
