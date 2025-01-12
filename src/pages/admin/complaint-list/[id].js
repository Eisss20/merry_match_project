import axios from "axios";
import { AdminSideBar } from "@/components/admin/AdminSideBar";
import AdminHeader from "@/components/admin/AdminHeader";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAdminAuth } from "@/contexts/AdminAuthContext"; // Import Context
import { jwtDecode } from "jwt-decode";
import DeleteConfirmationModal from "@/components/admin/DeleteConfirmationModal";

function ComplaintDetail() {
  const router = useRouter();
  const { id } = router.query; // ดึง id จาก URL
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  const { admin, logout } = useAdminAuth();

  const updateComplaintStatus = async (newStatus) => {
    try {
      console.log("Sending data to API:", {
        status: newStatus,
        adminId: admin.admin_id,
      });

      if (!admin || !admin.admin_id) {
        console.error("Admin ID is missing");
        alert("Admin information is not available. Please try again later.");
        return;
      }

      await axios.patch(`/api/admin/complaint/${id}`, {
        status: newStatus,
        adminId: admin.admin_id, // แนบ adminId ที่ได้จาก Context
      });
      setComplaint((prevComplaint) => ({
        ...prevComplaint,
        status: newStatus,
      }));

      router.push(`/admin/complaint-list`);
    } catch (err) {
      console.error(
        `Error updating complaint status to ${newStatus}:`,
        err.message,
      );
      alert("Failed to update complaint status. Please try again.");
    }
  };

  const handleOpenModal = (status) => {
    setNewStatus(status); // ตั้งค่า status ที่ต้องการ
    setIsModalOpen(true); // เปิด Modal
  };

  const handleConfirmStatusChange = () => {
    updateComplaintStatus(newStatus);
    setIsModalOpen(false); // ปิด Modal
  };

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
        console.error("Token decoding error:", error);
        logout(); // Invalid token, redirect to login
      }
    }
  }, [router]);

  useEffect(() => {
    if (!id) return; // รอจนกว่าจะมี id ใน router.query
    const fetchComplaint = async () => {
      try {
        const response = await axios.get(`/api/admin/complaint/${id}`);
        setComplaint(response.data); // เก็บข้อมูล complaint
      } catch (err) {
        console.error("Error fetching complaint:", err.message);
        setError(err.message); // แสดงข้อผิดพลาด
      } finally {
        setLoading(false); // ปิดสถานะการโหลด
      }
    };

    fetchComplaint();
  }, [id]);

  if (loading || authLoading) return <div></div>;

  if (error) {
    return <div>Error: {error}</div>;
  }

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
          buttons={[
            {
              type: "white",
              label: "Cancel Complaint",
              onClick: () => handleOpenModal("Cancel"),
            },
            {
              type: "third",
              label: "Resolve Complaint",
              onClick: () => handleOpenModal("Resolved"),
            },
          ]}
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
            <div>
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
          </div>
        </div>
      </main>
      {/* Modal */}
      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmStatusChange}
        title={`${newStatus === "Resolved" ? "Resolve Complaint" : "Cancel Complaint"} `}
        message={`${newStatus === "Resolved" ? "This complaint is resolved?" : "Do you sure to cancel this conplaint?"} `}
        confirmLabel={`${newStatus === "Resolved" ? "Yes, it has been resolved" : "Yes, cancel this complaint"} `}
        cancelLabel={`${newStatus === "Resolved" ? "No, it’s not" : "No, give me more time"} `}
        confirmClassName={
          newStatus === "Resolved"
            ? "rounded-full bg-red-500 px-6 py-2 text-white hover:bg-red-600"
            : "rounded-full bg-pink-100 px-6 py-2 text-pink-500 hover:bg-pink-200"
        }
        cancelClassName={
          newStatus === "Resolved"
            ? "rounded-full bg-pink-100 px-6 py-2 text-pink-500 hover:bg-pink-200"
            : "rounded-full bg-red-500 px-6 py-2 text-white hover:bg-red-600"
        }
      />
    </div>
  );
}

export default ComplaintDetail;
