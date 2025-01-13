import { NavBar, Footer } from "@/components/NavBar";
import CardSection from "@/components/landing-page/card-section";
import StartMacthing from "@/components/landing-page/startmatching-section";
import HeaderSection from "@/components/landing-page/header-section";
import WhyMerrySection from "@/components/landing-page/whymarry";
import { useAuth } from "@/contexts/AuthContext";
import LoadingMerry from "@/components/custom-loading/LoadingMerry";

export default function Homepage() {
  const { state } = useAuth();

  if (state.loading) {
    return <LoadingMerry />;
  }
  return (
    <>
      <NavBar />
      <HeaderSection />
      <WhyMerrySection />
      <CardSection />
      <StartMacthing />
      <Footer />
    </>
  );
}
