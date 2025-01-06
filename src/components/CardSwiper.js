import { FiX } from "react-icons/fi";
import { IoMdEye } from "react-icons/io";
import { IoArrowBack, IoArrowForward } from "react-icons/io5";
import { GoHeartFill } from "react-icons/go";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow } from "swiper/modules";
import "swiper/css";

import { useState } from "react";
import axios from "axios";

function CardSwiper({ userId, userProfiles, setUserProfiles }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState(null);

  const handleLikeUser = async (otherUserId) => {
    const response = await axios.post("/api/matches/likes", {
      user_master: userId,
      user_other: otherUserId,
    });

    console.log("response:", response);

    const newuserProfiles = [...userProfiles].filter(
      (profile) => profile.user_id !== otherUserId,
    );

    setUserProfiles(newuserProfiles);
  };

  const handleDislikeUser = async (otherUserId) => {
    const newuserProfiles = [...userProfiles].filter(
      (profile) => profile.user_id !== otherUserId,
    );

    setUserProfiles(newuserProfiles);
  };

  return (
    <Swiper
      effect={"coverflow"}
      modules={[EffectCoverflow]}
      slidesPerView={1.25}
      spaceBetween={0}
      centeredSlides={true}
      loop={false}
      onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
      onSwiper={(swiper) => setSwiperInstance(swiper)}
      coverflowEffect={{
        rotate: 0,
        stretch: 0,
        depth: 100,
        modifier: 2.5,
        slideShadows: false,
      }}
      breakpoints={{
        1024: {
          slidesPerView: 1.25,
        },
        1536: {
          slidesPerView: 1.5,
        },
      }}
      className="h-full w-full"
    >
      {userProfiles.map((profile, index) => (
        <SwiperSlide key={index} className="!flex items-center">
          <div className="relative mx-auto aspect-square w-full min-w-[10rem] max-w-[32.5rem] rounded-3xl 2xl:w-[60%] 2xl:max-w-full">
            {/* Text */}
            <div className="absolute bottom-14 z-20 flex w-full items-center justify-between">
              <div className="flex translate-x-10 items-center gap-4 text-3xl font-medium">
                <p
                  className={`text-utility-primary duration-300 ${activeIndex !== index ? "text-opacity-0" : ""}`}
                >
                  {profile.name} {profile.age} {profile.gender}
                </p>
                <button
                  className={`flex aspect-square items-center justify-center rounded-full bg-utility-primary p-2 transition-colors duration-300 hover:bg-opacity-25 ${activeIndex !== index ? "bg-opacity-0" : "bg-opacity-20"}`}
                >
                  <IoMdEye
                    className={`size-4 text-utility-primary duration-300 ${activeIndex !== index ? "text-opacity-0" : ""}`}
                  />
                </button>
              </div>

              {/* Navigator */}
              <div className="flex -translate-x-10 gap-4">
                <button
                  className={`text-utility-primary transition-colors duration-300 ${
                    activeIndex === index
                      ? activeIndex === 0
                        ? "cursor-default text-opacity-50"
                        : "hover:text-neutral-200"
                      : "text-opacity-0"
                  } `}
                  onClick={() => swiperInstance?.slidePrev()}
                >
                  <IoArrowBack className="size-6" />
                </button>
                <button
                  className={`text-utility-primary transition-colors duration-300 ${
                    activeIndex === index
                      ? activeIndex === userProfiles.length - 1
                        ? "cursor-default text-opacity-50"
                        : "hover:text-neutral-200"
                      : "text-opacity-0"
                  }`}
                  onClick={() => swiperInstance?.slideNext()}
                >
                  <IoArrowForward className="size-6" />
                </button>
              </div>
            </div>

            {/* Like/dislike button */}
            <div className="absolute bottom-0 z-20 flex w-full translate-y-1/2 items-center justify-center gap-5">
              <button
                type="button"
                onClick={() => handleDislikeUser(profile.user_id)}
                className={`flex aspect-square h-auto w-[14%] items-center justify-center rounded-3xl bg-utility-primary text-fourth-700 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-neutral-200 ${activeIndex !== index ? "bg-opacity-0 text-opacity-0 shadow-none" : ""}`}
              >
                <FiX className="aspect-square h-[60%] w-auto" />
              </button>
              <button
                type="button"
                onClick={() => handleLikeUser(profile.user_id)}
                className={`flex aspect-square h-auto w-[14%] items-center justify-center rounded-3xl bg-utility-primary text-primary-500 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-neutral-200 ${activeIndex !== index ? "bg-opacity-0 text-opacity-0 shadow-none" : ""}`}
              >
                <GoHeartFill className="aspect-square h-[55%] w-auto" />
              </button>
            </div>

            {/* Div gradient */}
            <div
              className={`bg-cardGradient absolute -bottom-1 z-10 h-full w-full rounded-3xl transition-colors duration-300 ${activeIndex !== index ? "blur-sm" : ""}`}
            ></div>
            <img
              src={profile.image_profile[0]}
              alt="Match 1"
              className={`h-full w-full rounded-3xl object-cover transition-all duration-300 ${activeIndex !== index ? "blur-sm grayscale" : ""}`}
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default CardSwiper;
