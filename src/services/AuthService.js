import api from "./Api";

export const registerUser = async (data) => {
  try {
    const res = await api.post("/Auth/register", data);
    return res.data;
  } catch (err) {
    console.error(err);
    throw err.response?.data || err;
  }
};

export const loginUser = async (data) => {
  try {
    const res = await api.post("/Auth/login", data);

    const accessToken = res.data?.data?.accessToken;
    const refreshToken = res.data?.data?.refreshToken;

    if (accessToken) {
      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    }

    return { success: true, accessToken, refreshToken };
  } catch (err) {
    console.error(err);
    return { success: false, error: err.response?.data?.message || "Login failed" };
  }
};

export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("No refresh token found");

    const res = await api.post("/Auth/refresh-token", { refreshToken });

    const newAccessToken = res.data?.data?.accessToken;
    const newRefreshToken = res.data?.data?.refreshToken;

    if (newAccessToken) {
      localStorage.setItem("token", newAccessToken);
      localStorage.setItem("refreshToken", newRefreshToken);
    }

    return { success: true, newAccessToken, newRefreshToken };
  } catch (err) {
    console.error("Token refresh failed:", err);
    return { success: false, error: err.response?.data?.message || "Token refresh failed" };
  }
};

export const revokeToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("No refresh token found");

    const res = await api.post("/Auth/revoke-token", { refreshToken });

    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");

    return { success: true, message: res.data?.message || "Token revoked successfully" };
  } catch (err) {
    console.error("Token revoke failed:", err);
    return { success: false, error: err.response?.data?.message || "Token revoke failed" };
  }
};
