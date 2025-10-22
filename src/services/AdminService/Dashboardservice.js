// dashboardService.js
import api from "../Api";

export const GetDashboard = async () => {
  try {
    const res = await api.get("/DashBoard", { params: { type: "all" } });
    return res.data;
  } catch (err) {
    console.error(err);
    throw err.response?.data || err;
  }
};