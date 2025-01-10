import Image from "next/image";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import { useCallback } from "react";
import DeleteConfirmationModal from "@/components/admin/DeleteConfirmationModal";
import {
  SkeletonPaymentMembershipPackage,
  SkeletonPaymentMembershipHistory,
} from "../custom-loading/SkeletonCard";

function PaymentMembership() {
  const { state } = useAuth();
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
        setModalMessage("Package cancelled successfully."); // ตั้งข้อความใน Modal
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
    setModalMessage("Are you sure you want to cancel this package?");
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

  let parsedDescription = paymentMembership?.description
    ? JSON.parse(paymentMembership.description)
    : [];

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
      <div className="mx-auto max-w-4xl px-4 py-8 text-gray-700">
        <h3 className="lg:text-left">MERRY MEMBERSHIP</h3>
        <h1 className="w-auto text-4xl font-bold text-primary-700 lg:text-left lg:text-4xl">
          Manage your membership
        </h1>
        <h1 className="w-auto text-4xl font-bold text-primary-700 lg:text-left lg:text-4xl">
          and payment method
        </h1>

        {/* Membership Package */}
        <section className="mt-8">
          <h2 className="text-lg font-bold lg:text-left lg:text-xl">
            Merry Membership Package
          </h2>
          <div className="relative mt-4 rounded-[24px] bg-bg-card p-6 text-white">
            <div className="flex flex-col gap-4 lg:flex-row">
              <div className="h-[60px] w-[60px] flex-shrink-0">
                <img
                  src={paymentMembership.icon_url}
                  alt="Package Icon"
                  className="h-full w-full rounded-lg object-cover"
                />
              </div>

              <div>
                <h3 className="text-2xl font-bold lg:text-3xl">
                  {paymentMembership.name_package}
                </h3>
                <p className="lg:text-md mt-1 text-lg">
                  THB {paymentMembership?.price} / Month
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
            <button className="absolute right-6 top-6 hidden rounded-full bg-rose-50 px-4 py-1 text-sm font-medium text-orange-600 lg:block">
              {paymentMembership.subscription_status === "Active"
                ? "Active"
                : "Inactive"}
            </button>
          </div>
        </section>

        {/* Billing History */}
        <section className="mt-8">
          <h2 className="text-lg font-bold lg:text-left lg:text-xl">
            Billing History
          </h2>
          <div className="flex lg:hidden">
            <h3 className="mb-4 text-sm font-semibold text-gray-600 lg:text-lg">
              <div>
                Next billing :&nbsp;
                {endDate
                  ? new Date(endDate).toLocaleDateString("en-GB")
                  : "N/A"}
              </div>
            </h3>
          </div>
          <div className="mt-4 rounded-[24px] bg-white p-6 shadow">
            <table className="w-full text-sm lg:text-base">
              <thead>
                <tr>
                  <th className="mb-4 hidden text-sm font-semibold text-gray-600 lg:flex lg:text-lg">
                    <div>Next billing :&nbsp;</div>

                    <div>
                      {endDate
                        ? new Date(endDate).toLocaleDateString("en-GB")
                        : "N/A"}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.length > 0 ? (
                  paymentHistory.map((history, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-gray-50" : ""}
                    >
                      <td className="py-3">
                        {new Date(history.payment_date).toLocaleDateString(
                          "en-GB",
                        )}
                      </td>
                      <td className="py-3">{history.name_package}</td>
                      <td className="py-3 text-right">THB {history.price}</td>
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
        </section>
      </div>

      {/* Modal การลบ */}
      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} // ปิด Modal
        onConfirm={() => {
          confirmAction(); // เรียกฟังก์ชันที่ตั้งไว้ (handleCancelPackage)
          setIsModalOpen(false); // ปิด Modal
        }}
        title="Confirm Cancellation"
        message={modalMessage}
        confirmLabel="Yes, Cancel"
        cancelLabel="No, Keep it"
      />
    </>
  );
}

export default PaymentMembership;
