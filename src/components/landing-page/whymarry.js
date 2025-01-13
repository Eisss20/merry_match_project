import { VscSend } from "react-icons/vsc";
import { IoShieldCheckmarkSharp } from "react-icons/io5";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { FaStar } from "react-icons/fa6";
import { TiStarOutline } from "react-icons/ti";

export default function WhyMerrySection() {
  return (
    <>
      <section id="WhyMerrySection" className="flex flex-col items-center justify-center bg-utility-bg lg:flex-row lg:gap-28">
        {/* Left Content */}
        <article className="max-w-lg p-8 text-white lg:p-8">
          <h1 className="mb-6 text-4xl font-extrabold text-second-300 lg:mb-10 lg:text-5xl">
            Why Merry Match?
          </h1>
          <p className="mb-6 text-lg">
            Merry Match is a new generation of online dating website for
            everyone
          </p>
          <p className="text-sm leading-relaxed">
            Whether you're committed to dating, meeting new people, expanding
            your social network, meeting locals while traveling, or even just
            making a small chat with strangers.
          </p>
          <p className="mt-4 text-sm leading-relaxed">
            This site allows you to make your own dating profile, discover new
            people, save favorite profiles, and let them know that you're
            interested.
          </p>
        </article>

        {/* Right Content */}
        <div className="relative">
          <figure className="flext flex px-[5rem] py-[10rem] lg:px-[10rem]">
            {/* Box 1 */}
            <div className="absolute right-[1.5rem] top-[1.3rem] z-20 flex h-[4.8rem] w-[11rem] items-center justify-between overflow-hidden rounded-badge bg-pink-700 drop-shadow lg:-left-[1.5rem] lg:right-[0rem] lg:top-[0.8rem] lg:h-[5.4rem] lg:w-[12rem]">
              <div className="mb-5 ml-1 flex flex-row items-center justify-center px-4">
                <VscSend className="rotate-[300deg] font-semibold text-utility-primary" />{" "}
                <p className="ml-2 font-bold text-utility-primary">Fast</p>
              </div>
              <img
                src="sendIcon.svg"
                alt="Person"
                className="scale-120 absolute left-[6.3rem] top-[0] h-[4.5rem] w-[4.5rem] rotate-[135deg] object-cover lg:scale-105"
              />
            </div>

            {/* Box 2 */}

            <div className="absolute -right-[3rem] bottom-0 top-[5.5rem] z-10 flex h-[5.5rem] w-[18.5rem] items-center justify-between overflow-hidden rounded-badge bg-pink-400 drop-shadow-md lg:-left-[5rem] lg:w-[20rem]">
              <div className="flex w-full flex-row justify-end px-5">
                <IoShieldCheckmarkOutline className="h-[1rem] w-[1rem] font-semibold text-second-700" />{" "}
                <p className="ml-2 font-bold text-second-600"> Secure </p>
                <IoShieldCheckmarkSharp className="absolute left-[1.5rem] top-[1.2rem] h-[5.5rem] w-[5.5rem] text-second-200" />
              </div>
            </div>

            {/* Box 3 */}
            <div className="absolute left-[2rem] top-[10rem] z-10 flex h-[7rem] w-[14rem] items-center justify-between overflow-hidden rounded-badge bg-second-200 drop-shadow-md lg:left-[4rem] lg:top-[9.4rem] lg:w-[16.5rem]">
              <div className="ml-1 mt-10 flex flex-row items-center justify-center px-4">
                <TiStarOutline className="mb-1 h-5 w-5 text-primary-400" />{" "}
                <p className="ml-2 text-xl font-bold text-primary-500">Easy</p>
                <FaStar className="absolute left-[8.5rem] top-[0.9rem] h-[6rem] w-[6rem] rotate-[31deg] text-pink-300" />
              </div>
            </div>

            <div className="z-5 absolute -right-[4.5rem] top-[3.5rem] h-12 w-12 overflow-hidden rounded-full drop-shadow lg:-right-[1rem]">
              <img
                src="/images/person-hompage3.png"
                alt="Person"
                className="scale-120 h-full w-full object-cover grayscale lg:scale-105"
              />
            </div>
            <div className="z-5 absolute -right-[5.5rem] top-[2.5rem] overflow-hidden rounded-full bg-third-700 p-1 lg:-right-[2.8rem] lg:top-[3rem]"></div>

            <div className="absolute right-[9rem] top-[13.9rem] z-0 h-16 w-16 overflow-hidden rounded-full drop-shadow lg:right-[17rem]">
              <img
                src="/images/person-hompage4.jpg"
                alt="Person"
                className="h-24 w-24 scale-150 object-cover grayscale lg:scale-150"
              />
            </div>

            <div className="z-5 absolute right-[14rem] top-[15.9rem] overflow-hidden rounded-full bg-second-400 p-[0.2rem] lg:right-[22.3rem]"></div>
          </figure>
        </div>
      </section>
    </>
  );
}
