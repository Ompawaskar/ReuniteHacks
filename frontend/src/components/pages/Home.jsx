import React, { useState, useEffect } from 'react';
import Navbar from '../shared/Navbar';
import { useTypewriter, Cursor } from 'react-simple-typewriter';
import { useNavigate } from 'react-router-dom';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const Home = () => {
  const [text] = useTypewriter({
    words: [
      'Every second counts in bringing them back home.',
      'Help us reunite families with their loved ones.',
      'Your report could be the key to bringing someone home.'
    ],
    loop: true,
    delaySpeed: 2000,
    typeSpeed: 50,
    deleteSpeed: 25
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const images = [
    "./src/assets/carausal1.png",
    "./src/assets/carausal2.png",
    "./src/assets/carausal3.png"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Auto-slide every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  const navigate = useNavigate();

  return (
    <div>
      <Navbar />
      <div className='p-10 flex justify-center items-center'>
        <div className='w-1/2 m-10'>
          <h1 className="text-7xl font-bold mt-10 mb-4 text-gray-800">
            {text}
            <Cursor cursorStyle="|" />
          </h1>
        </div>
        <div className="w-1/2 p-10">
          <Carousel>
            <CarouselContent
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {images.map((src, index) => (
                <CarouselItem key={index}>
                  <img src={src} className='w-[500px] m-auto h-[450px]' alt="carousel" />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>

      {/* Fixed button */}
      <div className="absolute bottom-10 ml-44 transform -translate-x-1/2">
        <button onClick={()=> navigate('/complain')}
          className="p-3 bg-[#A31D1D] text-white text-xl rounded-full hover:bg-[#6D2323] transition-all duration-300"
        >
          Post a complaint
        </button>
      </div>
    </div>
  );
}

export default Home;
