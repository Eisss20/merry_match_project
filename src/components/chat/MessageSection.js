import { useEffect, useRef, useState } from "react";
import { ChatBubble } from "@/components/CustomUi";
import { useChat } from "@/contexts/socket/ChatContext";
import { useSocketConnection } from "@/contexts/socket/SocketConnectionContext";

export default function MessageSection() {
  const scrollRef = useRef(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const { userId } = useSocketConnection();
  const { messages, otherUserData, imageFiles, setSelectedImage } = useChat();

  // Scroll to the bottom after fectching old messages
  useEffect(() => {
    if (messages.length === 0 || !scrollRef.current) return;

    const lastMessage = messages[messages.length - 1];
    const isSender = lastMessage?.sender_id === userId;

    if (isInitialLoad || isSender || (!isSender && isAtBottom)) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }

    if (isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [messages, userId]);

  // Make typing bar push messages div when adding images
  useEffect(() => {
    if (isAtBottom && Object.keys(imageFiles).length > 0 && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [imageFiles, isAtBottom]);

  return (
    <div
      ref={scrollRef}
      className="scrollable-element flex-grow overflow-y-auto px-4 lg:px-20"
      onScroll={() => {
        if (scrollRef.current) {
          const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
          setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 1);
        }
      }}
    >
      <div className="flex flex-col items-center justify-start gap-8">
        {/* Alert section */}
        {messages.length === 0 && (
          <div className="mt-10 flex max-w-fit items-center justify-center gap-5 rounded-2xl border-2 border-second-300 bg-second-100 p-4 lg:mt-28 lg:px-20 lg:py-6">
            <svg
              className="min-h-10 min-w-16 text-primary-400"
              width="61"
              height="36"
              viewBox="0 0 61 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20.717 31.0768L20.7223 31.0795L20.7412 31.0909L20.7748 31.1077C21.1203 31.287 21.504 31.3803 21.8935 31.3798C22.1799 31.3794 22.4631 31.3281 22.7301 31.2293H22.8113L23.0609 31.0795L23.0662 31.0768L23.0742 31.0726L23.082 31.0683C25.4842 29.7547 27.744 28.1962 29.8256 26.4177L29.8293 26.4145C33.0936 23.6006 37.0196 19.1429 37.0196 13.6251V13.625C37.0194 11.7633 36.4421 9.94746 35.3671 8.42747C34.2922 6.90748 32.7724 5.75812 31.0172 5.13764C29.2619 4.51716 27.3575 4.45608 25.5661 4.96281C24.1893 5.35225 22.9314 6.06237 21.8916 7.02753C20.8518 6.06237 19.5939 5.35225 18.2171 4.96281C16.4257 4.45608 14.5213 4.51716 12.766 5.13764C11.0108 5.75812 9.49104 6.90748 8.41608 8.42747C7.34113 9.94746 6.76382 11.7633 6.76364 13.625V13.6251C6.76364 19.143 10.6916 23.6007 13.9536 26.4143L13.9575 26.4176C15.4224 27.6695 16.9765 28.8131 18.6074 29.8393C19.2925 30.2719 19.9915 30.6822 20.7033 31.0694L20.7101 31.0731L20.717 31.0768Z"
                fill="#FF1659"
                stroke="white"
                strokeWidth="2.25592"
              />
              <path
                d="M41.717 31.0768L41.7223 31.0795L41.7412 31.0909L41.7748 31.1077C42.1203 31.287 42.504 31.3803 42.8935 31.3798C43.1799 31.3794 43.4631 31.3281 43.7301 31.2293H43.8113L44.0609 31.0795L44.0662 31.0768L44.0742 31.0726L44.082 31.0683C46.4842 29.7547 48.744 28.1962 50.8256 26.4177L50.8293 26.4145C54.0936 23.6006 58.0196 19.1429 58.0196 13.6251V13.625C58.0194 11.7633 57.4421 9.94746 56.3671 8.42747C55.2922 6.90748 53.7724 5.75812 52.0172 5.13764C50.2619 4.51716 48.3575 4.45608 46.5661 4.96281C45.1893 5.35225 43.9314 6.06237 42.8916 7.02753C41.8518 6.06237 40.5939 5.35225 39.2171 4.96281C37.4257 4.45608 35.5213 4.51716 33.766 5.13764C32.0108 5.75812 30.491 6.90748 29.4161 8.42747C28.3411 9.94746 27.7638 11.7633 27.7636 13.625V13.6251C27.7636 19.143 31.6916 23.6007 34.9536 26.4143L34.9575 26.4176C36.4224 27.6695 37.9765 28.8131 39.6074 29.8393C40.2925 30.2719 40.9915 30.6822 41.7033 31.0694L41.7101 31.0731L41.717 31.0768Z"
                fill="#FF1659"
                stroke="white"
                strokeWidth="2.25592"
              />
            </svg>

            <div className="text-sm font-semibold text-primary-700">
              <p>Now you and {otherUserData?.name} are Merry Match!</p>
              <p>
                You can messege something nice and make a good conversation.
                Happy Merry!
              </p>
            </div>
          </div>
        )}

        {/* Text section */}
        <ul className="flex w-full flex-col gap-4 py-10">
          {messages.map((msg, index) => {
            const isLastOfGroup =
              index === messages.length - 1 ||
              messages[index + 1].sender_id !== msg.sender_id;

            // Check spacing between words for word wrapping
            const noSpace = !msg.content?.includes(" ");

            return (
              <li
                key={index}
                className={`${msg.sender_id === userId ? "self-end" : "self-start"}`}
              >
                <div className="flex items-end gap-4">
                  {/* Other user image */}
                  {msg.sender_id !== userId && (
                    <div className="flex aspect-square min-w-12 max-w-12 overflow-hidden rounded-full">
                      {isLastOfGroup && (
                        <img
                          src={otherUserData?.image_profile}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                  )}

                  {/* Message */}
                  <div
                    className={`flex flex-col gap-2 ${msg.sender_id !== userId ? "items-start" : "items-end"}`}
                  >
                    {msg.type?.includes("text") && (
                      <ChatBubble
                        className={`flex min-h-14 !w-full max-w-[20rem] items-center justify-center text-start sm:max-w-[25rem] lg:max-w-[27.5rem] lg:text-lg ${msg.sender_id === userId ? "bg-second-600 text-utility-primary" : "border border-fourth-300 bg-primary-200 text-utility-second"} ${noSpace && "break-all"}`}
                        type={`${msg.sender_id === userId ? "receiver" : "sender"}`}
                      >
                        {msg.content}
                      </ChatBubble>
                    )}

                    {msg.type?.includes("image") &&
                      msg.image_urls.map((image, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setSelectedImage(image)}
                          className="rounded-2xl transition-opacity duration-300 hover:opacity-85"
                        >
                          <img
                            src={image}
                            alt=""
                            className="h-full w-full max-w-[22.5rem] rounded-2xl object-cover lg:max-h-[27.5rem] lg:max-w-[27.5rem]"
                            onLoad={() => {
                              if (
                                (isInitialLoad ||
                                  msg.sender_id === userId ||
                                  (msg.sender_id !== userId && isAtBottom)) &&
                                scrollRef.current
                              ) {
                                scrollRef.current.scrollTop =
                                  scrollRef.current.scrollHeight;
                              }
                            }}
                          />
                        </button>
                      ))}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
