import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { validatehobbies } from "@/utils/validateRegisterStep2";

export default function CustomSelect({
  formData,
  updateHobbies,
  updateHobbiesError,
  disabled,
  hobbieError,
}) {
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hobbiesError, setHobbiesError] = useState("");

  const validateSelectedOptions = (options) => {
    const error = validatehobbies(options);
    return error;
  };

  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get("/api/auth/registerStep2");
        const formattedOptions = response.data.hobbies.rows.map((item) => ({
          value: item.hobbies_id.toString(),
          label: item.hobby_name,
        }));

        setOptions(formattedOptions);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    const filtered = options.filter(
      (option) =>
        option.label.toLowerCase().includes(value.toLowerCase()) &&
        !selectedOptions.some((selected) => selected.value === option.value),
    );
    setFilteredOptions(filtered);
    setIsDropdownOpen(value.trim() !== "");
  };

  const handleInputFocus = () => {
    const filtered = options.filter(
      (option) =>
        !selectedOptions.some((selected) => selected.value === option.value),
    );
    setFilteredOptions(filtered);
    setIsDropdownOpen(true);
  };

  const handleSelectOption = (option) => {
    if (selectedOptions.length >= 10) {
      const errorMessage = "You can only select up to 10 hobbies / interests";
      setHobbiesError(errorMessage);
      setIsDropdownOpen(false);
      return;
    }
    const newSelectedOptions = [...selectedOptions, option];
    setSelectedOptions(newSelectedOptions);
    setInputValue("");
    setIsDropdownOpen(false);

    updateHobbies(newSelectedOptions);
  };

  useEffect(() => {
    updateHobbiesError(hobbiesError);
  }, [hobbiesError]);

  const handleRemoveOption = (value) => {
    const updatedOptions = selectedOptions.filter(
      (option) => option.value !== value,
    );

    setSelectedOptions(updatedOptions);

    const error = validateSelectedOptions(updatedOptions);
    setHobbiesError(error);
    updateHobbies(updatedOptions);
  };

  return (
    <div className="container relative" ref={dropdownRef}>
      {" "}
      {/* ใช้ ref ที่นี่ */}
      <label
        htmlFor="hobbies"
        className="block text-sm font-semibold text-gray-700"
      >
        Hobbies / Interests (Maximum 10)
      </label>
      <div className="container flex flex-col gap-2 lg:w-[950px]">
        <input
          type="text"
          id="hobbies"
          placeholder="Type to search or click..."
          value={inputValue}
          onChange={handleInputChange}
          disabled={disabled}
          onFocus={handleInputFocus}
          className={`rounded-lg border p-2 hover:border-second-500 focus:border-second-500 focus:outline-none ${
            disabled
              ? "cursor-not-allowed bg-gray-100 text-gray-500" // เมื่อ disabled จะไม่เปลี่ยนสีเส้นขอบ
              : `border-gray-300 bg-white focus:ring-blue-400 ${hobbieError ? "border-utility-third" : ""}` // เมื่อไม่ disabled ถ้ามี error ให้เปลี่ยนเส้นขอบเป็นสีแดง
          }`}
        />

        {isDropdownOpen && (
          <ul className="absolute top-full z-10 mt-2 max-h-40 overflow-y-auto rounded-lg border border-gray-300 bg-white">
            {filteredOptions.length > 10 ? (
              filteredOptions.map((option) => (
                <li
                  key={option.value}
                  onClick={() => handleSelectOption(option)}
                  className="cursor-pointer p-2 hover:bg-gray-100"
                >
                  {option.label}
                </li>
              ))
            ) : (
              <li className="cursor-pointer p-2 text-gray-500">
                No results found
              </li>
            )}
          </ul>
        )}

        <div className="flex flex-wrap gap-2">
          {selectedOptions.map((option) => (
            <div
              key={option.value}
              className="flex items-center rounded-full bg-second-100 px-3 py-1 text-second-600"
            >
              <span className="mr-2">{option.label}</span>
              <button
                onClick={() => handleRemoveOption(option.value)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
