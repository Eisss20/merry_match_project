import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
);

function PaymentPage({
  icon_url,
  packages_id,
  name_package,
  price,
  description = "[]",
  stripe_price_id,
}) {
  const { state, logout } = useAuth();
  const userId = state.user?.id;

  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  // แปลง description เป็น Array ก่อน
  let parsedDescription = [];
  try {
    if (typeof description === "string" && description.trim() !== "") {
      parsedDescription = JSON.parse(description); // แปลง JSON string เป็น Array
    } else {
      console.warn("Description is not a valid JSON string:", description);
    }
  } catch (error) {
    console.error("Failed to parse description:", error);
    parsedDescription = []; // กำหนดค่าเริ่มต้นเป็น array ว่างหากเกิดข้อผิดพลาด
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    if (!stripe || !elements) {
      setError("Stripe or Elements has not loaded yet.");
      setLoading(false);
      return;
    }

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const amount = Math.round(price * 100); // คูณ 100 เพื่อแปลงเป็น integer

      const response = await axios.post(
        `${apiBaseUrl}/api/payment/create-payment-intent`,
        {
          user_id: userId,
          packages_id,
          amount, // Convert to smallest currency unit
          currency: "thb",
          stripe_price_id,
        },
      );

      //  const { clientSecret }  เป็นการดึงค่ามาจาก  response.data
      // ซึ่งภายใน response.data บรรจุค่า {clientSecret: 'pi_3QYNRNKtPXaR0mx21J??????_secret_????????'}
      // การประกาศ const { clientSecret } เป็นการเรียกใช้ค่าข้างในออกมาตรงๆโดยไม่เก็บผ่าน state เพื่อนำไปใช้ครั้งเดียวไม่ไปใช้ที่อื่นต่อ
      const { clientSecret } = response.data;
      if (!clientSecret) {
        throw new Error("Failed to retrieve client secret.");
      }
      const cardNumberElement = elements.getElement(CardNumberElement);
      const cardExpiryElement = elements.getElement(CardExpiryElement);
      const cardCvcElement = elements.getElement(CardCvcElement);

      if (!cardNumberElement || !cardExpiryElement || !cardCvcElement) {
        setError("Card elements have not loaded yet.");
        setLoading(false);
        return;
      }

      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardNumberElement,
            billing_details: {
              name: "Card Holder Name", // สามารถเพิ่ม input ชื่อได้
            },
          },
        });

      if (stripeError) {
        setError(stripeError.message);
      } else if (paymentIntent.status === "succeeded") {
        // alert("Payment successful!");
        router.push({
          pathname: "/payment/success",
          query: {
            icon_url,
            transactionId: paymentIntent.id,
            amount: price,
            name_package,
            price,
            description,
          },
        });
      } else {
        setError("Payment not completed. Try again.");
      }
    } catch (err) {
      setError("Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token"); // ตรวจสอบ Token ใน Local Storage

    if (!token) {
      logout();
    }
  }, []);

  console.log("icon in PaymentContainer is ", icon_url);

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="bg-utility-bgMain lg:flex lg:justify-center lg:pb-40 lg:pt-40"
      >
        {/* Package */}
        <div className="bg-gray-100 shadow-inner shadow-sm lg:h-72 lg:w-96 lg:rounded-2xl">
          <div className="containerpt border-b-2 pt-8 lg:border-b-0">
            <div className="w-auto pl-5 pr-5">
              <div className="flex items-center justify-start gap-[12px]">
                <Image
                  src="/Frame.svg"
                  width={24}
                  height={24}
                  alt="packageList"
                />
                <h1 className="text-xl font-semibold text-gray-500 lg:font-bold">
                  Merry Membership
                </h1>
              </div>
              <div className="h-auto w-auto pb-5 pt-5">
                <div className="flex justify-between">
                  <h1 className="text-lg font-medium text-gray-500">Package</h1>
                  <h1 className="pr-2 text-[20px] font-bold">{name_package}</h1>
                </div>
                <div className="pt-3 lg:pt-2">
                  <div className="h-auto min-h-[76px] flex-col rounded-[8px] bg-white pl-2 pt-4 font-medium text-gray-500">
                    {Array.isArray(parsedDescription) &&
                    parsedDescription.length > 0 ? (
                      <ul className="list-disc pl-8">
                        {parsedDescription.map((detail, index) => (
                          <li className="pl-1 text-base" key={index}>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-[16px] text-gray-500">
                        No details available
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-between pt-5 lg:pt-6">
                  <h1 className="text-lg font-normal text-gray-500">
                    Price (Monthly)
                  </h1>
                  <h1 className="pr-2 text-xl font-bold text-primary-800">
                    THB {price}
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* End Package */}

        <div className="container shadow lg:ml-7 lg:w-[24vw] lg:rounded-3xl lg:border">
          <div className="mt-5 flex items-center justify-between gap-[12px] bg-gray-100 p-8 lg:mt-0 lg:rounded-xl">
            <h1 className="text-xl font-semibold text-[#646C80]">
              Credit Card
            </h1>
            <Image
              src="/Frame 427320879.svg"
              width={100}
              height={28}
              alt="Credit-Card"
            />
          </div>

          {/* Stripe Card Element */}
          <div className="container bg-utility-bgMain p-6">
            {/*  Card Number */}
            <div className="flex flex-col gap-10">
              <label className="block">
                <span className="block text-lg font-medium text-gray-700">
                  Card number <span className="text-red-500">*</span>
                </span>
                <CardNumberElement
                  options={{
                    style: {
                      base: {
                        fontSize: "16px",
                        color: "#32325d",
                        fontFamily: "Arial, sans-serif",
                        "::placeholder": {
                          color: "#9AA1B9",
                          fontSize: "16px",
                        },
                      },
                      invalid: {
                        color: "#fa755a",
                      },
                    },
                    placeholder: "Number of card",
                  }}
                  className="mt-2 rounded-md border border-gray-300 p-3 font-semibold"
                />
              </label>

              {/*  Card owner  */}
              <label className="block">
                <span className="block text-lg font-medium text-gray-700">
                  Card owner <span className="text-red-500">*</span>
                </span>
                <input
                  type="text"
                  placeholder="Holder of card"
                  className="mt-2 w-full rounded-md border border-gray-300 p-3 text-lg font-normal focus:outline-none"
                />
              </label>

              {/*  Expiry date  */}
              <div className="flex gap-4">
                <label className="block w-1/2">
                  <span className="block text-lg font-semibold text-gray-700">
                    Expiry date <span className="text-red-500">*</span>
                  </span>
                  <CardExpiryElement
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#32325d",
                          fontFamily: "Arial, sans-serif",
                          "::placeholder": {
                            color: "#aab7c4",
                            fontSize: "16px",
                          },
                        },
                        invalid: {
                          color: "#fa755a",
                        },
                      },
                      placeholder: "MM/YY",
                    }}
                    className="mt-2 rounded-md border border-gray-300 p-4"
                  />
                </label>
                {/*  {/*  Expiry date  */}
                <label className="block w-1/2">
                  <span className="block text-lg font-medium text-gray-700">
                    CVC/CVV <span className="text-red-500">*</span>
                  </span>
                  <CardCvcElement
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#32325d",
                          fontFamily: "Arial, sans-serif",
                          "::placeholder": {
                            color: "#aab7c4",
                            fontSize: "16px",
                          },
                        },
                        invalid: {
                          color: "#fa755a",
                        },
                      },
                      placeholder: "x x x",
                    }}
                    className="mt-2 rounded-md border border-gray-300 p-4"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="container mt-5 flex flex-row justify-between px-4 pb-10 pt-5 lg:mt-0 lg:border-t lg:px-8">
            <button
              type="button"
              className="transform rounded text-base font-bold text-primary-500 transition-transform duration-200 hover:scale-105 hover:text-primary-700 lg:font-bold"
            >
              <Link href="/packages">Cancel</Link>
            </button>
            <button
              type="submit"
              disabled={loading || !stripe || !elements}
              className="transform rounded-[99px] bg-primary-500 pb-3 pl-5 pr-5 pt-3 text-base font-bold text-white shadow-xl transition-transform duration-200 hover:scale-105 hover:bg-primary-700"
            >
              {loading ? "Processing..." : "Payment Confirm"}
            </button>
          </div>
          {error && (
            <p className="hidden text-center text-red-500 lg:mb-10">{error}</p>
          )}
        </div>
      </form>
    </>
  );
}

export default function PaymentContainer(props) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentPage {...props} />
    </Elements>
  );
}
