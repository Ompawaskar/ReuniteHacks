import React, { useState, useEffect } from 'react';
import Navbar from '../shared/Navbar';
import { useTypewriter, Cursor } from 'react-simple-typewriter';
import { useNavigate } from 'react-router-dom';
import { InfiniteSlider } from '@/components/ui/infinite-slider';
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
      <div className='p-10 flex justify-center items-center min-h-[600px]'>
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
                  <img src={src} className='w-[500px] m-auto h-[450px] object-cover' alt="carousel" />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
      <div className="absolute bottom-10 ml-44 transform -translate-x-1/2">
        <button onClick={() => navigate('/complain')}
          className="p-3 bg-[#115579] text-white text-xl rounded-full hover:bg-[#0e4d6c] transition-all duration-300"
        >
          Post a complaint
        </button>
      </div>
      <div className="p-10 flex justify-around bg-gray-800 min-h-[600px]">
        <div className='w-1/2 m-10'>
          <h1 className="text-2xl mt-10 mb-4 text-white">The issue of missing persons, particularly children, remains a significant challenge. Despite the efforts of law enforcement and NGOs, the lack of a centralized tracking system often hampers recovery efforts. Our platform addresses this gap by using Aadhaar's biometric authentication system to streamline the identification, tracking, and recovery process. With a focus on efficiency and real-time updates, we aim to support search and rescue operations, ensuring faster reunification of missing individuals with their families. Our goal is to create a safer, more connected world for everyone.</h1>
        </div>
        <div className='w-1/2 m-10'>
          <h1 className="text-7xl font-bold mt-10 mb-4 text-white">About us</h1>
        </div>
      </div>
      <div className="p-10 flex flex-col align-center items-center min-h-[500px]">
        <h1 className="text-7xl font-bold mb-32 text-gray-800">
              Our partner NGOs
        </h1>
        <InfiniteSlider durationOnHover={75} gap={24}>
          <img
            src='https://ngobase.org/images/ngo_logos/IN/CRY-India---Child-Rights-and-You-ngo-charity.png'
            alt='Dean blunt - Black Metal 2'
            className='aspect-square w-[120px] rounded-[4px]'
          />
          <img
            src='https://ngobase.org/images/ngo_logos/IN/Tata-Trusts-ngo-charity.jpg'
            alt='Jungle Jack - JUNGLE DES ILLUSIONS VOL 2'
            className='aspect-square w-[120px] rounded-[4px]'
          />
          <img
            src='https://ngobase.org/images/ngo_logos/IN/Pratham-ngo-charity.jpg'
            alt='Yung Lean - Stardust'
            className='aspect-square w-[120px] rounded-[4px]'
          />
          <img
            src='https://ngobase.org/images/ngo_logos/IN/United-Way-of-Mumbai-ngo-charity.png'
            alt='Lana Del Rey - Ultraviolence'
            className='aspect-square w-[120px] rounded-[4px]'
          />
          <img
            src='https://ngobase.org/images/ngo_logos/IN/Cuddles-Foundation-ngo-charity.jpg'
            alt='A$AP Rocky - Tailor Swif'
            className='aspect-square w-[120px] rounded-[4px]'
          />
          <img
            src='https://ngobase.org/images/ngo_logos/IN/Reliance-Foundation-ngo-charity.jpg'
            alt='Midnight Miami (feat Konvy) - Nino Paid, Konvy'
            className='aspect-square w-[120px] rounded-[4px]'
          />
        </InfiniteSlider>
      </div>


      <footer class="bg-white rounded-lg shadow-sm dark:bg-gray-900 m-4">
        <div class="w-full max-w-screen-xl mx-auto p-4 md:py-8">
          <div class="sm:flex sm:items-center sm:justify-between">
            <a href="#" class="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
              <img src="./src/assets/logo.png" class="h-8" alt="Flowbite Logo" className='rounded-full w-10' />
              <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white text-[#115579]">ReUnite</span>
            </a>
            <ul class="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
              <li>
                <a href="#" class="hover:underline me-4 md:me-6">About</a>
              </li>
              <li>
                <a href="#" class="hover:underline me-4 md:me-6">Privacy Policy</a>
              </li>
              <li>
                <a href="#" class="hover:underline me-4 md:me-6">Licensing</a>
              </li>
              <li>
                <a href="#" class="hover:underline">Contact</a>
              </li>
            </ul>
          </div>
          <hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
          <span class="block text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2025 <a href="#" class="hover:underline">ReUnite™</a>. All Rights Reserved.</span>
        </div>
      </footer>


    </div>
  );
}

export default Home;
