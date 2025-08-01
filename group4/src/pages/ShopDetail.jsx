import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAllStores, getAnStore } from '../services/stores';
import { getAllCategories } from '../services/categories';
import { getAllProducts } from '../services/products';
import './customerstyle/ShopDetail.css';


const ShopDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storeResponse = await getAnStore(id);
        setStore(storeResponse);


        const productsResponse = await getAllProducts();
        setProducts(productsResponse);

       
        

        
        const mappedProducts = productsResponse.map((product) => {
         
          return {
            ...product,
            
          };
        });

        
        const filtered = mappedProducts.filter(
          (p) => Number(p.storeId) === Number(id)
        );
        setFilter(filtered);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [id]);

  return (
    <div style={{ padding: '20px' }}>
      {store && (
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2>{store.name}</h2>
          <img src={store.img} alt={store.name} style={{ height: 200 }} />
        </div>
      )}

      <div>
        <h3><strong>Menu:</strong></h3>
        {filter.length === 0 ? (
          <p>Không có món ăn nào.</p>
        ) : (
          <ul>
            {filter.map((item) => (
              <li key={item.id}>
                <img src={item.img}/>
                <strong>{item.name}</strong> - {item.price}₫
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ShopDetail;
