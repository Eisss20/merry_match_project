import { FaFacebook, FaTwitter } from "react-icons/fa";
import { FiMenu, FiLogIn, FiFileText } from "react-icons/fi";
import { AiFillInstagram, AiFillMessage } from "react-icons/ai";
import { HiBell, HiMiniUser } from "react-icons/hi2";
import { GoHeartFill } from "react-icons/go";
import { RiBox3Fill } from "react-icons/ri";
import { IoWarning } from "react-icons/io5";
import { BsStars } from "react-icons/bs";
import { TbLogout, TbLoader2 } from "react-icons/tb";

import { CustomButton } from "./CustomUi";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

import { useNotifications } from "@/contexts/socket/NotificationContext";

function ContactIcon({ Icon }) {
  return (
    <button
      type="button"
      className="flex size-11 items-center justify-center rounded-full bg-second-500 text-utility-primary transition-colors duration-300 hover:bg-second-600"
    >
      <Icon className="size-4" />
    </button>
  );
}

export function NavBar() {
  const { isAuthenticated, state, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const router = useRouter();

  const menuList = [
    { name: "Profile", logo: HiMiniUser, path: "/profile" },
    { name: "Merry list", logo: GoHeartFill, path: "/merry-list" },
    { name: "Merry Membership", logo: RiBox3Fill, path: "/packages" },
    { name: "Compliant", logo: IoWarning, path: "/complaint" },
  ];

  // Disable scroll on mobile dropdown
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Notification
  const [hasDropdownOpened, setHasDropdownOpened] = useState(false);

  // Notification socket context
  const {
    notifications,
    unreadCount,
    markNotifAsReadOnServer,
    markNotifAsReadOnClient,
  } = useNotifications();

  // Mark notifications as read on the server by onClick()
  const handleServerNotif = () => {
    if (hasDropdownOpened) return;

    markNotifAsReadOnServer();
    setHasDropdownOpened(true);
  };

  // Mark notifications as read on the client by onBlur()
  const handleClientNotif = () => {
    markNotifAsReadOnClient();
  };

  return (
    <div className="flex flex-col">
      <nav className="z-50 flex h-16 items-center justify-between bg-utility-primary px-6 shadow-md lg:h-20 lg:px-32">
        <Link href="/" className="text-2xl font-semibold text-utility-second">
          Merry<span className="font-extrabold text-primary-500">Match</span>
        </Link>

        {/* Mobile */}
        <div
          className={`flex items-center lg:hidden ${isAuthenticated ? "gap-6" : "gap-8"}`}
        >
          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-full bg-fourth-100 text-primary-200 transition-colors duration-300 hover:bg-fourth-200"
          >
            <AiFillMessage className="size-4" />
          </button>

          {isAuthenticated && (
            <button
              type="button"
              className="flex size-9 items-center justify-center rounded-full bg-fourth-100 text-primary-200 transition-colors duration-300 hover:bg-fourth-200"
            >
              <HiBell className="size-5" />
            </button>
          )}

          <button
            type="button"
            className="text-fourth-700 transition-colors duration-300 hover:text-fourth-900"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <FiMenu className="size-7" />
          </button>
        </div>

        {/* Desktop */}
        <div className="hidden items-center gap-10 font-bold lg:flex">
          <Link
            href="#WhyMerrySection"
            className="text-second-800 transition-colors duration-300 hover:text-second-500"
          >
            Why Merry Match?
          </Link>
          <Link
            href="#HowToMerrySection"
            className="text-second-800 transition-colors duration-300 hover:text-second-500"
          >
            How to Merry
          </Link>

          <div
            className={`${state.loading ? "flex w-[5.25rem] justify-center" : ""}`}
          >
            {state.loading && (
              <TbLoader2 className="size-7 animate-spin text-utility-second" />
            )}

            {!isAuthenticated && !state.loading && (
              <CustomButton
                buttonType="primary"
                className="h-11 px-6"
                onClick={() => router.push("/login")}
              >
                Login
              </CustomButton>
            )}

            {/* Authenticated */}
            {isAuthenticated && !state.loading && (
              <div className="flex gap-3">
                {/* Notification dropdown menu */}
                <div className="dropdown dropdown-end">
                  {/* Notification button */}
                  <div
                    type="button"
                    tabIndex={0}
                    role="button"
                    onClick={handleServerNotif}
                    onBlur={handleClientNotif}
                    className="relative flex size-11 items-center justify-center rounded-full bg-fourth-100 text-primary-200 transition-colors duration-300 hover:bg-fourth-200"
                  >
                    <HiBell className="size-6" />

                    {/* Unread count */}
                    {unreadCount > 0 && (
                      <div className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-primary-400 text-xs text-utility-primary">
                        <p>{unreadCount}</p>
                      </div>
                    )}
                  </div>

                  {/* Notification list */}
                  <ul
                    tabIndex={0}
                    className="menu dropdown-content z-[1] mt-6 overflow-hidden rounded-box bg-utility-primary p-2 shadow-md"
                  >
                    {notifications.length > 0 ? (
                      notifications.map((notification, index) => {
                        console.log("notificationArray:", notification);
                        return (
                          <li key={index}>
                            <Link
                              href="#"
                              className={`group flex w-[18.5rem] items-center rounded-lg p-2 font-medium text-fourth-700 hover:!bg-fourth-200 focus:bg-utility-primary focus:!text-fourth-700 active:!bg-fourth-200`}
                            >
                              <div className="flex w-full items-center justify-between gap-2">
                                <div className="flex items-center gap-4">
                                  {/* User image */}
                                  <div className="relative flex">
                                    <img
                                      src={notification.image_profile}
                                      alt=""
                                      className="aspect-square w-[2.75rem] min-w-[2.75rem] rounded-full object-cover"
                                    />

                                    <svg
                                      className="absolute -bottom-1 right-0 h-6 w-6 fill-primary-400 transition-colors duration-300"
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

                                  {/* Content */}
                                  <div
                                    className={`text-sm ${
                                      !notification.is_read
                                        ? "text-fourth-700"
                                        : "text-fourth-600"
                                    }`}
                                  >
                                    <p>
                                      <span className="font-bold">
                                        '{notification.name}'
                                      </span>{" "}
                                      Merry you back!
                                    </p>
                                    <p>Let's start conversation now</p>
                                  </div>
                                </div>

                                {!notification.is_read && (
                                  <div className="aspect-square w-2 rounded-full bg-second-400"></div>
                                )}
                              </div>
                            </Link>
                          </li>
                        );
                      })
                    ) : (
                      <div className="min-w-fit px-3 py-2 text-fourth-700">
                        <p className="whitespace-nowrap">No notifications</p>
                      </div>
                    )}
                  </ul>
                </div>

                {/* User dropdown menu */}
                <div className="dropdown dropdown-end">
                  {/* Profile image */}
                  <div
                    type="button"
                    tabIndex={0}
                    role="button"
                    className="relative flex size-11 overflow-hidden rounded-full"
                  >
                    {/* <Image
                    src={state.user?.image_profile[0]}
                    alt="user picture"
                    fill
                    className="object-cover transition-opacity duration-300 hover:opacity-85"
                  /> */}
                    <img
                      src={state.user?.image_profile[0]}
                      alt="user profile picture"
                      className="object-cover transition-opacity duration-300 hover:opacity-85"
                    />
                  </div>

                  <ul
                    tabIndex={0}
                    className="menu dropdown-content z-[1] mt-6 w-52 overflow-hidden rounded-box bg-utility-primary p-0 shadow-md"
                  >
                    <li>
                      <Link
                        href="#"
                        className="mx-2 mt-2 flex items-center justify-center rounded-full bg-gradient-to-r from-[#742138] to-[#A878BF] py-3 font-semibold text-utility-primary hover:!text-fourth-300 focus:text-utility-primary active:!text-fourth-400"
                      >
                        <BsStars className="size-5 text-[#F3B984]" />
                        More limit Merry!
                      </Link>
                    </li>

                    {menuList.map((list, index) => {
                      const ListImg = list.logo;

                      return (
                        <li key={list.name}>
                          <Link
                            href={list.path}
                            className={`group mx-1 flex items-center gap-3 rounded-lg px-3 py-2 font-semibold text-fourth-700 hover:!bg-fourth-100 focus:bg-utility-primary focus:!text-fourth-700 active:!bg-fourth-200 ${index === 0 && "mt-2"} ${index === menuList.length - 1 && "mb-2"}`}
                          >
                            <ListImg className="size-5 text-primary-100 transition-colors duration-200 group-hover:text-primary-200" />
                            {list.name}
                          </Link>
                        </li>
                      );
                    })}
                    <div className="h-[1px] w-full bg-fourth-300"></div>
                    <li>
                      <Link
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          logout();
                        }}
                        className="flex items-center gap-2 rounded-none px-5 font-semibold text-fourth-700 hover:!bg-fourth-100 focus:bg-utility-primary focus:!text-fourth-700 active:!bg-fourth-200"
                      >
                        <TbLogout className="size-5" />
                        Logout
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-utility-primary px-4 lg:hidden">
          {isAuthenticated ? (
            <ul className="mt-24 flex flex-col gap-3">
              <li>
                <Link
                  href="#"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center rounded-full bg-gradient-to-r from-[#742138] to-[#A878BF] py-3 font-semibold text-utility-primary transition-colors duration-200 hover:!text-fourth-300 focus:text-utility-primary active:!text-fourth-400"
                >
                  <BsStars className="size-5 text-[#F3B984]" />
                  More limit Merry!
                </Link>
              </li>

              {menuList.map((list) => {
                const ListImg = list.logo;

                return (
                  <li key={list.name}>
                    <Link
                      href={list.path}
                      onClick={() => setMenuOpen(false)}
                      className={`group flex items-center gap-3 rounded-lg px-4 py-3 font-semibold text-fourth-700 transition-colors duration-200 hover:!bg-fourth-100 focus:bg-utility-primary focus:!text-fourth-700 active:!bg-fourth-200`}
                    >
                      <ListImg className="size-5 text-primary-100 transition-colors duration-200 group-hover:text-primary-200" />
                      {list.name}
                    </Link>
                  </li>
                );
              })}
              <div className="h-[1px] w-full bg-fourth-300"></div>
              <li>
                <Link
                  href="#"
                  onClick={(e) => {
                    setMenuOpen(false);
                    e.preventDefault();
                    logout();
                  }}
                  className="flex items-center gap-2 rounded-lg px-4 py-3 font-semibold text-fourth-700 transition-colors duration-200 hover:!bg-fourth-100 focus:bg-utility-primary focus:!text-fourth-700 active:!bg-fourth-200"
                >
                  <TbLogout className="size-5" />
                  Logout
                </Link>
              </li>
            </ul>
          ) : (
            <div className="mt-24 flex flex-col gap-3">
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg px-4 py-3 font-semibold text-fourth-700 transition-colors duration-200 hover:!bg-fourth-100 focus:bg-utility-primary focus:!text-fourth-700 active:!bg-fourth-200"
              >
                <FiLogIn className="size-5" />
                Login
              </Link>

              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg px-4 py-3 font-semibold text-fourth-700 transition-colors duration-200 hover:!bg-fourth-100 focus:bg-utility-primary focus:!text-fourth-700 active:!bg-fourth-200"
              >
                <FiFileText className="size-5" />
                Signup
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function Footer() {
  const contactIconList = [FaFacebook, AiFillInstagram, FaTwitter];

  return (
    <footer className="flex flex-col items-center justify-center gap-8 bg-fourth-100 px-4 py-10">
      <div className="flex flex-col items-center gap-3 font-semibold">
        <p className="text-4xl text-utility-second">
          Merry<span className="font-extrabold text-primary-500">Match</span>
        </p>
        <p className="text-center text-base text-fourth-700">
          New generation of online dating <br className="md:hidden" /> website
          for everyone
        </p>
      </div>

      <div className="flex w-full flex-col items-center gap-6">
        <div className="h-[1px] w-11/12 bg-fourth-300 lg:w-10/12"></div>
        <p className="text-center text-xs text-fourth-600">
          copyright ©2022 merrymatch.com All rights reserved
        </p>

        <div className="flex items-center gap-4">
          {contactIconList.map((Icon, index) => {
            return <ContactIcon key={index} Icon={Icon} />;
          })}
        </div>
      </div>
    </footer>
  );
}
