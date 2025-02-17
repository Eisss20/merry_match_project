import { CardImage, ChatBubble, CustomButton } from "@/components/CustomUi";
import { GoHeartFill } from "react-icons/go";
import { useRouter } from "next/router";

export default function HeaderSection() {
  const router = useRouter();

  return (
    <header className="relative mx-auto -mt-32 flex w-full max-w-5xl flex-col items-center justify-between gap-8 lg:mt-0 lg:h-[40rem] lg:flex-row lg:gap-0">
      {/* person 1 */}
      <div className="relative -left-10 top-0 w-auto self-start sm:left-0 lg:-top-28 lg:order-3 lg:self-start">
        <CardImage className="h-[26rem] w-[15rem]">
          <img
            src="/images/person-hompage1.jpg"
            alt="Person"
            className="scale-120 h-full w-full object-cover grayscale lg:scale-105"
          />
        </CardImage>

        <ChatBubble
          className="absolute -right-20 bottom-11 scale-75 bg-primary-700 text-sm text-white"
          type="sender"
        >
          Hi! Nice to meet you
        </ChatBubble>
      </div>

      {/* Main title */}
      <section className="flex flex-shrink-0 flex-col items-center p-6 text-center lg:order-2">
        <article>
          <h1 className="text-6xl font-extrabold text-utility-primary">
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
      <div className="relative -right-10 w-auto self-end sm:-right-0 lg:order-1">
        <CardImage className="h-[26rem] w-[15rem]">
          <img
            src="/images/person-hompage2.jpg"
            alt="Person"
            className="scale-120 h-full w-full object-cover grayscale lg:scale-105"
          />
        </CardImage>

        <ChatBubble
          className="absolute -left-16 top-16 scale-75 bg-primary-700 text-sm text-white"
          type="receiver"
        >
          <GoHeartFill className="hidden lg:absolute lg:left-3 lg:top-2 lg:block lg:h-2 lg:w-2 lg:-rotate-[20deg]" />
          Nice to meet you
        </ChatBubble>
      </div>
    </header>
  );
}
