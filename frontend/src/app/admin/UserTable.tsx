"use client";

import { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import { useSession } from "next-auth/react";
import { getUsers } from "@/actions/getUsers";
import { deleteUser } from "@/actions/deleteUser";
import type { AdminUser } from "@/types";

export const UserTable = () => {
  const { data: session } = useSession();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const currentUserId = (session?.user as { id?: string })?.id;
  const currentUserEmail = (session?.user?.email ?? "").trim().toLowerCase();
  const demoAdminEmail = (process.env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL ?? "admin-demo@example.com").trim().toLowerCase();
  const isDemoAdmin = currentUserEmail === demoAdminEmail;

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (userId: string) => {
    setDeletingId(userId);
    try {
      await deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <p className="text-sm text-gray-500">Loading users...</p>;
  }

  if (users.length === 0) {
    return <p className="text-sm text-gray-500">No users found.</p>;
  }

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
          <th className="py-2 pr-4">Name</th>
          <th className="py-2 pr-4">Email</th>
          <th className="py-2 pr-4">Role</th>
          <th className="py-2 pr-4">Joined</th>
          <th className="py-2" />
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
            <td className="py-3 pr-4 text-sm font-medium text-gray-800">{user.name}</td>
            <td className="py-3 pr-4 text-sm text-gray-500">{user.email}</td>
            <td className="py-3 pr-4">
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  user.roleName === "admin"
                    ? "bg-violet-100 text-violet-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {user.roleName}
              </span>
            </td>
            <td className="py-3 pr-4 text-sm text-gray-500">
              {new Date(user.createdAt).toLocaleDateString()}
            </td>
            <td className="py-3">
              {!isDemoAdmin && user.id !== currentUserId && (
                <Button
                  size="sm"
                    className="text-red-600 border border-red-200 hover:bg-red-50 bg-transparent"
                    isDisabled={deletingId === user.id}
                  onPress={() => void handleDelete(user.id)}
                >
                    {deletingId === user.id ? "Deleting..." : "Delete"}
                </Button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
