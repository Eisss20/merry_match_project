import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/NavBar";
import HobbiesProfilePage from "@/components/profile/HobbySection";
import { CustomButton } from "@/components/CustomUi";
import { useEffect, useState } from "react";
import { PreviewProfile } from "@/components/profile/PreviewProfile";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import {
  validateName,
  validateAge,
  validateHobbies,
  validateAboutme,
  validateProfilePicture,
  validateRequiredFieldsProfilePage,
} from "@/utils/validateProfilePage";
import Alert from "@/components/register/AlertRegister";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "@/components/register/SortableItem";
// import Loading from "@/components/loading/loading";

export default function ProfilePage() {
  const [date, setDate] = useState("");
  const [dateError, setDateError] = useState("");
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [age, setAge] = useState("");
  const [location, setLocation] = useState([]);
  const [allLocation, setAllLocation] = useState([]);
  const [city, setCity] = useState("");
  const [allCity, setAllCity] = useState([]);
  const [filterCity, setFilterCity] = useState([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [sexIdentity, setSexIdentity] = useState("");
  const [sexPref, setSexPref] = useState("");
  const [racialPref, setRacialPref] = useState("");
  const [meetingInterest, setMeetingInterest] = useState("");
  const [hobbies, setHobbies] = useState([]);
  const [hobbiesError, setHobbiesError] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [aboutMeError, setAboutMeError] = useState("");
  const [avatar, setAvatar] = useState([]);
  const [avatarError, setAvatarError] = useState("");
  const [allGender, setAllGender] = useState([]);
  const [allMeeting, setAllMeeting] = useState([]);
  const [allRacial, setAllRacial] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // console.log("state avatar", avatar);

  const { deleteuser } = useAuth();
  const router = useRouter();

  // รับค่าจากไฟล์ HobbySection และอัปเดตที่นี่ เพื่อส่งค่าไปยังหน้า PreviewProfile
  const handleUpdateOptions = (options) => {
    setSelectedOptions(options); // รับค่าจากไฟล์ HobbySection และอัปเดตที่นี่
  };
  // console.log("selected from hobbysection", selectedOptions);

  // update keyword hobby
  const updateHobbies = (selectedOptions) => {
    setHobbies(selectedOptions);
    setHobbiesError("");
  };

  // hobbies error
  const updateHobbiesError = (error) => {
    setHobbiesError(error); // รับค่า error จาก HobbiesProfilePage
  };

  // ดึง racial
  const getRacial = async () => {
    try {
      const result = await axios.get(`api/racials`);

      setAllRacial(result.data);
      // console.log("Racial response", result.data);
    } catch (error) {
      console.log(error);
    }
  };

  // ดึง meeting interest
  const getMeetingInterest = async () => {
    try {
      const result = await axios.get(`api/meetings`);

      setAllMeeting(result.data);
      // console.log("Meeting response", result.data);
    } catch (error) {
      console.log(error);
    }
  };

  // ดึง gender
  const getGender = async () => {
    try {
      const result = await axios.get(`api/genders`);

      setAllGender(result.data);
      // console.log("Gender response", result.data);
    } catch (error) {
      console.log(error);
    }
  };

  // ดึง city และ location
  const getAddress = async () => {
    try {
      const result = await axios.get(`/api/address`);
      // console.log("resultAddress", result);

      setAllCity(result.data.cities);
      setAllLocation(
        result.data.locations.map((loc) => ({
          value: loc.location_id,
          label: loc.location_name,
        })),
      );
      //console.log("Address response", result);
    } catch (error) {
      console.log(error);
    }
  };

  // ตั้งค่า Max date
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // ดึงข้อมูล users โดยระบุ id
  const getUsersById = async () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    try {
      const token = localStorage.getItem("token");
      const { id } = jwtDecode(token);

      // const { id } = {
      //   id: 7,
      //   name: "Tong",
      //   sexual_preference: "Female",
      //   image_profile: [
      //     "https://res.cloudinary.com/dg2ehb6zy/image/upload/v1733841816/test/pic/yoeapgceodompzxkul96.jpg",
      //     "https://res.cloudinary.com/dg2ehb6zy/image/upload/v1733841817/test/pic/h77b5cosenizmriqoopd.jpg",
      //   ],
      //   iat: 1733975459,
      //   exp: 1733979059,
      // };

      const result = await axios.get(`${apiBaseUrl}/api/users/profile/${id}`);

      // console.log("result from get", result.data);

      const fetchDate = new Date(result.data.date_of_birth)
        .toISOString()
        .split("T")[0];

      // ตรวจสอบว่าข้อมูลที่ get มาเป็น Array หรือ Object และมีค่า
      // const formattedAvatar = result.data.image_profiles.reduce((acc, img) => {
      //   acc[img.image_profile_id] = { image_url: img.image_url };
      //   return acc;
      // }, {});

      // เก็บค่าของ result ไว้ใน state
      setUserId(result.data.user_id);
      setDate(fetchDate);
      setName(result.data.name);
      setAge(result.data.age);
      setLocation(result.data.location);
      setCity(result.data.city);
      setEmail(result.data.email);
      setUsername(result.data.username);
      setSexIdentity(result.data.gender);
      setSexPref(result.data.sexual_preference);
      setRacialPref(result.data.racial_preference);
      setMeetingInterest(result.data.meeting_interest);
      setAboutMe(result.data.about_me);
      setAvatar(result.data.image_profiles);
    } catch (error) {
      console.log(error);
    }
  };

  // แยกรุปภาพเดิมที่มี url แล้วกับรุปภาพใหม่ที่เป้น File
  const isValidUrl = (url) => {
    try {
      new URL(url); // ถ้าเป็น URL ที่ถูกต้องจะไม่เกิดข้อผิดพลาด
      return true;
    } catch (e) {
      return false;
    }
  };

  const [validUrls, setValidUrls] = useState([]); // เก็บ URL ที่ถูกต้อง
  const [filesToUpload, setFilesToUpload] = useState([]); // เก็บไฟล์ที่ต้องอัปโหลด

  // ฟังก์ชันเพื่อแยก URL และ File
  const processAvatar = () => {
    let tempValidUrls = [];
    let tempFilesToUpload = [];

    Object.keys(avatar).forEach((key) => {
      const item = avatar[key];
      if (item.image_url && isValidUrl(item.image_url)) {
        tempValidUrls.push(item.image_url); // เก็บ URL ที่ถูกต้อง
      } else if (item instanceof File) {
        tempFilesToUpload.push(item); // เก็บไฟล์ที่ไม่ใช่ URL
      }
    });

    // อัปเดต state สำหรับ URL ที่ถูกต้อง
    setValidUrls(tempValidUrls);
    // อัปเดต state สำหรับไฟล์ที่ต้องอัปโหลด
    setFilesToUpload(tempFilesToUpload);
  };

  // เรียกฟังก์ชันเพื่อประมวลผล avatar เมื่อโหลดข้อมูล
  useEffect(() => {
    processAvatar();
  }, [avatar]);

  // แสดงผลลัพธ์
  // console.log("Valid URLs:", validUrls); // แสดง URL ที่ถูกต้อง
  // console.log("Files to upload:", filesToUpload); // แสดงไฟล์ที่ต้องอัปโหลด

  // function คำนวณอายุไว้แสดงใน modal แบบ real time
  const calculateAge = (birthdate) => {
    const birthDate = new Date(birthdate);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    // ตรวจสอบว่าครบรอบวันเกิดแล้วหรือยัง
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  // function handler update user profile
  const handleUpdateProfile = async () => {
    setIsLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You are not logged in. Please log in again.");
      router.push("/");
      return;
    }

    const { id } = jwtDecode(token);
    if (!id) {
      alert("Invalid user ID.");
      return;
    }

    // validate แต่ละช่อง input ว่าตรงตามเงื่อนไขหรือไม่
    const nameError = validateName(name);
    const dateError = validateAge(date);
    const hobbiesError = validateHobbies(selectedOptions);
    const aboutmeError = validateAboutme(aboutMe);
    const avatarError = validateProfilePicture(avatar);

    // validate ทั้งหน้า ว่ากรอกข้อมูลครบทุก input หรือไม่
    const allAalidationError = validateRequiredFieldsProfilePage({
      name,
      date,
      selectedOptions,
      value: aboutMe,
      fields: { avatar: avatar },
    });

    // error message
    const errorMessages = {
      name: nameError,
      date: dateError,
      hobbies: hobbiesError,
      aboutme: aboutmeError,
      image: avatarError,
    };

    console.log("ALL validationError", allAalidationError); // error กรอกข้อมูลไม่ครบทั้ง form
    console.log("errorMessages", errorMessages); // error ของแต่ละ input

    if (
      nameError ||
      dateError ||
      hobbiesError ||
      aboutmeError ||
      avatarError ||
      allAalidationError
    ) {
      setErrorMessage(
        "Please provide all the required information accurately and completely",
      );
      setAlertVisible(true);
      setIsLoading(false); // จบโหลด

      setNameError(errorMessages.name || "");
      setDateError(errorMessages.date || "");
      setHobbiesError(errorMessages.hobbies || "");
      setAboutMeError(errorMessages.aboutme || "");
      setAvatarError(errorMessages.image || "");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("date_of_birth", date);
    formData.append("city", city);
    formData.append("location", location);
    formData.append("gender", sexIdentity);
    formData.append("sexual_preference", sexPref);
    formData.append("racial_preference", racialPref);
    formData.append("meeting_interest", meetingInterest);
    formData.append("hobbies", JSON.stringify(selectedOptions)); // แปลง array เป็น JSON String เพื่อให้ส่งผ่าน formData ได้
    formData.append("about_me", aboutMe);
    formData.append("validUrls", validUrls);
    formData.append("filesToUpload", filesToUpload);

    for (let filesToUploadKey in filesToUpload) {
      formData.append("filesToUpload", filesToUpload[filesToUploadKey]);
    }

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const result = await axios.put(
        `${apiBaseUrl}/api/users/profile/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      // console.log("PUT Result:", result.data);

      if (result.status === 200) {
        document.getElementById("update-success-modal").showModal();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    } finally {
      setIsLoading(false); // จบโหลด
    }
  };

  // กดเพิ่มรูปภาพ
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const updatedAvatars = { ...avatar };

    // ตรวจสอบว่าอัปโหลดไฟล์มากกว่า 5 ไฟล์หรือไม่
    files.forEach((file, index) => {
      const uniqueId = `new-${Date.now()}-${index}`;
      if (Object.keys(updatedAvatars).length < 5) {
        updatedAvatars[uniqueId] = file;
      }
    });

    // แปลง newAvatars เป็น avatarsObject
    const avatarsArray = Object.values(updatedAvatars);
    const avatarsObject = avatarsArray.reduce((acc, file, index) => {
      acc[index] = file;
      return acc;
    }, {});

    // อัปเดต state
    setAvatar(avatarsObject);

    if (Object.keys(avatarsObject).length >= 2) {
      setAvatarError(""); // ล้างข้อความ error
    }
  };

  // กดลบรูปภาพ
  const handleRemoveImage = (avatarKey) => {
    // สร้างสำเนาของ avatars และลบ avatar ที่ต้องการ
    const updatedAvatars = { ...avatar };
    delete updatedAvatars[avatarKey]; // ลบรูปถาพที่ถูกเลือก

    // อัปเดต state
    setAvatar(updatedAvatars);

    // ใช้ validateProfilePicture เพื่อตรวจสอบข้อผิดพลาด
    const error = validateProfilePicture(updatedAvatars);
    setAvatarError(error); // อัพเดตข้อความ error
  };

  const handleAvatarUpdate = (updatedAvatars) => {
    setAvatar(updatedAvatars); // อัปเดตค่าของ avatar ใน parent
  };

  // console.log(" updated state avatar", avatar);

  // drag and drop รูปภาพ
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    // over คือค่าที่วาง โดยจะเป็นเลข ตำแหน่งที่อยู่ใน Array
    // active คือค่าที่โดนกดลาก โดยจะเป็นเลข ตำแหน่งที่อยู่ใน Array
    console.log("over", over);
    console.log("active", active);

    const activeIndex = parseInt(active.id, 10); // parseInt แปลง String เป็นตัวเลขแบบเต็มจำนวน จาก id
    const overIndex = parseInt(over.id, 10); // parseInt แปลง String เป็นตัวเลขแบบเต็มจำนวน จาก id

    console.log("activeIndex00000", activeIndex);
    console.log("overIndex00000", overIndex);

    if (activeIndex !== overIndex) {
      // สำเนาของ avatars
      const updatedAvatars = { ...avatar };
      console.log("updatedAvatars", updatedAvatars);

      // ดึงค่าของรูปที่ถูกลาก
      const activeAvatar = updatedAvatars[activeIndex];
      console.log("activeAvatar", activeAvatar);

      // ลบรูปที่ถูกลากออกจากตำแหน่งเดิม
      delete updatedAvatars[activeIndex];

      // จัดเรียงลำดับใหม่และแทรกรูปที่ถูกลากในตำแหน่งใหม่
      const newAvatars = {};
      let currentIndex = 0;
      Object.keys(updatedAvatars).forEach((key, index) => {
        if (currentIndex === overIndex) {
          newAvatars[overIndex] = activeAvatar;
          currentIndex++;
        }
        if (key !== String(activeIndex)) {
          newAvatars[currentIndex] = updatedAvatars[key];
          currentIndex++;
        }
      });

      // กรณีที่ลากไปยังตำแหน่งสุดท้าย
      if (overIndex >= Object.keys(updatedAvatars).length) {
        newAvatars[overIndex] = activeAvatar;
      }
      console.log("Object.keys", Object.keys(updatedAvatars));
      console.log("updatedAvatars.length", Object.keys(updatedAvatars).length);
      console.log("Updated avatars after rearranging: ", newAvatars);
      setAvatar(newAvatars); // อัปเดต state avatars

      handleAvatarUpdate(newAvatars); // เรียกฟังก์ชันเพิ่มเติมถ้ามี
      // console.log("handleAvatarUpdate", newAvatars);
    }
  };

  // Sensors สำหรับการลาก
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 10 },
    }),
  );
  // console.log("sensors", sensors);

  // เมื่อเปิดหน้าเว็บให้ function getProfileData ทำงาน
  useEffect(() => {
    getUsersById();
  }, []);

  // เมื่อเปิดหน้าเว็บให้ function getAddress ทำงาน
  useEffect(() => {
    getAddress();
  }, []);

  // เมื่อเปิดหน้าเว็บให้ function getGender ทำงาน
  useEffect(() => {
    getGender();
  }, []);

  // เมื่อเปิดหน้าเว็บให้ function getMeetingInterest ทำงาน
  useEffect(() => {
    getMeetingInterest();
  }, []);

  // เมื่อเปิดหน้าเว็บให้ function getRacial ทำงาน
  useEffect(() => {
    getRacial();
  }, []);

  // เมื่อเปิดหน้าเว็บให้ทำการ filter location กับ city ให้สัมพันธ์กัน
  useEffect(() => {
    if (location) {
      const filteredCities = allCity.filter(
        (city) => city.location_name === location,
      );
      setFilterCity(filteredCities);
    } else {
      setFilterCity([]);
    }
  }, [location, allCity]);

  return (
    <>
      <nav className="nav-bar-section w-full">
        <NavBar />
      </nav>
      <main className="info-section">
        {/* Profile-section */}
        <div className="profile flex flex-col items-center gap-10 bg-utility-bgMain px-4 py-10">
          <div className="profile-section flex w-full max-w-[931px] flex-col gap-10 lg:mx-auto lg:gap-20">
            <div className="title-section flex flex-col gap-2 lg:flex-row lg:justify-between lg:gap-20">
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
                    onClick={() =>
                      document.getElementById("preview-profile").showModal()
                    }
                  >
                    Preview Profile
                  </CustomButton>

                  <CustomButton
                    buttonType="primary"
                    customStyle="w-[162px] text-base font-bold"
                    onClick={handleUpdateProfile}
                    disabled={isLoading}
                  >
                    {isLoading ? "Updating..." : "Update Profile"}
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
                      max={getCurrentDate()}
                      value={date}
                      onChange={(e) => {
                        const selectedDate = e.target.value;
                        setDate(selectedDate);

                        // ตรวจสอบอายุและอัปเดต state
                        const calculatedAge = calculateAge(selectedDate);
                        setAge(calculatedAge);

                        // ตรวจสอบอายุ
                        const error = validateAge(e.target.value);
                        setDateError(error);
                      }}
                      disabled={alertVisible}
                      className={`input h-12 w-full rounded-[8px] border-[1px] border-fourth-400 bg-utility-primary py-3 pl-3 pr-4 text-utility-second transition-colors duration-300 hover:border-second-500 focus:border-second-500 focus:outline-none disabled:border-fourth-400 lg:w-full ${dateError ? "border-utility-third" : ""}`}
                    />
                    {dateError && (
                      <small className="ml-2 pt-2 text-red-600">
                        {dateError}
                      </small>
                    )}{" "}
                    {/* แสดงข้อผิดพลาด */}
                  </label>
                  <label className="name-section flex w-full flex-col gap-1 lg:order-1 lg:w-full">
                    <span className="text-base font-normal text-utility-second">
                      Name
                    </span>
                    <input
                      type="text"
                      disabled={alertVisible}
                      className={`input h-12 w-full rounded-[8px] border border-fourth-400 py-3 pl-3 pr-4 transition-colors duration-300 hover:border-second-500 focus:border-second-500 focus:outline-none disabled:border-fourth-400 lg:w-full ${nameError ? "border-utility-third" : ""}`}
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        // bg-utility-primary transition-colors duration-300 hover:border-second-500 focus:border-second-500 focus:outline-none ${nameError ? "border-utility-third" : ""}
                        // เรียกใช้ validate name
                        const error = validateName(e.target.value);
                        setNameError(error || "");
                      }}
                    />
                    {nameError && (
                      <small className="ml-2 pt-2 text-red-600">
                        {nameError}
                      </small>
                    )}{" "}
                    {/* แสดงข้อผิดพลาดขณะพิมพ์ */}
                  </label>
                </div>

                <div className="flex flex-col gap-6 lg:flex-row lg:gap-6">
                  <label className="city-section flex w-full flex-col gap-1 lg:order-2">
                    <span className="text-base font-normal text-utility-second">
                      City
                    </span>
                    <select
                      className="select select-bordered h-12 w-full border-fourth-400 transition-colors duration-300 hover:border-second-500 focus:border-second-500 focus:outline-none disabled:border-fourth-400"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      disabled={alertVisible}
                    >
                      <option value="">{city}</option>
                      {filterCity
                        .filter((cityItem) => cityItem.city_name !== city)
                        .map((cityItem) => (
                          <option
                            key={cityItem.city_id}
                            value={cityItem.city_name}
                          >
                            {cityItem.city_name}
                          </option>
                        ))}
                    </select>
                  </label>
                  <label className="location-section flex w-full flex-col gap-1 lg:order-1">
                    <span className="text-base font-normal text-utility-second">
                      Location
                    </span>
                    <select
                      className="select select-bordered h-12 w-full border-fourth-400 transition-colors duration-300 hover:border-second-500 focus:border-second-500 focus:outline-none disabled:border-fourth-400"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      disabled={alertVisible}
                    >
                      <option value="">{location}</option>
                      {allLocation
                        .filter((loc) => loc.label !== location)
                        .map((loc) => (
                          <option key={loc.value} value={loc.label}>
                            {loc.label}
                          </option>
                        ))}
                    </select>
                  </label>
                </div>

                <div className="flex flex-col gap-6 lg:flex-row lg:gap-6">
                  <label className="email-section flex w-full flex-col gap-1 lg:order-2">
                    <span className="text-base font-normal text-utility-second">
                      Email
                    </span>
                    <input
                      type="text"
                      placeholder="name@website.com"
                      className="input h-12 w-full rounded-[8px] border py-3 pl-3 pr-4 text-fourth-600 placeholder-fourth-900 disabled:border-fourth-400"
                      value={email}
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
                      className="input h-12 w-full rounded-[8px] border py-3 pl-3 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:border-fourth-400"
                      value={username}
                      disabled
                      onChange={(e) => setUsername(e.target.value)}
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
                    <select
                      className="select select-bordered h-12 w-full border-fourth-400 transition-colors duration-300 hover:border-second-500 focus:border-second-500 focus:outline-none disabled:border-fourth-400"
                      value={sexPref}
                      onChange={(e) => setSexPref(e.target.value)}
                      disabled={alertVisible}
                    >
                      <option value="">{sexPref}</option>
                      {allGender
                        .filter((gen) => gen.gender_name !== sexPref)
                        .map((gen) => (
                          <option key={gen.gender_id} value={gen.gender_name}>
                            {gen.gender_name}
                          </option>
                        ))}
                    </select>
                  </label>
                  <label className="sexual-identities-section flex w-full flex-col gap-1 lg:order-1">
                    <span className="text-base font-normal text-utility-second">
                      Sexual identities
                    </span>
                    <select
                      className="select select-bordered h-12 w-full border-fourth-400 transition-colors duration-300 hover:border-second-500 focus:border-second-500 focus:outline-none disabled:border-fourth-400"
                      value={sexIdentity}
                      onChange={(e) => setSexIdentity(e.target.value)}
                      disabled={alertVisible}
                    >
                      <option value="">{sexIdentity}</option>
                      {allGender
                        .filter((gen) => gen.gender_name !== sexIdentity)
                        .map((gen) => (
                          <option key={gen.gender_id} value={gen.gender_name}>
                            {gen.gender_name}
                          </option>
                        ))}
                    </select>
                  </label>
                </div>

                <div className="flex flex-col gap-6 lg:flex-row lg:gap-6">
                  <label className="meeting-interests-section flex w-full flex-col gap-1 lg:order-2">
                    <span className="text-base font-normal text-utility-second">
                      Meeting interests
                    </span>
                    <select
                      className="select select-bordered h-12 w-full border-fourth-400 transition-colors duration-300 hover:border-second-500 focus:border-second-500 focus:outline-none disabled:border-fourth-400"
                      value={meetingInterest}
                      onChange={(e) => setMeetingInterest(e.target.value)}
                      disabled={alertVisible}
                    >
                      <option value="">{meetingInterest}</option>
                      {allMeeting
                        .filter((meet) => meet.meeting_name !== meetingInterest)
                        .map((meet) => (
                          <option
                            key={meet.meeting_interest_id}
                            value={meet.meeting_name}
                          >
                            {meet.meeting_name}
                          </option>
                        ))}
                    </select>
                  </label>
                  <label className="racial-preferences-section flex w-full flex-col gap-1 lg:order-1">
                    <span className="text-base font-normal text-utility-second">
                      Racial preferences
                    </span>
                    <select
                      className="select select-bordered h-12 w-full border-fourth-400 transition-colors duration-300 hover:border-second-500 focus:border-second-500 focus:outline-none disabled:border-fourth-400"
                      value={racialPref}
                      onChange={(e) => setRacialPref(e.target.value)}
                      disabled={alertVisible}
                    >
                      <option value="">{racialPref}</option>
                      {allRacial
                        .filter((racial) => racial.racial_name !== racialPref)
                        .map((racial) => (
                          <option
                            key={racial.racial_id}
                            value={racial.racial_name}
                          >
                            {racial.racial_name}
                          </option>
                        ))}
                    </select>
                  </label>
                </div>

                <div className="hobby-input">
                  <HobbiesProfilePage
                    updateHobbies={updateHobbies}
                    onOptionsChange={handleUpdateOptions}
                    updateHobbiesError={updateHobbiesError}
                    disabled={alertVisible}
                    hobbieError={hobbiesError}
                    className={`${
                      hobbiesError ? "border-utility-third" : "" // เปลี่ยนเส้นขอบตาม error
                    }`}
                  />
                  {hobbiesError && (
                    <small className="ml-2 pt-2 text-red-600">
                      {hobbiesError}
                    </small>
                  )}
                </div>
              </div>

              <label className="about-me-section flex w-full flex-col gap-1">
                <span className="text-base font-normal text-utility-second">
                  About me (Maximum 150 characters)
                </span>
                <textarea
                  name="aboutme"
                  type="text"
                  placeholder="Write something about yourself"
                  className={`input h-28 w-full resize-none rounded-[8px] border border-fourth-400 px-4 py-3 placeholder-fourth-900 transition-colors duration-300 hover:border-second-500 focus:border-second-500 focus:outline-none disabled:border-fourth-400 ${aboutMeError ? "border-utility-third" : ""}`}
                  disabled={alertVisible}
                  value={aboutMe}
                  onChange={(e) => {
                    const { name, value } = e.target;
                    if (name === "aboutme") {
                      setAboutMe(value);
                      const error = validateAboutme(value);
                      setAboutMeError(error);
                    }
                  }}
                />
                {aboutMeError && (
                  <small className="ml-2 pt-2 text-red-600">
                    {aboutMeError}
                  </small>
                )}
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
                  {avatarError && (
                    <small className="ml-2 pt-2 text-red-600">
                      {avatarError}
                    </small>
                  )}
                </div>
                <div className="mx-auto flex h-auto w-full flex-wrap gap-4 rounded-lg border-gray-300 px-0 lg:w-[931px]">
                  {/* แสดงรูปภาพจาก State avatar */}
                  <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
                    <SortableContext
                      items={Object.keys(avatar)}
                      strategy={horizontalListSortingStrategy} // ใช้ horizontal list
                    >
                      {Object.entries(avatar).map(([key, value]) => {
                        return (
                          <SortableItem key={key} id={key}>
                            <img
                              src={
                                value instanceof File
                                  ? URL.createObjectURL(value) // Preview สำหรับภาพใหม่
                                  : value.image_url // URL สำหรับภาพจาก Database
                              }
                              alt={`profile-${key}`}
                              className="h-full w-full rounded-lg object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(key)} // ฟังก์ชั่นลบรูปภาพ
                              className="absolute right-[-5px] top-[-10px] flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xl text-white hover:bg-red-700"
                            >
                              x
                            </button>
                          </SortableItem>
                        );
                      })}
                    </SortableContext>
                  </DndContext>

                  {/* ถ้าจำนวนรูปน้อยกว่า 5 ให้โชว์ปุ่มอัปโหลด */}
                  {Object.keys(avatar).length < 5 && (
                    <div className="relative h-[120px] w-[120px] flex-shrink-0 cursor-pointer rounded-lg border-2 border-gray-300 sm:h-[140px] sm:w-[140px] lg:h-[167px] lg:w-[167px]">
                      <label
                        htmlFor="upload"
                        className="flex h-full w-full items-center justify-center text-sm text-gray-500"
                      >
                        {Object.keys(avatar).length === 0 ? (
                          <div className="flex h-full items-center justify-center">
                            <span className="flex flex-col items-center justify-center">
                              +
                              <p className="text-lg font-medium">
                                Upload photo
                              </p>
                            </span>
                          </div>
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <span className="flex flex-col items-center justify-center">
                              +
                              <p className="text-lg font-medium">
                                Upload photo
                              </p>
                            </span>
                          </div>
                        )}
                        <input
                          id="upload"
                          name="avatar"
                          type="file"
                          onChange={handleFileChange}
                          className="absolute z-10 h-full w-full cursor-pointer opacity-0"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </form>
            </div>
            <div className="pt-10">
              {alertVisible && (
                <Alert
                  message={errorMessage}
                  onClose={() => setAlertVisible(false)}
                />
              )}
            </div>

            {/* Button: Delete account desktop */}
            <div className="delete-account hidden lg:flex lg:justify-end">
              <button
                className="text-base font-bold text-fourth-700"
                onClick={() =>
                  document.getElementById("delete-confirm").showModal()
                }
              >
                Delete account
              </button>
            </div>
          </div>

          {/* Button: Preview and Update profile */}
          <div className="button-section flex flex-row gap-4 lg:hidden">
            <CustomButton
              buttonType="secondary"
              customStyle="w-[162px] text-base font-bold"
              onClick={() =>
                document.getElementById("preview-profile").showModal()
              }
            >
              Preview Profile
            </CustomButton>

            <CustomButton
              buttonType="primary"
              customStyle="w-[162px] text-base font-bold"
              onClick={handleUpdateProfile}
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Profile"}
            </CustomButton>
          </div>

          {/* Button: Delete account mobile */}
          <div className="delete-account lg:hidden">
            <button
              className="text-base font-bold text-fourth-700"
              onClick={() =>
                document.getElementById("delete-confirm").showModal()
              }
            >
              Delete account
            </button>
          </div>
        </div>
      </main>

      {/* Update success modal */}
      <dialog
        id="update-success-modal"
        className="modal fixed flex items-center justify-center px-4"
      >
        <div className="modal-content w-[530px] rounded-2xl bg-white p-6">
          <h3 className="mb-4 text-center text-xl font-semibold text-gray-800">
            Success !
          </h3>
          <p className="test-base mb-6 text-center font-normal text-gray-600">
            Your profile has been successfully updated.
          </p>
          <div className="flex justify-center">
            <CustomButton
              buttonType="primary"
              className="w-[125px] px-4 py-2 text-base font-bold"
              onClick={() =>
                document.getElementById("update-success-modal").close()
              }
            >
              Close
            </CustomButton>
          </div>
        </div>
      </dialog>

      {/* modal preview profile */}
      <dialog
        id="preview-profile"
        className="modal fixed inset-0 overflow-y-auto"
      >
        <PreviewProfile
          name={name}
          age={age}
          city={city}
          location={location}
          sexIdentity={sexIdentity}
          sexPref={sexPref}
          racialPref={racialPref}
          meetingInterest={meetingInterest}
          aboutMe={aboutMe}
          hobby={selectedOptions}
          image={avatar}
        />
      </dialog>

      {/* modal delete confirm */}
      <dialog id="delete-confirm" className="modal px-4">
        <div className="delete-popup w-full max-w-[530px] rounded-2xl bg-white shadow-xl">
          <div className="delete-title flex items-center justify-between border-b border-fourth-300 px-4 py-2 md:px-6">
            <h3 className="text-xl font-semibold">Delete Confirmation</h3>
            <form method="dialog">
              <button className="btn btn-circle btn-ghost btn-sm text-xl text-fourth-500">
                x
              </button>
            </form>
          </div>
          <div className="flex flex-col gap-6 p-4 md:p-6">
            <p className="text-base font-normal text-fourth-700">
              Do you sure to delete account?
            </p>
            <div className="flex flex-col gap-4 md:flex-row md:gap-4">
              <CustomButton
                buttonType="secondary"
                className="w-full text-base font-bold md:w-[200px]"
                onClick={() => {
                  deleteuser(userId);
                }}
              >
                Yes, I want to delete
              </CustomButton>
              <CustomButton
                buttonType="primary"
                className="w-full text-base font-bold md:w-[125px]"
                onClick={() =>
                  document.getElementById("delete-confirm").close()
                }
              >
                No, I don't
              </CustomButton>
            </div>
          </div>
        </div>
      </dialog>

      <footer className="footer-section">
        <Footer />
      </footer>
    </>
  );
}
