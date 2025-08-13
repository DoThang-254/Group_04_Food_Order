import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Rate, Flex } from "antd";
import { getAnProduct } from "../services/products";
import { useCartStore } from "../stores/stores";
import { loginContext } from "../context/LoginContext";
import "./customerstyle/FoodDetail.css";

const desc = ["terrible", "bad", "normal", "good", "wonderful"];

const FoodDetail = () => {
  const [value, setValue] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const addToCart = useCartStore((state) => state.addToCart);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const { token } = useContext(loginContext);
  const [userRating, setUserRating] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      const data = await getAnProduct(id);
      setProduct(data);

      const savedRating =
        JSON.parse(localStorage.getItem(`rating-product-${id}`)) || {
          totalScore: 0,
          voteCount: 0,
        };

      if (savedRating.voteCount > 0) {
        setValue(savedRating.totalScore / savedRating.voteCount);
      }
      const votersData =
        JSON.parse(localStorage.getItem(`voters-product-${id}`)) || [];
      const userId = token;
      const userVote = votersData.find((v) => v.userId === userId);
      if (userVote) {
        setUserRating(userVote.score);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (token) fetchCart();
  }, [token]);

  const handleRatingChange = (val) => {
    if (!token) {
      alert("Vui lòng đăng nhập để vote.");
      navigate("/login");
      return;
    }

    const ratingKey = `rating-product-${id}`;
    const votersKey = `voters-product-${id}`;
    const userId = token; 

    const ratingData =
      JSON.parse(localStorage.getItem(ratingKey)) || {
        totalScore: 0,
        voteCount: 0,
      };
    const votersData = JSON.parse(localStorage.getItem(votersKey)) || [];

    const existingVoteIndex = votersData.findIndex((v) => v.userId === userId);

    if (existingVoteIndex !== -1) {
      const oldScore = votersData[existingVoteIndex].score;
      ratingData.totalScore = ratingData.totalScore - oldScore + val;
      votersData[existingVoteIndex].score = val;
    } else {
      ratingData.totalScore += val;
      ratingData.voteCount += 1;
      votersData.push({ userId, score: val });
    }

    localStorage.setItem(ratingKey, JSON.stringify(ratingData));
    localStorage.setItem(votersKey, JSON.stringify(votersData));

    setUserRating(val);
    setValue(ratingData.totalScore / ratingData.voteCount);
  };

  const handleAddToCart = () => {
    if (!token) {
      alert("Please log in to add to cart.");
      navigate("/login");
      return;
    }

    if (product && quantity > 0) {
      const item = {
        productId: product.id,
        storeId: product.storeId,
        quantity: quantity,
      };
      addToCart(item);
      alert("Added to cart!");
    }
  };

  if (!product) return <div className="loading">Loading...</div>;

  return (
    <div className="food-detail-wrapper">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="food-detail-container">
        <div className="food-detail-img">
          <img src={product?.img} alt={product?.name} />
        </div>

        <div className="food-detail-info">
          <h1 className="food-name">{product?.name}</h1>
          <p className="food-price">
            {Number(product?.price).toLocaleString()}₫
          </p>

          {/* Rating */}
          <div className="rating-section">
            <Flex gap="middle" vertical>
              <Rate
                tooltips={desc}
                onChange={handleRatingChange}
                value={userRating}
              />
              {value ? (
                <span>
                  {desc[Math.round(value) - 1]} ({value.toFixed(1)})
                </span>
              ) : null}
            </Flex>
          </div>

          <p className="food-desc">
            {product?.description ||
              "Delicious food made from fresh ingredients, ensuring hygiene and authentic restaurant flavors."}
          </p>


          <div className="quantity-box">
            <span>Quantity:</span>
            <div className="quantity-controls">
              <button
                className="qty-btn"
                onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
              >
                −
              </button>
              <span className="qty-value">{quantity}</span>
              <button
                className="qty-btn"
                onClick={() => setQuantity((prev) => prev + 1)}
              >
                +
              </button>
            </div>
          </div>

          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            Add To Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodDetail;
