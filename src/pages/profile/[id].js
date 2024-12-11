import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/NavBar";
//import ProfilePicturesForm from "@/components/register/ProfilePicturesForm";
import { CustomButton } from "@/components/CustomUi";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PreviewProfile } from "@/components/profile/PreviewProfile";
import axios from "axios";
//import { jwtDecode } from "jwt-decode";

export default function ProfilePage() {
  const [date, setDate] = useState("");
  const [getUserData, setGetUserData] = useState({});
  const [name, setName] = useState("");
  const [birth, setBirth] = useState("");
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [sexIdentity, setSexIdentity] = useState("");
  const [sexPref, setSexPref] = useState("");
  const [racialPref, setRacialPref] = useState("");
  const [meetingInterest, setMeetingInterest] = useState("");
  const [hobbies, setHobbies] = useState([]);
  const [aboutMe, setAboutMe] = useState("");
  const [avatar, setAvatars] = useState("");

  const router = useRouter();
  const id = router.query;

  // ดึงข้อมูล users โดยระบุ id
  const getUsers = async () => {
    //const token = localStorage.getItem("token");
    //const userData = jwtDecode(token);
    //console.log(token);

    try {
      const result = await axios.get(
        `http://localhost:3000/api/users/profile/${id}`,
      );
      const test = JSON.parse(result.data.name || "[]");
      console.log(test);
      setGetUserData(result.data);
      // setName(result.data.name);
      // setBirth(result.data.birth); //
      // setLocation(result.data.location);
      // setCity(result.data.city);
      // setUsername(result.data.username);
      // setEmail(result.data.email); //
      // setSexIdentity(result.data.sex); //
      // setSexPref(result.data.sex); //
      // setRacialPref(result.data.racial); //
      // setMeetingInterest(result.data.meeting); //
      // setAboutMe(result.data.aboutme); //
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const newAvatars = { ...avatar };

    // ตรวจสอบว่าอัปโหลดไฟล์มากกว่า 5 ไฟล์หรือไม่
    files.forEach((file, index) => {
      const uniqueId = Date.now() + index;
      if (Object.keys(newAvatars).length < 5) {
        newAvatars[uniqueId] = file;
      }
    });

    setAvatars(newAvatars);
  };

  // กดลบรูปภาพ
  const handleRemoveImage = (event, avatarKey) => {
    event.preventDefault();

    // สร้างสำเนาของ avatars และลบ avatar ที่ต้องการ
    const updatedAvatars = { ...avatar };
    delete updatedAvatars[avatarKey]; // ลบ avatar ตาม avatarKey

    // อัปเดต state โดยการใช้สำเนาที่แก้ไขแล้ว
    setAvatars(updatedAvatars);
  };

  // เมื่อเปิดหน้าเว็บให้ function getProfileData ทำงาน
  useEffect(() => {
    getUsers();
  }, [id]);

  return (
    <>
      <nav className="nav-bar-section w-full">
        <NavBar />
      </nav>
      <main className="info-section">
        {/* Profile-section */}
        <div className="profile flex flex-col items-center gap-10 bg-utility-bgMain px-4 py-10">
          <div className="profile-section flex flex-col gap-10 lg:mx-auto lg:gap-20">
            <div className="title-section flex flex-col gap-2 lg:flex-row lg:gap-20">
              <div className="title lg:flex lg:w-[517px] lg:flex-col lg:gap-2">
                <span className="text-sm font-semibold text-third-700">
                  PROFILE
                </span>
                <h3 className="text-3xl font-bold text-second-500 lg:text-5xl lg:font-extrabold">
                  Let's make profile to let others know you
                </h3>
              </div>
              <div className="lg:flex lg:flex-col lg:justify-end">
                <div className="button-section hidden flex-row gap-4 lg:flex lg:h-[48px]">
                  <CustomButton
                    buttonType="secondary"
                    customStyle="w-[162px] text-base font-bold"
                    //onClick={() => router.push("/profile/preview-profile")}
                    onClick={() =>
                      document
                        .getElementById("preview-profile-desktop")
                        .showModal()
                    }
                  >
                    Preview Profile
                  </CustomButton>

                  {/* popup preview profile desktop*/}
                  <dialog
                    id="preview-profile-desktop"
                    className="modal overflow-y-auto"
                  >
                    <div className="">
                      <PreviewProfile />
                    </div>
                  </dialog>
                  <CustomButton
                    buttonType="primary"
                    customStyle="w-[162px] text-base font-bold"
                  >
                    Update Profile
                  </CustomButton>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="basic-information-section flex flex-col gap-6">
              <h4 className="text-2xl font-bold text-fourth-900">
                Basic Information
              </h4>

              <div className="basic-form-section flex flex-col gap-6 lg:gap-10">
                <div className="flex flex-col gap-6 lg:flex-row lg:gap-6">
                  <label className="form-control w-full gap-1 lg:order-2 lg:w-full">
                    <span className="label-text text-base font-normal text-utility-second">
                      Date of Birth
                    </span>
                    <input
                      type="date"
                      name="date"
                      value={date}
                      onChange={(event) => {
                        setDate(event.target.value);
                      }}
                      className="input input-bordered h-12 w-full rounded-[8px] border-[1px] border-fourth-400 py-3 pl-3 pr-4 lg:w-full"
                    />
                  </label>
                  <label className="name-section flex w-full flex-col gap-1 lg:order-1 lg:w-full">
                    <span className="text-base font-normal text-utility-second">
                      Name
                    </span>
                    <input
                      type="text"
                      className="h-12 w-full rounded-[8px] border border-fourth-400 py-3 pl-3 pr-4 lg:w-full"
                    />
                  </label>
                </div>

                <div className="flex flex-col gap-6 lg:flex-row lg:gap-6">
                  <label className="city-section flex w-full flex-col gap-1 lg:order-2">
                    <span className="text-base font-normal text-utility-second">
                      City
                    </span>
                    <select className="select select-bordered h-12 w-full border-fourth-400">
                      <option disabled selected>
                        Bangkok
                      </option>
                      <option>Songkhla</option>
                      <option>Chiangmai</option>
                    </select>
                  </label>
                  <label className="location-section flex w-full flex-col gap-1 lg:order-1">
                    <span className="text-base font-normal text-utility-second">
                      Location
                    </span>
                    <select className="select select-bordered h-12 w-full border-fourth-400">
                      <option disabled selected>
                        Thailand
                      </option>
                      <option>Japan</option>
                      <option>China</option>
                    </select>
                  </label>
                </div>

                <div className="flex flex-col gap-6 lg:flex-row lg:gap-6">
                  <label className="email-section flex w-full flex-col gap-1 lg:order-2">
                    <span className="text-base font-normal text-fourth-600">
                      Email
                    </span>
                    <input
                      type="text"
                      placeholder="name@website.com"
                      className="h-12 w-full rounded-[8px] border border-fourth-400 py-3 pl-3 pr-4 placeholder-fourth-900"
                      disabled
                    />
                  </label>
                  <label className="username-section flex w-full flex-col gap-1 lg:order-1">
                    <span className="text-base font-normal text-utility-second">
                      Username
                    </span>
                    <input
                      type="text"
                      placeholder="At least 6 character"
                      className="h-12 w-full rounded-[8px] border border-fourth-400 py-3 pl-3 pr-4 placeholder-fourth-900"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Identites and Interest Information */}
            <div className="identities-interest-section flex flex-col gap-6">
              <h4 className="text-2xl font-bold text-fourth-900">
                Identites and Interests
              </h4>

              <div className="identities-form-section flex flex-col gap-6 lg:gap-10">
                <div className="flex flex-col gap-6 lg:flex-row lg:gap-6">
                  <label className="sexual-preferences-section flex w-full flex-col gap-1 lg:order-2">
                    <span className="text-base font-normal text-utility-second">
                      Sexual preferences
                    </span>
                    <select className="select select-bordered h-12 w-full border-fourth-400">
                      <option disabled selected>
                        Female
                      </option>
                      <option>Male</option>
                      <option>LGBTQ+</option>
                    </select>
                  </label>
                  <label className="sexual-identities-section flex w-full flex-col gap-1 lg:order-1">
                    <span className="text-base font-normal text-utility-second">
                      Sexual identities
                    </span>
                    <select className="select select-bordered h-12 w-full border-fourth-400">
                      <option disabled selected>
                        Male
                      </option>
                      <option>Female</option>
                      <option>LGBTQ+</option>
                    </select>
                  </label>
                </div>

                <div className="flex flex-col gap-6 lg:flex-row lg:gap-6">
                  <label className="meeting-interests-section flex w-full flex-col gap-1 lg:order-2">
                    <span className="text-base font-normal text-utility-second">
                      Meeting interests
                    </span>
                    <select className="select select-bordered h-12 w-full border-fourth-400">
                      <option disabled selected>
                        Friends
                      </option>
                      <option>Others</option>
                    </select>
                  </label>
                  <label className="racial-preferences-section flex w-full flex-col gap-1 lg:order-1">
                    <span className="text-base font-normal text-utility-second">
                      Racial preferences
                    </span>
                    <select className="select select-bordered h-12 w-full border-fourth-400">
                      <option disabled selected>
                        Asian
                      </option>
                      <option>Chinese</option>
                      <option>Japanese</option>
                    </select>
                  </label>
                </div>

                <label className="hobbies-section flex w-full flex-col gap-1">
                  <span className="text-base font-normal text-utility-second">
                    Hobbies / Interests (Maximum 10)
                  </span>
                  <input
                    type="text"
                    className="h-14 w-full rounded-[8px] border border-fourth-400 px-4 py-3 placeholder-fourth-900"
                  />
                </label>
              </div>

              <label className="about-me-section flex w-full flex-col gap-1">
                <span className="text-base font-normal text-utility-second">
                  About me (Maximum 150 characters)
                </span>
                <input
                  type="text"
                  placeholder="Write something about yourself"
                  className="h-28 w-full rounded-[8px] border border-fourth-400 px-4 pb-14 placeholder-fourth-900"
                />
              </label>
            </div>

            {/* Picture upload */}
            <div className="upload-picture">
              <form
                className="w-full max-w-4xl space-y-4"
                encType="multipart/form-data"
              >
                <h1 className="mb-4 text-2xl text-[24px] font-bold leading-[30px] tracking-[-2%] text-second-500">
                  Profile pictures
                </h1>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <label className="form-control">
                    <span className="label-text">Upload at least 2 photos</span>
                  </label>
                </div>
                <div className="mx-auto flex h-auto w-full flex-wrap gap-4 rounded-lg border-gray-300 px-0 lg:w-[931px]">
                  {Object.keys(avatar).map((avatarKey, index) => (
                    <div
                      key={avatarKey}
                      className="relative h-[120px] w-[120px] flex-shrink-0 cursor-pointer rounded-lg border-2 border-gray-300 sm:h-[140px] sm:w-[140px] lg:h-[167px] lg:w-[167px]"
                    >
                      <img
                        src={URL.createObjectURL(avatar[avatarKey])}
                        alt={`profile-${avatarKey}`}
                        className="h-full w-full rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        onClick={(event) => handleRemoveImage(event, avatarKey)}
                        className="absolute right-[-5px] top-[-10px] flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xl text-white hover:bg-red-700"
                      >
                        x
                      </button>
                    </div>
                  ))}
                  {Object.keys(avatar).length < 5 && (
                    <div className="relative h-[120px] w-[120px] flex-shrink-0 cursor-pointer rounded-lg border-2 border-gray-300 sm:h-[140px] sm:w-[140px] lg:h-[167px] lg:w-[167px]">
                      <label
                        htmlFor="upload"
                        className="flex h-full w-full items-center justify-center text-sm text-gray-500"
                      >
                        {Object.keys(avatar).length === 0 ? (
                          <span>คลิกเพื่อเลือกไฟล์</span>
                        ) : (
                          <span>เลือกไฟล์ใหม่</span>
                        )}
                        <input
                          id="upload"
                          name="avatar"
                          type="file"
                          placeholder="Enter last name here"
                          onChange={handleFileChange}
                          className="absolute z-10 h-full w-full cursor-pointer opacity-0"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* Button: Delete account desktop */}
            <div className="delete-account hidden lg:flex lg:justify-end">
              <button
                className="text-base font-bold text-fourth-700"
                onClick={() =>
                  document.getElementById("delete-confirm-desktop").showModal()
                }
              >
                Delete account
              </button>
              {/* popup delete confirm */}
              <dialog id="delete-confirm-desktop" className="modal px-4">
                <div className="delete-popup w-[530px] rounded-2xl bg-white">
                  <div className="delete-title flex flex-row items-center justify-between border-b border-fourth-300 px-6 py-2">
                    <h3 className="text-xl font-semibold">
                      Delete Confirmation
                    </h3>
                    <form method="dialog">
                      <button className="btn btn-circle btn-ghost btn-sm text-xl text-fourth-500">
                        x
                      </button>
                    </form>
                  </div>
                  <div className="flex flex-col gap-6 p-6">
                    <p className="text-base font-normal text-fourth-700">
                      Do you sure to delete account?
                    </p>
                    <div className="flex flex-row gap-4">
                      <CustomButton
                        buttonType="secondary"
                        className="w-[200px] text-base font-bold"
                      >
                        Yes, I want to delete
                      </CustomButton>
                      <CustomButton
                        buttonType="primary"
                        className="w-[125px] text-base font-bold"
                      >
                        No, I don't
                      </CustomButton>
                    </div>
                  </div>
                </div>
              </dialog>
            </div>
          </div>

          {/* Button: Preview and Update profile */}
          <div className="button-section flex flex-row gap-4 lg:hidden">
            <CustomButton
              buttonType="secondary"
              customStyle="w-[162px] text-base font-bold"
              //onClick={() => router.push("/profile/preview-profile")}
              onClick={() =>
                document.getElementById("preview-profile-mobile").showModal()
              }
            >
              Preview Profile
            </CustomButton>

            {/* popup preview profile mobile*/}
            <dialog
              id="preview-profile-mobile"
              className="modal overflow-y-auto"
            >
              <div className="w-full">
                <PreviewProfile />
              </div>
            </dialog>

            <CustomButton
              buttonType="primary"
              customStyle="w-[162px] text-base font-bold"
            >
              Update Profile
            </CustomButton>
          </div>

          {/* Button: Delete account mobile */}
          <div className="delete-account lg:hidden">
            <button
              className="text-base font-bold text-fourth-700"
              onClick={() =>
                document.getElementById("delete-confirm-mobile").showModal()
              }
            >
              Delete account
            </button>

            {/* popup delete confirm */}
            <dialog id="delete-confirm-mobile" className="modal px-4">
              <div className="delete-popup w-full rounded-2xl bg-white">
                <div className="delete-title flex flex-row items-center justify-between border-b border-fourth-300 px-4 py-2">
                  <h3 className="text-xl font-semibold">Delete Confirmation</h3>
                  <form method="dialog">
                    <button className="btn btn-circle btn-ghost btn-sm text-xl text-fourth-500">
                      x
                    </button>
                  </form>
                </div>
                <div className="flex flex-col gap-6 p-4">
                  <p className="text-base font-normal text-fourth-700">
                    Do you sure to delete account?
                  </p>
                  <CustomButton
                    buttonType="secondary"
                    className="text-base font-bold"
                  >
                    Yes, I want to delete
                  </CustomButton>
                  <CustomButton
                    buttonType="primary"
                    className="text-base font-bold"
                  >
                    No, I don't
                  </CustomButton>
                </div>
              </div>
            </dialog>
          </div>
        </div>
      </main>
      <footer className="footer-section">
        <Footer />
      </footer>
    </>
  );
}
