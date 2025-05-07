import { NavLink } from "react-router";
import InstaShots from "../assets/logo_instagram.png";
import { useAuth } from "../store";

export default function Nav() {
  const { handleLogout } = useAuth();
  return (
    <div className="md:hidden w-full fixed top-0 z-40 py-2 px-4 shadow bg-white dark:bg-base-200">
      <div className="flex justify-between items-center">
        <NavLink
          to="/"
          className="text-2xl font-bold italic flex items-center gap-1"
        >
          <img src={InstaShots} alt="logo" className="w-[40px] h-[40px]" />
          <span>Instashots</span>
        </NavLink>
        <div className="flex gap-4 items-center px-4">
          <NavLink to="/settings">
            <i className="ri-settings-line text-2xl"></i>
          </NavLink>
          <a onClick={handleLogout}>
            <i className="ri-shut-down-line text-2xl"></i>
          </a>
        </div>
      </div>
    </div>
  );
}
