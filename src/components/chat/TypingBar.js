import { IoSend } from "react-icons/io5";
import { PiImageFill } from "react-icons/pi";
import { BiSolidImageAdd } from "react-icons/bi";
import { FiX } from "react-icons/fi";

import axios from "axios";
import { useState } from "react";

import { useChat } from "@/contexts/socket/ChatContext";
import { useSocketConnection } from "@/contexts/socket/SocketConnectionContext";

export default function TypingBar() {
  const [inputMessage, setInputMessage] = useState("");
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  const { socket, userId } = useSocketConnection();
  const { chatRoomId, imageFiles, setImageFiles, setSelectedImage } = useChat();

  // File input handle
  const handleFileChange = (event) => {
    setFileInputKey(Date.now());

    const files = [...event.target.files];
    const newImageFiles = { ...imageFiles };

    files.forEach((file, index) => {
      const isDuplicate = Object.values(newImageFiles).some(
        (existingFile) =>
          existingFile.name === file.name &&
          existingFile.lastModified === file.lastModified,
      );

      if (!isDuplicate) {
        const uniqueId = Date.now() + index;
        newImageFiles[uniqueId] = file;
      }
    });

    setImageFiles(newImageFiles);
  };

  // Remove image from input
  const handleRemoveImage = (event, imageFilesKey) => {
    event.preventDefault();
    URL.revokeObjectURL(imageFiles[imageFilesKey]);

    const updatedImageFiles = { ...imageFiles };
    delete updatedImageFiles[imageFilesKey];
    setImageFiles(updatedImageFiles);
  };

  // Send message
  const sendMessage = async () => {
    const messageType = [];
    const imageUrls = [];
    const inputMessageTrim = inputMessage.trim();

    if (inputMessageTrim) {
      messageType.push("text");
    }

    // Send image file to upload
    if (Object.keys(imageFiles).length > 0) {
      const uploadedImageUrls = await Promise.all(
        Object.values(imageFiles).map((file) => uploadToCloudinary(file)),
      );

      const validImageUrls = uploadedImageUrls.filter((url) => url !== null);
      console.log("Valid Image URLs:", validImageUrls);

      messageType.push("image");
      imageUrls.push(...validImageUrls);
    }

    // Send message to socket
    if (socket && chatRoomId && (inputMessageTrim || imageUrls.length > 0)) {
      socket.emit("sendMessage", {
        chatRoomId,
        inputMessage: inputMessageTrim,
        userId,
        messageType,
        imageUrls,
      });

      setInputMessage("");
      setImageFiles({});
    }
  };

  // Upload image to Cloudinary
  const uploadToCloudinary = async (file) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData,
      );

      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      return null;
    }
  };

  return (
    <div className="w-full">
      <div className="flex min-h-16 w-full items-end gap-5 border-t border-fourth-800 bg-utility-bg px-4 py-4 lg:min-h-20">
        {/* Upload image button */}
        <div className="flex aspect-square h-[54px] items-center justify-center">
          <input
            key={fileInputKey}
            type="file"
            id="upload"
            name="imageUrl"
            onChange={handleFileChange}
            disabled={Object.keys(imageFiles).length >= 5}
            className="hidden"
          />
          <label
            htmlFor="upload"
            className={`flex items-center justify-center rounded-full bg-fourth-100 p-3 text-fourth-600 transition-colors duration-300 ${Object.keys(imageFiles).length < 5 ? "cursor-pointer hover:bg-fourth-300" : "cursor-not-allowed opacity-60"}`}
          >
            <PiImageFill className="size-6" />
          </label>
        </div>

        {/* Text input */}
        <div className="flex w-full min-w-0 flex-col rounded-xl bg-[#1f1118] p-1 transition-colors duration-300 focus-within:bg-[#23161c] hover:bg-[#23161c]">
          {/* Typing section image display */}
          {Object.keys(imageFiles).length > 0 && (
            <div className="scrollable-element flex w-full flex-nowrap items-center gap-5 overflow-x-auto px-3 pb-2 pt-3">
              <div>
                <input
                  key={fileInputKey}
                  type="file"
                  id="upload"
                  name="imageUrl"
                  onChange={handleFileChange}
                  disabled={Object.keys(imageFiles).length >= 5}
                  className="hidden"
                />
                <label
                  htmlFor="upload"
                  className={`flex aspect-square min-w-24 items-center justify-center overflow-hidden rounded-xl bg-second-600 transition-colors duration-300 ${Object.keys(imageFiles).length < 5 ? "cursor-pointer hover:bg-second-500" : "cursor-not-allowed opacity-60"}`}
                >
                  <BiSolidImageAdd
                    className={`size-12 ${Object.keys(imageFiles).length < 5 ? "text-utility-primary" : "text-fourth-500"}`}
                  />
                </label>
              </div>

              {Object.keys(imageFiles).map((imageFilesKey, index) => {
                const image = URL.createObjectURL(imageFiles[imageFilesKey]);

                return (
                  <div
                    key={index}
                    onClick={() => setSelectedImage(image)}
                    className="relative aspect-square min-w-24 max-w-24 cursor-pointer rounded-xl"
                  >
                    <img
                      src={image}
                      alt={`Image-${imageFilesKey}`}
                      className="h-full w-full rounded-xl object-cover transition-opacity duration-300 hover:opacity-85"
                    />

                    {/* Remove image button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(e, imageFilesKey);
                      }}
                      className="absolute -right-2 -top-2 flex items-center justify-center rounded-full bg-second-500 p-1 text-white transition-colors duration-300 hover:bg-second-600"
                    >
                      <FiX className="size-5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            placeholder="Messege here..."
            className="h-full w-full rounded-lg bg-transparent p-3 text-utility-primary placeholder:text-fourth-500 focus:outline-none"
          />
        </div>

        {/* Send button */}
        <div className="flex aspect-square h-[54px] items-center justify-center">
          <button
            type="button"
            className={`flex items-center justify-center rounded-full bg-primary-500 p-3 text-utility-primary transition-colors duration-300 hover:bg-primary-600 active:scale-90`}
            onClick={sendMessage}
          >
            <IoSend className="size-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
