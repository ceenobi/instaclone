import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

export default function LazyLoadComponent({ image, classname, alt }) {
  return (
    <LazyLoadImage
      effect="blur"
      alt={alt || "images"}
      width="100%"
      src={image}
      className={classname}
    />
  );
}
