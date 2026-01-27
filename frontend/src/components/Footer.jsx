import React from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, MapPin, Instagram, Youtube, Home, BookOpen, Newspaper, LogIn } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();

  return (
<footer className="bg-gray-800 text-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">

      {/* Column 1: About */}
      <div>
        <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">Niti IAS</h3>
        <p className="text-gray-300 text-sm sm:text-base mb-3 sm:mb-4">
          UPSC और राज्य PCS परीक्षाओं की तैयारी के लिए प्रमुख कोचिंग संस्थान
        </p>

        <div className="flex space-x-3">
          <a href="https://www.instagram.com/nitiias?igsh=MWdhdzY0dzN2eXB5aQ==" target="_blank"
            className="text-gray-300 hover:text-white">
            <Instagram size={20} />
          </a>
          <a href="https://youtube.com/@nitiias?si=DJcs44QXx_m1-Y3G" target="_blank"
            className="text-gray-300 hover:text-white">
            <Youtube size={20} />
          </a>
        </div>
      </div>

      {/* Column 2: Contact */}
      <div>
        <h4 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">संपर्क जानकारी</h4>

        <div className="space-y-2 text-sm sm:text-base">
          <div className="flex items-center">
            <Phone size={16} className="mr-2 text-primary-400" />
            <span>+91 9795902017</span>
          </div>
          <div className="flex items-center">
            <Mail size={16} className="mr-2 text-primary-400" />
            <span>info@nitiias.com</span>
          </div>
          <div className="flex items-center">
            <MapPin size={16} className="mr-2 text-primary-400" />
            <span>दिल्ली, भारत</span>
          </div>
        </div>
      </div>

      {/* Column 3: Links */}
      <div>
        <h4 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">त्वरित लिंक</h4>

        <ul className="space-y-2 text-sm sm:text-base">
          <li><a href="/" className="text-gray-300 hover:text-white flex items-center"><Home size={15} className="mr-2" />Home</a></li>
          <li><a href="/courses" className="text-gray-300 hover:text-white flex items-center"><BookOpen size={15} className="mr-2" />Courses</a></li>
          <li><a href="/blog" className="text-gray-300 hover:text-white flex items-center"><Newspaper size={15} className="mr-2" />Blogs</a></li>
          <li><a href="/pyqs" className="text-gray-300 hover:text-white flex items-center"><BookOpen size={15} className="mr-2" />PYQs</a></li>
          <li><a href="/login" className="text-gray-300 hover:text-white flex items-center"><LogIn size={15} className="mr-2" />Login</a></li>
        </ul>
      </div>

    </div>

    {/* Bottom */}
    <div className="border-t border-gray-700 mt-6 pt-4 text-center text-gray-400 text-xs sm:text-sm">
      <p>© {new Date().getFullYear()} Niti IAS. सभी अधिकार सुरक्षित।</p>
      <p className="mt-1">UPSC और अन्य सिविल सेवा परीक्षाओं के लिए विशेषज्ञ मार्गदर्शन</p>
    </div>

  </div>
</footer>

  );
};

export default Footer;