import api from "../Api";


export const CreateOrder = async (orderData, productId = null, quantity = null) => {
  try {
    const queryParams =
      productId && quantity ? `?productId=${productId}&quantity=${quantity}` : "";
    const res = await api.post(`/Order/create${queryParams}`, orderData);
    return res.data;
  } catch (err) {
    console.error("CreateOrder error:", err);
    throw err.response?.data || err;
  }
};


export const VerifyRazorpayPayment = async (paymentVerifyDto) => {
  try {
    const res = await api.post(`/Order/verify-payment`, paymentVerifyDto);
    return res.data;
  } catch (err) {
    console.error("VerifyRazorpayPayment error:", err);
    throw err.response?.data || err;
  }
};


export const GetUserOrders = async () => {
  try {
    const res = await api.get("/Order");
    return res.data.data;
  } catch (err) {
    console.error("GetUserOrders error:", err);
    throw err.response?.data || err;
  }
};

export const GetOrdersByUserId = async (userId) => {
  try {
    const res = await api.get(`/Order/user/${userId}`);
    return res.data.data;
  } catch (err) {
    console.error("GetOrdersByUserId error:", err);
    throw err.response?.data || err;
  }
};


export const CancelOrder = async (orderId) => {
  try {
    const res = await api.post(`/Order/cancel/${orderId}`);
    return res.data;
  } catch (err) {
    console.error("CancelOrder error:", err);
    throw err.response?.data || err;
  }
};



export const GetAllOrders = async (pageNumber = 1, limit = 10) => {
  try {
    const res = await api.get("/Order/all", {
      params: { pageNumber, limit },
    });
    return res.data;
  } catch (err) {
    console.error("GetAllOrders error:", err);
    throw err.response?.data || err;
  }
};

export const GetOrderById = async (orderId) => {
  try {
    const res = await api.get(`/Order/${orderId}`);
    return res.data.data;
  } catch (err) {
    console.error("GetOrderById error:", err);
    throw err.response?.data || err;
  }
};

export const UpdateOrderStatus = async (orderId, newStatus) => {
  try {
    const res = await api.post(`/Order/admin/update-status/${orderId}`, null, {
      params: { newStatus },
    });
    return res.data;
  } catch (err) {
    console.error("UpdateOrderStatus error:", err);
    throw err.response?.data || err;
  }
};

export const SearchOrders = async (username) => {
  try {
    const res = await api.get("/Order/search", {
      params: { username },
    });
    return res.data.data;
  } catch (err) {
    console.error("SearchOrders error:", err);
    throw err.response?.data || err;
  }
};

export const GetOrdersByStatus = async (status) => {
  try {
    const res = await api.get(`/Order/status/${status}`);
    return res.data.data;
  } catch (err) {
    console.error("GetOrdersByStatus error:", err);
    throw err.response?.data || err;
  }
};

export const SortOrdersByDate = async (ascending = true) => {
  try {
    const res = await api.get("/Order/sort", {
      params: { ascending },
    });
    return res.data.data;
  } catch (err) {
    console.error("SortOrdersByDate error:", err);
    throw err.response?.data || err;
  }
};
