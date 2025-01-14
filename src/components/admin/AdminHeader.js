// src/components/Header.js

import { FaSearch, FaArrowLeft } from "react-icons/fa";
import { CustomButton } from "@/components/CustomUi";
import { useRouter } from "next/router";
export default function AdminHeader({
  title,
  buttons = [],
  searchPlaceholder = null, // Default เป็น null
  onSearchChange,
  extraContent,
  backButton = false,
}) {
  const router = useRouter();
  // ตรวจสอบ pathname เพื่อแสดงปุ่ม Back เฉพาะในหน้า detail
  const isDetailPage = router.pathname === "/admin/complaint-list/[id]";

  return (
    <header className="mb-6 flex items-center justify-between border-b border-gray-300 bg-white px-16 py-4">
      {/* Title */}
      <div className="flex items-center space-x-2">
        {backButton && ( // แสดงปุ่ม Back เฉพาะในหน้า detail
          <button
            className="text-gray-400 hover:text-gray-500"
            onClick={() => router.back()} // เปลี่ยน path กลับ
          >
            <FaArrowLeft className="text-xl" />
          </button>
        )}

        <h2 className="text-2xl font-bold text-fourth-900">{title}</h2>
        {extraContent && <div>{extraContent}</div>}
      </div>

      {/* Search & Buttons */}
      <div className="flex items-center space-x-4">
        {/* Search Bar */}
        {searchPlaceholder && (
          <div className="flex w-full max-w-sm items-center rounded-lg border border-gray-300 bg-white px-4 py-2">
            <FaSearch className="text-lg text-gray-500" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              className="ml-3 w-full bg-transparent text-gray-700 placeholder-gray-500 focus:outline-none"
              onChange={onSearchChange}
            />
          </div>
        )}

        {/* Action Buttons */}
        {buttons.map((button, index) => {
          if (button.type === "third") {
            return (
              <CustomButton
                key={index}
                onClick={button.onClick}
                buttonType={button.buttonType || "primary"}
                customStyle={button.customStyle || "h-full px-6 py-3"}
              >
                {button.label}
              </CustomButton>
            );
          }

          if (button.type === "dropdown") {
            return (
              <select
                key={index}
                className="w-40 rounded-md border border-gray-300 bg-white px-4 py-2 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                onChange={button.onChange}
              >
                {button.options.map((option, idx) => (
                  <option key={idx} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            );
          }

          /* 
          ก่อนใช้ปุ่ม Disable ที่ package add
          return (
            <button
              key={index}
              onClick={button.onClick}
              disabled={button.disabled} // เพิ่มการจัดการ disabled
              className={`rounded-full px-4 py-2 font-semibold ${
                button.type === "primary"
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-pink-100 text-pink-500 hover:bg-pink-200"
              }`}
            >
              {button.label}
            </button>
          );
*/
          return (
            <button
              key={index}
              onClick={button.onClick}
              disabled={button.disabled} // เพิ่มการจัดการ disabled
              className={`rounded-full px-5 py-2 font-bold ${
                button.type === "primary"
                  ? button.disabled
                    ? "cursor-not-allowed bg-red-300 text-gray-200" // สไตล์เมื่อปุ่มถูก disabled
                    : "bg-primary-500 text-white hover:bg-red-600"
                  : button.disabled
                    ? "cursor-not-allowed bg-pink-50 text-pink-200" // สไตล์เมื่อปุ่ม secondary ถูก disabled
                    : "bg-primary-100 text-primary-600 hover:bg-pink-200"
              }`}
            >
              {button.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}
