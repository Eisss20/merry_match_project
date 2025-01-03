import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { validatehobbies } from "@/utils/validateRegisterStep2";

export default function CustomSelect({
  formData,
  updateHobbies,
  updateHobbiesError,
  disabled,
}) {
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hobbiesError, setHobbiesError] = useState("");

  const validateSelectedOptions = (options) => {
    const error = validatehobbies(options); // ใช้ validatehobbies จาก utils
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
    const newSelectedOptions = [...selectedOptions, option];
    setSelectedOptions(newSelectedOptions);

    const error = validateSelectedOptions(newSelectedOptions);
    setHobbiesError(error); // ถ้ามี error จะอัพเดตข้อความ error

    updateHobbies(newSelectedOptions);
    updateHobbiesError(error); // ส่ง error กลับไปที่ parent component

    setInputValue("");
    setIsDropdownOpen(false);
    updateHobbies(newSelectedOptions);
  };

  // ส่ง hobbiesError กลับไปให้กับ parent
  useEffect(() => {
    updateHobbiesError(hobbiesError);
  }, [hobbiesError]);

  const handleRemoveOption = (value) => {
    const updatedOptions = selectedOptions.filter(
      (option) => option.value !== value,
    );

    setSelectedOptions(updatedOptions);

    // ตรวจสอบข้อผิดพลาด
    const error = validateSelectedOptions(updatedOptions);
    setHobbiesError(error); // อัปเดตข้อความ error
    updateHobbies(updatedOptions); // ส่งข้อมูลไปยังฟังก์ชันหลัก
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {" "}
      {/* ใช้ ref ที่นี่ */}
      <label
        htmlFor="hobbies"
        className="block text-sm font-semibold text-gray-700"
      >
        Hobbies / Interests (Maximum 10)
      </label>
      <div className="flex flex-col gap-2">
        <input
          type="text"
          id="hobbies"
          placeholder="Type to search or click..."
          value={inputValue}
          onChange={handleInputChange}
          disabled={disabled}
          onFocus={handleInputFocus}
          className={`rounded-lg border p-2 focus:outline-none focus:ring-2 ${
            disabled
              ? "cursor-not-allowed bg-gray-100 text-gray-500"
              : "border-gray-300 bg-white focus:ring-blue-400"
          }`}
        />
        {/* //อันนี้เพิ่มค่า option แต่ติดปัญหาที่ไม่อัพเดท ก่อนส่งค่า */}
        {/* {isDropdownOpen && (
          <ul className="absolute top-full z-10 mt-2 max-h-40 w-full overflow-y-auto rounded-lg border border-gray-300 bg-white">
            {filteredOptions.length > 0 ? (
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
              <li
                onClick={handleAddNewOption}
                className="cursor-pointer p-2 text-blue-600 hover:bg-blue-100"
              >
                Add "{inputValue}" as a new option
              </li>
            )}
          </ul>
        )} */}

        {/* อันนี้ตัวแก้ไขโดยไม่ให้เพิ่ม option */}
        {isDropdownOpen && (
          <ul className="absolute top-full z-10 mt-2 max-h-40 w-full overflow-y-auto rounded-lg border border-gray-300 bg-white">
            {filteredOptions.length > 0 ? (
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
              // ไม่แสดงรายการเพิ่มใหม่ในกรณีที่ไม่มีตัวเลือก
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
              className="flex items-center rounded-full bg-pink-200 px-3 py-1 text-blue-500"
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
        {/* {hobbiesError && (
          <small className="mt-2 block text-red-600">{hobbiesError}</small>
        )} */}
      </div>
    </div>
  );
}
