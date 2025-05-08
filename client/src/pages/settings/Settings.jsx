import { NavLink, Outlet, useNavigate, useLocation } from "react-router";
import { useEffect } from "react";
import Container from "../../components/Container";
import MetaArgs from "../../components/MetaArgs";
import { settingsLinks } from "../../libs/constants";
import { useAuth } from "../../store";
import TimeAgo from "timeago-react";

export default function Settings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname === "/settings";

  useEffect(() => {
    if (path) {
      navigate("/settings/update-password");
    }
  }, [navigate, path]);

  const formatTime = (time) => {
    return <TimeAgo datetime={time} locale="en-US" />;
  };

  return (
    <>
      <MetaArgs title="Your Instashots settings" content="Settings page" />
      <Container classname="container mx-auto px-4">
        <div className="grid grid-cols-12">
          <div className="col-span-12 md:col-span-3 lg:min-h-screen">
            <h1 className="mt-6 text-xl font-bold mb-6">Settings</h1>
            <div className="py-4 px-4">
              {settingsLinks.map(({ id, path, name, Icon }) => (
                <NavLink
                  key={id}
                  className="flex flex-col justify-center items-center mb-4"
                  to={`/settings${path}`}
                >
                  {({ isActive }) => (
                    <span
                      className={`rounded-lg p-3 flex gap-2 items-center w-full ${
                        isActive
                          ? "font-semibold bg-base-300 hover:text-neutral"
                          : "border"
                      }`}
                    >
                      <i className={`${Icon} text-2xl`}></i>
                      {name}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
          <div className="col-span-12 md:col-span-9">
            <div className="max-w-[600px] mx-auto py-8 px-4">
              <div className="flex justify-between items-center rounded-lg bg-base-300 p-4">
                <div className="hidden lg:flex gap-4 items-center">
                  <div className="avatar avatar-placeholder">
                    <div className={`border w-12 rounded-full`}>
                      {user?.profilePicture ? (
                        <img
                          src={user?.profilePicture}
                          alt={user?.username}
                          loading="lazy"
                        />
                      ) : (
                        <span className="text-md">
                          {user?.username?.charAt(0)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold">{user?.username}</p>
                    <p>{user?.fullname}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Date registered: {formatTime(user?.createdAt)}
                </p>
              </div>
              <Outlet />
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
