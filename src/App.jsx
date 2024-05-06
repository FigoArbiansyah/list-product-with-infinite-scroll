import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://dummyjson.com/products?limit=10&skip=${(page - 1) * 10}`);
      const newProducts = response.data?.products;
      setProducts(prevProducts => [...prevProducts, ...newProducts]);
      setHasMore(newProducts.length > 0);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
    setLoading(false);
  };

  const handleScroll = () => {
    if (!loading && hasMore) {
      const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
      const scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
      const clientHeight = document.documentElement.clientHeight || window.innerHeight;
      const scrolledToBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;

      if (scrolledToBottom) {
        setPage(prevPage => prevPage + 1);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="container max-md:px-5 mx-auto">
      <div className='text-center py-10'>
        <h1 className="text-3xl font-bold mb-4">Product List</h1>
      </div>
      <div className="grid md:grid-cols-4 gap-4">
        {products.map((product, index) => (
          <div key={index} className="bg-white p-4 rounded shadow">
            <img src={product.thumbnail} alt="Thumbnail" className='w-full aspect-square object-cover' />
            <h2 className="text-xl font-bold mb-2">{product.name}</h2>
            <p>{product.description}</p>
          </div>
        ))}
      </div>
      {loading && <p className="text-center text-xl">Loading...</p>}
      {!loading && !hasMore && <p className="text-center text-xl py-10">No more products</p>}
    </div>
  );
}

export default App;
