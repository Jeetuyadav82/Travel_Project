// Frontend Component
import React, { useEffect } from "react";
import axios from "./interceptors/axios";

const Logout = () => {
  useEffect(() => {
    (async () => {
      try {
        const response = await axios.post(
          "http://localhost:8000/logout/",
          {
            refresh_token: localStorage.getItem("refresh_token"),
            access_token: localStorage.getItem("access_token"),
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        console.log("Logout success:", response.data);
        localStorage.clear();
        axios.defaults.headers.common["Authorization"] = null;
        window.location.href = "/login";
      } catch (error) {
        console.error("Logout failed:", error);
      }
    })();
  }, []);

  return <div>Logging out...</div>;
};

export default Logout;
