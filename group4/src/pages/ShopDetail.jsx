import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAllStores, getAnStore } from '../services/stores';
import { getAllCategories } from '../services/categories';
import { getAllProducts } from '../services/products';
import './customerstyle/ShopDetail.css';
import { useCartStore } from '../stores/stores';
import Button from 'react-bootstrap/Button';
import { loginContext } from '../context/LoginContext';




const ShopDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState([]);
  const [idUser,setIdUser] = useState()
const { token } = useContext(loginContext);
const addToCart = useCartStore((state) => state.addToCart);
useEffect(() => {
      const decode = async () => {
        const info = await decodeFakeToken(token);
        console.log(info.id)
        if (info) {
          setIdUser(info.id);
           
        }
  
      };
      decode();
    }, [token]);
    const handleAddToCart = (product) => {
    if (!token) {
      alert("Please log in to add to cart.");
      nav('/login');
      return;
    }
    const item = {
      userId: idUser,
      productId: Number(product.id),
      storeId: Number(product.storeId),
      quantity: 1
    };
    addToCart(item);
  };

  

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
                  <Button onClick={() => handleAddToCart(item)} className="me-2">Add to Cart</Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ShopDetail;
