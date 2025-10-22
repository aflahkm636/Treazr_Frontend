import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { URL } from "../../services/Api";
import Loading from "../../common/components/Loading";
import ProductCard from "../../common/components/cards";

function CategoryProducts() {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const response = await axios.get(`${URL}/Product/filter`, {
          params: { filter: categoryName },
        });
        const data = response.data?.data || [];
        setProducts(data);
      } catch (err) {
        console.error("Error fetching category products:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [categoryName]);

  if (loading) return <Loading name={`${categoryName} Products`} />;
  if (error)
    return <div className="text-center text-red-500 py-8">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
     <h2 className="text-2xl font-bold mb-16  text-center capitalize">
  {categoryName}
</h2>


      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            No products found in this category.
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryProducts;
