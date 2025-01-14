import { CardImage, ChatBubble, CustomButton } from "@/components/CustomUi";
import { GoHeartFill } from "react-icons/go";
import { useRouter } from "next/router";

export default function HeaderSection() {
  const router = useRouter();

  return (
    <>
      <header className="relative flex min-h-screen flex-col overflow-hidden bg-utility-bg pb-96 lg:flex lg:flex-row lg:items-center lg:justify-center lg:pb-24">
        <div className="absolute right-[38rem] top-[4rem] hidden h-2 w-2 rounded-full lg:block">
          <GoHeartFill className="h-5 w-5 text-second-600" />
        </div>
        <div className="absolute left-[4rem] top-[2.5rem] hidden h-2 w-2 rounded-full bg-primary-300 lg:block"></div>
        <div className="absolute -left-[0.5rem] top-[4rem] hidden h-10 w-10 rounded-full bg-second-700 lg:block"></div>
        <div className="absolute right-[4rem] top-[25rem] hidden h-10 w-10 rounded-full bg-second-800 lg:block"></div>
        <div className="absolute right-[5.7rem] top-[25.9rem] hidden rounded-full lg:block">
          😄
        </div>
        <div className="absolute right-[11rem] top-[28.5rem] hidden h-2 w-2 rounded-full bg-third-600 lg:block"></div>

        {/* person 1 */}
        <div className="absolute -left-24 -top-44 overflow-hidden lg:-top-44 lg:left-auto lg:right-64">
          <div className="l:p-23 container relative w-auto scale-110 p-20">
            <CardImage className="h-[20rem] w-[11.5rem] lg:h-[22rem] lg:w-[12.5rem]">
              <img
                src="/images/person-hompage1.jpg"
                alt="Person"
                className="scale-120 h-full w-full object-cover lg:scale-105"
              />
            </CardImage>

            <ChatBubble
              className="absolute left-40 top-80 scale-75 bg-primary-700 text-sm text-white lg:left-44 lg:top-[22rem]"
              type="sender"
            >
              Hi! Nice to meet you
            </ChatBubble>
          </div>
        </div>

        {/* Main title  2 */}

        <section className="lg:contain static mt-60 flex flex-shrink-0 flex-col items-center p-5 text-center lg:mb-20 lg:mt-0">
          <article>
            <h1 className="text-5xl font-extrabold text-utility-primary">
              Make the <br />
              first 'Merry'
            </h1>
            <h2 className="mt-6 text-lg font-medium text-utility-primary">
              If you feel lonely, let's start meeting <br />
              new people in your area! <br />
              Don't forget to get Merry with us
            </h2>
            <div className="relative z-10 mt-12">
              <CustomButton
                type="submit"
                buttonType="primary"
                customStyle="w-40"
                onClick={() => router.push("/matches")}
              >
                Start matching!
              </CustomButton>
            </div>
          </article>
        </section>

        {/* person 2 */}

        <div className="absolute -bottom-32 -left-40 flex flex-row items-center justify-center overflow-hidden pl-[13rem] lg:bottom-20 lg:left-60 lg:mt-0 lg:p-0 lg:pl-0">
          <div className="container relative w-auto scale-x-105 scale-y-100 p-20 lg:scale-x-105 lg:scale-y-100 lg:p-0">
            <div className="relative p-20">
              <CardImage className="h-[20rem] w-[11.5rem] lg:h-[25rem] lg:w-[13.5rem]">
                <img
                  src="/images/person-hompage2.jpg"
                  alt="Person"
                  className="h-full w-full object-cover grayscale"
                />
              </CardImage>

              <ChatBubble
                className="absolute left-8 top-28 scale-75 bg-primary-700 text-sm text-white lg:top-36"
                type="receiver"
              >
                <GoHeartFill className="hidden lg:absolute lg:left-3 lg:top-2 lg:block lg:h-2 lg:w-2 lg:-rotate-[20deg]" />
                Nice to meet you
              </ChatBubble>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
