import React from 'react';
import Lottie from 'react-lottie';
import animationData from '../assets/book-girl-animation.json'; 

const MyLottieAnimation = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <Lottie
        options={defaultOptions}
        height={600} 
        width={800} 
        style={{
          width: '100%',
          height: 'auto',
          maxWidth: '500px', 
          margin: '0 auto',
          // position: 'absolute',
          top: '0rem' ,
          left: '0rem'
        }}
      />
    </div>
  );
};

export default MyLottieAnimation;
