import { motion } from "framer-motion";
import { CustomButton } from "../CustomUi";
import { useRouter } from "next/router";

export default function MatchAnimation({ matchChatId }) {
  const router = useRouter();

  return (
    <div className="relative flex h-full w-full justify-center gap-6">
      {/* รูปแรกที่วิ่งมาจากซ้าย */}
      <motion.div
        initial={{ opacity: 0, x: -100, scale: 0.5 }} // เริ่มต้นจากซ้ายมือ และมีขนาดเล็ก
        animate={{ opacity: 1, x: 0, scale: 1 }} // วิ่งมาที่ตำแหน่งกลางและขยายขนาด
        whileHover={{ scale: 1.1 }} // เพิ่มขนาดเมื่อ hover
        transition={{
          duration: 1,
          type: "spring", // ใช้ spring animation สำหรับการเคลื่อนไหวที่เร็วและพุ่ง
          stiffness: 300, // ความตึงของสปริง
          damping: 10, // ค่าการลดแรงกระตุ้น
        }}
        className="absolute -top-[4rem] mr-9"
        style={{ zIndex: 1 }}
      >
        <img
          src="/images/merry/merry.svg" // ใส่ path ของภาพให้ถูกต้อง
          alt="example"
          className="rounded-lg"
        />
      </motion.div>

      {/* รูปที่สองที่วิ่งมาจากขวา */}
      <motion.div
        initial={{ opacity: 0, x: 100, scale: 0.5 }} // เริ่มต้นจากขวามือ และมีขนาดเล็ก
        animate={{ opacity: 1, x: 0, scale: 1 }} // วิ่งมาที่ตำแหน่งกลางและขยายขนาด
        whileHover={{ scale: 1.1 }} // เพิ่มขนาดเมื่อ hover
        transition={{
          duration: 1,
          type: "spring", // ใช้ spring animation สำหรับการเคลื่อนไหวที่เร็วและพุ่ง
          stiffness: 300, // ความตึงของสปริง
          damping: 10, // ค่าการลดแรงกระตุ้น
        }}
        className="absolute -top-[4rem] ml-9"
        style={{ zIndex: 1 }}
      >
        <img
          src="/images/merry/merry.svg" // ใส่ path ของภาพให้ถูกต้อง
          alt="example"
          className="rounded-lg"
        />
      </motion.div>

      {/* รูป Merry Match! ที่อยู่บนสุด */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }} // เริ่มต้นที่ขนาด 0
        animate={{
          opacity: 1,
          scale: 1,
          x: [0, 10, -10, 0], // เพิ่มการขยับไปทางซ้ายและขวาเล็กน้อย
        }} // ขยายขนาดจนเต็ม
        whileHover={{ scale: 1.1 }} // เพิ่มขนาดเมื่อ hover
        transition={{
          duration: 1,
          type: "spring", // ใช้ spring animation สำหรับการเคลื่อนไหวที่เร็วและพุ่ง
          stiffness: 300, // ความตึงของสปริง
          damping: 20, // ค่าการลดแรงกระตุ้น
        }}
        className="absolute top-0"
        style={{ zIndex: 5 }}
      >
        <img
          src="/images/merry/Merry Match!.svg" // ใส่ path ของภาพให้ถูกต้อง
          alt="example"
          className="rounded-lg"
        />
      </motion.div>

      {/* Button */}
      <div className="absolute top-[5rem] flex justify-center">
        <CustomButton
          buttonType="secondary"
          className="h-11 px-6"
          onClick={() => router.push(`/chat/${matchChatId}`)}
        >
          Start Conversation
        </CustomButton>
      </div>
    </div>
  );
}
