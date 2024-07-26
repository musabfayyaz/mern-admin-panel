import  { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function RefreshHandler({ setIsAuthenticated }) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {

      const role =  localStorage.getItem("role") === null ||localStorage.getItem("role") === undefined ? "admin" : localStorage.getItem("role")
      setIsAuthenticated(true);
      if (location.pathname === "/" || location.pathname === "/login") {
        navigate(`/${role}`, { replace: false });
       }
    }
  }, [location, navigate, setIsAuthenticated]);

  return null;
}

export default RefreshHandler;
