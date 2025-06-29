import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProtectedRoute() {
  const { accessToken, isLoading } = useAuth();
  
  // Authentication state yüklenirken loading göster
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="space-y-4 w-full max-w-md">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    );
  }
  
  return accessToken ? <Outlet /> : <Navigate to="/login" replace />;
} 