import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/hooks/use-auth";
import { ShoppingCart, Menu, HeadphonesIcon, Search, User, Package2, Bot } from "lucide-react";
import { useCart } from "@/store/cart";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { SearchDialog } from "@/components/search-dialog";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { user, logoutMutation } = useAuth();
  const cart = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between relative">
        {/* Left side - Admin Links, Search, and Support */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Support Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <HeadphonesIcon className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[300px]">
              <div className="p-4 space-y-2">
                <h3 className="font-semibold">Contact Support</h3>
                <p className="text-sm">Phone: +91 9798626202</p>
                <p className="text-sm">Email: tiamodead@gmail.com</p>
                <p className="text-sm text-muted-foreground">
                  Address: Near of New Rk Gym, Eidgah jaipur
                </p>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Search Button */}
          <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)}>
            <Search className="h-5 w-5" />
          </Button>

          {/* AI Assistant */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Bot className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[300px]">
              <div className="p-4 text-center">
                <h3 className="font-semibold">AI Assistant</h3>
                <p className="text-sm text-muted-foreground">Coming Soon!</p>
                <p className="text-xs mt-2">Support in Hindi and English</p>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {user?.isAdmin && (
            <div className="hidden md:flex items-center space-x-2">
              <Link href="/admin/products">
                <a className="text-sm font-medium hover:text-primary">Products</a>
              </Link>
              <Link href="/admin/orders">
                <a className="text-sm font-medium hover:text-primary">Orders</a>
              </Link>
            </div>
          )}
        </div>

        {/* Center logo container */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <Link href="/">
            <a className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent hover:scale-105 transition-transform animate-pulse">
              Pixeldrops Printing
            </a>
          </Link>
        </div>

        {/* Right side - User Profile, Cart, Theme */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <a className="w-full">Profile</a>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders">
                    <a className="w-full flex items-center">
                      <Package2 className="h-4 w-4 mr-2" />
                      My Orders
                    </a>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingCart className="h-5 w-5" />
            {cart.items.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-4 h-4 text-xs flex items-center justify-center">
                {cart.items.length}
              </span>
            )}
          </Button>

          <ThemeToggle />

          {user ? (
            <Button
              variant="outline"
              size="sm"
              className="md:text-base"
              onClick={() => logoutMutation.mutate()}
            >
              Logout
            </Button>
          ) : (
            <Link href="/auth">
              <Button size="sm" className="md:text-base">Login</Button>
            </Link>
          )}
        </div>
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />

      {/* Footer */}
      <div className="fixed bottom-0 left-0 w-full bg-background border-t py-2 text-center text-sm text-muted-foreground">
        Host: md talha alam
      </div>
    </nav>
  );
}