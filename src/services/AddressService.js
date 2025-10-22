import api from "./Api";

export const GetUserAddresses = async () => {
  try {
    const res = await api.get(`/Address`);
    return res.data;
  } catch (err) {
    console.error("GetUserAddresses error:", err);
    throw err.response?.data || err;
  }
};

export const GetAddressById = async (id) => {
  try {
    const res = await api.get(`/Address/${id}`);
    return res.data;
  } catch (err) {
    console.error(`GetAddressById error (id: ${id}):`, err);
    throw err.response?.data || err;
  }
};

export const CreateAddress = async (dto) => {
  try {
    const res = await api.post(`/Address`, dto);
    return res.data;
  } catch (err) {
    console.error("CreateAddress error:", err);
    throw err.response?.data || err;
  }
};

export const UpdateAddress = async (id, dto) => {
  try {
    const res = await api.put(`/Address/${id}`, dto);
    return res.data;
  } catch (err) {
    console.error(`UpdateAddress error (id: ${id}):`, err);
    throw err.response?.data || err;
  }
};

export const DeleteAddress = async (id) => {
  try {
    const res = await api.delete(`/Address/${id}`);
    return res.data;
  } catch (err) {
    console.error(`DeleteAddress error (id: ${id}):`, err);
    throw err.response?.data || err;
  }
};
