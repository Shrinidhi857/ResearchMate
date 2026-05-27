import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";

interface AdminInfo {
  summary: {
    total_users: number;
    verified_users: number;
    admin_users: number;
    unverified_users: number;
  };
  token_stats: {
    total_tokens_issued: number;
    average_tokens_per_user: number;
    total_token_pool: number;
  };
  recent_users: any[];
  timestamp: string;
}

interface UserDetail {
  id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
  tokens: number;
  is_verified: boolean;
  is_admin: boolean;
  created_at: string;
  updated_at?: string;
}

interface PaginatedUsers {
  users: UserDetail[];
  total: number;
  pages: number;
  current_page: number;
  per_page: number;
}

interface AdminData {
  adminInfo: AdminInfo | null;
  users: UserDetail[];
  totalUsers: number;
  loading: boolean;
  error: string | null;
}

export const useAdminData = () => {
  const [data, setData] = useState<AdminData>({
    adminInfo: null,
    users: [],
    totalUsers: 0,
    loading: true,
    error: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchAdminData();
  }, [currentPage, search]);

  const fetchAdminData = async () => {
    try {
      setData((prev) => ({ ...prev, loading: true, error: null }));

      const token = localStorage.getItem("authToken");
      if (!token) {
        setData((prev) => ({
          ...prev,
          loading: false,
          error: "Unauthorized access",
        }));
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      // Fetch analytics/info
      const analyticsRes = await api.get("/admin/analytics", { headers });
      const usersRes = await api.get("/admin/users", {
        headers,
        params: {
          page: currentPage,
          per_page: 20,
          search: search || undefined,
        },
      });

      setData({
        adminInfo: analyticsRes.data,
        users: usersRes.data.users,
        totalUsers: usersRes.data.total,
        loading: false,
        error: null,
      });
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.error || "Failed to fetch admin data";
      setData((prev) => ({
        ...prev,
        loading: false,
        error: errorMsg,
      }));
    }
  };

  const addTokensToUser = async (
    userId: number,
    amount: number,
    reason?: string,
  ) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await api.post(
        `/admin/users/${userId}/tokens/add`,
        { amount, reason: reason || "Admin token addition" },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success(`Added ${amount} tokens to user`);
      await fetchAdminData();
      return response.data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || "Failed to add tokens";
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const deductTokensFromUser = async (
    userId: number,
    amount: number,
    reason?: string,
  ) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await api.post(
        `/admin/users/${userId}/tokens/deduct`,
        { amount, reason: reason || "Admin token deduction" },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success(`Deducted ${amount} tokens from user`);
      await fetchAdminData();
      return response.data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || "Failed to deduct tokens";
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const setUserTokens = async (userId: number, amount: number) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await api.post(
        `/admin/users/${userId}/tokens/set`,
        { amount },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success(`Set user tokens to ${amount}`);
      await fetchAdminData();
      return response.data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || "Failed to set tokens";
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const verifyUser = async (userId: number) => {
    try {
      const token = localStorage.getItem("authToken");
      await api.post(
        `/admin/users/${userId}/verify`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("User verified");
      await fetchAdminData();
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || "Failed to verify user";
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const grantAdmin = async (userId: number) => {
    try {
      const token = localStorage.getItem("authToken");
      await api.post(
        `/admin/users/${userId}/grant-admin`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Admin access granted");
      await fetchAdminData();
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || "Failed to grant admin";
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const revokeAdmin = async (userId: number) => {
    try {
      const token = localStorage.getItem("authToken");
      await api.post(
        `/admin/users/${userId}/revoke-admin`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Admin access revoked");
      await fetchAdminData();
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || "Failed to revoke admin";
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const deleteUser = async (userId: number) => {
    try {
      const token = localStorage.getItem("authToken");
      await api.delete(`/admin/users/${userId}/delete`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("User deleted successfully");
      await fetchAdminData();
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || "Failed to delete user";
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const refetchData = async () => {
    await fetchAdminData();
  };

  return {
    ...data,
    addTokensToUser,
    deductTokensFromUser,
    setUserTokens,
    verifyUser,
    grantAdmin,
    revokeAdmin,
    deleteUser,
    refetchData,
    currentPage,
    setCurrentPage,
    search,
    setSearch,
  };
};
