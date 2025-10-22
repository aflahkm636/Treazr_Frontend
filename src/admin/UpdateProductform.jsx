// UpdateProduct.js
import React, { useState } from "react";
import { FiX, FiUpload } from "react-icons/fi";
import { UpdateProduct } from "../services/AdminService/ProductService";
import { toast } from "react-toastify";

const UpdateProductForm = ({ product, onCancel, onSuccess, darkMode, categories }) => {
    const [formData, setFormData] = useState({
        id: product?.id || "",
        name: product?.name || "",
        description: product?.description || "",
        price: product?.price || "",
        brand: product?.brand || "",
        categoryId: product?.categoryId || "",
        currentStock: product?.currentStock || "",
        images: [],
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [existingImages, setExistingImages] = useState(product?.imageBase64 || []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData({
            ...formData,
            images: [...formData.images, ...files],
        });
    };

    const removeNewImage = (index) => {
        const newImages = formData.images.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            images: newImages,
        });
    };

    const removeExistingImage = (index) => {
        const newImages = existingImages.filter((_, i) => i !== index);
        setExistingImages(newImages);
    };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const submitData = new FormData();
    submitData.append("Id", formData.id);

    if (formData.name) submitData.append("Name", formData.name);
    if (formData.description) submitData.append("Description", formData.description);
    if (formData.price) submitData.append("Price", parseFloat(formData.price));
    if (formData.brand) submitData.append("Brand", formData.brand);
    if (formData.categoryId) submitData.append("CategoryId", parseInt(formData.categoryId));
    if (formData.currentStock) submitData.append("CurrentStock", parseInt(formData.currentStock));

    // existing image IDs
    existingImages.forEach((img) => {
      if (img.id) submitData.append("ExistingImageIds", img.id);
    });

    // new images
    formData.images.forEach((file) => {
      submitData.append("NewImages", file);
    });

    await UpdateProduct(submitData);
    toast.success("Product updated successfully!");
    onSuccess?.();
  } catch (err) {
    console.error("Error updating product:", err.response?.data || err);
    toast.error("Failed to update product!");
  }
};




    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div
                className={`rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl ${
                    darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                }`}
            >
                <div
                    className={`flex justify-between items-center border-b p-4 sticky top-0 z-10 ${
                        darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
                    }`}
                >
                    <h3 className="text-lg font-semibold">Update Product</h3>
                    <button
                        onClick={onCancel}
                        className={`p-1 rounded-full hover:bg-opacity-20 ${
                            darkMode
                                ? "text-gray-400 hover:text-gray-300 hover:bg-gray-700"
                                : "text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                        }`}
                    >
                        <FiX className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium mb-1">
                                Product Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm ${
                                    darkMode
                                        ? "border-gray-600 bg-gray-700 text-white"
                                        : "border-gray-300 bg-white text-gray-900"
                                }`}
                                placeholder={product?.name}
                            />
                        </div>

                        <div>
                            <label htmlFor="categoryId" className="block text-sm font-medium mb-1">
                                Category
                            </label>
                            <select
                                id="categoryId"
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleChange}
                                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm ${
                                    darkMode
                                        ? "border-gray-600 bg-gray-700 text-white"
                                        : "border-gray-300 bg-white text-gray-900"
                                }`}
                            >
                                <option value="">Select Category</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="price" className="block text-sm font-medium mb-1">
                                Price ($)
                            </label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                min="0.01"
                                step="0.01"
                                value={formData.price}
                                onChange={handleChange}
                                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm ${
                                    darkMode
                                        ? "border-gray-600 bg-gray-700 text-white"
                                        : "border-gray-300 bg-white text-gray-900"
                                }`}
                                placeholder={product?.price}
                            />
                        </div>

                        <div>
                            <label htmlFor="currentStock" className="block text-sm font-medium mb-1">
                                Stock Quantity
                            </label>
                            <input
                                type="number"
                                id="currentStock"
                                name="currentStock"
                                min="0"
                                value={formData.currentStock}
                                onChange={handleChange}
                                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm ${
                                    darkMode
                                        ? "border-gray-600 bg-gray-700 text-white"
                                        : "border-gray-300 bg-white text-gray-900"
                                }`}
                                placeholder={product?.currentStock}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="brand" className="block text-sm font-medium mb-1">
                                Brand
                            </label>
                            <input
                                type="text"
                                id="brand"
                                name="brand"
                                value={formData.brand}
                                onChange={handleChange}
                                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm ${
                                    darkMode
                                        ? "border-gray-600 bg-gray-700 text-white"
                                        : "border-gray-300 bg-white text-gray-900"
                                }`}
                                placeholder={product?.brand}
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">Add New Images</label>
                        <div
                            className={`border-2 border-dashed rounded-md p-4 ${
                                darkMode ? "border-gray-600" : "border-gray-300"
                            }`}
                        >
                            <input
                                type="file"
                                id="images"
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                            <label
                                htmlFor="images"
                                className={`cursor-pointer flex flex-col items-center justify-center p-4 ${
                                    darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                                }`}
                            >
                                <FiUpload className="h-8 w-8 mb-2 text-gray-400" />
                                <span className="text-sm">Click to upload additional images</span>
                                <span className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG up to 5MB</span>
                            </label>
                        </div>

                        {/* Existing Images */}
                        {existingImages.length > 0 && (
                            <div className="mt-4">
                                <h4 className="text-sm font-medium mb-2">Current Images:</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                    {existingImages.map((image, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={
                                                    image.startsWith("data:image")
                                                        ? image
                                                        : `data:image/jpeg;base64,${image}`
                                                }
                                                alt={`Existing ${index + 1}`}
                                                className="w-20 h-20 object-cover rounded-md"
                                            />

                                            <button
                                                type="button"
                                                onClick={() => removeExistingImage(index)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                            >
                                                <FiX className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* New Images */}
                        {formData.images.length > 0 && (
                            <div className="mt-4">
                                <h4 className="text-sm font-medium mb-2">New Images:</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                    {formData.images.map((image, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={URL.createObjectURL(image)}
                                                alt={`New ${index + 1}`}
                                                className="w-20 h-20 object-cover rounded-md"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeNewImage(index)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                            >
                                                <FiX className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mb-6">
                        <label htmlFor="description" className="block text-sm font-medium mb-1">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows="3"
                            value={formData.description}
                            onChange={handleChange}
                            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm ${
                                darkMode
                                    ? "border-gray-600 bg-gray-700 text-white"
                                    : "border-gray-300 bg-white text-gray-900"
                            }`}
                            placeholder={product?.description}
                        />
                    </div>

                    {errors.submit && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {errors.submit}
                        </div>
                    )}

                    <div className="flex justify-end space-x-3 border-t pt-4 border-gray-200 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={loading}
                            className={`px-4 py-2 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                darkMode
                                    ? "border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600"
                                    : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                            }`}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {loading ? "Updating..." : "Update Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateProductForm;
