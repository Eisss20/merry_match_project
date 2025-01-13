import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import { CustomButton } from "../CustomUi";

function PaymentSuccess({ name_package, price, description }) {
  const router = useRouter();
  const { icon_url } = router.query;

  const [subscriptionDetails, setSubscriptionDetails] = useState(null);

  // ดึง userId จาก state ใน context ที่ได้มาจากการรับค่าของ Token ตอน login เข้ามาและเก็บเข้าไปใน state ในหน้า context
  // ทำการดึงมาใช้โดยผ่าน useAuth และทำการเข้าถึง state
  const { state, logout } = useAuth();
  const userId = state.user?.id;

  // แปลง description เป็น Array ก่อน
  let parsedDescription = [];
  try {
    if (typeof description === "string" && description.trim() !== "") {
      parsedDescription = JSON.parse(description); // แปลง JSON string เป็น Array
    } else {
      console.warn("Description is not a valid JSON string:", description);
    }
  } catch (error) {
    console.error("Failed to parse description:", error);
    parsedDescription = []; // กำหนดค่าเริ่มต้นเป็น array ว่างหากเกิดข้อผิดพลาด
  }

  useEffect(() => {
    const fetchSubscriptionDetails = async () => {
      try {
        const response = await axios.get(`/api/payment/subscription-detail`, {
          params: { user_id: userId },
        });

        if (response.data) {
          setSubscriptionDetails(response.data);
        } else {
          console.warn("Response is empty or invalid:", response);
        }
      } catch (error) {
        console.error("Error fetching subscription details:", error);
        setErrorMessage(
          "Failed to load subscription details. Please try again.",
        );
      }
    };
    if (userId) {
      fetchSubscriptionDetails();
    }
  }, [userId]);

  useEffect(() => {
    const token = localStorage.getItem("token"); // ตรวจสอบ Token ใน Local Storage
    if (!token) {
      logout();
    }
  }, []);

  return (
    <>
      <div className="container flex max-w-full flex-col justify-center p-3 pb-24 lg:flex lg:max-h-screen lg:flex-row lg:pt-20">
        {/* Header */}
        <div className="cotainer flew flex-col p-2 pt-4 lg:pr-24 lg:pt-10">
          <div className="pb-3 lg:mt-5">
            <Image
              src="/success.svg"
              alt="Success"
              width={80}
              height={80}
              className="w-14"
            />
            <h2 className="pt-5 text-sm text-third-700">PAYMENT SUCCESS</h2>
            <div className="w-52 lg:w-[30rem]">
              <h1 className="justify-center pt-3 text-3xl font-bold leading-9 tracking-normal text-second-500">
                Welcom Merry Membership! Thank you for joining us
              </h1>
            </div>
          </div>

          <div className="container flex hidden flex-row gap-5 space-x-6 pb-40 pt-10 lg:block">
            <CustomButton
              buttonType="secondary"
              onClick={() => router.push("/")}
            >
              Back to home
            </CustomButton>
            <CustomButton
              buttonType="primary"
              onClick={() => router.push("/payment/membership")}
            >
              Check Membership
            </CustomButton>
          </div>
        </div>

        {/* Package Card */}
        <div className="mt-5 h-[25.5rem] w-[22rem] justify-center rounded-3xl border bg-bg-card p-5 shadow-lg">
          <div className="border-1 flex h-16 w-16 flex-row items-center justify-center rounded-2xl bg-gray-100">
            <img src={icon_url} className="h-12 w-12 object-cover" />
          </div>
          <div className="gap-7 pt-3">
            <h1 className="text-[32px] text-white">{name_package}</h1>
            <div className="flex flex-row gap-3 space-y-2 tracking-wide">
              <h2 className="text-[20px] text-second-100">THB {price}.00</h2>
              <span className="text-sm text-second-100">/Month</span>
            </div>
          </div>

          {/* Detail PackageCard */}
          <div className="border-b border-b-white">
            <div className="grid gap-4">
              <div className="space-y-4 pb-10 pt-5">
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
                      <h1 className="text-second-100">{item}</h1>
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
          {/* footer PackageCard */}
          <div>
            <div className="flex w-full justify-between pt-5">
              <h1 className="text-second-200">Start Membership</h1>
              <h1 className="text-white">
                {subscriptionDetails?.subscription_start_date
                  ? new Date(
                      subscriptionDetails.subscription_start_date,
                    ).toLocaleDateString("en-GB")
                  : "N/A"}
              </h1>
            </div>
            <div className="flex w-full justify-between pt-5">
              <h1 className="text-second-200">Next billing</h1>
              <h1 className="text-white">
                {subscriptionDetails?.subscription_end_date
                  ? new Date(
                      subscriptionDetails.subscription_end_date,
                    ).toLocaleDateString("en-GB")
                  : "N/A"}
              </h1>
            </div>
          </div>
        </div>

        <div></div>
        <div></div>

        <div className="container flex justify-start gap-5 pb-10 pt-10 lg:-mt-36 lg:hidden lg:w-[364px] lg:items-center lg:pb-40 lg:pt-10">
          <CustomButton buttonType="secondary" onClick={() => router.push("/")}>
            Back to home
          </CustomButton>
          <CustomButton
            buttonType="primary"
            onClick={() => router.push("/payment/membership")}
          >
            Check Membership
          </CustomButton>
        </div>
      </div>
    </>
  );
}

export default PaymentSuccess;
