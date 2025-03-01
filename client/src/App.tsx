import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import { Navbar } from "@/components/layout/navbar";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import AdminProductsPage from "@/pages/admin/products";
import AdminOrdersPage from "@/pages/admin/orders";
import OrdersPage from "@/pages/orders";
import ProfilePage from "@/pages/profile";

function Router() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl animate-blob left-0 top-0"></div>
        <div className="absolute w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl animate-blob animation-delay-2000 right-0 bottom-0"></div>
        <div className="absolute w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl animate-blob animation-delay-4000 left-1/2 top-1/2"></div>
      </div>

      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 relative">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/auth" component={AuthPage} />
          <ProtectedRoute path="/admin/products" component={AdminProductsPage} />
          <ProtectedRoute path="/admin/orders" component={AdminOrdersPage} />
          <ProtectedRoute path="/orders" component={OrdersPage} />
          <ProtectedRoute path="/profile" component={ProfilePage} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;