import { CustomButton } from "@/components/CustomUi";
import { useRouter } from "next/router";
import { GoHeartFill } from "react-icons/go";

export default function StartMacthing() {
  const router = useRouter();

  return (
    <>
      <section className="mx-auto flex items-center justify-center bg-utility-bg lg:container lg:px-20 lg:pb-24">
        <div className="relative w-full max-w-5xl overflow-hidden bg-gradient-to-r from-primary-600 via-utility-third to-purple-500 p-6 pb-28 text-center lg:rounded-badge lg:p-20">
          {/* Decorative Heart - Big (อยู่ข้างหลัง h2) */}
          <div>
            <GoHeartFill className="absolute -left-7 top-4 z-0 h-[140px] w-[151px] -rotate-[20deg] text-primary-300 opacity-30" />
          </div>

          <h2 className="relative z-10 mb-6 mt-16 text-center text-5xl font-extrabold text-white lg:mt-0 lg:text-4xl">
            Let's start finding <br />
            and matching someone new
          </h2>

          <CustomButton
            className="bg-white px-6 py-3 font-semibold"
            buttonType="secondary"
            onClick={() => router.push("/matches")}
          >
            Start Matching!
          </CustomButton>

          {/* Decorative Hearts - Other Sizes */}
          {/* Small */}
          <div>
            <GoHeartFill className="absolute bottom-20 right-10 h-[22px] w-[24px] -rotate-[20deg] overflow-hidden text-primary-200 opacity-50 lg:bottom-28 lg:right-12" />
          </div>

          {/* Medium */}
          <div>
            <GoHeartFill className="absolute -right-8 bottom-0 h-[70px] w-[77px] rotate-[15deg] overflow-hidden text-primary-200 opacity-50 lg:-right-4 lg:bottom-6" />
          </div>
        </div>
      </section>
    </>
  );
}
