import React from "react";
import { Carousel, Typography, Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import bookwallpaper from "../assets/bookwallpaper.jpg"; 
import bookwallpaper2 from "../assets/bookwallpaper2.jpg"; 
import bookwallpaper3 from "../assets/bookwallpaper3.jpg"; 

const CarouselBooks = () => {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate('/bookspage');
  };

  useGSAP(() => {
    // Animate headings
    gsap.from('.carousel-heading', {
      y: -50,
      opacity: 0,
      duration: 1.5,
      ease: "power3.out",
      stagger: 0.2
    });

    // Animate description text
    gsap.from('.carousel-description', {
      y: 30,
      opacity: 0,
      duration: 1.5,
      delay: 0.5,
      ease: "power2.out"
    });

    // Animate buttons
    gsap.from('.carousel-buttons', {
      y: 20,
      opacity: 0,
      duration: 1,
      delay: 1,
      ease: "back.out(1.7)"
    });

    // Animate images
    gsap.from('.carousel-image', {
      scale: 1.2,
      opacity: 0,
      duration: 2,
      ease: "power2.out"
    });
  });

  return (
    <Carousel className="hero rounded-xl h-screen z-0" transition={{ duration: 1 }} loop={true} autoplay interval={6000}>
      <div className="relative h-full w-full">
        <img
          src={bookwallpaper}
          alt="image 1"
          className="carousel-image h-full w-full object-cover"
        />
        <div className="absolute inset-0 grid h-full w-full place-items-center bg-black/50">
          <div className="w-3/4 text-center md:w-3/4">
            <Typography
              variant="h1"
              color="white"
              className="carousel-heading mb-4 text-3xl md:text-4xl lg:text-5xl font-Oswald"
            >
              Welcome to Book Shelter
            </Typography>
            <Typography
              variant="lead"
              color="white"
              className="carousel-description mb-12 opacity-80"
            >
              Books open doors to countless worlds, offering solace, knowledge,
              and adventure. They are windows into the human experience, weaving
              tales of triumph and tragedy, love and loss. In their pages, we
              find refuge, inspiration, and boundless possibilities.
              </Typography>
              <div className="carousel-buttons flex justify-center gap-2">
              <Button size="lg" color="white" onClick={handleExploreClick}>
                Explore
              </Button>
              {/* <Button size="lg" color="white" variant="text">
                Gallery
              </Button> */}
            </div>
          </div>
        </div>
      </div>
      <div className="relative h-full w-full">
        <img
          src={bookwallpaper2}
          alt="image 2"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 grid h-full w-full items-center bg-black/50">
          <div className="w-3/4 pl-12 md:w-2/4 md:pl-20 lg:pl-32">
            <Typography
              variant="h1"
              color="white"
              className="mb-4 text-3xl md:text-4xl lg:text-5xl font-Oswald"
            >
              The Beauty of Books
            </Typography>
            <Typography
              variant="lead"
              color="white"
              className="mb-12 opacity-80"
            >
              Books are keys to unlock worlds of imagination and knowledge,
              bridging the past, present, and future. They offer refuge, provoke
              thought, and ignite curiosity, shaping minds and hearts with
              stories that transcend time and place.
            </Typography>
            <div className="flex gap-2">
              <Button size="lg" color="white" onClick={handleExploreClick}>
                Explore
              </Button>
              {/* <Button size="lg" color="white" variant="text">
                Gallery
              </Button> */}
            </div>
          </div>
        </div>
      </div>
      <div className="relative h-full w-full">
        <img
          src={bookwallpaper3}
          alt="image 3"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 grid h-full w-full items-end bg-black/50">
          <div className="w-3/4 pl-12 pb-10 md:w-2/4 md:pl-20 md:pb-20 lg:pl-32 lg:pb-48">
            <Typography
              variant="h1"
              color="white"
              className="mb-4 text-3xl md:text-4xl lg:text-5xl font-Oswald"
            >
              Best Book Website
            </Typography>
            <Typography
              variant="lead"
              color="white"
              className="mb-12 opacity-80"
            >
              Books are like lanterns in the dark, illuminating paths of
              knowledge and imagination. They whisper stories of courage, love,
              and discovery, inviting us to explore realms both familiar and
              unknown. In their pages, we find solace, inspiration, and endless
              possibilities.
            </Typography>
            <div className="flex gap-2">
              <Button size="lg" color="white" onClick={handleExploreClick}>
                Explore
              </Button>
              {/* <Button size="lg" color="white" variant="text">
                Gallery
              </Button> */}
            </div>
          </div>
        </div>
      </div>
    </Carousel>
  );
};

export default CarouselBooks;
