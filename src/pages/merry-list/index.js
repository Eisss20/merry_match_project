import { useRouter } from "next/router";
import axios from "axios";
import React, { useState, useEffect, Fragment } from "react";
import { GoHeartFill } from "react-icons/go";
import {
  HiMiniMapPin,
  HiMiniChatBubbleOvalLeftEllipsis,
} from "react-icons/hi2";
import { IoMdEye } from "react-icons/io";
import { NavBar, Footer } from "@/components/NavBar";
import { jwtDecode } from "jwt-decode";
import { MatchlistProfile } from "@/components/profile/MatchlistProfile";
import LoadingMerry from "@/components/custom-loading/LoadingMerry";

function MerryCountBox({ count = 0, text = "Merry", twoHearts = false }) {
  return (
    <div className="flex w-full flex-col gap-1 rounded-2xl border-2 border-fourth-200 bg-utility-primary px-6 py-4 md:w-[12.5rem]">
      <div className="flex items-center gap-2">
        <p className="text-2xl font-bold text-primary-500">{count}</p>

        <div className="relative flex text-primary-400">
          {twoHearts === true ? (
            <>
              <GoHeartFill className="size-6" />
              <div className="absolute left-[18px] top-0 flex">
                <GoHeartFill className="z-10 size-6" />
                <GoHeartFill className="absolute right-[1px] size-6 translate-y-[0.3px] -rotate-[4deg] scale-x-[1.1] scale-y-[1.2] text-utility-primary" />
              </div>
            </>
          ) : (
            <GoHeartFill className="size-6" />
          )}
        </div>
      </div>

      <p className="text-sm font-medium text-fourth-700 md:text-base">{text}</p>
    </div>
  );
}

