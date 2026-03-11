import { ReactNode } from "react";
import { ProtectedRoute } from "@/components/ui/layout/ProtectedRoute";

interface EditLayoutProps {
  children: ReactNode;
}

export default function EditLayout({ children }: EditLayoutProps) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );
}