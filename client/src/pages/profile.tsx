import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

export default function ProfilePage() {
  const { user, logoutMutation } = useAuth();

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-6 w-6" />
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium">Username</h3>
            <p className="text-muted-foreground">{user.username}</p>
          </div>
          <div>
            <h3 className="font-medium">Account Type</h3>
            <p className="text-muted-foreground">
              {user.isAdmin ? "Administrator" : "Customer"}
            </p>
          </div>
          <Button
            variant="destructive"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
          >
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
