import { motion } from "framer-motion";

export default function LoadingMerry() {
  return (
    <div>
      {/* ใช้ relative เพื่อให้รูปภาพทับกัน */}
      <div className="relative flex h-screen items-center justify-center">
        {/* ภาพหมุนชั้นนอก */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute"
        >
          <img
            src="/images/merry/merry.svg" // ใช้ path ของภาพที่ต้องการ
            alt="Outer Layer"
            className="h-64 w-64"
          />
        </motion.div>

        {/* ภาพหมุนชั้นกลาง */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
            rotate: [0, 360],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute"
        >
          <img
            src="/images/merry/merry.svg" // ใช้ path ของภาพที่ต้องการ
            alt="Middle Layer"
            className="h-48 w-48"
          />
        </motion.div>

        {/* ภาพหมุนชั้นใน */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 1, 0.5],
            rotate: [-360, 0],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute"
        >
          <img
            src="/images/merry/merry.svg" // ใช้ path ของภาพที่ต้องการ
            alt="Inner Layer"
            className="h-32 w-32"
          />
        </motion.div>

        {/* ภาพ Loading */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute mt-80"
        >
          <img
            src="/images/merry/Merry Match!.svg" // ใช้ path ของภาพที่ต้องการ
            alt="Loading Text"
            className="h-16"
          />
        </motion.div>
      </div>
    </div>
  );
}
