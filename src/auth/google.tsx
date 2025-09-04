import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const GoogleSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("jwtToken", token);
      navigate("/"); // redirect user after login
    } else {
      navigate("/login");
    }
  }, [searchParams, navigate]);

  return <div>Logging in...</div>;
};

export default GoogleSuccess;
