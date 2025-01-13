import { AdminSideBar } from "@/components/admin/AdminSideBar";
import AdminHeader from "@/components/admin/AdminHeader";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAdminAuth } from "@/contexts/AdminAuthContext"; // Import Context
import { jwtDecode } from "jwt-decode";
import axios from "axios";

function ComplaintList() {
  const router = useRouter();
  //const { isAuthenticated, logout } = useAdminAuth();
  const [complaints, setComplaints] = useState([]);
  const [authLoading, setAuthLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState(null);
  // State สำหรับจัดการสถานะและการค้นหา
  const [searchQuery, setSearchQuery] = useState(""); // for Search
  const [selectedStatus, setSelectedStatus] = useState("all"); // for Dropdown

  const { admin, logout } = useAdminAuth();

  // 🟢 Pagination State P'ChatGPT
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // จำนวนรายการที่แสดงต่อหน้า

  /// ฟังก์ชันสำหรับกรองข้อมูลตามสถานะและข้อความค้นหา
  // ฟังก์ชันสำหรับกรองข้อมูลตามสถานะและข้อความค้นหา
  const filteredData = complaints.filter((item) => {
    const statusMatch =
      selectedStatus === "all" ||
      (item.status &&
        item.status.toLowerCase() === selectedStatus.toLowerCase());

    const searchMatch =
      (item.description &&
        item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.name &&
        item.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.issue &&
        item.issue.toLowerCase().includes(searchQuery.toLowerCase()));

    return statusMatch && searchMatch;
  });

  // 📄 คำนวณหน้าปัจจุบัน  P'ChatGPT
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // 📌 คำนวณจำนวนหน้าทั้งหมด P'ChatGPT
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // ฟังก์ชันสำหรับจัดการการเปลี่ยนแปลงใน Search
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // อัปเดตคำค้นหาใน state
  };

  // ฟังก์ชันสำหรับจัดการการเปลี่ยนแปลงสถานะใน Dropdown
  const handleStatusChange = (selectedValue) => {
    setSelectedStatus(selectedValue); // อัปเดตสถานะที่เลือกใน state
  };

  // ฟังก์ชันสำหรับเพิ่ม className ของสถานะ
  const getStatusClassName = (status) => {
    switch (status) {
      case "New":
        return "bg-pink-100 text-pink-500 px-3 py-1 rounded-full";
      case "Pending":
        return "bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full";
      case "Resolved":
        return "bg-green-100 text-green-600 px-3 py-1 rounded-full";
      case "Cancel":
        return "bg-gray-100 text-gray-500 px-3 py-1 rounded-full";
      default:
        return "bg-gray-100 text-gray-500 px-3 py-1 rounded-full";
    }
  };

  const handleStatusChangeOnClick = async (id) => {
    try {
      // ค้นหา Complaint ตาม ID
      const complaint = complaints.find((item) => item.complaint_id === id);

      // ถ้าสถานะเป็น Resolved ให้เข้าไปยังหน้าใหม่ที่ออกแบบสำหรับ Resolved
      if (complaint.status === "Resolved") {
        router.push(`/admin/complaint-resolved/${id}`);
        return;
      }

      if (complaint.status === "Cancel") {
        router.push(`/admin/complaint-cancel/${id}`);
        return;
      }

      // ถ้าสถานะเป็น Pending ให้เข้าไปหน้า Detail โดยไม่อัปเดตสถานะ
      if (complaint.status === "Pending") {
        router.push(`/admin/complaint-list/${id}`);
        return;
      }

      // ถ้าสถานะเป็น New อัปเดตสถานะเป็น Pending
      if (complaint.status === "New") {
        await axios.patch(`/api/admin/complaint/${id}`, {
          status: "Pending", // ส่งข้อมูล status ใน body
          adminId: admin.admin_id, // แนบ adminId ที่ได้จาก Context
        });

        // อัปเดตสถานะใน State ท้องถิ่น
        setComplaints((prevComplaints) =>
          prevComplaints.map((complaint) =>
            complaint.complaint_id === id
              ? { ...complaint, status: "Pending" }
              : complaint,
          ),
        );
      }

      // นำทางไปยังหน้า Detail
      router.push(`/admin/complaint-list/${id}`);
    } catch (err) {
      console.error("Error updating complaint status:", err);
    }
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
    const fetchComplaints = async () => {
      try {
        const response = await fetch("/api/admin/complaint"); // เรียก API
        if (!response.ok) {
          throw new Error("Failed to fetch complaints");
        }
        const data = await response.json();
        setComplaints(data); // เก็บข้อมูลใน state
      } catch (err) {
        console.error("Error fetching complaints:", err.message);
        setError(err.message); // แสดงข้อผิดพลาด
      } finally {
        setDataLoading(false); // ปิดสถานะการโหลด
      }
    };

    if (!authLoading) {
      fetchComplaints(); // ดึงข้อมูลเมื่อการตรวจสอบเสร็จ
    }
  }, [authLoading]);

  // ตรวจสอบสถานะ loading และแสดงหน้าว่างจนกว่าการตรวจสอบจะเสร็จ
  if (authLoading || dataLoading) {
    return <div></div>; // หรือจะแสดง loading spinner ก็ได้
  }

  return (
    <div className="flex min-h-screen">
      <AdminSideBar />
      <main className="flex-1 bg-fourth-100">
        <AdminHeader
          title="Complaint list"
          searchPlaceholder="Search..."
          onSearchChange={handleSearchChange} // ใช้ฟังก์ชันจัดการ Search
          buttons={[
            {
              type: "dropdown",
              options: [
                { value: "all", label: "All Status" },
                { value: "new", label: "New" },
                { value: "pending", label: "Pending" },
                { value: "resolved", label: "Resolved" },
                { value: "Cancel", label: "Cancel" },
              ],
              onChange: (e) => handleStatusChange(e.target.value), // ใช้ฟังก์ชันจัดการ Dropdown
            },
          ]}
        />

        {/* Table */}

        <div className="mt-12 max-w-full overflow-x-auto px-16">
          <div className="min-h-[630px] overflow-auto">
            <table className="min-w-full table-fixed rounded-2xl bg-white shadow-md">
              <thead className="bg-fourth-400 text-left">
                <tr>
                  <th className="w-[10%] rounded-tl-2xl px-12 py-3 text-sm font-medium leading-5 text-fourth-800">
                    User
                  </th>
                  <th className="w-[20%] px-6 py-3 text-sm font-medium leading-5 text-fourth-800">
                    Issue
                  </th>
                  <th className="w-[45%] px-6 py-3 text-sm font-medium leading-5 text-fourth-800">
                    Description
                  </th>
                  <th className="w-[15%] px-12 py-3 text-sm font-medium leading-5 text-fourth-800">
                    Date Submitted
                  </th>
                  <th className="w-[10%] rounded-tr-2xl px-6 py-3 text-sm font-medium leading-5 text-fourth-800">
                    Status
                  </th>
                </tr>
              </thead>

              {/*  ของเดิม filteredData.length > 0  และ  filteredData.map((item)  */}
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((item) => (
                    <tr
                      key={item.complaint_id}
                      className="cursor-pointer border-t hover:bg-gray-50"
                      onClick={() =>
                        handleStatusChangeOnClick(item.complaint_id)
                      }
                    >
                      <td className="px-12 py-4">{item.name}</td>
                      <td className="max-w-[150px] overflow-hidden truncate text-ellipsis whitespace-nowrap px-6 py-4">
                        {item.issue}
                      </td>
                      <td className="max-w-[250px] overflow-hidden truncate text-ellipsis whitespace-nowrap px-6 py-4">
                        {item.description}
                      </td>

                      <td className="px-12 py-4">
                        {(() => {
                          const date = new Date(item.submited_date); // แปลงเป็น Date object
                          if (isNaN(date)) return "Invalid Date"; // ตรวจสอบว่าข้อมูลวันที่ถูกต้องหรือไม่
                          const day = String(date.getDate()).padStart(2, "0");
                          const month = String(date.getMonth() + 1).padStart(
                            2,
                            "0",
                          );
                          const year = date.getFullYear();
                          return `${day}/${month}/${year}`; // รวมเป็นรูปแบบ DD/MM/YYYY
                        })()}
                      </td>

                      <td className="px-6 py-4">
                        <span className={getStatusClassName(item.status)}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="border border-gray-200 px-4 py-2 text-center"
                    >
                      No data found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 🔘 Pagination Controls */}
          <div className="mt-8 flex justify-center space-x-2">
            {/* 
            ปุ่ม Prev
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="rounded bg-gray-200 px-3 py-1 hover:bg-gray-300"
            >
              Prev
            </button>
            */}
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`rounded-md px-3 py-1 ${
                  currentPage === i + 1
                    ? "bg-primary-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                } rounded`}
              >
                {i + 1}
              </button>
            ))}

            {/* 
            ปุ่ม Next
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="rounded bg-gray-200 px-3 py-1 hover:bg-gray-300"
            >
              Next
            </button>
            */}
          </div>
          {/* End Pagination */}
        </div>
      </main>
    </div>
  );
}

export default ComplaintList;
