import { Link, useParams } from "react-router";
import { useAuth } from "../../store";
import useFetch from "../../hooks/useFetch";
import { getAllPostsByTag } from "../../api/post";
import { useState } from "react";
import MetaArgs from "../../components/MetaArgs";
import Container from "../../components/Container";

export default function Tag() {
  const [page] = useState(1);
  const [limit] = useState(10);
  const { accessToken } = useAuth();
  const { tag } = useParams();
  const { data } = useFetch({
    apiCall: getAllPostsByTag,
    params: [tag, page, limit, accessToken],
  });

  if (data?.posts?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <i className="ri-error-warning-line text-gray-400 text-3xl" />
        <h1 className="text-xl font-semibold text-gray-600">
          No posts matching <strong>"{tag}"</strong> found
        </h1>
        <p className="text-gray-500">Explore new posts from different tags</p>
      </div>
    );
  }

  return (
    <>
      {" "}
      <MetaArgs
        title={`Explore posts from tag: ${tag}`}
        content="Explore and discover new posts from different tags"
      />
      <Container classname="max-w-[950px]">
        <h1 className="text-3xl font-bold my-4 capitalize">#{tag}</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {data?.posts?.map((post) => (
            <Link
              key={post.id}
              to={`/post/${post.id}`}
              className="aspect-square group relative overflow-hidden rounded-md"
            >
              <img
                src={post.media[0]}
                alt={post.caption}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 rounded-md"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <p className="text-white font-medium text-center">
                  {post.caption}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </>
  );
}
