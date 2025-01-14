import { NavBar, Footer } from "@/components/NavBar";
import { useRouter } from "next/router";
import PaymentSuccess from "@/components/payment/paymentsuccess";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const { transactionId, amount, name_package, price, description } =
    router.query; // รับข้อมูลผ่าน query parameters

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <PaymentSuccess
        name_package={name_package}
        price={price}
        description={description}
      />
      <Footer />
    </div>
  );
}
