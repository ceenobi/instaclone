import { explorePost } from "../../api/post";
import Container from "../../components/Container";
import MetaArgs from "../../components/MetaArgs";
import useFetch from "../../hooks/useFetch";
import { useAuth } from "../../store";
import { Link } from "react-router";
import { DataSpinner } from "../../components/Spinner";

export default function Explore() {
  const { accessToken } = useAuth();
  const { data, loading } = useFetch({
    apiCall: explorePost,
    params: [accessToken],
  });

  return (
    <>
      <MetaArgs
        title="Explore Instashot feed - Discover new posts"
        content="discover posts"
      />
      {loading ? (
        <DataSpinner />
      ) : (
        <Container classname="max-w-[950px] px-4">
          {data?.randomPosts?.length > 0 ? (
            <>
              <div className="my-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                {data?.randomPosts?.map((post) => (
                  <Link
                    key={post._id}
                    to={`/post/${post._id}`}
                    className="aspect-square group relative overflow-hidden rounded-md"
                  >
                    <img
                      src={post.media[0]}
                      alt={post.caption}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 rounded-md"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
                      <div>
                        <p className="text-white font-medium">{post.caption}</p>
                      </div>
                      <div className="mx-2">
                        <i className="ri-heart-fill text-xl text-white"></i>{" "}
                        <span className="text-white">{post.likes?.length}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
              <i className="ri-error-warning-line text-gray-400 text-3xl" />
              <h1 className="text-xl font-semibold text-gray-600">
                Nothing to show yet
              </h1>
              <p className="text-gray-500">
                View, like, save, and comment in order to get recommendations
              </p>
            </div>
          )}
        </Container>
      )}
    </>
  );
}
