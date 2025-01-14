import { FiX } from "react-icons/fi";
import { TbLoader2 } from "react-icons/tb";

import { NavBar } from "@/components/NavBar";
import { CustomButton } from "@/components/CustomUi";
import LeftSidebar from "@/components/matches/LeftSidebar";
import CardSwiperMobile from "@/components/matches/CardSwiperMobile";
import CardSwiper from "@/components/CardSwiper";
import LoadingMerry from "@/components/custom-loading/LoadingMerry";

import apiClient from "@/utils/jwtInterceptor";

import { useEffect, useState, useRef } from "react";
import { Range } from "react-range";
import Link from "next/link";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";

import ShowAlertAndOpenModal from "@/components/Alertbox";

function AgeRangeSlider({ age, setAge, inputValues, setInputValues }) {
  const handleInputChange = (index, value) => {
    const updatedValues = [...inputValues];
    updatedValues[index] = value;
    setInputValues(updatedValues);
  };

  const handleInputKeyDown = (event, index) => {
    if (event.key === "Enter") {
      const value = parseInt(inputValues[index], 10);

      if (index === 0) {
        const newMin = Math.max(18, Math.min(value, age[1]));
        setAge([newMin, age[1]]);
        setInputValues([newMin, inputValues[1]]);
      } else {
        const newMax = Math.min(80, Math.max(value, age[0]));
        setAge([age[0], newMax]);
        setInputValues([inputValues[0], newMax]);
      }
    }
  };

  return (
    <>
      {/* Slider */}
      <div className="w-full rounded-md bg-gray-300 px-2">
        <Range
          step={1}
          min={18}
          max={80}
          values={age}
          onChange={(values) => {
            setAge(values);
            setInputValues(values);
          }}
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
          value={inputValues[0]}
          onChange={(e) => handleInputChange(0, e.target.value)}
          onKeyDown={(e) => handleInputKeyDown(e, 0)}
          className="hover: w-full rounded-lg border-2 border-fourth-400 bg-utility-primary px-3 py-2 text-fourth-600 outline-none"
          min={18}
          max={age[1]}
        />
        <span className="font-semibold text-utility-second">-</span>
        <input
          type="number"
          value={inputValues[1]}
          onChange={(e) => handleInputChange(1, e.target.value)}
          onKeyDown={(e) => handleInputKeyDown(e, 1)}
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
  setSendAge,
  setSendSelectedGender,
  inputValues,
  setInputValues,
}) {
  const handleCheckboxChange = (genderName, isChecked) => {
    setSelectedGender((prev) => {
      if (isChecked) {
        return [...prev, genderName];
      } else {
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
            {genderList.map((interest, index) => (
              <CustomCheckbox
                key={index}
                list={interest}
                onChange={(isChecked) =>
                  handleCheckboxChange(interest, isChecked)
                }
                isChecked={selectedGender.includes(interest)}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <p className="font-bold text-fourth-900">Age Range</p>
          <div className="flex flex-col gap-6">
            <AgeRangeSlider
              age={age}
              setAge={setAge}
              inputValues={inputValues}
              setInputValues={setInputValues}
            />
          </div>
        </div>
      </div>

      <div className="h-[2px] w-full bg-fourth-300"></div>

      <div className="flex items-center justify-end gap-6 px-4 py-4">
        <Link
          href=""
          onClick={() => {
            setSelectedGender([]);
            setAge([18, 50]);
            setInputValues([18, 50]);
          }}
          className="font-bold text-primary-500 transition-colors duration-300 hover:text-primary-600"
        >
          Clear
        </Link>
        <CustomButton
          buttonType="primary"
          onClick={() => {
            setSendSelectedGender(selectedGender);
            setSendAge(age);
          }}
        >
          Search
        </CustomButton>
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
  setSendAge,
  setSendSelectedGender,
  inputValues,
  setInputValues,
}) {
  const handleCheckboxChange = (genderName, isChecked) => {
    setSelectedGender((prev) => {
      if (isChecked) {
        return [...prev, genderName];
      } else {
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
            {genderList.map((interest, index) => (
              <CustomCheckbox
                key={index}
                list={interest}
                onChange={(isChecked) =>
                  handleCheckboxChange(interest, isChecked)
                }
                isChecked={selectedGender.includes(interest)}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <p className="font-bold text-fourth-900">Age Range</p>
          <div className="flex flex-col gap-6">
            <AgeRangeSlider
              age={age}
              setAge={setAge}
              inputValues={inputValues}
              setInputValues={setInputValues}
            />
          </div>
        </div>

        <CustomButton
          buttonType="primary"
          className="w-full"
          onClick={() => {
            setSendSelectedGender(selectedGender);
            setSendAge(age);
          }}
        >
          Search
        </CustomButton>
      </div>
    </aside>
  );
}

export default function Matches() {
  const { state, isAuthenticated } = useAuth();
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [userProfiles, setUserProfiles] = useState([]);

  const [selectedGender, setSelectedGender] = useState(["Default"]);
  const [age, setAge] = useState([18, 50]);
  const [sendSelectedGender, setSendSelectedGender] = useState(["Default"]);
  const [sendAge, setSendAge] = useState([18, 50]);
  const [inputValues, setInputValues] = useState(age);

  const [matchesLoading, setMatchesLoading] = useState(false);
  const [isfilterMobileOpen, setIsfilterMobileOpen] = useState(false);

  const [isMatchAnimation, setIsMatchAnimation] = useState(false);
  const [matchChatId, setMatchChatId] = useState("");

  const [merryLimitData, setMerryLimitData] = useState({
    matchesRemaining: null,
    totalLimit: null,
    subscriptionId: null,
  });

  const limitModalRef = useRef();

  const genderList = ["Default", "Male", "Female", "Other"];

  const removeUserProfile = (otherUserId) => {
    setUserProfiles((prev) =>
      prev.filter((profile) => profile.user_id !== otherUserId),
    );
  };

  const handleLikeUser = async (otherUserId) => {
    if (merryLimitData.matchesRemaining > 0) {
      setMerryLimitData((prevData) => ({
        ...prevData,
        matchesRemaining: prevData.matchesRemaining - 1,
      }));

      const response = await apiClient.post("/api/matches/likes", {
        user_master: userId,
        user_other: otherUserId,
      });

      if (response.data.status === "match") {
        setIsMatchAnimation(true);
        setMatchChatId(response.data?.chatRoomId);

        setTimeout(() => {
          removeUserProfile(otherUserId);
          setIsMatchAnimation(false);
        }, 5000);
      } else {
        removeUserProfile(otherUserId);
      }
    } else {
      limitModalRef.current?.showModal();
    }
  };

  const handleDislikeUser = async (otherUserId) => {
    if (merryLimitData.matchesRemaining > 0) {
      removeUserProfile(otherUserId);
    } else {
      limitModalRef.current?.showModal();
    }
  };

  // Remove scrollbar from daisy modal
  useEffect(() => {
    document.documentElement.classList.add("matches-page");

    return () => {
      document.documentElement.classList.remove("matches-page");
    };
  }, []);

  // Authorization
  useEffect(() => {
    if (state.loading) return;

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    setUserId(state.user?.id);
  }, [isAuthenticated, state.loading, router]);

  // Fetch merry limit data
  useEffect(() => {
    if (!userId) return;

    const fetchMatchData = async () => {
      try {
        const response = await apiClient.get(
          `/api/matches/merryLimit/${userId}`,
        );

        setMerryLimitData({
          matchesRemaining: response.data.matches_remaining,
          totalLimit: response.data.total_limit,
          subscriptionId: response.data.subscription_id,
        });
      } catch (error) {
        console.log("Error fetching match data:", error);
      }
    };

    fetchMatchData();
  }, [userId]);

  // Fetch other user profile
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userId) return;

        setMatchesLoading(true);

        // Fetch user profiles
        const queryParams = new URLSearchParams();

        // Handle default gender
        const resolvedGenders = sendSelectedGender.map((gender) =>
          gender === "Default" ? state.user?.sexual_preference || "" : gender,
        );

        // Add genders to queryParams
        resolvedGenders
          .filter((gender) => gender)
          .forEach((gender) => {
            queryParams.append("gender", gender);
          });

        // Add age range to queryParams
        if (sendAge[0]) queryParams.append("minAge", sendAge[0]);
        if (sendAge[1]) queryParams.append("maxAge", sendAge[1]);

        const profileResponse = await apiClient.get(
          `/api/matches/profiles?userMasterId=${userId}&${queryParams.toString()}`,
        );

        setUserProfiles(profileResponse.data);
      } catch (error) {
        console.log("Error fetching data:", error);
      } finally {
        setMatchesLoading(false);
      }
    };

    fetchData();
  }, [userId, sendSelectedGender, sendAge]);

  if (state.loading || !isAuthenticated) {
    return <LoadingMerry />;
  }

  return (
    <>
      <main className="bg-utility-bg">
        {/* Desktop version */}
        <div className="hidden h-screen flex-col lg:flex">
          <NavBar />

          <div className="flex min-h-0 flex-grow">
            <LeftSidebar type="desktop" />

            {matchesLoading ? (
              <div className="flex flex-grow flex-col items-center justify-center text-utility-primary">
                <TbLoader2 className="size-20 animate-spin" />
              </div>
            ) : (
              <section className="relative flex w-[20rem] flex-grow flex-col justify-center">
                <CardSwiper
                  userId={userId}
                  userProfiles={userProfiles}
                  setUserProfiles={setUserProfiles}
                  handleLikeUser={handleLikeUser}
                  handleDislikeUser={handleDislikeUser}
                  isMatchAnimation={isMatchAnimation}
                  matchChatId={matchChatId}
                />

                <p className="absolute bottom-5 z-30 w-full text-center text-fourth-700">
                  Merry limit today{" "}
                  <span className="text-primary-400">
                    {merryLimitData.matchesRemaining}/
                    {merryLimitData.totalLimit}
                  </span>
                </p>
              </section>
            )}

            <RightSidebar
              age={age}
              setAge={setAge}
              genderList={genderList}
              selectedGender={selectedGender}
              setSelectedGender={setSelectedGender}
              setSendAge={setSendAge}
              setSendSelectedGender={setSendSelectedGender}
              inputValues={inputValues}
              setInputValues={setInputValues}
            />
          </div>
        </div>

        {/* Mobile version */}
        <div className="relative flex min-h-screen flex-col lg:hidden">
          <NavBar />

          {matchesLoading ? (
            <div className="flex flex-grow flex-col items-center justify-center text-utility-primary">
              <TbLoader2 className="size-20 animate-spin" />
            </div>
          ) : (
            <div className="w-full">
              <CardSwiperMobile
                userId={userId}
                userProfiles={userProfiles}
                setUserProfiles={setUserProfiles}
                handleLikeUser={handleLikeUser}
                handleDislikeUser={handleDislikeUser}
                isMatchAnimation={isMatchAnimation}
                matchChatId={matchChatId}
              />
            </div>
          )}

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
              Merry limit today{" "}
              <span className="text-primary-400">
                {merryLimitData.matchesRemaining}/{merryLimitData.totalLimit}
              </span>
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
                    href=""
                    onClick={() => {
                      setSelectedGender([]);
                      setAge([18, 50]);
                      setInputValues([18, 50]);
                    }}
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
                  setSendAge={setSendAge}
                  setSendSelectedGender={setSendSelectedGender}
                  inputValues={inputValues}
                  setInputValues={setInputValues}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      <ShowAlertAndOpenModal
        modalRef={limitModalRef}
        modalId="modal_limit"
        notice="Limit Reached"
        message="You have reached your daily match limit. Please try again tomorrow."
        closeModal={() => limitModalRef.current?.close()}
      />
    </>
  );
}
