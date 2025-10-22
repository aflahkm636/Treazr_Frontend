// AddProduct.js
import React, { useState } from "react";
import { FiX, FiUpload, FiImage } from "react-icons/fi";
import { AddProduct } from "../services/AdminService/ProductService";

const AddProductForm = ({ onCancel, onSuccess, darkMode, categories }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        brand: "",
        categoryId: "",
        currentStock: "",
        images: []
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

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
            images: files
        });
    };

    const removeImage = (index) => {
        const newImages = formData.images.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            images: newImages
        });
    };

    const validate = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) newErrors.name = "Product name is required";
        if (!formData.categoryId) newErrors.categoryId = "Category is required";
        if (!formData.description.trim()) newErrors.description = "Description is required";
        if (!formData.price || isNaN(formData.price) || formData.price <= 0) 
            newErrors.price = "Valid price is required";
        if (!formData.currentStock || isNaN(formData.currentStock) || formData.currentStock < 0) 
            newErrors.currentStock = "Valid stock quantity is required";
        if (!formData.brand.trim()) newErrors.brand = "Brand is required";
        if (formData.images.length === 0) newErrors.images = "At least one image is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validate()) return;

        setLoading(true);
        try {
            const submitData = new FormData();
            
            // Append all required fields
            submitData.append('name', formData.name);
            submitData.append('description', formData.description);
            submitData.append('price', parseFloat(formData.price));
            submitData.append('brand', formData.brand);
            submitData.append('categoryId', parseInt(formData.categoryId));
            submitData.append('currentStock', parseInt(formData.currentStock));
            
            // Append images
            formData.images.forEach(image => {
                submitData.append('images', image);
            });

            await AddProduct(submitData);
            onSuccess();
        } catch (error) {
            console.error("Error adding product:", error);
            setErrors({ submit: "Failed to add product. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl ${
                darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            }`}>
                <div className={`flex justify-between items-center border-b p-4 sticky top-0 z-10 ${
                    darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
                }`}>
                    <h3 className="text-lg font-semibold">Add New Product</h3>
                    <button
                        onClick={onCancel}
                        className={`p-1 rounded-full hover:bg-opacity-20 ${
                            darkMode ? "text-gray-400 hover:text-gray-300 hover:bg-gray-700" : "text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                        }`}
                    >
                        <FiX className="h-6 w-6" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium mb-1">
                                Product Name *
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm ${
                                    errors.name 
                                        ? "border-red-300" 
                                        : darkMode 
                                            ? "border-gray-600 bg-gray-700 text-white" 
                                            : "border-gray-300 bg-white text-gray-900"
                                }`}
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                        </div>

                        <div>
                            <label htmlFor="categoryId" className="block text-sm font-medium mb-1">
                                Category *
                            </label>
                            <select
                                id="categoryId"
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleChange}
                                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm ${
                                    errors.categoryId 
                                        ? "border-red-300" 
                                        : darkMode 
                                            ? "border-gray-600 bg-gray-700 text-white" 
                                            : "border-gray-300 bg-white text-gray-900"
                                }`}
                            >
                                <option value="">Select Category</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            {errors.categoryId && <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>}
                        </div>

                        <div>
                            <label htmlFor="price" className="block text-sm font-medium mb-1">
                                Price ($) *
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
                                    errors.price 
                                        ? "border-red-300" 
                                        : darkMode 
                                            ? "border-gray-600 bg-gray-700 text-white" 
                                            : "border-gray-300 bg-white text-gray-900"
                                }`}
                            />
                            {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                        </div>

                        <div>
                            <label htmlFor="currentStock" className="block text-sm font-medium mb-1">
                                Stock Quantity *
                            </label>
                            <input
                                type="number"
                                id="currentStock"
                                name="currentStock"
                                min="0"
                                value={formData.currentStock}
                                onChange={handleChange}
                                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm ${
                                    errors.currentStock 
                                        ? "border-red-300" 
                                        : darkMode 
                                            ? "border-gray-600 bg-gray-700 text-white" 
                                            : "border-gray-300 bg-white text-gray-900"
                                }`}
                            />
                            {errors.currentStock && <p className="mt-1 text-sm text-red-600">{errors.currentStock}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="brand" className="block text-sm font-medium mb-1">
                                Brand *
                            </label>
                            <input
                                type="text"
                                id="brand"
                                name="brand"
                                value={formData.brand}
                                onChange={handleChange}
                                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm ${
                                    errors.brand 
                                        ? "border-red-300" 
                                        : darkMode 
                                            ? "border-gray-600 bg-gray-700 text-white" 
                                            : "border-gray-300 bg-white text-gray-900"
                                }`}
                            />
                            {errors.brand && <p className="mt-1 text-sm text-red-600">{errors.brand}</p>}
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">Images *</label>
                        <div className={`border-2 border-dashed rounded-md p-4 ${
                            darkMode ? "border-gray-600" : "border-gray-300"
                        }`}>
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
                                <span className="text-sm">Click to upload images</span>
                                <span className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG up to 5MB</span>
                            </label>
                        </div>
                        {errors.images && <p className="mt-1 text-sm text-red-600">{errors.images}</p>}
                        
                        {formData.images.length > 0 && (
                            <div className="mt-4">
                                <h4 className="text-sm font-medium mb-2">Selected Images:</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                    {formData.images.map((image, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={URL.createObjectURL(image)}
                                                alt={`Preview ${index + 1}`}
                                                className="w-20 h-20 object-cover rounded-md"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
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
                            Description *
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows="3"
                            value={formData.description}
                            onChange={handleChange}
                            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm ${
                                errors.description 
                                    ? "border-red-300" 
                                    : darkMode 
                                        ? "border-gray-600 bg-gray-700 text-white" 
                                        : "border-gray-300 bg-white text-gray-900"
                            }`}
                        />
                        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
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
                            {loading ? "Adding..." : "Add Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProductForm;