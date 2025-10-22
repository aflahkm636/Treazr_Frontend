import api from "./Api";

export const GetWishList = async () => {
  try {
    const res = await api.get("/Wishlist");
    return res.data;
  } catch (err) {
    console.error(err);
    throw err.response?.data || err;
  }
}
export const ToggleWishList = async (productId) => {
  try {
    const res = await api.post(`/Wishlist/${productId}`);
    return res.data;
  } catch (err) {
    console.error(err);
    throw err.response?.data || err;
  }
}
