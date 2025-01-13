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
import Image from "next/image";

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
                <button
                  type="button"
                  className="flex size-11 items-center justify-center rounded-full bg-fourth-100 text-primary-200 transition-colors duration-300 hover:bg-fourth-200"
                >
                  <HiBell className="size-6" />
                </button>

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
