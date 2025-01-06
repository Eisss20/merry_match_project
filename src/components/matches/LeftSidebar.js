import { GoHeartFill } from "react-icons/go";
import { FiSearch } from "react-icons/fi";

import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { useAuth } from "@/contexts/AuthContext";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const ChatsSwiper = ({ lastChats, userId, chatRoomId }) => {
  const router = useRouter();

  return (
    <Swiper
      direction="vertical"
      spaceBetween={5}
      slidesPerView={3}
      className="h-[17.5rem] w-full"
    >
      {lastChats.map((chat, index) => {
        const { type: messageType, sender_id, content } = chat.lastMessage;
        const isSenderUser = sender_id === userId;

        const messageDisplay = (() => {
          if (messageType.includes("text")) {
            return isSenderUser ? `You: ${content}` : content;
          }

          if (messageType.includes("image")) {
            return isSenderUser
              ? "You sent a picture."
              : `${chat.name} sent a picture.`;
          }

          return "Unknown message type.";
        })();

        return (
          <SwiperSlide key={index}>
            <div
              className={`flex w-full cursor-pointer items-center gap-4 rounded-2xl border p-3 transition-colors duration-300 hover:bg-fourth-100 ${chatRoomId === chat.chat_room_id ? "border-second-500 bg-fourth-100" : "border-transparent"} `}
              onClick={() => router.push(`/chat/${chat.chat_room_id}`)}
            >
              <div className="flex size-14 overflow-hidden rounded-full">
                <img
                  src={chat.image_profile}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="text-start font-semibold">
                <p className="text-sm text-fourth-900">{chat.name}</p>
                <p className="text-xs text-fourth-700">{messageDisplay}</p>
              </div>
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

const MatchesSwiper = ({ matchesList }) => {
  const router = useRouter();

  return (
    <div className="w-full">
      <Swiper spaceBetween={5} slidesPerView={3} className="w-full">
        {matchesList.map((match, index) => (
          <SwiperSlide key={index} className="!flex !justify-center">
            <div
              className="group relative aspect-square w-20 min-w-20 cursor-pointer"
              onClick={() => router.push(`/chat/${match.chat_room_id}`)}
            >
              <img
                src={match.image_profile}
                alt=""
                className="h-full w-full rounded-2xl object-cover transition-opacity duration-300 group-hover:opacity-85"
              />

              <div className="absolute -bottom-1 -right-1">
                <svg
                  className="h-6 w-10 fill-primary-400 transition-colors duration-300 group-hover:fill-[#ff4a7e]"
                  width="61"
                  height="36"
                  viewBox="0 0 61 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20.717 31.0768L20.7223 31.0795L20.7412 31.0909L20.7748 31.1077C21.1203 31.287 21.504 31.3803 21.8935 31.3798C22.1799 31.3794 22.4631 31.3281 22.7301 31.2293H22.8113L23.0609 31.0795L23.0662 31.0768L23.0742 31.0726L23.082 31.0683C25.4842 29.7547 27.744 28.1962 29.8256 26.4177L29.8293 26.4145C33.0936 23.6006 37.0196 19.1429 37.0196 13.6251V13.625C37.0194 11.7633 36.4421 9.94746 35.3671 8.42747C34.2922 6.90748 32.7724 5.75812 31.0172 5.13764C29.2619 4.51716 27.3575 4.45608 25.5661 4.96281C24.1893 5.35225 22.9314 6.06237 21.8916 7.02753C20.8518 6.06237 19.5939 5.35225 18.2171 4.96281C16.4257 4.45608 14.5213 4.51716 12.766 5.13764C11.0108 5.75812 9.49104 6.90748 8.41608 8.42747C7.34113 9.94746 6.76382 11.7633 6.76364 13.625V13.6251C6.76364 19.143 10.6916 23.6007 13.9536 26.4143L13.9575 26.4176C15.4224 27.6695 16.9765 28.8131 18.6074 29.8393C19.2925 30.2719 19.9915 30.6822 20.7033 31.0694L20.7101 31.0731L20.717 31.0768Z"
                    fill=""
                    stroke="white"
                    strokeWidth="3"
                  />
                  <path
                    d="M41.717 31.0768L41.7223 31.0795L41.7412 31.0909L41.7748 31.1077C42.1203 31.287 42.504 31.3803 42.8935 31.3798C43.1799 31.3794 43.4631 31.3281 43.7301 31.2293H43.8113L44.0609 31.0795L44.0662 31.0768L44.0742 31.0726L44.082 31.0683C46.4842 29.7547 48.744 28.1962 50.8256 26.4177L50.8293 26.4145C54.0936 23.6006 58.0196 19.1429 58.0196 13.6251V13.625C58.0194 11.7633 57.4421 9.94746 56.3671 8.42747C55.2922 6.90748 53.7724 5.75812 52.0172 5.13764C50.2619 4.51716 48.3575 4.45608 46.5661 4.96281C45.1893 5.35225 43.9314 6.06237 42.8916 7.02753C41.8518 6.06237 40.5939 5.35225 39.2171 4.96281C37.4257 4.45608 35.5213 4.51716 33.766 5.13764C32.0108 5.75812 30.491 6.90748 29.4161 8.42747C28.3411 9.94746 27.7638 11.7633 27.7636 13.625V13.6251C27.7636 19.143 31.6916 23.6007 34.9536 26.4143L34.9575 26.4176C36.4224 27.6695 37.9765 28.8131 39.6074 29.8393C40.2925 30.2719 40.9915 30.6822 41.7033 31.0694L41.7101 31.0731L41.717 31.0768Z"
                    fill=""
                    stroke="white"
                    strokeWidth="3"
                  />
                </svg>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default function LeftSidebar() {
  const [userId, setUserId] = useState(null);
  const [lastChats, setLastChats] = useState([]);
  const [matchesList, setMatchesList] = useState([]);

  const { state, isAuthenticated } = useAuth();

  const router = useRouter();
  const { id: chatRoomId } = router.query;

  useEffect(() => {
    const fetchChatsData = async () => {
      try {
        setUserId(state.user?.id);

        const fetchUrls = {
          matches: `/api/matches/chats/?userMasterId=${state.user?.id}&filter=matches`,
          lastChats: `/api/matches/chats/?userMasterId=${state.user?.id}&filter=lastChats`,
        };

        const responses = await Promise.all(
          Object.values(fetchUrls).map((url) => axios.get(url)),
        );

        const [matchesResponse, lastChatsResponse] = responses;

        console.log("matchesResponse:", matchesResponse.data);
        console.log("lastChatsResponse:", lastChatsResponse.data);
        setMatchesList(matchesResponse.data);
        setLastChats(lastChatsResponse.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchChatsData();
  }, []);

  return (
    <aside className="hidden min-w-[18.5rem] max-w-[18.5rem] border-r-2 border-fourth-300 bg-utility-primary lg:inline">
      <div className="px-4 py-7">
        <button
          type="button"
          className={`flex w-full flex-col items-center gap-4 rounded-xl border bg-fourth-100 px-3 py-6 transition-colors duration-300 hover:bg-fourth-200 ${!chatRoomId && "border-second-500"}`}
          onClick={() => router.push("/matches")}
        >
          <figure className="relative">
            <GoHeartFill className="size-10 text-primary-400" />
            <FiSearch className="absolute -bottom-1 -right-3 size-9 text-primary-600" />
          </figure>

          <div>
            <p className="text-xl font-bold text-primary-600">
              Discover New Match
            </p>
            <p className="text-center text-xs text-fourth-700">
              Start find and Merry to get know <br /> and connect with new
              friend!
            </p>
          </div>
        </button>
      </div>

      <div className="h-[2px] w-full bg-fourth-300"></div>

      <div className="flex flex-col gap-10 px-4 py-7">
        {/* Merry Match! carousel*/}
        <div className="flex flex-col gap-3">
          <p className="text-xl font-bold text-fourth-900">Merry Match!</p>

          {/* Carousel */}
          <MatchesSwiper matchesList={matchesList} />
        </div>

        {/* Chat with Merry Match */}
        <div className="flex flex-col gap-3">
          <p className="text-xl font-bold text-fourth-900">
            Chat with Merry Match
          </p>

          {/* Chat */}
          <div className="flex flex-col gap-4">
            <ChatsSwiper
              lastChats={lastChats}
              userId={userId}
              chatRoomId={chatRoomId}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
