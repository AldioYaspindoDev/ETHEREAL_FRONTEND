"use client";

import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaRegTrashAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function UserTableClient({ initialUsers }) {
  const [users, setUsers] = useState(initialUsers);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchUsersClient = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin`,
        { withCredentials: true } // cookie akan otomatis dikirim browser
      );

      setUsers(res.data.data || []);
    } catch (error) {
      console.error("ERROR FETCH USERS (Client):", error.response?.data);

      if (error.response?.status === 401) {
        toast.error("Sesi habis. Silakan login.");
        router.push("/loginadmin");
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

const handleDeleteUser = async (userId) => {
  if (!confirm(`Apakah Anda yakin ingin menghapus user ID: ${userId}?`)) return;

  setLoading(true);

  try {
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/${userId}`,
      {
        withCredentials: true,  // WAJIB untuk mengirim cookie
      }
    );

    toast.success(`User ${userId} berhasil dihapus.`);
    setUsers((prev) => prev.filter((u) => u._id !== userId));
    await fetchUsersClient();
  } catch (error) {
    console.log("DELETE ERROR:", error);

    const status = error?.response?.status;
    const data = error?.response?.data;

    console.log("STATUS:", status);
    console.log("DATA:", data);

    if (status === 401) {
      toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
      router.push("/loginadmin");
    } else {
      toast.error(data?.message || "Gagal menghapus user.");
    }
  } finally {
    setLoading(false);
  }
};


  return (
    <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
      <thead className="bg-neutral-800 text-white">
        <tr>
          <th className="px-4 py-3 text-left font-poppins">No</th>
          <th className="px-4 py-3 text-left font-poppins">Username</th>
          <th className="px-4 py-3 text-center font-poppins">Aksi</th>
        </tr>
      </thead>

      <tbody>
        {users.map((user, index) => (
          <tr key={user._id} className="border-b hover:bg-neutral-50  text-black">
            <td className="px-4 py-3">{index + 1}</td>
            <td className="px-4 py-3">{user.username}</td>
            <td className="text-center">
              <button
                onClick={() => handleDeleteUser(user._id)}
                className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition"
                disabled={loading}
              >
                <FaRegTrashAlt />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
