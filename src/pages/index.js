import { NavBar, Footer } from "@/components/NavBar";
import CardSection from "@/components/landing-page/card-section";
import StartMacthing from "@/components/landing-page/startmatching-section";
import HeaderSection from "@/components/landing-page/header-section";
import WhyMerrySection from "@/components/landing-page/whymarry";
import { useAuth } from "@/contexts/AuthContext";
import LoadingMerry from "@/components/custom-loading/LoadingMerry";
import { GoHeartFill } from "react-icons/go";

export default function Homepage() {
  const { state } = useAuth();

  if (state.loading) {
    return <LoadingMerry />;
  }
  return (
    <div className="overflow-x-hidden bg-utility-bg">
      <NavBar />
      <div className="container relative mx-auto lg:px-20">
        {/* Background decoration */}
        <div>
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
        </div>

        <HeaderSection />
        <WhyMerrySection />
        <CardSection />
      </div>

      <StartMacthing />
      <Footer />
    </div>
  );
}
