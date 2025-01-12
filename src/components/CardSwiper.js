import { FiX } from "react-icons/fi";
import { IoMdEye } from "react-icons/io";
import { IoArrowBack, IoArrowForward } from "react-icons/io5";
import { GoHeartFill } from "react-icons/go";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow } from "swiper/modules";
import "swiper/css";
import { useState, useRef, useEffect } from "react";

import { DetailProfileDesktop } from "./matches/DetailProfileDesktop";
import MatchAnimation from "@/components/matches/MatchAnimation";

function CardSwiper({
  userProfiles,
  handleLikeUser,
  handleDislikeUser,
  isMatchAnimation,
  matchChatId,
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState(null);

  const activeProfileDesktop = userProfiles[activeIndex];
  const modalRef = useRef(null);

  useEffect(() => {
    if (swiperInstance) {
      swiperInstance.allowSlideNext = !isMatchAnimation;
      swiperInstance.allowSlidePrev = !isMatchAnimation;
    }
  }, [isMatchAnimation, swiperInstance]);

  return (
    <>
      <Swiper
        effect={"coverflow"}
        modules={[EffectCoverflow]}
        slidesPerView={1.25}
        spaceBetween={0}
        centeredSlides={true}
        loop={false}
        onSlideChange={(swiper) => {
          if (isMatchAnimation) {
            swiper.slideTo(activeIndex); // Prevent slide change
          } else {
            setActiveIndex(swiper.activeIndex);
          }
        }}
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
        className={`h-full w-full`}
      >
        {userProfiles.map((profile, index) => (
          <SwiperSlide key={index} className="!flex items-center">
            <div className="relative mx-auto aspect-square w-full min-w-[10rem] max-w-[32.5rem] rounded-3xl 2xl:w-[60%] 2xl:max-w-full">
              {/* Text */}
              {!isMatchAnimation && (
                <div className="absolute bottom-0 z-20 flex w-full items-center justify-between px-10 pb-14">
                  <div className="flex items-center gap-4 text-3xl font-medium">
                    <p
                      className={`text-utility-primary duration-300 ${activeIndex !== index ? "pointer-events-none text-opacity-0" : ""}`}
                    >
                      {profile.name} {profile.age} {profile.gender}
                    </p>
                    <button
                      className={`flex aspect-square items-center justify-center rounded-full bg-utility-primary p-2 transition-colors duration-300 hover:bg-opacity-25 ${activeIndex !== index ? "bg-opacity-0" : "bg-opacity-20"}`}
                      onClick={() => {
                        document
                          .getElementById("preview-profile-desktop")
                          .showModal();
                      }}
                    >
                      <IoMdEye
                        className={`size-4 text-utility-primary duration-300 ${activeIndex !== index ? "pointer-events-none text-opacity-0" : ""}`}
                      />
                    </button>
                  </div>

                  {/* Navigator */}
                  <div className="flex gap-4">
                    <button
                      className={`text-utility-primary transition-colors duration-300 ${
                        activeIndex === index
                          ? activeIndex === 0
                            ? "cursor-default text-opacity-50"
                            : "hover:text-neutral-200"
                          : "pointer-events-none text-opacity-0"
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
                          : "pointer-events-none text-opacity-0"
                      }`}
                      onClick={() => swiperInstance?.slideNext()}
                    >
                      <IoArrowForward className="size-6" />
                    </button>
                  </div>
                </div>
              )}

              {/* Like/dislike button */}
              {!isMatchAnimation && (
                <div className="absolute bottom-0 z-20 flex w-full translate-y-1/2 items-center justify-center gap-5">
                  <button
                    type="button"
                    onClick={() => handleDislikeUser(profile.user_id)}
                    className={`flex aspect-square h-auto w-[5rem] items-center justify-center rounded-3xl bg-utility-primary text-fourth-700 shadow-lg transition-colors duration-300 hover:bg-neutral-200 ${activeIndex !== index ? "pointer-events-none bg-opacity-0 text-opacity-0 shadow-none" : ""}`}
                  >
                    <FiX className="aspect-square h-[60%] w-auto" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLikeUser(profile.user_id)}
                    className={`flex aspect-square h-auto w-[5rem] items-center justify-center rounded-3xl bg-utility-primary text-primary-500 shadow-lg transition-colors duration-300 hover:bg-neutral-200 ${activeIndex !== index ? "pointer-events-none bg-opacity-0 text-opacity-0 shadow-none" : ""}`}
                  >
                    <GoHeartFill className="aspect-square h-[55%] w-auto" />
                  </button>
                </div>
              )}

              {/* Match animation */}
              {isMatchAnimation && activeIndex === index && (
                <div className="absolute top-0 z-50 flex h-full w-full translate-y-1/2 items-center justify-center">
                  <MatchAnimation matchChatId={matchChatId} />
                </div>
              )}

              {/* Div gradient */}
              <div
                className={`absolute -bottom-1 z-10 h-full w-full rounded-3xl bg-gradient-to-t from-[#390741] to-30% transition-colors duration-300 ${activeIndex !== index ? "blur-sm" : ""}`}
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

      {/* Profile modal */}
      <dialog
        id="preview-profile-desktop"
        ref={modalRef}
        className="modal px-10"
      >
        {activeProfileDesktop && (
          <DetailProfileDesktop
            name={activeProfileDesktop.name}
            age={activeProfileDesktop.age}
            city={activeProfileDesktop.city}
            location={activeProfileDesktop.location}
            sexIdentity={activeProfileDesktop.gender}
            sexPref={activeProfileDesktop.sexual_preference}
            racialPref={activeProfileDesktop.racial_preference}
            meetingInterest={activeProfileDesktop.meeting_interest}
            aboutMe={activeProfileDesktop.about_me}
            hobby={activeProfileDesktop.hobbies}
            image={activeProfileDesktop.image_profile}
            userId={activeProfileDesktop.user_id}
            onDislike={handleDislikeUser}
            onLike={handleLikeUser}
            closeModal={() => modalRef.current?.close()}
          />
        )}
      </dialog>
    </>
  );
}

export default CardSwiper;
