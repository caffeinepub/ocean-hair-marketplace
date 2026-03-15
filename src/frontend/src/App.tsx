import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { AuthPage } from "./pages/AuthPage";
import { ChatPage } from "./pages/ChatPage";
import { HomePage } from "./pages/HomePage";
import { OrdersPage } from "./pages/OrdersPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { ProductsPage } from "./pages/ProductsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { SplashPage } from "./pages/SplashPage";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster position="top-center" richColors />
    </>
  ),
});

const splashRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: SplashPage,
});

const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth",
  component: AuthPage,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/home",
  component: HomePage,
});

const productsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/products",
  component: ProductsPage,
});

const productDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/product/$id",
  component: ProductDetailPage,
});

const chatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/chat",
  component: ChatPage,
  validateSearch: (search: Record<string, unknown>) => ({
    productId: search.productId as string | undefined,
    sellerId: search.sellerId as string | undefined,
  }),
});

const ordersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/orders",
  component: OrdersPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: ProfilePage,
});

const routeTree = rootRoute.addChildren([
  splashRoute,
  authRoute,
  homeRoute,
  productsRoute,
  productDetailRoute,
  chatRoute,
  ordersRoute,
  profileRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
