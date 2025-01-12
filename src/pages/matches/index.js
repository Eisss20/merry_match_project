import { FiX, FiSearch } from "react-icons/fi";
import { GoHeartFill } from "react-icons/go";
import { TbLoader2 } from "react-icons/tb";

import { NavBar } from "@/components/NavBar";
import { CustomButton } from "@/components/CustomUi";
import LeftSidebar from "@/components/matches/LeftSidebar";
import CardSwiperMobile from "@/components/matches/CardSwiperMobile";

import apiClient from "@/utils/jwtInterceptor";

import { useEffect, useState } from "react";
import { Range } from "react-range";
import dynamic from "next/dynamic";
import Link from "next/link";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";

const LazyCardSwiper = dynamic(() => import("@/components/CardSwiper"), {
  ssr: false,
});

function AgeRangeSlider({ age, setAge }) {
  return (
    <>
      {/* Slider */}
      <div className="w-full rounded-md bg-gray-300 px-2">
        <Range
          step={1}
          min={18}
          max={80}
          values={age}
          onChange={(values) => setAge(values)}
          renderTrack={({ props, children }) => {
            const { key, ...restProps } = props;
            return (
              <div key={key} {...restProps} className="relative h-[3px]">
                <div
                  className="absolute h-full bg-second-500"
                  style={{
                    width: `${((age[1] - age[0]) / (80 - 18)) * 100}%`,
                    marginLeft: `${((age[0] - 18) / (80 - 18)) * 100}%`,
                  }}
                />
                {children}
              </div>
            );
          }}
          renderThumb={({ props }) => {
            const { key, ...restProps } = props;
            return (
              <div
                key={key}
                {...restProps}
                className="h-4 w-4 rounded-full border-[3px] border-second-500 bg-second-300 outline-none"
              />
            );
          }}
        />
      </div>

      {/* Inputs */}
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={age[0]}
          onChange={(e) => setAge([+e.target.value, age[1]])}
          className="hover: w-full rounded-lg border-2 border-fourth-400 bg-utility-primary px-3 py-2 text-fourth-600 outline-none"
          min={18}
          max={age[1]}
        />
        <span className="font-semibold text-utility-second">-</span>
        <input
          type="number"
          value={age[1]}
          onChange={(e) => setAge([age[0], +e.target.value])}
          className="w-full rounded-lg border-2 border-fourth-400 bg-utility-primary px-3 py-2 text-fourth-600 outline-none"
          min={age[0]}
          max={80}
        />
      </div>
    </>
  );
}

function CustomCheckbox({ list, onChange, isChecked }) {
  return (
    <div className="form-control font-semibold text-fourth-700">
      <label className="label cursor-pointer justify-start gap-3 p-0">
        <input
          type="checkbox"
          className="checkbox border-fourth-400 transition-colors duration-300 [--chkbg:theme(colors.second.500)] [--chkfg:theme(colors.utility.primary)] checked:border-second-300 checked:text-fourth-100 hover:border-second-300"
          onChange={(e) => onChange(e.target.checked)}
          checked={isChecked}
        />
        <span className="label-text">{list}</span>
      </label>
    </div>
  );
}

