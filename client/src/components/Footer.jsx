import { sidebarLinks } from "../libs/constants";
import { NavLink } from "react-router";
import CreatePost from "./CreatePost";
import Search from "./Search";
import { useAuth } from "../store";

export default function Footer() {
  const { user } = useAuth();
  return (
    <div className="md:hidden sticky bottom-0 z-40 py-2 px-4 bg-white dark:bg-base-200 shadow">
      <div className="flex justify-around items-center">
        {sidebarLinks.map(({ id, path, Icon }) => (
          <NavLink key={id} to={path}>
            {({ isActive }) => (
              <span>
                <i
                  className={`${Icon} text-2xl ${
                    isActive ? "text-secondary" : ""
                  }`}
                ></i>
              </span>
            )}
          </NavLink>
        ))}
        <CreatePost />
        <Search />
        <NavLink to={`/profile/${user?.username}`}>
          <div className="avatar avatar-placeholder">
            <div className={`border w-7 rounded-full`}>
              {user?.profilePicture ? (
                <img
                  src={user?.profilePicture}
                  alt={user?.username}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="text-sm">{user?.username?.charAt(0)}</span>
              )}
            </div>
          </div>
        </NavLink>
      </div>
    </div>
  );
}
