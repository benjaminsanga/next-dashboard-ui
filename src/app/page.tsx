"use client"
import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { BiLeftArrowAlt, BiRightArrowAlt } from 'react-icons/bi';
import UserNavbar from '@/components/UserNavbar';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'Welcome to the NASFA Database Management System',
      description: 'Streamlining course management for officers and soldiers.',
      image: '/images/NASFA1.jpg',
    },
    {
      title: 'Efficient, Secure, and Scalable',
      description: 'Replacing Excel and MS Access with a centralized solution.',
      image: '/images/NASFA2.jpg',
    },
    {
      title: 'Built for the Future',
      description: 'Automating tasks and providing secure access to records.',
      image: '/images/NASFA2.jpg',
    },
  ];

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <>
      <Head>
        <title>NASFA - RMS</title>
        <meta name="description" content="Streamlining course management records." />
      </Head>
      <UserNavbar/>
      <main className="bg-gray-50 text-gray-800">
        {/* Hero Section */}
        <section className="relative">
          <div className="relative h-[90vh]">
            <Image
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              width={100}
              height={100}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-center">
              <div className="lg:w-2/4 w-[80%] text-white px-4">
                <h1 className="text-4xl font-bold mb-2">{slides[currentSlide].title}</h1>
                <p className="text-lg">{slides[currentSlide].description}</p>
                <button
                  onClick={handleNextSlide}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
          {/* Slider Controls */}
          <button
            onClick={handlePrevSlide}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 hover:bg-opacity-80 text-white p-2 rounded"
          >
            <BiLeftArrowAlt/>
          </button>
          <button
            onClick={handleNextSlide}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 hover:bg-opacity-80 text-white p-2 rounded"
          >
            <BiRightArrowAlt/>
          </button>
        </section>

        {/* About Us Section */}
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">About Us</h2>
            <p className="lg:w-3/5 w-[80%] text-lg text-gray-700 leading-relaxed text-center mx-auto">
              Our system is designed to replace outdated record-keeping methods such as Excel and MS Access. 
              By leveraging cutting-edge technology, we streamline the management of registration documents, scores, 
              and course-related records for military officers and soldiers.
            </p>
          </div>
        </section>

        {/* About the Commandant */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
            <div className="md:w-1/3 mb-8 md:mb-0">
              <Image
                src="/images/osi.jpg"
                alt="Commandant"
                width={100}
                height={100}
                className="rounded-lg shadow-md w-full"
              />
            </div>
            <div className="md:w-2/3 lg:text-left text-center md:pl-8">
              <h2 className="text-3xl font-bold mb-4">Meet the Commandant</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                The Commandant is a visionary leader dedicated to improving military education systems. 
                Under their guidance, this project ensures scalability, security, and efficiency in managing 
                military student records for future growth.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold">What is the NASFA Database Management System?</h3>
                <p className="text-gray-700">
                  It is a centralized solution for managing course records, scores, and documents for officers and soldiers.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">How secure is the system?</h3>
                <p className="text-gray-700">
                  The system is built with robust security protocols, ensuring all data is encrypted and access is tightly controlled.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Who can use this system?</h3>
                <p className="text-gray-700">
                  It is designed for military personnel, including officers, soldiers, and administrative staff.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-8">
          <div className="container mx-auto px-4 text-center">
            <p className="mb-4">&copy; {new Date().getFullYear()} NASFA. All rights reserved.</p>
            <div className="flex justify-center space-x-6">
              <a href="#" className="hover:text-gray-400">Privacy Policy</a>
              <a href="#" className="hover:text-gray-400">Terms of Service</a>
              <a href="#" className="hover:text-gray-400">Contact</a>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
