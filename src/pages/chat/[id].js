import { IoIosArrowBack } from "react-icons/io";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { useAuth } from "@/contexts/AuthContext";
import { NavBar } from "@/components/NavBar";
import LeftSidebar from "@/components/matches/LeftSidebar";
import MessageSection from "@/components/chat/MessageSection";
import TypingBar from "@/components/chat/TypingBar";
import ImageModal from "@/components/chat/ImageModal";
import LoadingMerry from "@/components/custom-loading/LoadingMerry";

import { useChat } from "@/contexts/socket/ChatContext";

export default function Chat() {
  const router = useRouter();

  const { state, isAuthenticated } = useAuth();
  const { otherUserData, selectedImage } = useChat();

  // Authentication
  useEffect(() => {
    if (state.loading) return;

    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, state.loading, router]);

  if (state.loading || !isAuthenticated) {
    return <LoadingMerry />;
  }

  return (
    <>
      <main
        className={`items flex h-screen flex-col bg-utility-bg ${selectedImage && "blur-sm"}`}
      >
        <NavBar />

        <div className="flex min-h-0 flex-grow">
          <LeftSidebar />

          <section className="flex w-full min-w-0 flex-col">
            {/* Back button */}
            <div className="flex min-h-14 w-full items-center gap-3 bg-utility-primary px-4 lg:hidden">
              <button
                type="button"
                onClick={() => {
                  router.push("/matches");
                }}
              >
                <IoIosArrowBack className="size-6 text-fourth-700 transition-colors duration-300 hover:text-fourth-600" />
              </button>
              <p className="text-lg font-semibold text-fourth-900">
                {otherUserData?.name}
              </p>
            </div>

            {/* Message section */}
            <MessageSection />

            {/* Typing bar */}
            <TypingBar />
          </section>
        </div>
      </main>

      {/* Image modal */}
      {selectedImage && <ImageModal />}
    </>
  );
}