function RightSidebar({
  age,
  setAge,
  genderList,
  selectedGender,
  setSelectedGender,
}) {
  const handleCheckboxChange = (genderName, isChecked) => {
    setSelectedGender((prev) => {
      if (isChecked) {
        // Add gender if checked
        return [...prev, genderName];
      } else {
        // Remove gender if unchecked
        return prev.filter((gender) => gender !== genderName);
      }
    });
  };

  return (
    <aside className="flex w-[15rem] flex-col border-l-2 border-fourth-300 bg-utility-primary py-7">
      <div className="flex h-[70%] flex-col gap-12 px-4">
        <div className="flex flex-col gap-5">
          <p className="font-bold text-fourth-900">Gender you interest</p>
          <div className="flex flex-col gap-4">
            <CustomCheckbox
              key="default"
              list="Default"
              onChange={(isChecked) =>
                handleCheckboxChange("Default", isChecked)
              }
              isChecked={selectedGender.includes("Default")}
            />
            {genderList.map((interest, index) => (
              <CustomCheckbox
                key={index}
                list={interest.gender_name}
                onChange={(isChecked) =>
                  handleCheckboxChange(interest.gender_name, isChecked)
                }
                isChecked={selectedGender.includes(interest.gender_name)}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <p className="font-bold text-fourth-900">Age Range</p>
          <div className="flex flex-col gap-6">
            <AgeRangeSlider age={age} setAge={setAge} />
          </div>
        </div>
      </div>

      <div className="h-[2px] w-full bg-fourth-300"></div>

      <div className="flex items-center justify-end gap-6 px-4 py-4">
        <Link
          href="#"
          className="font-bold text-primary-500 transition-colors duration-300 hover:text-primary-600"
        >
          Clear
        </Link>
        <CustomButton>Search</CustomButton>
      </div>
    </aside>
  );
}

function FilterMobile({
  age,
  setAge,
  genderList,
  selectedGender,
  setSelectedGender,
}) {
  const handleCheckboxChange = (genderName, isChecked) => {
    setSelectedGender((prev) => {
      if (isChecked) {
        // Add gender if checked
        return [...prev, genderName];
      } else {
        // Remove gender if unchecked
        return prev.filter((gender) => gender !== genderName);
      }
    });
  };

  return (
    <aside className="flex flex-col border-fourth-300 bg-utility-primary">
      <div className="flex h-[70%] flex-col gap-8 px-4">
        <div className="flex flex-col gap-5">
          <p className="font-bold text-fourth-900">Gender you interest</p>
          <div className="flex flex-col gap-4">
            <CustomCheckbox
              key="default"
              list="Default"
              onChange={(isChecked) =>
                handleCheckboxChange("Default", isChecked)
              }
              isChecked={selectedGender.includes("Default")}
            />
            {genderList.map((interest, index) => (
              <CustomCheckbox
                key={index}
                list={interest.gender_name}
                onChange={(isChecked) =>
                  handleCheckboxChange(interest.gender_name, isChecked)
                }
                isChecked={selectedGender.includes(interest.gender_name)}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <p className="font-bold text-fourth-900">Age Range</p>
          <div className="flex flex-col gap-6">
            <AgeRangeSlider age={age} setAge={setAge} />
          </div>
        </div>

        <CustomButton
          buttonType="primary"
          className="w-full"
          onClick={() => router.push("/")}
        >
          Search
        </CustomButton>
      </div>
    </aside>
  );
}

export default function Matches() {
  const [userId, setUserId] = useState(null);
  const [userProfiles, setUserProfiles] = useState([]);
  const [genderList, setGenderList] = useState([]);
  const [selectedGender, setSelectedGender] = useState([]);
  const [age, setAge] = useState([18, 50]);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [isfilterMobileOpen, setIsfilterMobileOpen] = useState(false);

  const { state, isAuthenticated } = useAuth();
  const router = useRouter();

  // Remove scrollbar from daisy modal
  useEffect(() => {
    document.documentElement.classList.add("matches-page");

    return () => {
      document.documentElement.classList.remove("matches-page");
    };
  }, []);

  useEffect(() => {
    if (state.loading) return;

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    setUserId(state.user?.id);

    const fetchData = async () => {
      try {
        setMatchesLoading(true);

        // Fetch gender list
        const genderResponse = await apiClient.get(`/api/genders`);
        setGenderList(genderResponse.data);

        // Fetch user profiles
        const queryParams = new URLSearchParams();
        if (selectedGender.length > 0) {
          selectedGender.forEach((gender) => {
            queryParams.append("gender", gender);
          });
        }
        if (age[0]) queryParams.append("minAge", age[0]);
        if (age[1]) queryParams.append("maxAge", age[1]);

        const profileResponse = await apiClient.get(
          `/api/matches/profiles?userMasterId=${state.user?.id}&${queryParams.toString()}`,
        );

        setUserProfiles(profileResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setMatchesLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, state.loading, selectedGender, age, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="bg-utility-bg">
      {/* Desktop version */}
      <div className="hidden min-h-screen flex-col lg:flex">
        <NavBar />

        <div className="flex flex-grow">
          <LeftSidebar />

          {matchesLoading ? (
            <div className="flex flex-grow flex-col items-center justify-center text-utility-primary">
              <TbLoader2 className="size-20 animate-spin" />
            </div>
          ) : (
            <section className="relative flex w-[20rem] flex-grow flex-col justify-center">
              <LazyCardSwiper
                userId={userId}
                userProfiles={userProfiles}
                setUserProfiles={setUserProfiles}
              />

              <p className="absolute bottom-5 z-30 w-full text-center text-fourth-700">
                Merry limit today <span className="text-primary-400">2/20</span>
              </p>
            </section>
          )}

          <RightSidebar
            age={age}
            setAge={setAge}
            genderList={genderList}
            selectedGender={selectedGender}
            setSelectedGender={setSelectedGender}
          />
        </div>
      </div>

      {/* Mobile version */}
      <div className="relative flex min-h-screen flex-col lg:hidden">
        <NavBar />

        <div className="w-full">
          <CardSwiperMobile
            userId={userId}
            userProfiles={userProfiles}
            setUserProfiles={setUserProfiles}
          />
        </div>

        <div className="absolute bottom-5 z-20 flex w-full justify-between px-4 md:px-14">
          <button
            type="button"
            onClick={() => setIsfilterMobileOpen(!isfilterMobileOpen)}
            className="group flex items-center gap-2"
          >
            <svg
              className="fill-fourth-400 transition-colors duration-300 group-hover:fill-fourth-200"
              width="18"
              height="19"
              viewBox="0 0 18 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 9.10107C2.80109 9.10107 2.61032 9.02206 2.46967 8.8814C2.32902 8.74075 2.25 8.54999 2.25 8.35107V0.851074C2.25 0.652162 2.32902 0.461396 2.46967 0.320744C2.61032 0.180092 2.80109 0.101074 3 0.101074C3.19891 0.101074 3.38968 0.180092 3.53033 0.320744C3.67098 0.461396 3.75 0.652162 3.75 0.851074V8.35107C3.75 8.54999 3.67098 8.74075 3.53033 8.8814C3.38968 9.02206 3.19891 9.10107 3 9.10107ZM15 9.10107C14.8011 9.10107 14.6103 9.02206 14.4697 8.8814C14.329 8.74075 14.25 8.54999 14.25 8.35107V0.851074C14.25 0.652162 14.329 0.461396 14.4697 0.320744C14.6103 0.180092 14.8011 0.101074 15 0.101074C15.1989 0.101074 15.3897 0.180092 15.5303 0.320744C15.671 0.461396 15.75 0.652162 15.75 0.851074V8.35107C15.75 8.54999 15.671 8.74075 15.5303 8.8814C15.3897 9.02206 15.1989 9.10107 15 9.10107ZM3.75 17.3511V15.8511C3.75 15.6522 3.67098 15.4614 3.53033 15.3207C3.38968 15.1801 3.19891 15.1011 3 15.1011C2.80109 15.1011 2.61032 15.1801 2.46967 15.3207C2.32902 15.4614 2.25 15.6522 2.25 15.8511V17.3511C2.25 17.55 2.32902 17.7408 2.46967 17.8814C2.61032 18.0221 2.80109 18.1011 3 18.1011C3.19891 18.1011 3.38968 18.0221 3.53033 17.8814C3.67098 17.7408 3.75 17.55 3.75 17.3511ZM15.75 15.8511V17.3511C15.75 17.55 15.671 17.7408 15.5303 17.8814C15.3897 18.0221 15.1989 18.1011 15 18.1011C14.8011 18.1011 14.6103 18.0221 14.4697 17.8814C14.329 17.7408 14.25 17.55 14.25 17.3511V15.8511C14.25 15.6522 14.329 15.4614 14.4697 15.3207C14.6103 15.1801 14.8011 15.1011 15 15.1011C15.1989 15.1011 15.3897 15.1801 15.5303 15.3207C15.671 15.4614 15.75 15.6522 15.75 15.8511ZM9.75 2.35107V0.851074C9.75 0.652162 9.67098 0.461396 9.53033 0.320744C9.38968 0.180092 9.19891 0.101074 9 0.101074C8.80109 0.101074 8.61032 0.180092 8.46967 0.320744C8.32902 0.461396 8.25 0.652162 8.25 0.851074V2.35107C8.25 2.54999 8.32902 2.74075 8.46967 2.8814C8.61032 3.02206 8.80109 3.10107 9 3.10107C9.19891 3.10107 9.38968 3.02206 9.53033 2.8814C9.67098 2.74075 9.75 2.54999 9.75 2.35107ZM9 18.1011C8.80109 18.1011 8.61032 18.0221 8.46967 17.8814C8.32902 17.7408 8.25 17.55 8.25 17.3511V9.85107C8.25 9.65216 8.32902 9.4614 8.46967 9.32074C8.61032 9.18009 8.80109 9.10107 9 9.10107C9.19891 9.10107 9.38968 9.18009 9.53033 9.32074C9.67098 9.4614 9.75 9.65216 9.75 9.85107V17.3511C9.75 17.55 9.67098 17.7408 9.53033 17.8814C9.38968 18.0221 9.19891 18.1011 9 18.1011ZM0.75 12.1011C0.75 12.6978 0.987053 13.2701 1.40901 13.6921C1.83097 14.114 2.40326 14.3511 3 14.3511C3.59674 14.3511 4.16903 14.114 4.59099 13.6921C5.01295 13.2701 5.25 12.6978 5.25 12.1011C5.25 11.5043 5.01295 10.932 4.59099 10.5101C4.16903 10.0881 3.59674 9.85107 3 9.85107C2.40326 9.85107 1.83097 10.0881 1.40901 10.5101C0.987053 10.932 0.75 11.5043 0.75 12.1011ZM9 8.35107C8.40326 8.35107 7.83097 8.11402 7.40901 7.69206C6.98705 7.27011 6.75 6.69781 6.75 6.10107C6.75 5.50434 6.98705 4.93204 7.40901 4.51008C7.83097 4.08813 8.40326 3.85107 9 3.85107C9.59674 3.85107 10.169 4.08813 10.591 4.51008C11.0129 4.93204 11.25 5.50434 11.25 6.10107C11.25 6.69781 11.0129 7.27011 10.591 7.69206C10.169 8.11402 9.59674 8.35107 9 8.35107ZM12.75 12.1011C12.75 12.6978 12.9871 13.2701 13.409 13.6921C13.831 14.114 14.4033 14.3511 15 14.3511C15.5967 14.3511 16.169 14.114 16.591 13.6921C17.0129 13.2701 17.25 12.6978 17.25 12.1011C17.25 11.5043 17.0129 10.932 16.591 10.5101C16.169 10.0881 15.5967 9.85107 15 9.85107C14.4033 9.85107 13.831 10.0881 13.409 10.5101C12.9871 10.932 12.75 11.5043 12.75 12.1011Z"
                fill=""
              />
            </svg>

            <p className="text-fourth-500 transition-colors duration-300 group-hover:text-fourth-300">
              Filter
            </p>
          </button>

          <p className="text-center text-fourth-700">
            Merry limit today <span className="text-primary-400">2/20</span>
          </p>
        </div>

        {/* Filter div */}
        {isfilterMobileOpen && (
          <div
            onClick={() => setIsfilterMobileOpen(!isfilterMobileOpen)}
            className="fixed inset-0 bottom-0 z-50 bg-utility-second bg-opacity-50"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-0 flex w-full flex-col gap-5 rounded-t-3xl bg-utility-primary px-5 pb-6 pt-3"
            >
              {/* Header */}
              <div className="flex items-center justify-between font-bold">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsfilterMobileOpen(!isfilterMobileOpen);
                  }}
                >
                  <FiX className="size-5 text-utility-second transition-colors duration-300 hover:text-neutral-700" />
                </button>

                <p className="text-xl text-[#191C77]">Filter</p>
                <Link
                  href="#"
                  className="font-bold text-primary-500 transition-colors duration-300 hover:text-primary-600"
                >
                  Clear
                </Link>
              </div>

              <FilterMobile
                age={age}
                setAge={setAge}
                genderList={genderList}
                selectedGender={selectedGender}
                setSelectedGender={setSelectedGender}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
