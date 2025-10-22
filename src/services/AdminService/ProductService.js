import api from "../Api";


export const GetProducts = async (search = "", pageNumber = null, pageSize = null) => {
  try {
    const res = await api.get("/Product", {
      params: { search, pageNumber, pageSize },
    });
    return res.data.data; 
  } catch (err) {
    console.error("GetProducts error:", err);
    throw err.response?.data || err;
  }
};

export const GetProductById = async (id) => {
  try {
    const res = await api.get(`/Product/${id}`);
    return res.data.data;
  } catch (err) {
    console.error("GetProductById error:", err);
    throw err.response?.data || err;
  }
};

export const GetProductsByCategory = async (categoryId, pageNumber = null, pageSize = null) => {
  try {
    const res = await api.get(`/Product/category/${categoryId}`, {
      params: { pageNumber, pageSize },
    });
    return res.data.data;
  } catch (err) {
    console.error("GetProductsByCategory error:", err);
    throw err.response?.data || err;
  }
};

export const GetFilteredProducts = async (filter = "") => {
  try {
    const res = await api.get("/Product/filter", {
      params: { filter },
    });
    return res.data;
  } catch (err) {
    console.error("GetFilteredProducts error:", err);
    throw err.response?.data || err;
  }
};

export const AddProduct = async (formData) => {
  try {
    const res = await api.post("/Product", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    console.error("AddProduct error:", err);
    throw err.response?.data || err;
  }
};

export const UpdateProduct = async (formData) => {
  try {
    const res = await api.put("/Product", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    console.error("UpdateProduct error:", err);
    throw err.response?.data || err;
  }
};

export const ToggleDeleteProduct = async (id) => {
  try {
    const res = await api.patch(`/Product`, null, {
      params: { id },
    });
    return res.data;
  } catch (err) {
    console.error("ToggleDeleteProduct error:", err);
    throw err.response?.data || err;
  }
};
