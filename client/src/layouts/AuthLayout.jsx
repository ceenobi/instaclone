import AuthImage from "../assets/AuthImage.png";
import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <section className="max-w-[960px] mx-auto flex justify-center gap-8 min-h-screen py-[50px] bg-white">
      <div className="hidden lg:block ml-auto lg:w-[400px] h-[565px]">
        <img
          src={AuthImage}
          alt="AuthImage"
          className="w-full h-full rounded-md"
        />
      </div>
      <div className="md:w-[50%]">
        <Outlet />
      </div>
    </section>
  );
}