function ProfileBox({
  profileData,
  updateMerryToggle,
  onPreviewClick,
}) {
  const [merryToggle, setMerryToggle] = useState(true);

  const ProfileButton = ({ className = "flex" }) => {
    const toggleMerry = () => {
      // ฟังก์ชันที่ใช้สลับสถานะของปุ่ม Merry ระหว่างสีเทาและสีแดง
      const newToggleState = !merryToggle;
      setMerryToggle(newToggleState);
      updateMerryToggle(profileData.user_other, newToggleState);
      // ส่งข้อมูล user_other และสถานะของปุ่ม Merry ไปยังฟังก์ชัน updateMerryToggle ที่อยู่ใน ProfileBox
    };

    return (
      <div
        className={`flex min-w-[165px] flex-col items-end justify-center gap-5 md:justify-start ${className}`}
      >
        {/* Merry match/Not match */}
        {profileData.is_match === true ? ( // ถ้า is_match เป็น true ให้แสดงปุ่ม Merry match
          <div className="flex items-center gap-1 rounded-full border-2 border-primary-500 px-4 py-[0.1rem] text-primary-500">
            {/* Two hearts icon */}
            <div className="relative w-[21.5px] text-primary-400">
              <GoHeartFill className="size-3" />
              <div className="absolute left-[10px] top-0 flex">
                <GoHeartFill className="z-10 size-3" />
                <GoHeartFill className="absolute right-[1px] size-3 translate-y-[0.3px] -rotate-[4deg] scale-x-[1.1] scale-y-[1.2] text-utility-primary" />
              </div>
            </div>
            <p className="font-extrabold">Merry Match!</p>
          </div>
        ) : (
          <div className="flex items-center gap-1 rounded-full border-2 border-fourth-500 px-4 py-[0.1rem] text-fourth-700">
            <p className="font-semibold">Not Match Yet</p>
          </div>
        )}

        <div className="flex gap-4">
          {/* Chat button */}
          {profileData.is_match === true && (
            <button
              className={`flex size-11 items-center justify-center rounded-2xl bg-utility-primary text-fourth-700 transition-all duration-300 [box-shadow:3px_3px_12.5px_rgba(0,0,0,0.1)] hover:scale-105 md:size-12`}
              onClick={() => {}}
            >
              <HiMiniChatBubbleOvalLeftEllipsis className="size-5 md:size-6" />
            </button>
          )}

          {/* View profile button */}
          <button
            className={`flex size-11 items-center justify-center rounded-2xl bg-utility-primary text-fourth-700 transition-all duration-300 [box-shadow:3px_3px_12.5px_rgba(0,0,0,0.1)] hover:scale-105 md:size-12`}
            onClick={() => onPreviewClick(profileData)}
          >
            <IoMdEye className="size-5 md:size-6" />
          </button>

          {/* Merry button */}
          <button
            className={`flex size-11 items-center justify-center rounded-2xl text-fourth-700 transition-all duration-300 [box-shadow:3px_3px_12.5px_rgba(0,0,0,0.1)] hover:scale-105 md:size-12 ${
              merryToggle
                ? "bg-primary-500 text-utility-primary"
                : "bg-utility-primary"
            }`} // สลับสีพื้นหลังและสีตัวอักษรของปุ่ม Merry ระหว่างสีเทาและสีแดง
            onClick={toggleMerry} // เรียกใช้ฟังก์ชัน toggleMerry
          >
            <GoHeartFill className="size-5 md:size-6" />
          </button>
        </div>
      </div>
    );
  };

  const ProfileDetail = ({ className = "flex" }) => {
    return (
      <div className={`flex-col justify-between text-fourth-900 ${className}`}>
        {/* Profile name */}
        <div className="flex items-center gap-5">
          <p className="min-w-fit text-2xl font-bold">
            {profileData.name}
            <span className="pl-2 text-fourth-700">{profileData.age}</span>
          </p>

          <div className="flex items-center gap-2 text-fourth-700">
            <HiMiniMapPin className="aspect-square w-4 min-w-4 text-primary-200" />
            <p>
              {profileData.location_name}, {profileData.city_name}
            </p>
          </div>
        </div>

        {/* Profile detail */}
        <div className="text-sm md:max-w-full">
          <div className="flex flex-col gap-2 lg:gap-3">
            {detailList.map((list, index) => (
              <div key={index} className="grid grid-cols-[9.5rem_1fr]">
                <p className="font-semibold text-fourth-900">{list}</p>
                <p className="text-fourth-700">{detailData[index]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const detailList = [
    "Sexual identities",
    "Sexual preferences",
    "Racial preferences",
    "Meeting interests",
  ];

  const detailData = [
    profileData.sexual_identity,
    profileData.sexual_preference,
    profileData.racial_preference,
    profileData.meeting_interest,
  ];

  return (
    <div className="flex flex-col gap-6 md:flex-row md:justify-between">
      <div className="flex w-full justify-between gap-5 md:justify-start md:gap-10 lg:gap-12">
        {/* Profile picture */}
        <figure className="relative aspect-square min-w-[7rem] max-w-[10rem] overflow-hidden rounded-3xl md:max-w-[11rem]">
          <img
            src={
              profileData?.images[0]?.image_url || "/images/blank-profile.png"
            }
            alt=""
            className="h-full w-full object-cover"
          />

          {profileData.date_match &&
            new Date(profileData.date_match).toDateString() ===
              new Date().toDateString() && (
              <div className="absolute bottom-0 left-0 flex h-[1.5rem] w-[5.5rem] justify-end rounded-tr-xl bg-second-100 pr-2 pt-1 text-xs text-second-600">
                Merry today
              </div>
            )}
          <div className="h-[1px] w-full bg-fourth-300"></div>
        </figure>

        {/* Profile desktop */}
        <ProfileDetail className="hidden md:flex" />

        {/* Button Mobile*/}
        <ProfileButton className="flex md:hidden" />
      </div>

      {/* Profile mobile */}
      <ProfileDetail className="flex gap-4 md:hidden" />

      {/* Button desktop*/}
      <ProfileButton className="hidden md:flex" />
    </div>
  );
}

export default function MerryList() {
  const router = useRouter();
  const [profileDataRaw, setProfileDataRaw] = useState([]);
  const [profilesToDelete, setProfilesToDelete] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalTrue, setTotalTrue] = useState(0);
  const [totalFalse, setTotalFalse] = useState(0);
  const [merryRemainLimit, setMerryRemainLimit] = useState(null);
  const [merryTotaLimit, setMerryTotalLimit] = useState(null);
  const [merryTime, setMerryTime] = useState(null);
  const [merryCurrentTime, setMerryCurrentTime] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);

  const handlePreviewClick = (profileData) => {
    setSelectedProfile(profileData); // ตั้งค่าโปรไฟล์ที่ถูกเลือก
    document.getElementById("preview-profile-desktop").showModal(); // เปิด Modal
  };

  useEffect(() => {
    const fetchProfiles = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(true); // เปิดหน้าโหลด
        setTimeout(() => {
          // alert("Please log in to continue.")
          router.push("/login"); // ส่งไปยังหน้า login หลังรอ 2 วินาที
        }, 3000);
        return;
      }

      try {
        const decodedToken = jwtDecode(token); //    ถอดรหัส token ด้วย jwtDecode
        const userMasterId = decodedToken.id; //  ดึง userMasterId จาก decodedToken payload

        console.log("Logged in User ID (from token):", userMasterId);

        const response = await axios.get(`/api/merry-list`, {
          // ดึงข้อมูล Matches และจำนวน Matches จาก API
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProfileDataRaw(response.data.matches || []);
        setTotalTrue(response.data.total_true || 0);
        setTotalFalse(response.data.total_false || 0);
        setMerryRemainLimit(response.data.limit_info.matches_remaining || 0);
        setMerryTime(response.data.limit_info.hours_reset_time || 0);
        setMerryTotalLimit(response.data.limit_info.total_limit || 0);
        setMerryCurrentTime(response.data.limit_info.reset_time || 0);
        setSelectedProfile(response.data.matches[0] || null);
      } catch (error) {
        console.error("Invalid token or fetch error:", error);
        // alert("Invalid session. Please log in again.");
        setLoading(true);
        localStorage.removeItem("token");
        router.push("/login");
        return;
      } finally {
        setLoading(false);
      }
    };

    const storedProfiles = JSON.parse(
      sessionStorage.getItem("profilesToDelete") || "[]", // ดึง profilesToDelete จาก sessionStorage ถ้าไม่มีให้ใช้ค่าเริ่มต้นเป็น []
    );
    if (storedProfiles.length > 0) {
      deleteProfiles(storedProfiles); // ถ้ามี profilesToDelete ใน sessionStorage ให้ลบ profiles ที่อยู่ใน profilesToDelete เมื่อรีเฟรชเว็บเพจ
    }

    fetchProfiles();
  }, []); // ให้เรียกใช้ฟังก์ชันเมื่อคอมโพเนนต์ถูกโหลดเท่านั้น

  const deleteProfiles = async (profiles) => {
    const token = localStorage.getItem("token"); // ดึง token จาก localStorage
    if (profiles.length === 0 || !token) {
      console.warn("Empty profiles list or missing token.");
      return;
    }

    try {
      const response = await axios.delete(`/api/merry-list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { users_to_delete: profiles },
      });
      console.log("Deleted profiles:", profiles);
      console.log("Response status:", response.status);
      console.log("Response data:", response.data);
      sessionStorage.removeItem("profilesToDelete");
    } catch (error) {
      console.error("Error deleting profiles:", error);
    }
  };

  const updateMerryToggle = (userOther, isActive) => {
    // ฟังก์ชันที่ใช้สลับสถานะของปุ่ม Merry ระหว่างสีเทาและสีแดง
    const updatedProfiles = isActive // ถ้าปุ่ม Merry ถูกกด ให้เพิ่ม userOther ลงใน profilesToDelete และบันทึกลง sessionStorage
      ? profilesToDelete.filter((id) => id !== userOther) //  ถูกกดเป็นสีแดง ให้ลบ userOther ออกจาก profilesToDelete และบันทึกลง sessionStorage
      : [...profilesToDelete, userOther]; // ถูกกดเป็นสีเทา ให้เพิ่ม userOther ลงใน profilesToDelete และบันทึกลง sessionStorage เพื่อรอการลบ

    setProfilesToDelete(updatedProfiles);
    sessionStorage.setItem("profilesToDelete", JSON.stringify(updatedProfiles)); // บันทึก profilesToDelete ลงใน sessionStorage
  };

  if (loading) {
    return (
      <LoadingMerry />

      // <main className="flex h-screen items-center justify-center bg-utility-bgMain">
      //   <span className="loading loading-spinner loading-lg"></span>
      // </main>
    );
  }

  return (
    <main className="flex flex-col bg-utility-bgMain">
      <NavBar />

      <section className="container mx-auto flex max-w-[450px] flex-col gap-12 px-4 pb-20 pt-10 md:max-w-[768px] lg:max-w-[1024px] lg:pb-40 lg:pt-20 xl:max-w-[1200px]">
        <header className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold uppercase text-third-700 lg:text-base">
              Merry list
            </p>
            <p className="text-2xl font-extrabold text-second-500 md:text-4xl">
              Let's know each other <br className="inline sm:hidden" /> with
              Merry!
            </p>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-4">
              <MerryCountBox
                count={totalTrue}
                text="Merry Match"
                // จำนวน Merry Match และ Not a Match ที่ได้จาก totalTrue และ totalFalse
              />
              <MerryCountBox count={totalFalse} text="Not a Match" />
            </div>

            <div className="flex flex-col items-end">
              <p className="text-sm text-fourth-700 lg:text-base">
                Merry limit today{" "}
                <span className="text-primary-400">
                  {merryRemainLimit}/{merryTotaLimit}{" "}
                </span>
              </p>
              <p className="text-xs text-fourth-600 lg:text-sm">
                Reset in {merryTime}h...
              </p>
            </div>
          </div>
        </header>

        <div className="flex flex-col gap-10">
          {profileDataRaw.map((profileData) => (
            <Fragment key={profileData.user_other}>
              <ProfileBox
                profileData={profileData}
                updateMerryToggle={updateMerryToggle}
                merryCurrentTime={merryCurrentTime}
                onPreviewClick={handlePreviewClick} // ส่งฟังก์ชัน onPreviewClick
                selectedProfile={selectedProfile}
              />
              <div className="h-[1px] w-full bg-fourth-300"></div>
            </Fragment>
          ))}
        </div>
      </section>

      <dialog id="preview-profile-desktop" className="modal overflow-y-auto">
        {selectedProfile && (
          <MatchlistProfile
            name={selectedProfile.name}
            age={selectedProfile.age}
            city={selectedProfile.city_name}
            location={selectedProfile.location_name}
            sexIdentity={selectedProfile.sexual_identity}
            sexPref={selectedProfile.sexual_preference}
            racialPref={selectedProfile.racial_preference}
            meetingInterest={selectedProfile.meeting_interest}
            aboutMe={selectedProfile.about_me}
            hobby={selectedProfile.hobbies}
            image={selectedProfile.images}
          />
        )}
      </dialog>

      <Footer />
    </main>
  );
}
