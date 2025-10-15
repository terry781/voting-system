"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { authApi } from "@/services/api";
import { toast } from "react-hot-toast";

export function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    try {
      await authApi.signOut();
      router.refresh();
    } catch (error) {
      toast.error("Failed to logout");
      console.error("Logout error:", error);
    }
  };

  return (
    <button onClick={handleLogout} className="btn btn-secondary">
      Logout
    </button>
  );
}
