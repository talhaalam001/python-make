import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/store/cart";
import { X, Plus, Minus, MapPin } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const cart = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    paymentMethod: "",
    notes: "",
    location: {
      latitude: "",
      longitude: "",
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/orders", {
        items: cart.items,
        total: cart.total(),
        details: orderDetails,
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Order placed successfully!",
      });
      cart.clearCart();
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setOrderDetails({
            ...orderDetails,
            location: {
              latitude: position.coords.latitude.toString(),
              longitude: position.coords.longitude.toString(),
            },
          });
          toast({
            title: "Location Updated",
            description: "Your current location has been added to the order.",
          });
        },
        (error) => {
          toast({
            title: "Location Error",
            description: "Could not get your current location. Please enter address manually.",
            variant: "destructive",
          });
        }
      );
    }
  };

  const isFormValid = () => {
    return (
      orderDetails.name &&
      orderDetails.email &&
      orderDetails.phone &&
      orderDetails.address &&
      orderDetails.city &&
      orderDetails.state &&
      orderDetails.pinCode &&
      orderDetails.paymentMethod
    );
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
        </SheetHeader>

        <div className="mt-8 space-y-4">
          {cart.items.map((item) => (
            <div key={item.product.id} className="flex items-center space-x-4">
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-medium">{item.product.name}</h3>
                <p className="text-sm text-muted-foreground">
                  ${(item.product.price / 100).toFixed(2)}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => cart.updateQuantity(item.product.id, item.quantity - 1)}
                  disabled={item.quantity === 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span>{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => cart.updateQuantity(item.product.id, item.quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => cart.removeItem(item.product.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {cart.items.length > 0 && (
          <>
            <Separator className="my-4" />
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="font-medium">Total</span>
                <span className="font-medium">
                  ${(cart.total() / 100).toFixed(2)}
                </span>
              </div>

              {!showCheckoutForm ? (
                <Button 
                  className="w-full" 
                  onClick={() => setShowCheckoutForm(true)}
                  disabled={!user}
                >
                  {user ? "Proceed to Checkout" : "Login to Checkout"}
                </Button>
              ) : (
                <div className="space-y-4">
                  <h3 className="font-medium">Contact Information</h3>
                  <Input
                    placeholder="Full Name"
                    value={orderDetails.name}
                    onChange={(e) => setOrderDetails({...orderDetails, name: e.target.value})}
                  />
                  <Input
                    type="email"
                    placeholder="Email Address"
                    value={orderDetails.email}
                    onChange={(e) => setOrderDetails({...orderDetails, email: e.target.value})}
                  />
                  <Input
                    placeholder="Phone Number"
                    value={orderDetails.phone}
                    onChange={(e) => setOrderDetails({...orderDetails, phone: e.target.value})}
                  />

                  <h3 className="font-medium">Shipping Address</h3>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={getCurrentLocation}
                    >
                      <MapPin className="h-4 w-4" />
                      Use Current Location
                    </Button>
                  </div>
                  <Input
                    placeholder="Street Address"
                    value={orderDetails.address}
                    onChange={(e) => setOrderDetails({...orderDetails, address: e.target.value})}
                  />
                  <Input
                    placeholder="City"
                    value={orderDetails.city}
                    onChange={(e) => setOrderDetails({...orderDetails, city: e.target.value})}
                  />
                  <Input
                    placeholder="State"
                    value={orderDetails.state}
                    onChange={(e) => setOrderDetails({...orderDetails, state: e.target.value})}
                  />
                  <Input
                    placeholder="PIN Code"
                    value={orderDetails.pinCode}
                    onChange={(e) => setOrderDetails({...orderDetails, pinCode: e.target.value})}
                  />

                  <h3 className="font-medium">Payment Method</h3>
                  <Select
                    value={orderDetails.paymentMethod}
                    onValueChange={(value) => setOrderDetails({...orderDetails, paymentMethod: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Payment Method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash on Delivery</SelectItem>
                      <SelectItem value="upi">UPI</SelectItem>
                      <SelectItem value="card">Credit/Debit Card</SelectItem>
                      <SelectItem value="netbanking">Net Banking</SelectItem>
                    </SelectContent>
                  </Select>

                  <h3 className="font-medium">Additional Information</h3>
                  <Textarea
                    placeholder="Order Notes (Optional)"
                    value={orderDetails.notes}
                    onChange={(e) => setOrderDetails({...orderDetails, notes: e.target.value})}
                  />

                  <Button 
                    className="w-full"
                    onClick={() => createOrderMutation.mutate()}
                    disabled={createOrderMutation.isPending || !isFormValid()}
                  >
                    Place Order
                  </Button>
                </div>
              )}
            </div>
          </>
        )}

        {cart.items.length === 0 && (
          <div className="mt-8 text-center text-muted-foreground">
            Your cart is empty
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}