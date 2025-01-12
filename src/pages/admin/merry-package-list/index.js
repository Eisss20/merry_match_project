// src/pages/admin/merrypackagelist/index.js

import AdminHeader from "@/components/admin/AdminHeader";
import { FaTrashAlt } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { AdminSideBar } from "@/components/admin/AdminSideBar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { SubmitConfirmationModal } from "@/components/admin/DeleteConfirmationModal";
import { jwtDecode } from "jwt-decode";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

function MerryPackageList() {
  const [packages, setPackages] = useState([]);
  const router = useRouter(); // เรียกใช้ useRouter
  const [searchQuery, setSearchQuery] = useState(""); // for Search
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailToDelete, setDetailToDelete] = useState(null); // state สำหรับ delete โดยเก็บค่า id ของแถวนั้นๆ
  const [authLoading, setAuthLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);

  const { logout } = useAdminAuth(); // ดึง logout จาก Context

  // ✅ State สำหรับ Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // เปลี่ยนเป็น 15 ได้ตามต้องการ

  // ฟังก์ชันดึงข้อมูล package
  const fetchPackages = async () => {
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await axios.get(`${apiBaseUrl}/api/admin/packages`);
      console.log("Fetched Packages:", res.data); // ตรวจสอบข้อมูลที่ได้
      setPackages(res.data); // เก็บข้อมูลใน state
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setDataLoading(false);
    }
  };

  // ฟังก์ชันสำหรับจัดการการเปลี่ยนแปลงใน Search
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // อัปเดตคำค้นหาใน state
  };

  // Filter packages based on search query
  const filteredPackages = packages.filter(
    (pkg) => pkg.name_package.toLowerCase().includes(searchQuery.toLowerCase()), // กรองชื่อแพ็กเกจตาม searchQuery
  );

  // ✅ ตัดข้อมูลตามหน้าปัจจุบัน
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPackages = filteredPackages.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  // ✅ คำนวณจำนวนหน้าทั้งหมด
  const totalPages = Math.ceil(filteredPackages.length / itemsPerPage);

  // ✅ เปลี่ยนหน้าปัจจุบัน
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // deleteDetail Step2:
  // เรียกใช้ state: setDetailToDelete  เพื่อเก็บค่า id ของแถวนั้นๆที่จะทำการลบ detail
  // เรียก setIsModalOpen จากเดิมเป็น false > true เพื่อเปิดการใช้งาน DeleteConfirmationModal จากการเรียกใช้ props ใน DeleteConfirmationModal.JS
  const confirmDelete = (id) => {
    setDetailToDelete(id);
    setIsModalOpen(true);
  };

  //deleteDetail Step6: ใช้ filter เพื่อลบ detail ที่มี id ตรงกับ detailToDelete
  // ตั้งค่า isModalOpen เป็น false เพื่อปิด Modal.
  // รีเซ็ต detailToDelete เป็น null

  // แก้ไขฟังก์ชัน handleDelete ให้ลบข้อมูลจากฐานข้อมูล
  const handleDelete = async () => {
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

      // เรียก API เพื่อลบข้อมูลในฐานข้อมูล
      await axios.delete(`${apiBaseUrl}/api/admin/packages/${detailToDelete}`);
      //, {data: { id: detailToDelete },}
      // อัปเดตรายการ package หลังลบสำเร็จ
      setPackages(packages.filter((pkg) => pkg.package_id !== detailToDelete));

      //setDetails(details.filter((detail) => detail.id !== detailToDelete));
      // ปิด Modal
      setIsModalOpen(false);
      setDetailToDelete(null);
    } catch (error) {
      console.error("Error deleting package:", error);
      alert("Failed to delete package.");
    }
  };

  // deleteDetail Step3.3: เรียกใช้ setIsModalOpen เพื่อ false ปิดหน้า Modal
  const closeModal = () => {
    setIsModalOpen(false);
    setDetailToDelete(null);
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
          alert("Session expired. Please login again.");
          logout(); // Token expired, redirect to login
        } else {
          setAuthLoading(false);
          fetchPackages(); // Fetch package data
        }
      } catch (error) {
        console.error("Token decoding error:", error);
        logout(); // Invalid token, redirect to login
      }
    }
  }, [router]);

  if (authLoading) {
    return <div></div>; // แสดง Loading Spinner หรือข้อความขณะกำลังตรวจสอบ
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <AdminSideBar logout={logout} />

      {/* Main Content */}
      <main className="flex-1 bg-fourth-100">
        {/* Header */}

        <AdminHeader
          title="Merry Package"
          searchPlaceholder="Search..."
          onSearchChange={handleSearchChange} // ใช้ฟังก์ชันจัดการ Search
          buttons={[
            {
              label: "+ Add Package",
              type: "third",
              onClick: () => router.push("/admin/merry-package-add"),
            },
          ]}
        />

        {/* Table */}
        <div className="mt-12 overflow-x-auto px-16">
          {dataLoading ? (
            <div></div>
          ) : (
            <div className="min-h-[700px] overflow-auto">
              <table className="min-w-full rounded-2xl bg-white shadow-md">
                <thead className="bg-fourth-400">
                  <tr>
                    <th className="rounded-tl-2xl px-6 py-3 text-center text-gray-600"></th>
                    <th className="px-6 py-3 text-center text-sm leading-5 text-fourth-800"></th>
                    <th className="px-6 py-3 text-center text-sm font-medium leading-5 text-fourth-800">
                      Icon
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium leading-5 text-fourth-800">
                      Package Name
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium leading-5 text-fourth-800">
                      Merry Limit
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium leading-5 text-fourth-800">
                      Created Date
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-medium leading-5 text-fourth-800">
                      Updated Date
                    </th>
                    <th className="rounded-tr-2xl px-6 py-3 text-center text-gray-600"></th>
                  </tr>
                </thead>

                {/* ของเก่า {filteredPackages.map((pkg, index) => ( */}
                <tbody>
                  {currentPackages.map((pkg, index) => (
                    <tr
                      key={pkg.package_id}
                      className="border-t text-center align-middle hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 align-middle">
                        <span className="cursor-move">⋮⋮</span>
                      </td>
                      <td className="px-6 py-4 align-middle">{index + 1}</td>
                      <td className="px-6 py-4 align-middle">
                        {pkg.icon_url ? (
                          <img
                            src={pkg.icon_url}
                            alt="Package Icon"
                            className="mx-auto h-8 w-8 rounded-lg object-cover"
                          />
                        ) : (
                          <span className="text-gray-500">No Image</span>
                        )}
                      </td>
                      <td className="px-6 py-4 align-middle">
                        {pkg.name_package}
                      </td>
                      <td className="px-6 py-4 align-middle">
                        {pkg.limit_match}
                      </td>
                      <td className="px-6 py-4 align-middle">
                        {pkg.created_date}
                      </td>
                      <td className="px-6 py-4 align-middle">
                        {pkg.updated_date ? pkg.updated_date : "Not updated"}
                      </td>
                      <td className="px-6 py-4 align-middle">
                        <div className="flex items-center justify-center gap-4">
                          <FaTrashAlt
                            className="cursor-pointer text-2xl text-primary-300"
                            onClick={() => confirmDelete(pkg.package_id)}
                          />
                          <FaEdit
                            className="cursor-pointer text-2xl text-primary-300"
                            onClick={() =>
                              router.push(
                                `/admin/merry-package-list/${pkg.package_id}`,
                              )
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ✅ Pagination Controls */}
          <div className="mt-8 flex justify-center">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (number) => (
                <button
                  key={number}
                  onClick={() => handlePageChange(number)}
                  className={`mx-1 rounded-md px-3 py-1 ${
                    number === currentPage
                      ? "bg-primary-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {number}
                </button>
              ),
            )}
          </div>
        </div>
      </main>

      {/* Delete Confirm Modal */}
      <SubmitConfirmationModal
        isOpen={isModalOpen} // isModalOpen = true เปิดใช้งาน
        onClose={closeModal} // deleteDetail Step3.2: เรียกใช้ function closeModal เพื่อยกเลิก
        onConfirm={handleDelete} // ลบรายการโดยกดยืนยัน deleteDetail Step5: เรียกใข้ function: handleDelete
        title="Delete Confirmation"
        message="Do you sure to delete this Package?"
        confirmLabel="Yes, I want to delete"
        cancelLabel="No, I don't want"
      />
    </div>
  );
}

export default MerryPackageList;
