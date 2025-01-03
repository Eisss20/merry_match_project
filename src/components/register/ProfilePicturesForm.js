import React from "react";
const ProfilePicturesForm = ({
  avatar,
  handleFileChange,
  handleRemoveImage,
  avatarError,
  disabled,
}) => {
  return (
    <form
      className="w-full max-w-4xl space-y-4 rounded-lg p-6"
      encType="multipart/form-data"
    >
      <h1 className="mb-4 font-nunito text-2xl text-[24px] font-bold leading-[30px] tracking-[-2%] text-second-500">
        Profile pictures
      </h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <label className="form-control">
          {/* แสดงข้อความ error ถ้ามี */}
          {avatarError && (
            <small className="ml-2 pt-2 text-red-600">{avatarError}</small>
          )}
        </label>
      </div>
      <div className="mx-auto flex h-auto w-full flex-wrap gap-4 rounded-lg border-gray-300 p-4 lg:w-[931px]">
        {Object.keys(avatar).map((avatarKey, index) => (
          <div
            key={avatarKey}
            className="relative h-[120px] w-[120px] flex-shrink-0 cursor-pointer rounded-lg border-2 border-gray-300 sm:h-[140px] sm:w-[140px] lg:h-[167px] lg:w-[167px]"
          >
            <img
              src={URL.createObjectURL(avatar[avatarKey])}
              alt={`profile-${avatarKey}`}
              className="h-full w-full rounded-lg object-cover"
            />
            <button
              type="button"
              onClick={(event) => handleRemoveImage(event, avatarKey)}
              className="absolute right-[-5px] top-[-10px] flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xl text-white hover:bg-red-700"
            >
              x
            </button>
          </div>
        ))}
        {Object.keys(avatar).length < 5 && (
          <div className="relative h-[120px] w-[120px] flex-shrink-0 cursor-pointer rounded-lg border-2 border-gray-300 sm:h-[140px] sm:w-[140px] lg:h-[167px] lg:w-[167px]">
            <label
              htmlFor="upload"
              className="flex h-full w-full items-center justify-center text-sm text-gray-500"
            >
              {Object.keys(avatar).length === 0 ? (
                <span>คลิกเพื่อเลือกไฟล์</span>
              ) : (
                <span>เลือกไฟล์ใหม่</span>
              )}
              <input
                id="upload"
                name="avatar"
                type="file"
                placeholder="Enter last name here"
                onChange={handleFileChange}
                className="absolute z-10 h-full w-full cursor-pointer opacity-0"
              />
            </label>
          </div>
        )}
      </div>
    </form>
  );
};
export default ProfilePicturesForm;
