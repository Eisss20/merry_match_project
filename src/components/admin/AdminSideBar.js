import { useRouter } from "next/router";
import { IoCubeSharp } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import { IoIosWarning } from "react-icons/io";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import Link from "next/link";

export function AdminSideBar() {
  const { logout } = useAdminAuth(); // ใช้ logout จาก Context
  const router = useRouter(); // ใช้ useRouter เพื่อดึง pathname
  return (
    <aside className="w-64 border-r bg-white">
      <div className="flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-bold text-utility-second">
          Merry<span className="text-primary-500">Match</span>
        </h1>
        <h2 className="text-xs leading-9 text-fourth-700">
          Admin panel Control
        </h2>
      </div>
      <nav>
        <ul className="space-y-2">
          <li>
            <Link
              href="/admin/merry-package-list"
              className={`flex items-center rounded-lg px-6 py-3 ${
                router.pathname === "/admin/merry-package-list"
                  ? "bg-gray-200 text-gray-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <IoCubeSharp className="text-2xl text-primary-200" />
              <span className="ml-3 font-extrabold">Merry Package</span>
            </Link>
          </li>
          <li>
            <Link
              href="/admin/complaint-list"
              className={`flex items-center rounded-lg px-6 py-3 ${
                router.pathname === "/admin/complaint-list"
                  ? "bg-gray-200 text-gray-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <IoIosWarning className="text-2xl text-primary-200" />
              <span className="ml-3 font-extrabold">Complaint</span>
            </Link>
          </li>

          <li>
            <button
              onClick={logout}
              className="mt-80 flex w-full items-center rounded-lg border-t border-gray-300 px-5 py-6 text-gray-600 hover:bg-gray-100"
            >
              <MdLogout className="text-2xl text-primary-200" />
              <span className="ml-3 font-extrabold">Log out</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
