import { AdminSideBar } from "@/components/admin/AdminSideBar";
import AdminHeader from "@/components/admin/AdminHeader";
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import DeleteConfirmationModal from "@/components/admin/DeleteConfirmationModal";

function MerryPackageAdd() {
  const router = useRouter(); // เรียกใช้ useRouter

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [details, setDetails] = useState([{ id: 1, text: "" }]); // state สำหรับเก็บรายการ Detail โดยเริ่มต้นที่ 1 และ text = ""

  const [packageName, setPackageName] = useState("");
  const [merryLimit, setMerryLimit] = useState("");

  //const [icon, setIcon] = useState(null);

  const handleAddPackage = async () => {
    try {
      // Step 1: อัปโหลด Icon ไปยัง Cloudinary (ถ้าต้องการ)
      // let iconUrl = "";
      //if (icon) {
      //  const formData = new FormData();
      //  formData.append("file", icon);

      // const uploadRes = await axios.post("/api/upload", formData, {
      //   headers: { "Content-Type": "multipart/form-data" },
      //  });
      //  iconUrl = uploadRes.data.url;
      //}

      // Validation ข้อมูลก่อนส่ง
      if (!packageName || !merryLimit === 0) {
        // || details.length
        alert("Please fill in all required fields.");
        return;
      }

      // Step 2: ส่งข้อมูลแพ็กเกจไปยัง API
      const packageData = {
        package_name: packageName,
        merry_limit: parseInt(merryLimit || "0", 10),
        // icon_url: iconUrl,
        details: JSON.stringify(details.map((d) => d.text)) || null,
      };

      console.log("Data to be sent to API:", packageData); // Debug Data ก่อนส่ง

      const res = await axios.post(
        "http://localhost:3000/api/admin/packages",
        packageData,
      );

      if (res.status === 201) {
        alert("Package added successfully!");
        resetForm(); // ล้างฟอร์มหลังจากสำเร็จ
        router.push("/admin/merry-package-list");
      }
    } catch (error) {
      console.error(error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(error.response.data.message);
      } else {
        alert("An unexpected error occurred.");
      }
    }
  };

  // รีเซ็ตฟอร์ม
  const resetForm = () => {
    setPackageName("");
    setMerryLimit("");
    //setIcon(null);
    setDetails([{ id: 1, text: "" }]);
  };

  // addDetail Step2:
  // ใช้ setDetails เพื่อเพิ่ม object ใหม่ใน array ของ state : details
  // เพิ่ม Detail ใหม่
  const addDetail = () => {
    setDetails([...details, { id: details.length + 1, text: "" }]);
  };

  // deleteDetail Step3.3: เรียกใช้ setIsModalOpen เพื่อ false ปิดหน้า Modal
  const closeModal = () => {
    setIsModalOpen(false);
    setDetailToDelete(null);
  };

  // updateDetail Step2: ใช้ map เพื่อวนลูปข้อมูล details
  // เช็คว่า id ตรงกับรายการที่ต้องการแก้ไขหรือไม่
  // ถ้าใช่: สร้าง object ใหม่ โดยเปลี่ยนค่าของ text เป็น value.
  // ถ้าไม่ใช่: คืนค่ารายการเดิม.

  // อัปเดต Detail
  const updateDetail = (id, value) => {
    setDetails(
      details.map((detail) =>
        detail.id === id ? { ...detail, text: value } : detail,
      ),
    );
  };

  // ลบ Detail
  const handleDelete = (id) => {
    setDetails(details.filter((detail) => detail.id !== id));
  };

  {
    /*
    
     const handleIconChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setIcon(e.target.files[0]);
    }
  };
  */
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSideBar />
      {/* Main Content */}
      <main className="flex-1">
        <AdminHeader
          title="Add Package"
          buttons={[
            {
              label: "Cancel",
              type: "secondary",
              onClick: () => router.push("/admin/merry-package-list"),
            },
            {
              label: "Create",
              type: "primary",
              onClick: handleAddPackage,
            },
          ]}
        />
        <div className="mx-auto p-8">
          <div className="mx-auto max-w-5xl rounded-lg bg-white p-8 shadow">
            <div className="mb-8 grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="packageName"
                  className="block font-medium text-gray-700"
                >
                  Package name <span className="text-red-500">*</span>
                </label>
                <input
                  id="packageName"
                  type="text"
                  value={packageName}
                  onChange={(e) => setPackageName(e.target.value)}
                  className="mt-1 h-12 w-full rounded-md border-2 border-gray-300 px-4 shadow-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="merryLimit"
                  className="block font-medium text-gray-700"
                >
                  Merry limit <span className="text-red-500">*</span>
                </label>
                <select
                  id="merryLimit"
                  value={merryLimit}
                  onChange={(e) => setMerryLimit(e.target.value)}
                  className="mt-1 h-12 w-full rounded-md border-2 border-gray-300 px-4 shadow-sm"
                >
                  <option value=""></option>
                  <option value="25">25</option>
                  <option value="45">45</option>
                  <option value="70">70</option>
                </select>
              </div>
            </div>

            {/* Upload Icon */}
            <div className="mb-8">
              <label
                htmlFor="icon-upload"
                className="block font-medium text-gray-700"
              >
                Icon <span className="text-red-500">*</span>
              </label>
              <div className="mt-4 flex h-32 w-32 items-center justify-center rounded-3xl border-gray-300 bg-gray-100">
                <button className="text-primary-500">
                  <span className="text-3xl">+</span>
                  <p className="text-sm">Upload icon</p>
                </button>
              </div>
            </div>

            <hr className="my-8 border-gray-300" />

            {/* Package Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700">
                Package Detail
              </h3>

              {/* addDetail Step3:
               1. ใช้ .map เพื่อวนลูป State: details
               2. key={detail.id}  ใช้ id เป็น key เพื่อช่วย React แยกแยะ element แต่ละตัว 
               3. แสดงค่าจาก detail.text ใน <input>
              */}
              {details.map((detail) => (
                <div
                  key={detail.id}
                  className="mt-4 flex items-center space-x-4"
                >
                  <span className="cursor-move text-gray-400">⋮⋮</span>
                  <label className="w-full">
                    <input
                      type="text"
                      placeholder="Enter detail"
                      value={detail.text}
                      //updateDetail Step1: เก็บค่า key={detail.id} และ e.target.value
                      onChange={(e) => updateDetail(detail.id, e.target.value)}
                      id={`detail-${detail.id}`}
                      name={`detail-${detail.id}`}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </label>
                  {/* deleteDetail Step1: เรียกใช้ function confirmDelete และส่งค่า detail.id ของแถวนั้นๆ */}
                  <button
                    onClick={() => handleDelete(detail.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    Delete
                  </button>
                </div>
              ))}
              {/* Add Detail Button */}
              <div className="mt-6">
                <button
                  // addDetail Step1:  onClick to Function > addDetail
                  onClick={addDetail}
                  className="rounded-lg bg-pink-100 px-4 py-2 text-pink-500 hover:bg-pink-200"
                >
                  + Add detail
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirm Modal */}
      <DeleteConfirmationModal
        isOpen={isModalOpen} // isModalOpen = true เปิดใช้งาน
        onClose={closeModal} // deleteDetail Step3.2: เรียกใช้ function closeModal เพื่อยกเลิก
        onConfirm={handleDelete} // ลบรายการโดยกดยืนยัน deleteDetail Step5: เรียกใข้ function: handleDelete
        message="Are you sure you want to delete this detail?"
        confirmLabel="Yes, I want to delete"
        cancelLabel="No, I don't want"
      />
    </div>
  );
}

export default MerryPackageAdd;