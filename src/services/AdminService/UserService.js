import api from "../Api";

export const GetAllUsers = async (search = "", role = "") => {
  try {
    const res = await api.get("/users", {
      params: { search, role },
    });
    return res.data.data;
  } catch (err) {
    console.error("GetAllUsers error:", err);
    throw err.response?.data || err;
  }
};

export const GetUserById = async (id) => {
  try {
    const res = await api.get(`/users/${id}`);
    return res.data;
  } catch (err) {
    console.error("GetUserById error:", err);
    throw err.response?.data || err;
  }
};
export const GetUser = async () => {
  try {
    const res = await api.get(`/users/me`);
    return res.data;
  } catch (err) {
    console.error("GetUserById error:", err);
    throw err.response?.data || err;
  }
};

export const BlockUnblockUser = async (id) => {
  try {
    const res = await api.put(`/users/${id}`);
    return res.data;
  } catch (err) {
    console.error("BlockUnblockUser error:", err);
    throw err.response?.data || err;
  }
};

export const SoftDeleteUser = async (id) => {
  try {
    const res = await api.delete(`/users/${id}`);
    return res.data;
  } catch (err) {
    console.error("SoftDeleteUser error:", err);
    throw err.response?.data || err;
  }
};
