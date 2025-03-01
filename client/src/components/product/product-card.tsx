import { Product } from "@shared/schema";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const cart = useCart();

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-all">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button 
            variant="secondary"
            className="scale-90 group-hover:scale-100 transition-transform"
            onClick={() => cart.addItem(product)}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
      <CardHeader>
        <CardTitle className="text-lg">{product.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>
        <p className="mt-2 text-lg font-semibold text-primary">
          ${(product.price / 100).toFixed(2)}
        </p>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          Category: {product.category}
        </p>
      </CardFooter>
    </Card>
  );
}