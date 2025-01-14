import { FaLocationDot } from "react-icons/fa6";
import { IoArrowBackOutline } from "react-icons/io5";
import { IoArrowForwardOutline } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { IoHeart } from "react-icons/io5";
import { useState, useEffect } from "react";
import { HobbyBlog } from "../HobbyBlog";

export function PreviewProfilev2({
  name,
  age,
  city,
  location,
  sexIdentity,
  sexPref,
  racialPref,
  meetingInterest,
  aboutMe,
  hobby,
  image,
}) {
  const [hobbyList, setHobbyList] = useState([]); // เก็บ hobby
  const [imageList, setImageList] = useState([]); // เก็บ image
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // เก็บ index ของรูปที่กำลังแสดง

  // ฟังก์ชันสำหรับเลื่อนรูปไปข้างหน้า
  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === imageList.length - 1 ? 0 : prevIndex + 1,
    );
  };

  // ฟังก์ชันสำหรับเลื่อนรูปถอยหลัง
  const goToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? imageList.length - 1 : prevIndex - 1,
    );
  };

  // เช็คค่าว่า props image ที่รับมาเป็น Object หรือไม่ แล้วแปลงเป็น Array
  useEffect(() => {
    if (image && typeof image === "object") {
      const imageArray = Object.values(image);
      setImageList(imageArray); // ใส่ลง state หลังแปลงเป็น Array
      setCurrentImageIndex(0);
    }
  }, [image]); //ถ้า image มีการเปลี่ยนแปลง useEffect จะทำงาน
  // console.log("imagelist", imageList);

  // เช็คค่าว่า props hobby ที่รับมาเป็น Array หรือไม่
  useEffect(() => {
    if (Array.isArray(hobby)) {
      setHobbyList(hobby);
    }
  }, [hobby]); //ถ้า hobby มีการเปลี่ยนแปลง useEffect จะทำงาน
  // console.log("hobbylist", hobbyList);

  // ฟังก์ชันสำหรับแสดง URL ของรูปภาพ
  const getImageUrl = (img) => {
    if (img && img.image_url) {
      return img.image_url; // ถ้าเป็น Object ที่มี image_url ให้ใช้ URL นั้น
    }
    if (img instanceof File) {
      return URL.createObjectURL(img); // ถ้าเป็น File ใช้ URL.createObjectURL() เพื่อแปลงเป็น URL
    }
    return ""; // ถ้าไม่มี URL คืนค่าเป็นค่าว่าง
  };

  const currentImage = imageList[currentImageIndex];

  return (
    <>
      <div className="absalute">
        <div className="preview-card container bg-white">
          <form
            method="dialog"
            className="hidden lg:flex lg:flex-row lg:justify-end lg:px-3 lg:py-2"
          >
            <button className="btn btn-circle btn-ghost btn-sm text-xl text-fourth-500 lg:text-[30px]">
              x
            </button>
          </form>
          <div className="lg:px-14 lg:pb-14">
            <div className="lg:flex lg:flex-row lg:gap-7">
              {/* show-image  */}
              <div className="image relative lg:w-full">
                <form method="dialog">
                  <button className="btn btn-ghost absolute rounded-xl lg:hidden">
                    <IoArrowBackOutline className="h-4 w-4 text-white" />
                  </button>
                </form>

                {imageList.length > 0 && (
                  <div className="relative -left-7 -top-11 w-[24rem] lg:hidden">
                    <img
                      src={getImageUrl(currentImage)}
                      alt={`Image ${currentImageIndex + 1}`}
                      className="h-[436px] w-full rounded-bl-3xl rounded-br-3xl object-cover object-center lg:h-[436px] lg:rounded-[32px]"
                    />
                  </div>
                )}

                {imageList.length > 0 && (
                  <div className="hidden lg:block">
                    <img
                      src={getImageUrl(currentImage)}
                      alt={`Image ${currentImageIndex + 1}`}
                      className="h-[436px] w-full rounded-bl-3xl rounded-br-3xl object-cover object-center lg:h-[436px] lg:rounded-[32px]"
                    />
                  </div>
                )}

                <div className="dislike-like-button absolute left-1/2 top-[285px] flex -translate-x-1/2 flex-row gap-6 lg:top-[404px]">
                  <button className="dislike btn h-[60px] w-[60px] rounded-2xl bg-white drop-shadow-xl">
                    <RxCross2 className="text-5xl text-fourth-700" />
                  </button>
                  <button className="like btn h-[60px] w-[60px] rounded-2xl bg-white drop-shadow-xl">
                    <IoHeart className="text-5xl text-primary-500" />
                  </button>
                </div>

                {/* image-wrapper */}
                <div className="image-wrapper flex flex-row justify-between">
                  <div className="image-number px-6 py-3 text-fourth-700">
                    {currentImageIndex + 1}
                    <span className="text-fourth-600">/{imageList.length}</span>
                  </div>

                  <div className="image-arrow">
                    <button
                      className="btn btn-ghost join-item rounded-xl bg-white"
                      onClick={goToPreviousImage}
                    >
                      <IoArrowBackOutline className="h-4 w-4 text-fourth-600" />
                    </button>
                    <button
                      className="btn btn-ghost join-item rounded-xl bg-white"
                      onClick={goToNextImage}
                    >
                      <IoArrowForwardOutline className="h-4 w-4 text-fourth-600" />
                    </button>
                  </div>
                </div>
              </div>

              {/* information-section */}
              <div className="information flex flex-col gap-6 px-4 py-6 lg:w-full lg:gap-10 lg:pb-0 lg:pl-[60px] lg:pt-6">
                {/* head */}
                <header className="head-section flex flex-col gap-3 lg:gap-2">
                  <div className="name-age flex flex-row gap-4">
                    <h2 className="text-5xl font-extrabold text-fourth-900">
                      {name}
                    </h2>
                    <h2 className="text-5xl font-extrabold text-fourth-700">
                      {age}
                    </h2>
                  </div>
                  <div className="location flex flex-row gap-4">
                    <FaLocationDot className="h-6 w-6 text-primary-200" />
                    <span className="text-xl font-semibold text-fourth-700">
                      {city}, {location}
                    </span>
                  </div>
                </header>

                {/* sexual-prefer */}
                <div className="sexual-preference flex flex-col">
                  <label className="sexual-identities flex flex-row gap-2 py-[6px]">
                    <span className="w-2/5 text-base font-normal text-fourth-900">
                      Sexual identities
                    </span>
                    <span className="text-base font-normal text-fourth-700">
                      {sexIdentity}
                    </span>
                  </label>
                  <label className="sexual-preferences flex flex-row gap-2 py-[6px]">
                    <span className="w-2/5 text-base font-normal text-fourth-900">
                      Sexual preferences
                    </span>
                    <span className="text-base font-normal text-fourth-700">
                      {sexPref}
                    </span>
                  </label>
                  <label className="racial-preferences flex flex-row gap-2 py-[6px]">
                    <span className="w-2/5 text-base font-normal text-fourth-900">
                      Racial preferences
                    </span>
                    <span className="text-base font-normal text-fourth-700">
                      {racialPref}
                    </span>
                  </label>
                  <label className="meeting-interests flex flex-row gap-2 py-[6px]">
                    <span className="w-2/5 text-base font-normal text-fourth-900">
                      Meeting interests
                    </span>
                    <span className="text-base font-normal text-fourth-700">
                      {meetingInterest}
                    </span>
                  </label>
                </div>

                {/* about-me */}
                <div className="about-me flex flex-col gap-3 lg:gap-4">
                  <h4 className="text-2xl font-bold text-fourth-900">
                    About me
                  </h4>
                  <span className="text-base font-normal text-fourth-900">
                    {aboutMe}
                  </span>
                </div>

                {/* hobbies-interests */}
                <div className="hobbies-interests flex flex-col gap-3 lg:gap-6">
                  <h4 className="text-2xl font-bold text-fourth-900">
                    Hobbies and Interests
                  </h4>
                  <div className="hobby-list flex flex-wrap items-center gap-3">
                    {hobbyList.map((option, index) => {
                      return (
                        <p
                          key={index}
                          className="whitespace-normal break-words rounded-lg border border-pink-500 px-4 py-2 text-center text-pink-500"
                        >
                          {option}
                        </p>
                        ///เก็บ responsive modal and api inert for delete limit match qty.
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
