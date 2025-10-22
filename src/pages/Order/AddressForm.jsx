import React from "react";
import { FaTimes } from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";

// ✅ Address validation schema (optional fields but validated if entered)
const addressValidationSchema = Yup.object().shape({
  street: Yup.string()
    .min(5, "Street address must be at least 5 characters")
    .nullable(),
  city: Yup.string()
    .matches(/^[a-zA-Z\s]*$/, "City can only contain letters")
    .nullable(),
  state: Yup.string()
    .matches(/^[a-zA-Z\s]*$/, "State can only contain letters")
    .nullable(),
  zip: Yup.string()
    .matches(/^\d{6}$/, "ZIP code must be 6 digits")
    .nullable(),
  country: Yup.string().nullable(),
});

const AddressForm = ({
  initialValues = null,
  onSubmit,
  onCancel,
  isEditing = false,
  loading = false,
}) => {
  const formik = useFormik({
    initialValues: initialValues || {
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "India",
    },
    validationSchema: addressValidationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
    enableReinitialize: true,
  });

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {isEditing ? "Edit Address" : "Add New Address"}
        </h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FaTimes className="text-xl" />
        </button>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Street */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street Address
              {formik.touched.street && formik.errors.street && (
                <span className="text-red-500 text-xs ml-1">
                  {formik.errors.street}
                </span>
              )}
            </label>
            <input
              type="text"
              name="street"
              placeholder="Enter your street address (optional)"
              value={formik.values.street}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                formik.touched.street && formik.errors.street
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
              {formik.touched.city && formik.errors.city && (
                <span className="text-red-500 text-xs ml-1">
                  {formik.errors.city}
                </span>
              )}
            </label>
            <input
              type="text"
              name="city"
              placeholder="Enter city (optional)"
              value={formik.values.city}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                formik.touched.city && formik.errors.city
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
          </div>

          {/* State */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State
              {formik.touched.state && formik.errors.state && (
                <span className="text-red-500 text-xs ml-1">
                  {formik.errors.state}
                </span>
              )}
            </label>
            <input
              type="text"
              name="state"
              placeholder="Enter state (optional)"
              value={formik.values.state}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                formik.touched.state && formik.errors.state
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
          </div>

          {/* ZIP */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ZIP Code
              {formik.touched.zip && formik.errors.zip && (
                <span className="text-red-500 text-xs ml-1">
                  {formik.errors.zip}
                </span>
              )}
            </label>
            <input
              type="text"
              name="zip"
              placeholder="6-digit PIN (optional)"
              value={formik.values.zip}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              maxLength={6}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                formik.touched.zip && formik.errors.zip
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <select
              name="country"
              value={formik.values.country}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
            >
              <option value="">Select Country (optional)</option>
              <option value="India">India</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              isEditing ? "Update Address" : "Save Address"
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddressForm;
