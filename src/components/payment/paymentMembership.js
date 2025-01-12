import Image from "next/image";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import { useCallback } from "react";
import DeleteConfirmationModal, {
  SubmitCancelMembershipModal,
} from "@/components/admin/DeleteConfirmationModal";
import {
  SkeletonPaymentMembershipPackage,
  SkeletonPaymentMembershipHistory,
} from "../custom-loading/SkeletonCard";

function PaymentMembership() {
  const { state, logout } = useAuth();
  const userId = state.user?.id;

  const [paymentMembership, setPaymentMembership] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [membershipLoading, setMembershipLoading] = useState(true);
  const [HistoryLoading, setHistoryLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // ควบคุมการแสดงผล Modal
  const [modalMessage, setModalMessage] = useState(""); // ข้อความใน Modal
  const [confirmAction, setConfirmAction] = useState(() => () => {}); // เก็บฟังก์ชันที่ต้องการเรียกเมื่อผู้ใช้กดยืนยัน
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // เพิ่ม State สำหรับ Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // จำนวนรายการที่แสดงต่อหน้า

  const fetchMembership = useCallback(async () => {
    setMembershipLoading(true);
    try {
      const response = await axios.get(
        `/api/payment/paymentMembership-detail`,
        {
          params: { user_id: userId },
        },
      );

      if (response.data) {
        setPaymentMembership(response.data);
      } else {
        console.warn("Response is empty or invalid:", response);
      }
    } catch (error) {
      console.error("Error fetching Membership:", error);
      setErrorMessage("Failed to load Membership. Please try again.");
    } finally {
      setMembershipLoading(false);
    }
  }, [userId]);

  const fetchPaymentHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const response = await axios.get("/api/payment/paymentHistory", {
        params: { user_id: userId },
      });

      if (response.data) {
        setPaymentHistory(response.data);
      } else {
        console.warn("No billing history found");
      }
    } catch (error) {
      console.error("Error fetching billing history:", error);
    } finally {
      setHistoryLoading(false);
    }
  }, [userId]);

  const handleCancelPackage = async () => {
    setCancelLoading(true);
    try {
      const response = await axios.post("/api/payment/cancelPackage", {
        user_id: userId,
      });
      if (response.data.message) {
        // alert("Package cancelled successfully."); <<<<<<<<<<<<<<<<<<<<<<<<<<<
        //setModalMessage("Do you sure to cancel Membership to get more Merry"); // ตั้งข้อความใน Modal
        fetchMembership(); // Refresh membership data after cancellation
      }
    } catch (error) {
      console.error("Error cancelling package:", error);
      alert("Failed to cancel package. Please try again.");
    } finally {
      setCancelLoading(false);
    }
  };

  const openCancelModal = () => {
    setModalMessage("Do you sure to cancel Membership to get more Merry?");
    setConfirmAction(() => handleCancelPackage); // เก็บฟังก์ชันสำหรับดำเนินการหลังจากยืนยัน
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (userId) {
      fetchMembership();
      fetchPaymentHistory();
    }
  }, [userId, fetchMembership, fetchPaymentHistory]);

  useEffect(() => {
    if (paymentHistory.length > 0) {
      const firstRecord = paymentHistory[0]; // ดึงรายการแรกใน paymentHistory
      setStartDate(firstRecord.subscription_start_date || null);
      setEndDate(firstRecord.subscription_end_date || null);
    }
  }, [paymentHistory]);

  useEffect(() => {
    const token = localStorage.getItem("token"); // ตรวจสอบ Token ใน Local Storage
    if (!token) {
      logout();
    }
  }, []);

  let parsedDescription = paymentMembership?.description
    ? JSON.parse(paymentMembership.description)
    : [];

  // คำนวณการแบ่งหน้า
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentHistory = paymentHistory.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  // ฟังก์ชันเปลี่ยนหน้า
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (membershipLoading || HistoryLoading) {
    return (
      <div className="mx-auto min-h-screen max-w-4xl px-4 py-8">
        <SkeletonPaymentMembershipPackage />
        <SkeletonPaymentMembershipHistory />
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-4xl px-4 py-8 pt-10 text-gray-700 lg:pt-20">
        <h3 className="text-sm text-third-800 lg:text-left">
          MERRY MEMBERSHIP
        </h3>
        <h1 className="pt-3 text-3xl font-extrabold text-second-500 lg:text-left lg:text-4xl">
          Manage your membership <br />
          and payment method
        </h1>

        {/* Membership Package */}
        <section className="pt-7 lg:pt-16">
          <h2 className="text-xl font-bold text-gray-700 lg:text-left lg:text-xl">
            Merry Membership Package
          </h2>
          <div className="relative mt-4 rounded-[24px] bg-bg-card p-6 text-white shadow">
            <div className="flex flex-col gap-4 lg:flex-row">
              <div className="border-1 flex h-16 w-16 flex-shrink-0 flex-row items-center justify-center rounded-2xl bg-gray-100">
                <img
                  src={paymentMembership.icon_url}
                  alt="Package Icon"
                  className="h-12 w-12 object-cover"
                />
              </div>

              <div>
                <h3 className="text-2xl font-bold lg:text-3xl">
                  {paymentMembership.name_package}
                </h3>
                <p className="lg:text-md mt-1 text-lg">
                  THB {paymentMembership?.price}
                  <span className="text-sm"> /Month </span>
                </p>
              </div>
              {/* Detail PackageCard */}
              <div className="grid gap-4 lg:pl-20">
                <div className="space-y-4 pb-10">
                  {Array.isArray(parsedDescription) &&
                  parsedDescription.length > 0 ? (
                    parsedDescription.map((item, index) => (
                      <div className="flex items-center gap-3" key={index}>
                        <Image
                          src="/checkbox-circle-fill.svg"
                          alt="checkbox-circle-fill.svg"
                          width={24}
                          height={24}
                        />
                        <h1 className="lg:text-md text-second-100">{item}</h1>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center gap-3">
                      <h1 className="text-gray-400 text-second-100">
                        No details available
                      </h1>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <hr></hr>
            <div className="mt-6 flex flex-col justify-between text-sm lg:hidden lg:text-base">
              <div className="flex justify-between">
                <p>Start Membership</p>
                <p className="font-semibold">
                  {startDate
                    ? new Date(startDate).toLocaleDateString("en-GB")
                    : "N/A"}
                </p>
              </div>
              <div className="flex justify-between">
                <p>Next Billing</p>
                <p className="font-semibold">
                  {endDate
                    ? new Date(endDate).toLocaleDateString("en-GB")
                    : "N/A"}
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={openCancelModal} // เปิด Modal
                disabled={
                  cancelLoading ||
                  paymentMembership.subscription_status === "Cancelled"
                }
                className={`hidden text-base font-semibold text-white lg:block lg:pt-5 ${
                  cancelLoading ? "cursor-not-allowed opacity-50" : ""
                }`}
              >
                {cancelLoading ? "Cancelling..." : "Cancel Package"}
              </button>
            </div>
            <button className="absolute right-6 top-6 hidden rounded-full bg-rose-50 px-4 py-1 text-sm font-bold text-primary-600 hover:bg-primary-100 lg:block">
              {paymentMembership.subscription_status === "Active"
                ? "Active"
                : "Inactive"}
            </button>
          </div>
        </section>

        {/* Billing History */}
        <section className="pt-10">
          <h2 className="text-xl font-bold lg:text-left lg:text-xl">
            Billing History
          </h2>
          <div className="flex lg:hidden">
            <h3 className="mt2 text-lg font-semibold text-gray-600 lg:text-lg">
              <div>
                Next billing :&nbsp;
                {endDate
                  ? new Date(endDate).toLocaleDateString("en-GB")
                  : "N/A"}
              </div>
            </h3>
          </div>
          <div className="mt-4 shadow lg:rounded-2xl lg:p-6">
            {/* กำหนดความสูงคงที่ให้ตาราง */}
            <div className="min-h-[450px] overflow-auto">
              <table className="w-full text-sm lg:text-base">
                <thead>
                  <tr>
                    <th className="0 mb-4 hidden text-sm font-semibold text-gray-500 lg:flex lg:text-lg">
                      <div>Next billing :&nbsp;</div>

                      <div>
                        {endDate
                          ? new Date(endDate).toLocaleDateString("en-GB")
                          : "N/A"}
                      </div>
                    </th>
                  </tr>
                </thead>

                {/* ของเดิม
              {paymentHistory.length > 0 ? (
                  paymentHistory.map((history, index) => (
              */}
                <tbody>
                  {currentHistory.length > 0 ? (
                    currentHistory.map((history, index) => (
                      <tr
                        key={index}
                        className={index % 2 !== 0 ? "bg-gray-100" : ""}
                      >
                        <td className="p-2">
                          {new Date(history.payment_date).toLocaleDateString(
                            "en-GB",
                          )}
                        </td>
                        <td className="pl-3">{history.name_package}</td>
                        <td className="pr-5 text-right">THB {history.price}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="py-3 text-center">
                        No billing history found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {paymentHistory.length > itemsPerPage && (
            <div className="mt-8 flex justify-center space-x-2">
              {Array.from({
                length: Math.ceil(paymentHistory.length / itemsPerPage),
              }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`rounded-md px-3 py-1 ${
                    currentPage === index + 1
                      ? "bg-primary-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}

          {/* End Pagination */}
        </section>
      </div>

      {/* Modal การลบ */}
      <SubmitCancelMembershipModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} // ปิด Modal
        onConfirm={() => {
          confirmAction(); // เรียกฟังก์ชันที่ตั้งไว้ (handleCancelPackage)
          setIsModalOpen(false); // ปิด Modal
        }}
        title="Confirm Confirmation"
        message={modalMessage}
        confirmLabel="Yes, I want to cancel"
        cancelLabel="No, I still want to be member"
      />
    </>
  );
}

export default PaymentMembership;
