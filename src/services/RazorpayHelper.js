import { toast } from "react-toastify";
import { CreateOrder, VerifyRazorpayPayment } from "./AdminService/OrderService";

/**
 * Handles Razorpay payment checkout for both cart and buy-now orders.
 * @param {Object} params
 * @param {Object} params.orderData - Order details (addressId, paymentMethod, etc.)
 * @param {Object} [params.buyNowData] - { productId, quantity } (if Buy Now)
 * @param {boolean} [params.isBuyNow=false] - Whether order is from Buy Now
 * @param {Function} [params.onSuccess] - Callback after successful payment & verification
 */
export const CheckoutOrder = async ({
  orderData,
  buyNowData,
  isBuyNow = false,
  onSuccess,
}) => {
  try {
    // 1️⃣ Create Razorpay order in backend
    const createRes = await CreateOrder(
      orderData,
      buyNowData?.productId || null,
      buyNowData?.quantity || null
    );

    if (!createRes || createRes.statusCode !== 200) {
      throw new Error(createRes?.message || "Failed to create Razorpay order");
    }

    const { orderId, amount, key } = createRes.data;

    // 2️⃣ Razorpay checkout options
    const options = {
      key,
      amount: amount * 100, // Convert to paise
      currency: "INR",
      name: "Treazr",
      description: isBuyNow ? "Buy Now Payment" : "Cart Order Payment",
      order_id: orderId,

      handler: async function (response) {
        try {
          // 3️⃣ Verify payment
          const verifyRes = await VerifyRazorpayPayment({
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          });

          if (verifyRes.statusCode === 200) {
            toast.success("Payment successful!");
            onSuccess?.(); // Navigate or handle success
          } else {
            toast.error("Payment verification failed!");
          }
        } catch (verifyError) {
          console.error("Payment verification error:", verifyError);
          toast.error("Payment verification failed!");
        }
      },

      prefill: {
        name: orderData?.customerName || "",
        email: orderData?.customerEmail || "",
        contact: orderData?.customerPhone || "",
      },
      theme: { color: "#6366f1" },
      modal: {
        ondismiss: () => toast.info("Payment cancelled"),
      },
    };

    // 4️⃣ Open Razorpay
    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error("CheckoutOrder error:", error);
    toast.error(error.message || "Something went wrong during payment.");
  }
};
