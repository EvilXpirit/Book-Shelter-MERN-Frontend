import React, { useState } from 'react';
import './Testimonials.css';

const testimonials = [
  {
    person: 'Ryan Gosling',
    quote: 'I’ve been interested in coding for a while but never taken the jump, until now. I couldn’t recommend this course enough. I’m now in the job of my dreams and so excited about the future.',
    name: 'Ryan Gosling',
    role: 'UX Engineer',
    imageUrl: 'https://del.h-cdn.co/assets/17/07/3200x3200/square-1487365300-delish-ryan-gosling-getty-pascal.jpg'
  },
  {
    person: 'Ryan Reynolds',
    quote: 'If you want to lay the best foundation possible I’d recommend taking this course. The depth the instructors go into is incredible. I now feel so confident about starting up as a professional developer.',
    name: 'Ryan Reynolds',
    role: 'Junior Front-end Developer',
    imageUrl: 'https://avatarfiles.alphacoders.com/164/164012.jpg'
  },
  {
    person: 'Christian Bale',
    quote: 'I just wanted to share a quick note and let you know that you guys do a really good job. I’m glad I decided to work with you. It’s really great how easy your websites are to update and manage. I never have any problem at all.',
    name: 'Christian Bale',
    role: 'Senior Back-end Developer',
    imageUrl: 'https://i.pinimg.com/originals/bc/27/13/bc2713a369730a7e1088e3d5d7618488.jpg'
  }
];

const TestimonialSlider = () => {
  const [current, setCurrent] = useState(0);

  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const { person, quote, name, role, imageUrl } = testimonials[current];

  return (
    <div className="view bg-gradient-to-r from-indigo-200/90 via-purple-200/90 to-pink-200/80 rounded-md">
      <div className="wrapper">
        <div className="background"></div>
        <div style={{ position: 'relative' }}>
          <img src={imageUrl} alt={person} className="person" />
          <div className="controls">
            <button className="prev" aria-label="Previous slide" onClick={handlePrev} disabled={current === 0}>
              <img src="https://raw.githubusercontent.com/Mhmd-Tarek-Mhmd/Testimonials-Slider/5c60f6ce078e257223c7925df3ee75604b6a06cd/images/icon-prev.svg" alt="Previous" />
            </button>
            <button className="next" aria-label="Next slide" onClick={handleNext} disabled={current === testimonials.length - 1}>
              <img src="https://raw.githubusercontent.com/Mhmd-Tarek-Mhmd/Testimonials-Slider/5c60f6ce078e257223c7925df3ee75604b6a06cd/images/icon-next.svg" alt="Next" />
            </button>
          </div>
        </div>
      </div>
      <div className="text">
        <q>{quote}</q>
        <div>
          <strong>{name}</strong>
          <span>{role}</span>
        </div>
      </div>
      <div className="curve"></div>
    </div>
  );
};

export default TestimonialSlider;