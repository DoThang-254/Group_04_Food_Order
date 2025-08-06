import React from 'react';
import { Carousel, Button } from 'antd';
import './style/HomeCarousel.css';
import img1 from './image/image1.jpg';
import img2 from './image/image2.jpg';
import img3 from './image/image3.jpg';

const HomeCarousel = ({ onClickButton }) => {
  const slides = [
    {
      img: img1,
      title: 'Pizza • Burger • Pasta',
      subtitle: 'Enjoy the ultimate combo',
    },
    {
      img: img2,
      title: 'Burger delight',
      subtitle: 'Burgers hot from the grill',
    },
    {
      img: img3,
      title: 'Delicious Italian Pasta',
      subtitle: 'Creamy sauce, rich cheese',
    },
  ];

  return (
    <Carousel autoplay>
      {slides.map((s, i) => (
        <div key={i} className="slide">
          <img src={s.img} alt={s.title} className="slide-img" />
          <div className="slide-caption">
            <h2>{s.title}</h2>
            <p>{s.subtitle}</p>
            <Button type="primary" onClick={onClickButton}>Xem ngay</Button>
          </div>
        </div>
      ))}
    </Carousel>
  );
};

export default HomeCarousel;
