import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const GoogleSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token: string | null = searchParams.get("token");
    if (token) {
      localStorage.setItem("authToken", token);
      navigate("/"); // redirect user after login
    } else {
      navigate("/login");
    }
  }, [searchParams, navigate]);

  return <div>Logging in...</div>;
};

export default GoogleSuccess;
