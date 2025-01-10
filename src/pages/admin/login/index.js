import { NavBarAdmin } from "@/components/admin/NavBarAdmin";
import { CustomButton, CardImage } from "@/components/CustomUi";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { useState } from "react";
import { MdError } from "react-icons/md";

import Link from "next/link";

function CustomInput({
  type,
  onChange,
  label = "Label",
  placeholder,
  className = "",
  value,
  error = null,
}) {
  let customStyle =
    `input border-fourth-400 bg-utility-primary text-utility-second transition-colors duration-300 hover:border-second-500 focus:border-second-500 focus:outline-none ${className}`.trim();

  if (error) {
    customStyle += " border-utility-third";
  }

  return (
    <label className="form-control w-full">
      <div className="label p-1">
        <span className="label-text text-utility-second">{label}</span>
      </div>
      <div className="relative flex items-center">
        <input
          type={type}
          placeholder={placeholder}
          className={customStyle}
          value={value}
          onChange={onChange}
        />
        {error && <MdError className="absolute right-3 text-utility-third" />}
      </div>
      {error && <p className="p-1 text-sm text-utility-third">{error}</p>}
    </label>
  );
}

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { state, error, login } = useAdminAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Login Attempt with:", { username, password });
    await login({ username, password });
  };

  return (
    <main className="flex min-h-screen flex-col bg-utility-bgMain">
      <NavBarAdmin />

      {/* Login section */}
      <article className="container mx-auto flex w-full flex-grow flex-col items-center justify-center gap-10 px-5 py-12 lg:flex-row lg:gap-0 lg:p-10 xl:p-20">
        {/* Image section */}
        <figure className="flex items-center justify-center lg:w-1/2 lg:px-12">
          <CardImage className="h-[25rem] w-[15rem] lg:h-[40rem] lg:w-[25rem]">
            <img
              src="/images/login_page_man.jpg"
              alt="Man smiling while using laptop"
              className={`h-full w-full object-cover object-right grayscale`}
            />
          </CardImage>
        </figure>

        {/* Form section */}
        <div className="flex w-full flex-col gap-8 self-start lg:w-1/2 lg:self-auto lg:p-12">
          <header className="flex flex-col gap-1">
            <h2 className="text-third-700">LOGIN</h2>
            <h1 className="text-3xl font-extrabold leading-tight text-second-500 lg:text-5xl">
              Welcome <br className="hidden lg:inline xl:hidden" /> back to
              <br className="inline sm:hidden lg:inline" /> Merry Match
            </h1>
          </header>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-8"
            role="main"
          >
            <CustomInput
              type="text"
              label="Username or Email"
              placeholder="Enter Username or Email"
              className="w-full"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={error?.username || error?.general} // แสดงข้อความ error ของ username
            />

            <CustomInput
              type="password"
              label="Password"
              placeholder="Enter password"
              className="w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={error?.password || error?.general} // แสดงข้อความ error ของ password
            />

            <CustomButton type="submit" buttonType="primary" className="w-full">
              Log in
            </CustomButton>
          </form>

          <div className="flex items-center gap-3">
            <p className="hidden text-utility-second">Don't have an account?</p>
            <Link
              href="/register"
              className="hidden font-bold text-primary-500 transition-colors duration-300 hover:text-primary-600"
            >
              Register
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
