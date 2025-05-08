import Container from "../components/Container";
import { useNavigate } from "react-router";

export default function NotFoundRoute() {
  const navigate = useNavigate();
  return (
    <Container classname="container">
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h1 className="font-bold text-4xl">OOPS!</h1>
          <p>The page you are looking for does not exist</p>
          <p>Let's help you get back</p>
          <button
            className="mt-4 btn bg-[var(--wine-red)] text-white rounded-md"
            onClick={() => navigate("/")}
          >
            Go Back
          </button>
        </div>
      </div>
    </Container>
  );
}
