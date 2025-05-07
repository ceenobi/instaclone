import { useRef, useCallback, useEffect } from "react";

export default function useInfiniteScroll({
  loading,
  hasMore,
  setPage,
  root = null,
  rootMargin = "0px 0px 400px 0px",
  threshold = 1.0,
}) {
  const observer = useRef(null);

  const lastPostRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new window.IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            setPage((prev) => prev + 1);
          }
        },
        { root, rootMargin, threshold }
      );

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, setPage, root, rootMargin, threshold]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, []);

  return lastPostRef;
}
