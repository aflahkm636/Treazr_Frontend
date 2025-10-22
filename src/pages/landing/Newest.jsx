import React, { useEffect, useState } from "react";
import ProductCard from "../../common/components/cards";
import axios from "axios";
import { URL } from "../../services/Api";
import Loading from "../../common/components/Loading";

function Newest() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewestProducts = async () => {
      try {
         const response = await axios.get(`${URL}/Product`, {
          params: { pageNumber: 1, pageSize: 8 },
        });

     
        const latestProducts = response.data?.data?.products || [];

        setProducts(latestProducts);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching newest products:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchNewestProducts();
  }, []);

  if (loading) return <Loading name="Newest Products" />;
  if (error)
    return (
      <div className="text-center py-8 text-red-500">
        Error loading newest products: {error}
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Newest Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            No new products found.
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(Newest);
