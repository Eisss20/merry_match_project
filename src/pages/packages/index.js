import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router"; // สำหรับ Redirect
import { NavBar, Footer } from "@/components/NavBar";
import { CustomButton } from "@/components/CustomUi";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { useAuth } from "@/contexts/AuthContext";
import DeleteConfirmationModal from "@/components/admin/DeleteConfirmationModal";
import { DeleteConfirmationModal2 } from "@/components/admin/DeleteConfirmationModal";
import { SkeletonMembership } from "@/components/custom-loading/SkeletonCard";

export default function MerryPackage() {
  const [packages, setPackages] = useState([]); // เก็บข้อมูลแพ็กเกจ
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMember, setIsMember] = useState(false); // เช็คสถานะการเป็นสมาชิก
  const [isModalOpen, setIsModalOpen] = useState(false); // เปิด/ปิด Modal
  const [selectedPackage, setSelectedPackage] = useState(null); // แพ็กเกจที่เลือกสำหรับการซื้อ <---> Modal
  const [duplicatePackageMessage, setDuplicatePackageMessage] = useState(""); // เก็บข้อความแจ้งเตือนข้อผิดพลาด
  const [duplicatePackageModal, setDuplicatePackageModal] = useState(false); // ควบคุม Modal ข้อผิดพลาด

  const router = useRouter(); // ใช้สำหรับ Redirect

  const { state, logout } = useAuth();
  const userId = state.user?.id;

  // ดึงข้อมูลแพ็กเกจ
  const fetchPackages = async () => {
    try {
      console.log("userId in fetchPackages = ", userId);
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await axios.get(`${apiBaseUrl}/api/packages`, {
        params: { user_id: userId }, // ส่ง user_id ผ่าน Query Params
      });

      setPackages(response.data);
    } catch (err) {
      setError("Error fetching packages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token"); // ตรวจสอบ Token ใน Local Storage
    if (token) {
      setIsMember(true); // หากมี Token ให้ถือว่าเป็นสมาชิก
    } else {
      logout();
    }
    if (userId) {
      fetchPackages(); // เรียกเฉพาะเมื่อ userId มีค่า
    }
  }, [userId]);

  // ฟังก์ชันเมื่อคลิกปุ่ม Choose Package
  const handleChoosePackage = async (pkg) => {
    if (pkg.is_same_package_active) {
      console.log("This package is already purchased and cannot be chosen.");
      return; // ไม่ทำอะไรถ้าปุ่มถูกปิดการใช้งาน
    }

    console.log("pkg is : ", pkg.id);
    console.log("id is : ", userId);

    if (isMember) {
      try {
        console.log(
          "Attempting to choose package:",
          pkg.id,
          "for user:",
          userId,
        );

        // เรียก API เพื่อตรวจสอบว่า Package นี้ซื้อได้หรือไม่
        const response = await axios.post("/api/payment/checkPackage", {
          user_id: userId, // ใช้ state.user?.id แทน currentUser.id
          package_id: pkg.id,
        });

        const { isActive, isSamePackageActive } = response.data;

        console.log("API Response Checkpackage :", response.data);

        if (isActive && !isSamePackageActive) {
          // หากมี active package -> แสดง modal เพื่อยืนยันการซื้อ
          setSelectedPackage(pkg); // บันทึกแพ็กเกจที่เลือก
          setIsModalOpen(true); // เปิด modal
        } else {
          // หากไม่มี active package -> ซื้อได้โดยตรง (ไม่มี modal)
          router.push({
            pathname: "/payment",
            query: {
              icon_url: pkg.icon_url,
              packages_id: pkg.id,
              name_package: pkg.title,
              price: pkg.price,
              description: JSON.stringify(pkg.details), // ส่งเป็น JSON string
              stripe_price_id: pkg.stripe_price_id,
            },
          });
        }
      } catch (error) {
        console.error("Error checking package:", error.response?.data || error);
      }
    } else {
      // หากไม่ได้เป็นสมาชิก Redirect ไปยังหน้า Login
      alert("You must be logged in to choose a package!");
      router.push("/login");
    }
  };

  // ฟังก์ชันยืนยันการซื้อกรณีที่ยืนยันซื้อ Package อื่นโดยที่ยัง Active อันเก่าอยู่
  const confirmPurchase = () => {
    setIsModalOpen(false); // ปิด modal
    if (selectedPackage) {
      router.push({
        pathname: "/payment",
        query: {
          packages_id: selectedPackage.id,
          name_package: selectedPackage.title,
          price: selectedPackage.price,
          description: JSON.stringify(selectedPackage.details), // ส่งเป็น JSON string
          stripe_price_id: selectedPackage.stripe_price_id,
        },
      });
    }
  };

  // ถ้ากำลังโหลด หรือเกิดข้อผิดพลาด ให้แสดงข้อความ
  if (loading) return <SkeletonMembership count={12} />;
  if (error) return <div>{error}</div>;

  return (
    <>
      <NavBar />
      <section className="bg-utility-primary p-5">
        <article className="flex flex-col gap-2 bg-utility-primary p-4 pb-5 pt-5 lg:pb-14 lg:pl-52 lg:pt-10">
          <div>
            <h3 className="font-medium text-third-700">MERRY MEMBERSHIP</h3>
          </div>
          <div className="text-4xl font-bold text-second-500">
            <h1 className="lg:hidden">
              Join us and start <br /> matching
            </h1>
            <h1 className="hidden font-extrabold lg:block">
              Be part of Merry Membership <br /> to make more Merry!
            </h1>
          </div>
        </article>

        <div className="items-center justify-center lg:flex lg:flex-row">
          <figure className="container grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-6 lg:p-20">
            {packages.map((pkg, index) => (
              <div
                className="lg:flex lg:flex-row lg:justify-around"
                key={pkg.id} // ใช้ id ผสมกับ index เพื่อให้ key unique
              >
                <article className="flex flex-col gap-3 rounded-3xl border-2 bg-utility-primary pb-6 pl-10 pr-6 pt-6 shadow-md lg:h-[26rem] lg:w-[100%] lg:pl-10 lg:pr-8">
                  {/* icon package */}
                  <div className="border-1 flex h-16 w-16 flex-row items-center justify-center rounded-2xl bg-gray-100">
                    {/* แสดงรูปภาพ icon */}
                    <img
                      src={pkg.icon_url}
                      alt={pkg.title}
                      className="h-12 w-12 object-cover"
                    />
                  </div>
                  {/* Title package */}
                  <div>
                    <h1 className="mt-2 text-3xl font-bold">{pkg.title}</h1>
                  </div>
                  <div className="flex gap-2">
                    {/* Currency data */}
                    <h2 className="text-2xl text-black">{pkg.currency_code}</h2>
                    <h2 className="text-2xl text-black">{pkg.price}</h2>
                    <h2 className="text-2xl text-gray-400">/Month</h2>
                  </div>
                  {/* Cost package */}
                  <div>
                    <h1>
                      {pkg.cost} <span>{pkg.duration}</span>
                    </h1>
                  </div>
                  {/* Details */}
                  <div className="flex-grow">
                    {pkg.details &&
                    Array.isArray(pkg.details) &&
                    pkg.details.length > 0 ? (
                      pkg.details.map((detail, index) => (
                        <div
                          className="mt-1 flex items-center gap-2"
                          key={index}
                        >
                          <IoIosCheckmarkCircle className="mr-2 text-pink-500" />
                          <p className="text-gray-700">{detail}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400">No details available</p>
                    )}
                  </div>

                  <hr className="mb-3 mt-3" />

                  {/* Button */}
                  <CustomButton
                    className={`flex flex-shrink-0 font-bold shadow-sm ${
                      pkg.is_same_package_active ? "cursor-not-allowed" : ""
                    }`}
                    buttonType="secondary"
                    onClick={() => {
                      if (!pkg.is_same_package_active) {
                        handleChoosePackage(pkg); // เรียกฟังก์ชันเฉพาะเมื่อปุ่มไม่ถูกปิดการใช้งาน
                      }
                    }}
                    disabled={pkg.is_same_package_active} // ปิดการใช้งานถ้า is_same_package_active เป็น true
                  >
                    {pkg.is_same_package_active
                      ? "Purchased"
                      : "Choose Package"}
                  </CustomButton>
                </article>
              </div>
            ))}
          </figure>
        </div>
      </section>

      <Footer />

      {/* Modal ยืนยันการซื้อ */}
      <DeleteConfirmationModal2
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Unable to Purchase a New Package"
        message
        cancelLabel="Got It"
      />

      {/* Modal แจ้งเตือนซื้อ package ซ้ำ */}
      <DeleteConfirmationModal
        isOpen={duplicatePackageModal}
        onClose={() => setDuplicatePackageModal(false)}
        title="Error"
        message={duplicatePackageMessage}
        confirmLabel="Close"
        onConfirm={() => setDuplicatePackageModal(false)}
      />
    </>
  );
}
