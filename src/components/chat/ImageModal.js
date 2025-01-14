import { FiX } from "react-icons/fi";
import { useChat } from "@/contexts/socket/ChatContext";

export default function ImageModal() {
  const { selectedImage, setSelectedImage } = useChat();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-utility-second bg-opacity-85 px-4 py-20 md:p-20"
      onClick={() => setSelectedImage(null)}
    >
      <button
        className="absolute right-5 top-5 text-utility-primary transition-colors duration-300 hover:text-fourth-300"
        onClick={(e) => {
          e.stopPropagation();
          setSelectedImage(null);
        }}
      >
        <FiX className="size-7" />
      </button>

      <img
        src={selectedImage}
        alt=""
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="max-h-full max-w-full rounded-2xl object-contain"
      />
    </div>
  );
}
