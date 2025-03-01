import { useQuery } from "@tanstack/react-query";
import { Order } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";

export default function OrdersPage() {
  const { user } = useAuth();
  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">My Orders</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders?.map((order) => (
            <TableRow key={order.id}>
              <TableCell>#{order.id}</TableCell>
              <TableCell>
                {format(new Date(order.createdAt), "MMM d, yyyy")}
              </TableCell>
              <TableCell>
                {(order.items as any[]).map((item: any) => (
                  <div key={item.product.id} className="text-sm">
                    {item.quantity}x {item.product.name}
                  </div>
                ))}
              </TableCell>
              <TableCell>${(order.total / 100).toFixed(2)}</TableCell>
              <TableCell>
                <span className="capitalize">{order.status}</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
