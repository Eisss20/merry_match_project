import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { CustomButton } from "@/components/CustomUi";
import { IoMdArrowBack } from "react-icons/io";
import BackgroundPage from "@/components/BackgroundPage";
import { NavBar } from "@/components/NavBar";
import CustomSelect from "@/components/register/CustomSelect";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import {
  validateEmail,
  validateName,
  validateAge,
  validateLocation,
  validateCity,
  validateUsername,
  validatePassword,
  validateConfirmPassword,
  validateRequiredFieldsStep1,
} from "@/utils/validateRegisterStep1";
import {
  validateSexualIdentities,
  validateSexualpreferences,
  validateRacialIdentities,
  validateRacialPreferences,
  validateMeetingInterests,
  validatehobbies,
  validateAboutme,
  validateRequiredFieldsStep2,
} from "@/utils/validateRegisterStep2";
import { validateProfilePicture } from "@/utils/validateRegisterStep3";
import ProfilePicturesForm from "@/components/register/ProfilePicturesForm";
import Alert from "@/components/register/AlertRegister";
import AlertStepTwo from "@/components/register/AlertRegisterstep2";
import AlertStepThree from "@/components/register/AlertRegisterstep3";
import LoadingMerry from "@/components/custom-loading/LoadingMerry";

function RegisterPage() {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [citys, setCitys] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [sexualIdentities, setSexualIdentities] = useState("");
  const [racialPreferences, setRacialPreferences] = useState("");
  const [meetingInterests, setMeetingInterests] = useState("");
  const [sexualPreferences, setSexualPreferences] = useState("");
  const [racialIdentities, setRacialIdentities] = useState("");
  const [aboutme, setAboutme] = useState("");
  const [hobbies, sethobbies] = useState("");
  const router = useRouter();
  const [preferencesOptions, setPreferencesOptions] = useState([]);
  const [meetingOptions, setMeetingOptions] = useState([]);
  const [racialOptions, setRacialOptions] = useState([]);
  const [locations, setLocations] = useState([]);
  const [cities, setCities] = useState([]);
  const [allCities, setAllCities] = useState([]);
  const [nameError, setNameError] = useState("");
  const [dateError, setDateError] = useState("");
  const [locationError, setLocationError] = useState("");
  const [citysError, setCitysError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertVisibleTwo, setAlertVisibleTwo] = useState(false);
  const [alertVisibleThree, setAlertVisibleThree] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessageTwo, setErrorMessageTwo] = useState("");
  const [errorMessageThree, setErrorMessageThree] = useState("");
  const [sexualIdentitiesError, setSexualIdentitiesError] = useState("");

  const [sexualPreferencesError, setSexualPreferencesError] = useState("");
  const [racialIdentitiesError, setRacialIdentitiesError] = useState("");
  const [racialPreferencesError, setRacialPreferencesError] = useState("");
  const [meetingInterestsError, setMeetingInterestsError] = useState("");
  const [hobbiesError, setHobbiesError] = useState("");
  const [aboutmeError, setAboutmeError] = useState("");
  const [avatarError, setAvatarError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [avatar, setAvatars] = useState("");
  const [step, setStep] = useState(1);
  const { register } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/auth/registerStep2");

        const genderOptions = response.data.genders.rows.map((item) => ({
          value: item.gender_id.toString(),
          label: item.gender_name,
        }));
        setPreferencesOptions(genderOptions);

        const meetingInterestOptions = response.data.meeting_interest.rows.map(
          (item) => ({
            value: item.meeting_interest_id.toString(),
            label: item.meeting_name,
          }),
        );
        setMeetingOptions(meetingInterestOptions);

        const racialOptions = response.data.racial_identity.rows.map(
          (item) => ({
            value: item.racial_id.toString(),
            label: item.racial_name,
          }),
        );
        setRacialOptions(racialOptions);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/auth/registerStep2");

        setLocations(
          response.data.location.map((loc) => ({
            value: loc.location_id.toString(),
            label: loc.location_name,
          })),
        );

        setAllCities(response.data.city);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      const filteredCities = allCities.filter(
        (city) => city.location_id.toString() === selectedLocation,
      );
      setCities(filteredCities);
    } else {
      setCities([]);
    }
  }, [selectedLocation, allCities]);

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const avatarError = validateProfilePicture(avatar);
    if (avatarError) {
      setErrorMessageThree(avatarError);
      setAlertVisibleThree(true);
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("date", date);
    formData.append("selectedLocation", selectedLocation);
    formData.append("citys", citys);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("confirm", confirm);
    formData.append("sexualIdentities", sexualIdentities);
    formData.append("sexualPreferences", sexualPreferences);
    formData.append("racialPreferences", racialPreferences);
    formData.append("meetingInterests", meetingInterests);
    formData.append("hobbies", JSON.stringify(hobbies));
    formData.append("aboutme", aboutme);
    formData.append("racialIdentities", racialIdentities);

    for (let avatarKey in avatar) {
      formData.append("avatar", avatar[avatarKey]);
    }

    try {
      await register(formData);
      router.push("/login");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateHobbies = (selectedOptions) => {
    sethobbies(selectedOptions);
    setHobbiesError("");
  };

  const updateHobbiesError = (error) => {
    setHobbiesError(error);
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const newAvatars = { ...avatar };

    files.forEach((file, index) => {
      const uniqueId = Date.now() + index;
      if (Object.keys(newAvatars).length < 5) {
        newAvatars[uniqueId] = file;
      }
    });

    const avatarsArray = Object.values(newAvatars);
    const avatarsObject = avatarsArray.reduce((acc, file, index) => {
      acc[index] = file;
      return acc;
    }, {});

    setAvatars(avatarsObject);

    if (Object.keys(avatarsObject).length >= 2) {
      setAvatarError("");
    }
  };

  const handleRemoveImage = (event, avatarKey) => {
    event.preventDefault();
    const updatedAvatars = { ...avatar };
    delete updatedAvatars[avatarKey];
    setAvatars(updatedAvatars);

    const error = validateProfilePicture(updatedAvatars);
    setAvatarError(error);
  };

  const handleAvatarUpdate = (updatedAvatars) => {
    setAvatars(updatedAvatars);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "aboutme") {
      setAboutme(value);
      const error = validateAboutme(value);
      setAboutmeError(error);
    }
  };

  const goToPrevStep = (e) => {
    e.preventDefault();
    if (step > 1) {
      setStep(step - 1);
    }
    if (step === 3) {
      sethobbies("");
      setHobbiesError("");
    }
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);

    const error = validateName(value);
    setNameError(error || "");
  };

  const handleNameBlur = () => {
    if (name.trim() === "") {
      setNameError("");
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    const error = validatePassword(value, confirm);
    setPasswordError(error || "");
  };
  const handlePasswordBlur = () => {
    if (password.trim() === "") {
      setPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirm(value);

    const error = validateConfirmPassword(password, value);
    setConfirmPasswordError(error || "");
  };

  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    setDate(selectedDate);

    const error = validateAge(selectedDate);
    setDateError(error);
  };

  const handleCityChange = (e) => {
    const value = e.target.value;
    setCitys(value);

    const error = validateCity(value);
    setCitysError(error || "");
  };

  const goToNextStep = async (e) => {
    e.preventDefault();
    if (step === 1) {
      const nameError = validateName(name);
      const passwordError = validatePassword(password);
      const confirmPasswordError = validateConfirmPassword(password, confirm);
      const dateError = validateAge(date);
      const cityError = validateCity(citys);
      const usernameError = await validateUsername(username);
      const emailError = await validateEmail(email);
      const locationError = validateLocation(selectedLocation);

      const requiredErrorStep1 = validateRequiredFieldsStep1({
        name,
        date,
        selectedLocation,
        citys,
        username,
        email,
        password,
        confirm,
      });

      const errorMessages = {
        name: nameError,
        email: emailError,
        selectedLocation: locationError,
        citys: cityError,
        date: dateError,
        username: usernameError,
        password: passwordError,
        confirm: confirmPasswordError,
      };

      if (
        nameError ||
        passwordError ||
        confirmPasswordError ||
        locationError ||
        emailError ||
        usernameError ||
        dateError ||
        cityError ||
        requiredErrorStep1
      ) {
        setErrorMessage(
          "Please provide all the required information accurately and completely",
        );
        setAlertVisible(true);

        setNameError(errorMessages.name || "");
        setEmailError(errorMessages.email || "");
        setLocationError(errorMessages.selectedLocation || "");
        setCitysError(errorMessages.citys || "");
        setDateError(errorMessages.date || "");
        setUsernameError(errorMessages.username || "");
        setPasswordError(errorMessages.password || "");
        setConfirmPasswordError(errorMessages.confirm || "");

        return;
      }

      setAlertVisible(false);
      setStep(step + 1);
    }

    if (step === 2) {
      const sexualIdentitiesError = validateSexualIdentities(sexualIdentities);
      const sexualPreferencesError =
        validateSexualpreferences(sexualPreferences);
      const racialIdentitiesError = validateRacialIdentities(racialIdentities);
      const racialPreferencesError =
        validateRacialPreferences(racialPreferences);
      const meetingInterestsError = validateMeetingInterests(meetingInterests);
      const hobbiesError = validatehobbies(hobbies);
      const aboutmeError = validateAboutme(aboutme);

      if (hobbiesError) {
        setHobbiesError(hobbiesError);
      } else {
        setHobbiesError("");
      }

      const requiredErrorStep2 = validateRequiredFieldsStep2({
        sexualIdentity: sexualIdentities,
        sexualPreferences,
        racialIdentities,
        racialPreferences,
        meetingInterests,
        hobbies,
        value: aboutme,
      });

      const errorMessages = {
        sexualIdentities: sexualIdentitiesError,
        sexualPreferences: sexualPreferencesError,
        racialIdentities: racialIdentitiesError,
        racialPreferences: racialPreferencesError,
        meetingInterests: meetingInterestsError,
        hobbies: hobbiesError,
        aboutme: aboutmeError,
      };

      if (
        sexualIdentitiesError ||
        sexualPreferencesError ||
        racialIdentitiesError ||
        racialPreferencesError ||
        meetingInterestsError ||
        hobbiesError ||
        aboutmeError ||
        requiredErrorStep2
      ) {
        setErrorMessageTwo(
          "Please provide all the required information accurately and completely",
        );
        setAlertVisibleTwo(true);

        setSexualIdentitiesError(errorMessages.sexualIdentities || "");
        setSexualPreferencesError(errorMessages.sexualPreferences || "");
        setRacialIdentitiesError(errorMessages.racialIdentities || "");
        setRacialPreferencesError(errorMessages.racialPreferences || "");
        setMeetingInterestsError(errorMessages.meetingInterests || "");
        setHobbiesError(errorMessages.hobbies || "");
        setAboutmeError(errorMessages.aboutme || "");

        return;
      }

      setAlertVisibleTwo(false);
      setStep(step + 1);
    }
    const avatarError = validateProfilePicture(avatar);
    if (step < 3) {
      if (avatarError) {
        setAvatarError(avatarError);
        return;
      }
    }
  };

  return (
    <>
      <NavBar />
      <BackgroundPage className="flex items-center justify-center bg-utility-bgMain">
        <div className="container mt-10 flex flex-col justify-start lg:mt-36">
          <div className="">
            <div className="container ml-2 flex-grow">
              {" "}
              <div className="lg:flex lg:h-[145px] lg:w-full lg:items-center lg:justify-center lg:px-8">
                {/* Header */}
                <div className="">
                  <div className="lg:head lg:mr-8 lg:h-[145px] lg:w-[453px] lg:text-left">
                    <h2 className="font-nunito text-[14px] font-semibold">
                      Register
                    </h2>
                    <h1 className="items-center font-nunito text-[32px] font-extrabold text-second-500 lg:text-[46px]">
                      Join us and start matching
                    </h1>
                  </div>
                </div>

                {/* Step Indicator นับตัวเลยหน้าใช้.map */}
                <div className="mt-2 flex justify-center gap-[16px] px-4 lg:h-[80px] lg:w-[430px] lg:px-0">
                  {[1, 2, 3].map((num) => (
                    <div
                      key={num}
                      className={`tab relative flex h-auto w-auto items-center justify-start rounded-[8px] border-[1px] lg:tab lg:relative lg:h-[80px] lg:gap-[8px] lg:rounded-[16px] ${
                        step === num ? "border-second-500" : "border-gray-200"
                      } transform transition-all duration-300 ease-in-out ${
                        step === num ? "scale-105" : "scale-100"
                      }`}
                    >
                      {/* หมายเลข (1, 2, 3) อยู่ตรงกลางด้านซ้าย */}
                      <span
                        className={`mt-2 flex h-[20px] w-[20px] items-center justify-center rounded-full bg-fourth-200 text-center font-nunito text-[16px] font-bold leading-[30px] tracking-[-2%] text-second-500 lg:mt-0 lg:h-[50px] lg:w-[50px] lg:space-x-[12px] lg:text-[24px] ${
                          step === num
                            ? "bg-fourth-200 text-second-500"
                            : "bg-gray-200 text-gray-500"
                        } ml-0 transition-all duration-300 ease-in-out`}
                      >
                        {num}
                      </span>

                      {/* Step และข้อความที่เกี่ยวข้องจะอยู่ทางขวา */}
                      {step === num && (
                        <div className="transition-all duration-300 ease-in-out lg:ml-auto">
                          <h2 className="text-left font-nunito font-medium lg:text-[12px] lg:leading-[18px]">
                            Step {num}/3
                          </h2>
                          {num === 1 && (
                            <div className="flex w-full items-center justify-between">
                              <h1 className="text-center font-nunito text-[16px] font-extrabold leading-[24px] text-second-500">
                                Basic Information
                              </h1>
                            </div>
                          )}
                          {num === 2 && (
                            <h1 className="font-nunito text-[12px] font-extrabold text-second-500 lg:text-[12px] lg:leading-[24px]">
                              Identities and Interests
                            </h1>
                          )}
                          {num === 3 && (
                            <h1 className="font-nunito text-[16px] font-extrabold leading-[24px] text-second-500">
                              Upload Photos
                            </h1>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* การแสดง loading เมื่อ isLoading เป็น true */}
            {isLoading && <LoadingMerry className="mt-52"></LoadingMerry>}

            {/* Form Content */}
            <div className="lg:mt-10">
              <div className="container mt-8 flex flex-grow flex-col px-4">
                <div className="container">
                  {step === 1 && (
                    <div className="grid-cols-1 gap-6 lg:grid lg:grid-cols-2">
                      <label className="form-control">
                        <span className="label-text">Name</span>
                        <input
                          type="text"
                          name="name"
                          value={name}
                          onChange={handleNameChange}
                          disabled={alertVisible}
                          onBlur={handleNameBlur}
                          className={`input border-fourth-400 bg-utility-primary text-utility-second transition-colors duration-300 hover:border-second-500 focus:border-second-500 focus:outline-none ${nameError ? "border-utility-third" : ""}`}
                          placeholder="Name"
                        />
                        {nameError && (
                          <small className="ml-2 pt-2 text-red-600">
                            {nameError}
                          </small>
                        )}{" "}
                        {/* แสดงข้อผิดพลาดขณะพิมพ์ */}
                      </label>
                      <div>
                        <label className="form-control">
                          <span className="label-text">Date of Birth</span>
                          <input
                            type="date"
                            name="date"
                            value={date}
                            onChange={handleDateChange}
                            disabled={alertVisible}
                            className={`input border-fourth-400 bg-utility-primary text-utility-second transition-colors duration-300 hover:border-second-500 focus:border-second-500 focus:outline-none ${dateError ? "border-utility-third" : ""}`}
                            max={getCurrentDate()}
                          />
                        </label>
                        {dateError && (
                          <small className="ml-2 pt-2 text-red-600">
                            {dateError}
                          </small>
                        )}{" "}
                        {/* แสดงข้อผิดพลาด */}
                      </div>

                      <label className="form-control">
                        <span className="label-text">Location</span>
                        <select
                          name="location"
                          value={selectedLocation}
                          onChange={(e) => {
                            setSelectedLocation(e.target.value);
                            setLocationError("");
                          }}
                          disabled={alertVisible}
                          className={`select select-bordered border-fourth-400 bg-utility-primary text-utility-second transition-colors duration-300 hover:border-second-500 focus:border-second-500 focus:outline-none ${locationError ? "border-utility-third" : ""}`}
                        >
                          <option value="" disabled>
                            Select Location
                          </option>
                          {locations.map((loc) => (
                            <option key={loc.value} value={loc.value}>
                              {loc.label}
                            </option>
                          ))}
                        </select>
                        {locationError && (
                          <small className="ml-2 pt-2 text-red-600">
                            {locationError}
                          </small>
                        )}
                      </label>

                      <label className="form-control">
                        <span className="label-text">City</span>
                        <select
                          name="city"
                          value={citys}
                          onChange={handleCityChange}
                          disabled={!selectedLocation || alertVisible}
                          className={`select select-bordered border-fourth-400 bg-utility-primary text-utility-second transition-colors duration-300 hover:border-second-500 focus:border-second-500 focus:outline-none ${citysError ? "border-utility-third" : ""}`}
                        >
                          <option value="" disabled>
                            Select City
                          </option>
                          {cities.map((city) => (
                            <option key={city.city_id} value={city.city_id}>
                              {city.city_name}
                            </option>
                          ))}
                        </select>
                        {/* แสดงข้อความผิดพลาดถ้ามี */}
                        {citysError && (
                          <small className="ml-2 pt-2 text-red-600">
                            {citysError}
                          </small>
                        )}
                      </label>
                      <label className="form-control">
                        <span className="label-text">Username</span>
                        <input
                          type="text"
                          name="username"
                          value={username}
                          onChange={(event) => {
                            setUsername(event.target.value);
                            setUsernameError("");
                          }}
                          disabled={alertVisible}
                          onBlur={handleNameBlur}
                          className={`input border-fourth-400 bg-utility-primary text-utility-second transition-colors duration-300 hover:border-second-500 focus:border-second-500 focus:outline-none ${usernameError ? "border-utility-third" : ""}`}
                          placeholder="Username"
                        />
                        {usernameError && (
                          <small className="ml-2 pt-2 text-red-600">
                            {usernameError}
                          </small>
                        )}
                      </label>
                      <label className="form-control">
                        <span className="label-text">Email</span>
                        <input
                          type="email"
                          name="email"
                          value={email}
                          onChange={(event) => {
                            setEmail(event.target.value);
                            setEmailError("");
                          }}
                          disabled={alertVisible}
                          onBlur={handleNameBlur}
                          className={`input border-fourth-400 bg-utility-primary text-utility-second transition-colors duration-300 hover:border-second-500 focus:border-second-500 focus:outline-none ${emailError ? "border-utility-third" : ""}`}
                          placeholder="Email"
                        />

                        {/* แสดงข้อผิดพลาดถ้ามี */}
                        {emailError && (
                          <small className="ml-2 pt-2 text-red-600">
                            {emailError}
                          </small>
                        )}
                      </label>
                      <label className="form-control">
                        <span className="label-text">Password</span>
                        <input
                          type="password"
                          name="password"
                          value={password}
                          onChange={handlePasswordChange}
                          disabled={alertVisible}
                          onBlur={handlePasswordBlur}
                          className={`input border-fourth-400 bg-utility-primary text-utility-second transition-colors duration-300 hover:border-second-500 focus:border-second-500 focus:outline-none ${passwordError ? "border-utility-third" : ""}`}
                          placeholder="Password"
                        />
                        {passwordError && (
                          <small className="ml-2 pt-2 text-red-600">
                            {passwordError}
                          </small>
                        )}{" "}
                        {/* แสดงข้อผิดพลาด */}
                      </label>

                      <label className="form-control">
                        <span className="label-text">Confirm Password</span>
                        <input
                          type="password"
                          name="confirm"
                          value={confirm}
                          onChange={handleConfirmPasswordChange}
                          disabled={alertVisible}
                          className={`input border-fourth-400 bg-utility-primary text-utility-second transition-colors duration-300 hover:border-second-500 focus:border-second-500 focus:outline-none ${confirmPasswordError ? "border-utility-third" : ""}`}
                          placeholder="Confirm Password"
                        />
                        {confirmPasswordError && (
                          <small className="ml-2 pt-2 text-red-600">
                            {confirmPasswordError}
                          </small>
                        )}{" "}
                        {/* แสดงข้อผิดพลาด */}
                      </label>
                    </div>
                  )}
                  <div className="pt-10">
                    {alertVisible && (
                      <Alert
                        message={errorMessage}
                        onClose={() => setAlertVisible(false)}
                      />
                    )}
                  </div>
                </div>

                <div className="container">
                  {step === 2 && (
                    <div className="">
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <label className="form-control">
                          <span className="label-text">Sexual identities</span>
                          <select
                            name="sexualIdentities"
                            value={sexualIdentities}
                            onChange={(event) => {
                              setSexualIdentities(event.target.value);
                              setSexualIdentitiesError("");
                            }}
                            disabled={alertVisibleTwo}
                            className={`select select-bordered border-fourth-400 bg-utility-primary text-utility-second transition-colors duration-300 hover:border-second-500 focus:border-second-500 focus:outline-none ${sexualIdentitiesError ? "border-utility-third" : ""}`}
                          >
                            <option value="" disabled>
                              Select Sexual Identity
                            </option>
                            {preferencesOptions.map((gender) => (
                              <option key={gender.value} value={gender.value}>
                                {gender.label}
                              </option>
                            ))}
                          </select>
                          {sexualIdentitiesError && (
                            <small className="ml-2 pt-2 text-red-600">
                              {sexualIdentitiesError}
                            </small>
                          )}
                        </label>

                        <label className="form-control">
                          <span className="label-text">Sexual preferences</span>
                          <select
                            className={`select select-bordered border-fourth-400 bg-utility-primary text-utility-second transition-colors duration-300 hover:border-second-500 focus:border-second-500 focus:outline-none ${sexualIdentitiesError ? "border-utility-third" : ""}`}
                            name="sexualPreferences"
                            value={sexualPreferences}
                            onChange={(event) => {
                              setSexualPreferences(event.target.value);
                              setSexualPreferencesError("");
                            }}
                            disabled={alertVisibleTwo}
                          >
                            <option value="" disabled>
                              Select Sexual Preference
                            </option>
                            {/* แสดงข้อมูล gender จาก API */}
                            {preferencesOptions.map((gender) => (
                              <option key={gender.value} value={gender.value}>
                                {gender.label}
                              </option>
                            ))}
                          </select>
                          {sexualPreferencesError && (
                            <small className="ml-2 pt-2 text-red-600">
                              {sexualPreferencesError}
                            </small>
                          )}
                        </label>

                        <label className="form-control">
                          <span className="label-text">Racial identities</span>
                          <select
                            className={`select select-bordered border-fourth-400 bg-utility-primary text-utility-second transition-colors duration-300 hover:border-second-500 focus:border-second-500 focus:outline-none ${racialIdentitiesError ? "border-utility-third" : ""}`}
                            name="racialPreferences"
                            value={racialIdentities}
                            onChange={(event) => {
                              setRacialIdentities(event.target.value);
                              setRacialIdentitiesError("");
                            }}
                            disabled={alertVisibleTwo}
                          >
                            <option value="" disabled>
                              Select Racial Preference
                            </option>{" "}
                            {/* แสดงข้อมูล gender จาก API */}
                            {racialOptions.map((racialOptions) => (
                              <option
                                key={racialOptions.value}
                                value={racialOptions.value}
                              >
                                {racialOptions.label}
                              </option>
                            ))}
                          </select>
                          {racialIdentitiesError && (
                            <small className="ml-2 pt-2 text-red-600">
                              {racialIdentitiesError}
                            </small>
                          )}
                        </label>

                        <label className="form-control">
                          <span className="label-text">Racial preferences</span>
                          <select
                            className={`select select-bordered border-fourth-400 bg-utility-primary text-utility-second transition-colors duration-300 hover:border-second-500 focus:border-second-500 focus:outline-none ${racialPreferencesError ? "border-utility-third" : ""}`}
                            name="racialPreferences"
                            value={racialPreferences}
                            onChange={(event) => {
                              setRacialPreferences(event.target.value);
                              setRacialPreferencesError("");
                            }}
                            disabled={alertVisibleTwo}
                          >
                            <option value="" disabled>
                              Select Racial Preference
                            </option>{" "}
                            {/* แสดงข้อมูล gender จาก API */}
                            {racialOptions.map((racialOptions) => (
                              <option
                                key={racialOptions.value}
                                value={racialOptions.value}
                              >
                                {racialOptions.label}
                              </option>
                            ))}
                          </select>
                          {racialPreferencesError && (
                            <small className="ml-2 pt-2 text-red-600">
                              {racialPreferencesError}
                            </small>
                          )}
                        </label>

                        <label className="form-control">
                          <span className="label-text">Meeting Interests</span>
                          <select
                            className={`select select-bordered border-fourth-400 bg-utility-primary text-utility-second transition-colors duration-300 hover:border-second-500 focus:border-second-500 focus:outline-none ${meetingInterestsError ? "border-utility-third" : ""}`}
                            value={meetingInterests}
                            onChange={(event) => {
                              setMeetingInterests(event.target.value);
                              setMeetingInterestsError("");
                            }}
                            disabled={alertVisibleTwo}
                          >
                            <option value="" disabled>
                              Select Meeting Interest
                            </option>
                            {/* แสดงข้อมูล meetingInterests */}
                            {meetingOptions.map((meetingOptions) => (
                              <option
                                key={meetingOptions.value}
                                value={meetingOptions.value}
                              >
                                {meetingOptions.label}
                              </option>
                            ))}
                          </select>
                          {meetingInterestsError && (
                            <small className="ml-2 pt-2 text-red-600">
                              {meetingInterestsError}
                            </small>
                          )}
                        </label>
                      </div>
                      <div className="container mt-6">
                        <CustomSelect
                          formData={hobbies}
                          updateHobbies={updateHobbies}
                          updateHobbiesError={updateHobbiesError}
                          disabled={alertVisibleTwo}
                          hobbieError={hobbiesError}
                          className={`${
                            hobbiesError ? "border-utility-third" : "" // เปลี่ยนเส้นขอบตาม error
                          }`}
                        />
                        {hobbiesError && (
                          <small className="ml-2 pt-2 text-red-600">
                            {hobbiesError}
                          </small>
                        )}
                      </div>
                      <div>
                        <label className="about-me-section mt-6 flex w-full flex-col gap-1">
                          <span className="text-base font-normal text-utility-second">
                            About me (Maximum 150 characters)
                          </span>
                          <textarea
                            type="text"
                            name="aboutme"
                            value={aboutme}
                            onChange={handleInputChange}
                            disabled={alertVisibleTwo}
                            onBlur={handleNameBlur}
                            className={`input h-28 w-full rounded-[8px] border border-fourth-400 bg-utility-primary px-4 pb-14 pt-3 text-utility-second placeholder-fourth-900 transition-colors duration-300 hover:border-second-500 focus:border-second-500 focus:outline-none ${aboutmeError ? "border-utility-third" : ""}`}
                            placeholder="Write something about yourself"
                          />
                        </label>
                        {aboutmeError && (
                          <small className="ml-2 pt-2 text-red-600">
                            {aboutmeError}
                          </small>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="pt-10">
                    {alertVisibleTwo && (
                      <AlertStepTwo
                        message={errorMessageTwo}
                        onClose={() => setAlertVisibleTwo(false)}
                      />
                    )}
                  </div>
                </div>

                <div className="container">
                  <div>
                    {step === 3 && (
                      <div className="grid grid-cols-1 gap-6 text-2xl sm:grid-cols-2 lg:flex">
                        <ProfilePicturesForm
                          avatar={avatar}
                          handleFileChange={handleFileChange}
                          handleRemoveImage={handleRemoveImage}
                          avatarError={avatarError}
                          handleAvatarUpdate={handleAvatarUpdate}
                        />
                      </div>
                    )}
                  </div>

                  <div className="pb-10 pt-10">
                    {alertVisibleThree && (
                      <AlertStepThree
                        message={errorMessageThree}
                        onClose={() => setAlertVisibleThree(false)}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Footer Navigation */}
      </BackgroundPage>
      <footer className="flex h-[112px] flex-shrink-0 items-center justify-between border-t border-gray-300 bg-white">
        <div className="ml-10 lg:ml-96">
          <span>{step}/3</span>
        </div>
        <div className="mr-10 flex space-x-4 lg:mr-80">
          <button
            disabled={step === 1}
            onClick={goToPrevStep}
            className="flex h-[48px] w-[80px] items-center justify-center rounded-full border-2 text-primary-500"
          >
            <IoMdArrowBack className="mr-2" />
            Back
          </button>
          <CustomButton
            className="w-[80px]"
            buttonType="primary"
            onClick={step < 3 ? goToNextStep : handleSubmit}
          >
            {step < 3 ? "Next Step" : "Submit"}
          </CustomButton>
        </div>
      </footer>
    </>
  );
}

export default RegisterPage;
