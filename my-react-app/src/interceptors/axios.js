import axios from "axios";

let refresh = false;

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401 && !refresh) {
      refresh = true;
      const refreshToken = localStorage.getItem("refresh_token");
      console.log(refreshToken)

      try {
        const response = await axios.post(
          "http://localhost:8000/token/refresh/",
          {
            refresh: refreshToken,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        if (response && response.status === 200) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.access}`;
          localStorage.setItem("access_token", response.data.access);
          localStorage.setItem("refresh_token", response.data.refresh);
          refresh = false;
          return axios(error.config);
        }
      } catch (refreshError) {
        console.log("failed to refresh the token in axios")
        console.error("Error refreshing token:", refreshError);
        // Handle token refresh error
      }
    }

    refresh = false;
    return Promise.reject(error);
  }
);

export default axios;
