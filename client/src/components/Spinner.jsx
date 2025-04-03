import Instagram from "../assets/logo_instagram.png";

export function LazySpinner() {
  return (
    <div className="flex flex-col gap-2 justify-center items-center h-screen relative">
      <img src={Instagram} alt="logoInstagram" className="w-[75px] h-[75px]" />
      <h1 className="text-md text-gray-500 absolute top-[90%]">
        &copy; {new Date().getFullYear()} InstaShots
      </h1>
    </div>
  );
}

export function DataSpinner() {
  return (
    <div className="flex justify-center items-center h-screen">
      <span className="loading loading-bars loading-md bg-[#8D0D76]"></span>
    </div>
  );
}
