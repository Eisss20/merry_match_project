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
import { set } from "mongoose";


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

function ProfileBox({ profileData, handleDelete }) {
  const [merryToggle, setMerryToggle] = useState(true);
  const ProfileButton = ({ className = "flex" }) => {
    const toggleMerry = () => {
      if (merryToggle) {
        console.log("Deleting user_other:", profileData.user_other);
        handleDelete(profileData.user_other); // ใช้งาน handleDelete จาก props
      }
      setMerryToggle(!merryToggle); // สลับสถานะ merryToggle
    };

    return (
      <div
        className={`flex min-w-[165px] flex-col items-end justify-center gap-5 md:justify-start ${className}`}
      >
        {/* Merry match/Not match */}
        {profileData.is_match === true ? (
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
            onClick={() => {}}
          >
            <IoMdEye className="size-5 md:size-6" />
          </button>

          {/* Merry button */}
          <button
            className={`flex size-11 items-center justify-center rounded-2xl text-fourth-700 transition-all duration-300 [box-shadow:3px_3px_12.5px_rgba(0,0,0,0.1)] hover:scale-105 md:size-12 ${
              merryToggle ? "bg-primary-500 text-utility-primary" : "bg-utility-primary"
            }`}
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
            <span className="text-fourth-700">{profileData.age}</span>
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
            src={profileData?. profile_image}
            alt=""
            className="h-full w-full object-cover"
          />

          {profileData.merry_today === true && (
            <div className="absolute bottom-0 left-0 flex h-[1.5rem] w-[5.5rem] justify-end rounded-tr-xl bg-second-100 pr-2 pt-1 text-xs text-second-600">
              Merry today
            </div>
          )}
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
  const { id: userMasterId } = router.query; // ดึง userMasterId จาก URL
  const [profileDataRaw, setProfileDataRaw] = useState([]); // เก็บ matches
  const [loading, setLoading] = useState(true);
  const [totalTrue, setTotalTrue] = useState(0); // เก็บ total_true
  const [totalFalse, setTotalFalse] = useState(0); // เก็บ total_false

  useEffect(() => {
    const fetchProfiles = async () => {
      if (!userMasterId) return; // ถ้า userMasterId ไม่มีค่า ให้หยุดรอ

      try {
        // เรียก API
        const response = await axios.get(`/api/merry-list/${userMasterId}`);

        // ตั้งค่าข้อมูลใน state
        setProfileDataRaw(response.data.matches || []); // ข้อมูล matches
        setTotalTrue(response.data.total_true || 0); // ข้อมูล total_true
        setTotalFalse(response.data.total_false || 0); // ข้อมูล total_false
      } catch (error) {
        console.error("Error fetching profiles:", error);
      } finally {
        setLoading(false); // เลิก loading
      }
    };

    fetchProfiles();
  }, [userMasterId]);

  const handleDelete = async (userOther) => {
    try {
      console.log("Deleting user_other:", userOther);
      const response = await axios.delete(`/api/merry-list/${userMasterId}`, {
        data: { user_other: userOther },
      });
      console.log("Deleted:", response.data);
      setProfileDataRaw((prev) =>
        prev.filter((profile) => profile.user_other !== userOther)
      );
    } catch (error) {
      console.error("Error deleting user_other:", error);
    }
  };
  
  if (loading) {
    return (
      <main className="flex flex-col items-center justify-center h-screen bg-utility-bgMain">
   <span class="loading loading-spinner loading-lg"></span>
      </main>
    );
  }

  if (profileDataRaw.length === 0) {
    return (
      <main className="flex flex-col items-center justify-center h-screen bg-utility-bgMain">
        <p className="text-xl text-primary-500">No profiles found.</p>
      </main>
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

          {/* Merry count section */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-4">
            <MerryCountBox count={totalTrue} text="Merry Match" />
            <MerryCountBox count={totalFalse} text="Not a Match" />
            </div>

            <div className="flex flex-col items-end">
              <p className="text-sm text-fourth-700 lg:text-base">
                Merry limit today <span className="text-primary-400">2/20</span>
              </p>
              <p className="text-xs text-fourth-600 lg:text-sm">
                Reset in 12h...
              </p>
            </div>
          </div>
        </header>

        {/* Match profile section */}
        <div className="flex flex-col gap-10">
          {profileDataRaw.map((profileData, index) => {
             console.log('Profile:', profileData);
            return (
              <Fragment key={index}>
  <ProfileBox
      profileData={profileData}
      handleDelete={handleDelete} // ต้องส่ง handleDelete เป็น prop
    />

                {index !== profileDataRaw.length - 1 && (
                  <div className="h-[1px] w-full bg-fourth-300"></div>
                )}
              </Fragment>
            );
          })}
        </div>
      </section>

      <Footer />
    </main>
  );
}
