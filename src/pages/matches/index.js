import { FiSearch } from "react-icons/fi";
import { GoHeartFill } from "react-icons/go";
import { TbLoader2 } from "react-icons/tb";

import { NavBar } from "@/components/NavBar";
import { CustomButton } from "@/components/CustomUi";
import LeftSidebar from "@/components/matches/LeftSidebar";

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

export default function Matches() {
  const [userProfiles, setUserProfiles] = useState([]);
  const [genderList, setGenderList] = useState([]);
  const [selectedGender, setSelectedGender] = useState([]);
  const [age, setAge] = useState([18, 50]);
  const [matchesLoading, setMatchesLoading] = useState(false);

  const { state, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (state.loading) return;

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

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
          `/api/users/profile?${queryParams.toString()}`,
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
    <main className="items flex min-h-screen flex-col bg-utility-bg">
      <NavBar />

      <div className="flex flex-grow">
        <LeftSidebar />

        {matchesLoading ? (
          <div className="flex flex-grow flex-col items-center justify-center text-utility-primary">
            <TbLoader2 className="size-20 animate-spin" />
          </div>
        ) : (
          <section className="relative flex w-[20rem] flex-grow flex-col justify-center">
            <LazyCardSwiper userProfiles={userProfiles} />

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
    </main>
  );
}
