import api from "./Api";

export const GetCart = async () => {
  try {
    const res = await api.get("/Cart");
    return res.data;
  } catch (err) {
    console.error(err);
    throw err.response?.data || err;
  }
}
export const GetCartById = async (userId) => {
  try {
    const res = await api.get(`/Cart/${userId}`);
    return res.data;
  } catch (err) {
    console.error(err);
    throw err.response?.data || err;
  }
}
export const AddToCart = async (data) => {
  try {
    const res = await api.post("/Cart/Add", data);
    return res.data;
  } catch (err) {
    console.error(err);
    throw err.response?.data || err;
  }
}
export const ClearCart = async () => {
  try {
    const res = await api.delete("/Cart");
    return res.data;
  } catch (err) {
    console.error(err);
    throw err.response?.data || err;
  }
}
export const DeleteCartItem = async (CartItemId) => {
  try {
    const res = await api.delete(`/Cart/${CartItemId}`);
    return res.data;
  } catch (err) {
    console.error(err);
    throw err.response?.data || err;
  }
}
export const UpdateCartitemQuantity = async (CartItemId,quantity) => {
  try {
    const res = await api.put(`/Cart/${CartItemId}`,{quantity});
    return res.data;
  } catch (err) {
    console.error(err);
    throw err.response?.data || err;
  }
}