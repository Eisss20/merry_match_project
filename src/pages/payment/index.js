import { NavBar, Footer } from "@/components/NavBar";
// import PaymentSuccess from "@/components/payment/paymentsuccess";
import PaymentContainer from "@/components/payment/payment";
import { useRouter } from "next/router";

export default function Homepage() {
  const router = useRouter();
  const {
    icon_url,
    packages_id,
    name_package,
    price,
    description,
    stripe_price_id,
  } = router.query; // รับ Query Parameters

  // แปลง `price` เป็นตัวเลข
  const numericPrice = parseFloat(price);

  return (
    <>
      <NavBar />
      <PaymentContainer
        icon_url={icon_url}
        packages_id={packages_id}
        name_package={name_package}
        price={numericPrice}
        description={description}
        stripe_price_id={stripe_price_id}
      />
      <Footer />
    </>
  );
}
