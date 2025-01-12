import { FiX } from "react-icons/fi";
import { IoMdEye } from "react-icons/io";
import { GoHeartFill } from "react-icons/go";
import { HiMiniMapPin } from "react-icons/hi2";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useState, useRef, useEffect } from "react";

import { DetailProfile } from "./DetailProfile";
import MatchAnimation from "./MatchAnimation";

export default function CardSwiperMobile({
  userProfiles,
  handleLikeUser,
  handleDislikeUser,
  isMatchAnimation,
  matchChatId,
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState(null);
  const modalRef = useRef(null);

  const activeProfile = userProfiles[activeIndex];

  useEffect(() => {
    if (swiperInstance) {
      swiperInstance.allowSlideNext = !isMatchAnimation;
      swiperInstance.allowSlidePrev = !isMatchAnimation;
    }
  }, [isMatchAnimation, swiperInstance]);

  return (
    <>
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        onSwiper={(swiper) => setSwiperInstance(swiper)}
        className="h-[75vh] w-full rounded-b-3xl"
      >
        {userProfiles.map((profile, index) => (
          <SwiperSlide key={index} className="!flex h-full">
            <div className="relative min-w-full">
              {/* Text */}
              {!isMatchAnimation && (
                <div
                  className={`absolute bottom-0 z-20 flex w-full items-center justify-between gap-3 px-4 pb-14 text-4xl font-semibold transition-colors md:px-14 ${activeIndex !== index ? "bg-opacity-0 text-opacity-0" : "bg-opacity-0 text-opacity-0"}`}
                >
                  {/* Name, age */}
                  <div className="flex flex-col">
                    <p
                      className={`text-utility-primary duration-300 ${activeIndex !== index && "text-opacity-0"}`}
                    >
                      {profile.name}{" "}
                      <span
                        className={`text-fourth-400 duration-300 ${activeIndex !== index && "text-opacity-0"}`}
                      >
                        {profile.age}
                      </span>{" "}
                      {profile.gender}
                    </p>

                    {/* Location */}
                    <div className="flex items-center gap-1 font-medium">
                      <HiMiniMapPin
                        className={`size-6 text-[#BEBFF1] duration-300 ${activeIndex !== index && "text-opacity-0"}`}
                      />
                      <p
                        className={`text-lg text-[#D6D9E4] duration-300 ${activeIndex !== index && "text-opacity-0"}`}
                      >
                        Bangkok, Thailand
                      </p>
                    </div>
                  </div>

                  <button
                    className={`flex aspect-square items-center justify-center rounded-full bg-utility-primary p-2 transition-colors duration-300 hover:bg-opacity-25 ${activeIndex !== index ? "bg-opacity-0" : "bg-opacity-20"}`}
                    onClick={() => {
                      document
                        .getElementById("preview-profile-mobile")
                        .showModal();
                    }}
                  >
                    <IoMdEye
                      className={`size-4 text-utility-primary duration-300 ${activeIndex !== index && "text-opacity-0"}`}
                    />
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
                className={`absolute -bottom-1 z-10 h-full w-full bg-gradient-to-t from-[#390741] to-30% ${index === 0 && "rounded-bl-3xl"} ${index === userProfiles.length - 1 && "rounded-br-3xl"}`}
              ></div>
              {/* Image Profile */}
              <div className="h-full w-full">
                <img
                  src={profile.image_profile[0]}
                  alt=""
                  className={`h-full w-full object-cover ${index === 0 && "rounded-bl-3xl"} ${index === userProfiles.length - 1 && "rounded-br-3xl"}`}
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Like/dislike button */}
      {!isMatchAnimation && activeProfile && (
        <div className="absolute z-20 flex w-full -translate-y-1/2 items-center justify-center gap-5">
          <button
            type="button"
            onClick={() => handleDislikeUser(activeProfile.user_id)}
            className={`flex aspect-square w-[5rem] items-center justify-center rounded-3xl bg-utility-primary text-fourth-700 shadow-lg transition-colors duration-300 hover:bg-neutral-200 md:w-[5.5rem]`}
          >
            <FiX className="aspect-square h-[60%] w-auto" />
          </button>
          <button
            type="button"
            onClick={() => handleLikeUser(activeProfile.user_id)}
            className={`flex aspect-square w-[5rem] items-center justify-center rounded-3xl bg-utility-primary text-primary-500 shadow-lg transition-colors duration-300 hover:bg-neutral-200 md:w-[5.5rem]`}
          >
            <GoHeartFill className="aspect-square h-[55%] w-auto" />
          </button>
        </div>
      )}

      {/* Profile modal */}
      <dialog
        id="preview-profile-mobile"
        ref={modalRef}
        className="no-scrollbar modal overflow-y-auto"
      >
        {activeProfile && (
          <DetailProfile
            name={activeProfile.name}
            age={activeProfile.age}
            city={activeProfile.city}
            location={activeProfile.location}
            sexIdentity={activeProfile.gender}
            sexPref={activeProfile.sexual_preference}
            racialPref={activeProfile.racial_preference}
            meetingInterest={activeProfile.meeting_interest}
            aboutMe={activeProfile.about_me}
            hobby={activeProfile.hobbies}
            image={activeProfile.image_profile}
            userId={activeProfile.user_id}
            onDislike={handleDislikeUser}
            onLike={handleLikeUser}
            closeModal={() => modalRef.current?.close()}
          />
        )}
      </dialog>
    </>
  );
}
