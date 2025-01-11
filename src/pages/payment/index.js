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

  console.log("icon_url before Child is : ", icon_url);
  console.log("Package_id : ", packages_id);
  console.log("name_package : ", name_package);
  console.log("price : ", price);
  console.log("description : ", description);
  console.log("stripe_price_id : ", stripe_price_id);

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
