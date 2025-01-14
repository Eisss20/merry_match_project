import { AdminSideBar } from "@/components/admin/AdminSideBar";
import AdminHeader from "@/components/admin/AdminHeader";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { jwtDecode } from "jwt-decode";

function ComplaintResolved() {
  const router = useRouter();
  const { id } = router.query;
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);

  const { logout } = useAdminAuth(); // ดึง logout จาก Context

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const response = await axios.get(`/api/admin/complaint/${id}`);
        setComplaint(response.data);
      } catch (error) {
        console.error("Error fetching complaint:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchComplaint();
  }, [id]);

  // Verify authentication
  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      router.push("/admin/login");
    } else {
      try {
        const decodedToken = jwtDecode(token);
        const now = Date.now() / 1000;
        if (decodedToken.exp < now) {
          logout(); // Token expired, redirect to login
        } else {
          setAuthLoading(false); // ตั้งค่า loading เป็น false เมื่อการตรวจสอบเสร็จ
        }
      } catch (error) {
        console.error("Token decoding error:", error); // Console error show popup Display  ใช้ Modal แทนได้
        logout(); // Invalid token, redirect to login
      }
    }
  }, [router]);

  if (authLoading || loading) return <div></div>;

  return (
    <div className="flex min-h-screen">
      <AdminSideBar />
      <main className="flex-1 bg-fourth-100">
        <AdminHeader
          title={
            complaint.issue.length > 50
              ? complaint.issue.substring(0, 50) + "..."
              : complaint.issue
          }
          backButton={true}
          extraContent={
            <span
              className={`rounded-full px-3 py-1 text-sm font-bold ${
                complaint.status === "Pending"
                  ? "bg-yellow-100 text-yellow-600"
                  : complaint.status === "Resolved"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
              }`}
            >
              {complaint.status}
            </span>
          }
        />
        {/* เพิ่มความสูงให้ main container */}
        <div className="relative min-h-[120vh]">
          {/* Complaint Detail */}
          <div className="ml-16 mt-14 max-w-5xl rounded-2xl border bg-white pb-20 pl-20 pr-20 shadow">
            <h3 className="my-10 text-xl font-bold text-fourth-700">
              Complaint by:{" "}
              <span className="font-normal text-[#000000]">
                {complaint.user_name || "Unknown User"}
              </span>
            </h3>
            <hr className="w-full"></hr>
            <div className="py-12">
              <p className="mb-2 text-lg font-semibold text-fourth-700">
                Issue
              </p>
              <p className="break-words text-[#000000]">
                {complaint.issue || "No issue provided"}
              </p>
            </div>
            <div className="pb-12">
              <p className="mb-2 text-lg font-semibold text-fourth-700">
                Description
              </p>
              <p className="break-words text-[#000000]">
                {complaint.description || "No description provided"}
              </p>
            </div>
            <div className="pb-12">
              <p className="mb-2 text-lg font-semibold text-fourth-700">
                Date Submitted
              </p>
              <p className="text-[#000000]">
                {(() => {
                  const date = new Date(complaint.submited_date);
                  if (isNaN(date)) return "Invalid Date";
                  const day = String(date.getDate()).padStart(2, "0");
                  const month = String(date.getMonth() + 1).padStart(2, "0");
                  const year = date.getFullYear();
                  return `${day}/${month}/${year}`;
                })()}
              </p>
            </div>
            <hr className="w-full"></hr>
            <div className="pt-12">
              <p className="text-lg font-semibold">
                <strong className="text-fourth-700">Resolved Date:</strong>{" "}
                <div className="mt-2 text-[#000000]">
                  {complaint.resolve_date}
                </div>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ComplaintResolved;
