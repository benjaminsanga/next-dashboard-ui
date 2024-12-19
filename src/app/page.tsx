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
      image: '/images/nasfanight.jpg',
    },
    {
      title: 'Efficient, Secure, and Scalable System',
      description: 'Replacing manual processes with a centralized solution.',
      image: '/images/image-2.jpg',
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
              unoptimized
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center text-center">
              <div className="lg:w-2/4 w-[80%] text-white px-4">
                <h1 className="text-4xl font-bold mb-5">{slides[currentSlide].title}</h1>
                <p className="text-lg">{slides[currentSlide].description}</p>
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

        {/* About the Commandant */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-start">
            <div className="md:w-1/5 w-1/3 mb-8 md:mb-0">
              <Image
                src="/images/osi.jpg"
                alt="Commandant"
                width={100}
                height={100}
                className="rounded-lg shadow-md w-full"
                unoptimized
              />
            </div>
            <div className="md:w-4/5 w-2/3 lg:text-left text-center md:pl-8">
              <p className='text-2xl font-bold mb-3'>Major General JE OSIFO</p>
              <h2 className="text-lg font-bold mb-5">Commandant</h2>
              <p>
                Major General Julius Ehioze Osifo, a distinguished and decorated veteran, assumed the role of the 51st Commandant of the Nigerian Army School of Finance & Administration (NASFA) in January 2023. A native of Edo State, General Osifo&apos;s military journey has been marked by remarkable achievements and leadership roles within various units and formations. He was currently promoted to a Major General on the 15th of December, 2023.
              </p><br/>
              <p>
                General Osifo&apos;s journey began when he graduated with a Bachelor of Science (Honours) Degree in Economics from the Nigerian Defence Academy. His dedication and skills were recognized as he received his commission as a Second Lieutenant into the Nigerian Army, being part of the 42nd Regular Combatant Course on the 12th of September. Over the years, he has accumulated extensive experience in diverse command and staff positions, serving across multiple divisions.
              </p><br/>
              <p>
                Throughout his distinguished military career, General Osifo has demonstrated exceptional leadership. Notable appointments include his roles as Commander Division Finance and Accounts (CDFA) at Headquarters 3 Division Jos, Director of Finance at the Nigerian Armed Forces Resettlement Center Oshodi, Lagos, and Commander Division Finance and Accounts (CDFA) at 7 Division Finance HQ TC JTF (NE) OPHK. Presently, he serves as the Commandant at the Nigerian Army School of Finance and Administration in Apapa, a position he has held since 2023.
              </p><br/>
              <p>
                General Osifo&apos;s educational journey showcases his commitment to continuous learning. In addition to his Bachelor&apos;s Degree, he holds a Master of Science Degree in Economics and a Doctor of Philosophy Degree in Finance.
              </p><br/>
              <p>
                His professional affiliations include membership and fellowship in esteemed organizations such as the Nigerian Institute of Management, the Institute of Chartered Economists of Nigeria, and the Institute of Certified Public Accountants of Nigeria. General Osifo&apos;s pursuit of knowledge has led him to participate in numerous workshops and seminars at prestigious institutions, further enhancing his expertise.
              </p><br/>
              <p>
                To enhance his military prowess, General Osifo has successfully completed a range of Military Courses. These include the Young Officers Course (Finance) at the Nigerian Army School of Finance and Administration Apapa Lagos, Young Officers Course (Infantry) at the Infantry Centre and School Jaji Nigeria, Cashiers Course at the Nigerian Army School of Finance and Administration Apapa Lagos, Computer Appreciation Course at the Nigerian Army School of Finance and Administration in Apapa, Lagos, Junior Staff Course at the Armed Forces Command and Staff College Jaji, Nigeria, Senior Staff Course at the Armed Forces Command and Staff College Jaji, and the Commander Division Finance and Accounts Course at the Nigerian Army School of Finance and Administration in Apapa, Lagos.
              </p><br/>
              <p>
                General Osifo&apos;s dedication to duty and excellence has resulted in a collection of decorations and awards, including the Forces Service Star (FSS), the Meritorious Service Star (MSS), Passed Staff Course (psc), Passed Junior Staff Course (Pjsc), and the General Operations Medal (GOM).
              </p><br/>
              <p>
                Furthermore, General Osifo has demonstrated his commitment to professional growth through extensive training, as well as his contributions to the field through various publications and research endeavors.
                Beyond his outstanding military career, General Osifo finds fulfillment in his personal life as well. He is happily married and a proud parent, rounding out his profile as a devoted family man.
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
                  It is a centralized solution for managing course records, scores, and documents for NASFA students.
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
                  It is designed for NASFA students and administrative staff.
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
