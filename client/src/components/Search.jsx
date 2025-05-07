import { useState, useEffect } from "react";
import { useAuth } from "../store";
import { searchUsers } from "../api/auth";
import { Link } from "react-router";

export default function Search() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const { accessToken } = useAuth();

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (searchTerm.trim()) {
        setIsLoading(true);
        try {
          const res = await searchUsers(searchTerm, accessToken);
          setData(res.data.users);
        } catch (error) {
          setError(
            error?.response?.data?.message ||
              error?.response?.data?.error ||
              error?.response?.data ||
              error?.message ||
              "An unexpected error has ocurred"
          );
        } finally {
          setIsLoading(false);
        }
      }
    }, 500);
    return () => clearTimeout(searchTimeout);
  }, [searchTerm, accessToken]);

  return (
    <>
      <div
        className="hidden tooltip tooltip-right md:flex gap-3 items-center p-2 cursor-pointer hover:font-bold hover:text-zinc-800 hover:transition duration-150 ease-out rounded-lg z-50 hover:bg-zinc-100"
        data-tip="Search"
        onClick={isOpen ? handleClose : handleOpen}
      >
        <i className="ri-search-line text-2xl" />
        <span className="text-lg">Search</span>
      </div>
      <i
        className="ri-search-line text-2xl md:hidden"
        onClick={isOpen ? handleClose : handleOpen}
      />
      <div
        className={`drawer fixed top-0 md:left-[0px] z-50 ${
          isOpen ? "drawer-open" : ""
        }`}
      >
        <input
          type="checkbox"
          className="drawer-toggle"
          checked={isOpen}
          onChange={() => setIsOpen(!isOpen)}
        />
        <div className="drawer-side">
          <label
            className="drawer-overlay"
            onClick={() => setIsOpen(false)}
          ></label>
          <div className="menu w-90 h-screen bg-base-200 text-base-content p-4">
            <div className="md:mt-2 mb-4">
              <h1 className="text-lg font-bold mb-2">Search</h1>
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                type="button"
                onClick={handleClose}
              >
                ✕
              </button>
              <form role="search" id="search-InstaShots" className="relative">
                <input
                  type="text"
                  placeholder="Search users"
                  className="input input-bordered w-full"
                  value={searchTerm}
                  aria-label="Search"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {isLoading ? (
                  <span className="loading loading-dots loading-xs absolute top-1/2 right-0 transform -translate-x-1/2 -translate-y-1/2"></span>
                ) : (
                  <button
                    type="button"
                    className="absolute top-1/2 right-0 transform -translate-x-1/2 -translate-y-1/2"
                    onClick={() => setSearchTerm("")}
                  >
                    <i className="ri-close-circle-line text-xl cursor-pointer"></i>
                  </button>
                )}
              </form>
              <div className="divider"></div>
              {error && <p className="text-red-500">{error}</p>}
              {searchTerm && data?.length === 0 ? (
                <p className="text-center p-3">No results found</p>
              ) : (
                <>
                  {data?.map((result) => (
                    <Link
                      to={`/profile/${result.username}`}
                      className="flex items-center gap-4 hover:bg-base-300 p-3 rounded-lg"
                      key={result.id}
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="avatar avatar-placeholder">
                        <div className="w-10 rounded-full border border-gray-300">
                          {result.profilePicture ? (
                            <img
                              src={result.profilePicture}
                              alt={result.username}
                              loading="lazy"
                            />
                          ) : (
                            <span className="text-3xl">
                              {result.username?.charAt(0)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold">{result.username}</p>
                        <p className="text-sm">{result.fullname}</p>
                      </div>
                    </Link>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
