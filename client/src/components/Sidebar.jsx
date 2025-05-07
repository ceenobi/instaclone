import InstaShots from "../assets/logo_instagram.png";
import { NavLink } from "react-router";
import { sidebarLinks } from "../libs/constants";
import Search from "./Search";
import CreatePost from "./CreatePost";
import { useAuth } from "../store";

export default function Sidebar() {
  const { user, handleLogout } = useAuth();

  return (
    <div className="hidden md:block min-h-screen fixed z-50 shadow border-r border-gray-200 w-[220px] xl:w-[240px]">
      <div className="flex flex-col min-h-screen justify-between py-6 px-4">
        <div>
          <div className="flex gap-3 items-center mb-10">
            <img src={InstaShots} className="w-[40px] h-[40px]" />
            <h1 className="text-2xl font-bold italic">Instashots</h1>
          </div>
          <div className="flex flex-col gap-2">
            {sidebarLinks.map(({ id, name, path, Icon }) => (
              <NavLink
                to={path}
                key={id}
                className="tooltip tooltip-right z-50"
                data-tip={name}
              >
                {({ isActive }) => (
                  <span
                    className={`flex items-center gap-3 p-2 hover:font-bold hover:transition duration-150 ease-out text-lg rounded-lg ${
                      isActive
                        ? "font-bold bg-[#8D0D76] text-white"
                        : "hover:bg-zinc-100 hover:text-zinc-800"
                    }`}
                  >
                    <i className={`${Icon} text-2xl`}></i> {name}
                  </span>
                )}
              </NavLink>
            ))}
            <Search />
            <CreatePost />
            <NavLink
              to={`/profile/${user?.username}`}
              className="tooltip tooltip-right"
              data-tip="Profile"
            >
              {({ isActive }) => (
                <span
                  className={`flex items-center gap-3 p-2 hover:font-bold hover:transition duration-150 ease-out text-lg rounded-lg ${
                    isActive
                      ? "font-bold bg-[#8D0D76] text-white"
                      : "hover:bg-zinc-100 hover:text-zinc-800"
                  }`}
                >
                  <div className="avatar avatar-placeholder">
                    <div
                      className={`w-7 rounded-full ${
                        !user?.profilePicture ? "border" : ""
                      }`}
                    >
                      {user?.profilePicture ? (
                        <img
                          src={user?.profilePicture}
                          alt={user?.username?.charAt(0)}
                        />
                      ) : (
                        <span className="text-md font-bold">
                          {user?.username?.charAt(0)}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-md">Profile</p>
                </span>
              )}
            </NavLink>
          </div>
        </div>
        <div className="dropdown dropdown-top">
          <div
            className="m-1 flex items-center cursor-pointer"
            role="button"
            tabIndex={0}
          >
            <i className="ri-menu-line text-2xl mr-2"></i>
            <span className="text-lg">More</span>
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box z-1 p-2 shadow-sm w-full"
          >
            <li>
              <NavLink to="/settings" className="text-lg">
                <i className="ri-settings-line text-2xl"></i>Settings
              </NavLink>
            </li>
            <li>
              <a onClick={handleLogout} className="text-lg">
                <i className="ri-logout-box-line text-2xl"></i>Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
