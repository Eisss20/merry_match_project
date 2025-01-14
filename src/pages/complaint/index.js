import { Footer, NavBar } from "@/components/NavBar";
import { useState, useEffect, useRef } from "react";
import { CustomButton, CardImage } from "@/components/CustomUi";
import axios from "axios";
import ShowAlertAndOpenModal from "@/components/Alertbox";
import { useRouter } from "next/router";
import LoadingMerry from "@/components/custom-loading/LoadingMerry";

export default function Complaint() {
  const router = useRouter();

  const [issue, setIssue] = useState("");
  const [description, setDescription] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalNotice, setModalNotice] = useState("");
  const [isCheckingToken, setIsCheckingToken] = useState(true); // ใช้สถานะนี้เฉพาะตอนเช็ค token

  const modalRef = useRef();

  // ตรวจสอบ token เพื่อเช็คว่า user ล็อคอินหรือไม่
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setIsCheckingToken(false); // หยุดสถานะเช็ค token เมื่อ token มีอยู่
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!issue || !description) {
      setModalNotice("Missing Information");
      setModalMessage(
        "Please fill in all required fields so we can assist you better.",
      );

      modalRef.current?.showModal();
      return;
    }

    const complaintData = { issue, description };

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setModalNotice("Error");
        setModalMessage("Please log in first!");
        modalRef.current?.showModal();
        return;
      }

      const res = await axios.post("/api/complaint", complaintData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 201) {
        setModalNotice("Success!");
        setModalMessage("Complaint submitted. We'll review it soon");
        modalRef.current?.showModal();
        setIssue("");
        setDescription("");
      } else {
        const errorMessage = res.data?.error || "Unexpected error";
        setModalNotice("Error");
        setModalMessage(`Error: ${errorMessage}`);
        modalRef.current?.showModal();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      setModalNotice("Error");
      setModalMessage(`${errorMessage}`);
      modalRef.current?.showModal();
    }
  };

  if (isCheckingToken) {
    return <LoadingMerry />;
  }

  return (
    <>
      <NavBar />
      <div className="min-h-screen gap-32 bg-utility-primary pt-10 lg:flex lg:flex-row lg:items-center lg:justify-center lg:pb-48">
        <figure className="flex items-center justify-center lg:order-2 lg:px-12">
          <CardImage className="h-[25rem] w-[15rem] lg:h-[40rem] lg:w-[25rem]">
            <img
              src="/images/login_page_man.jpg"
              alt="Man smiling while using laptop"
              className="h-full w-full object-cover object-right grayscale"
            />
          </CardImage>
        </figure>

        <div className="w-full max-w-md rounded-lg bg-white p-6 lg:order-1">
          {/* Header */}
          <h3 className="mb-1 text-sm font-medium uppercase text-third-700">
            Complaint
          </h3>
          <h1 className="mb-6 text-3xl font-bold leading-tight text-second-500">
            If you have any trouble <br /> Don't be afraid to tell us!
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="issue"
                className="mb-2 block font-medium text-gray-700"
              >
                Issue
              </label>
              <input
                type="text"
                id="issue"
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                placeholder="Please enter the subject of your issue"
                className="w-full rounded-lg border-2 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="description"
                className="mb-2 block font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Share more information about the issue"
                rows="5"
                className="w-full resize-none rounded-lg border-2 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
              ></textarea>
            </div>

            <CustomButton
              type="submit"
              buttonType="primary"
              className="w-full lg:w-24"
            >
              Submit
            </CustomButton>
          </form>
        </div>
      </div>

      <Footer />

      <ShowAlertAndOpenModal
        modalRef={modalRef}
        modalId="modal_complaint"
        notice={modalNotice}
        message={modalMessage}
        closeModal={() => modalRef.current?.close()}
      />
    </>
  );
}
