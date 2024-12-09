import { FaLocationDot } from "react-icons/fa6";
import { IoArrowBackOutline } from "react-icons/io5";
import { IoArrowForwardOutline } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { IoHeart } from "react-icons/io5";
import { HobbyBlog } from "../HobbyBlog";
import { useRouter } from "next/navigation";

export function PreviewProfile() {
  const router = useRouter();

  return (
    <>
      <div className="preview-card bg-white lg:w-[1140px] lg:rounded-[32px]">
        <form
          method="dialog"
          className="hidden lg:flex lg:flex-row lg:justify-end lg:px-3 lg:py-2"
        >
          <button className="btn btn-circle btn-ghost btn-sm text-xl text-fourth-500 lg:text-[30px]">
            x
          </button>
        </form>
        <div className="lg:px-14 lg:pb-12">
          <div className="lg:flex lg:flex-row lg:gap-7">
            {/* show-image  */}
            <div className="image relative lg:w-full">
              <form method="dialog">
                <button
                  className="btn btn-ghost absolute rounded-xl lg:hidden"
                  //onClick={() => router.push("/profile")}
                >
                  <IoArrowBackOutline className="h-4 w-4 text-white" />
                </button>
              </form>
              <img
                src="/images/test1.png"
                alt="man in black"
                className="h-[315px] w-full rounded-bl-3xl rounded-br-3xl object-cover object-center lg:h-[436px] lg:rounded-[32px]"
              />
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
                  1<span className="text-fourth-600">/2</span>
                </div>

                <div className="image-arrow">
                  <button className="btn btn-ghost join-item rounded-xl bg-white">
                    <IoArrowBackOutline className="h-4 w-4 text-fourth-600" />
                  </button>
                  <button className="btn btn-ghost join-item rounded-xl bg-white">
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
                    Jon Snow
                  </h2>
                  <h2 className="text-5xl font-extrabold text-fourth-700">
                    26
                  </h2>
                </div>
                <div className="location flex flex-row gap-4">
                  <FaLocationDot className="h-6 w-6 text-primary-200" />
                  <span className="text-xl font-semibold text-fourth-700">
                    Bangkok, Thailand
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
                    Male
                  </span>
                </label>
                <label className="sexual-preferences flex flex-row gap-2 py-[6px]">
                  <span className="w-2/5 text-base font-normal text-fourth-900">
                    Sexual preferences
                  </span>
                  <span className="text-base font-normal text-fourth-700">
                    Female
                  </span>
                </label>
                <label className="racial-preferences flex flex-row gap-2 py-[6px]">
                  <span className="w-2/5 text-base font-normal text-fourth-900">
                    Racial preferences
                  </span>
                  <span className="text-base font-normal text-fourth-700">
                    Asian
                  </span>
                </label>
                <label className="meeting-interests flex flex-row gap-2 py-[6px]">
                  <span className="w-2/5 text-base font-normal text-fourth-900">
                    Meeting interests
                  </span>
                  <span className="text-base font-normal text-fourth-700">
                    Friends
                  </span>
                </label>
              </div>

              {/* about-me */}
              <div className="about-me flex flex-col gap-3 lg:gap-4">
                <h4 className="text-2xl font-bold text-fourth-900">About me</h4>
                <span className="text-base font-normal text-fourth-900">
                  I know nothing...but you
                </span>
              </div>

              {/* hobbies-interests */}
              <div className="hobbies-interests flex flex-col gap-3 lg:gap-6">
                <h4 className="text-2xl font-bold text-fourth-900">
                  Hobbies and Interests
                </h4>
                <div className="hobby-list flex flex-row gap-3">
                  <HobbyBlog />
                  <HobbyBlog />
                  <HobbyBlog />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
