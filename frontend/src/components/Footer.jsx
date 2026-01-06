import React from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, MapPin, Instagram, Youtube, Home, BookOpen, Newspaper, LogIn } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: About */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Niti IAS</h3>
            <p className="text-gray-300 mb-4">
              {t('tagline') || 'UPSC और राज्य PCS परीक्षाओं की तैयारी के लिए प्रमुख कोचिंग संस्थान'}
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/nitiias?igsh=MWdhdzY0dzN2eXB5aQ==" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Instagram पर हमें फॉलो करें"
              >
                <Instagram size={24} />
              </a>
              <a 
                href="https://youtube.com/@nitiias?si=DJcs44QXx_m1-Y3G" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="YouTube चैनल देखें"
              >
                <Youtube size={24} />
              </a>
            </div>
          </div>
          
          {/* Column 2: Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">संपर्क जानकारी</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone size={18} className="mr-3 text-primary-400" />
                <span>+91 9795902017</span>
              </div>
              <div className="flex items-center">
                <Mail size={18} className="mr-3 text-primary-400" />
                <span>info@nitiias.com</span>
              </div>
              <div className="flex items-center">
                <MapPin size={18} className="mr-3 text-primary-400" />
                <span>दिल्ली, भारत</span>
              </div>
            </div>
          </div>
          
          {/* Column 3: Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">त्वरित लिंक</h4>
            <ul className="space-y-3">
              <li>
                <a href="/" className="text-gray-300 hover:text-white flex items-center transition-colors">
                  <Home size={16} className="mr-2" />
                  होम
                </a>
              </li>
              <li>
                <a href="/courses" className="text-gray-300 hover:text-white flex items-center transition-colors">
                  <BookOpen size={16} className="mr-2" />
                  कोर्सेज
                </a>
              </li>
              <li>
                <a href="/blog" className="text-gray-300 hover:text-white flex items-center transition-colors">
                  <Newspaper size={16} className="mr-2" />
                  ब्लॉग
                </a>
              </li>
              <li>
                <a href="/pyqs" className="text-gray-300 hover:text-white flex items-center transition-colors">
                  <BookOpen size={16} className="mr-2" />
                  पिछले वर्षों के प्रश्न
                </a>
              </li>
              <li>
                <a href="/login" className="text-gray-300 hover:text-white flex items-center transition-colors">
                  <LogIn size={16} className="mr-2" />
                  लॉगिन
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Niti IAS कोचिंग संस्थान। सभी अधिकार सुरक्षित।
          </p>
          <p className="text-sm mt-2">
            UPSC, IAS, IPS, IFS और अन्य सिविल सेवा परीक्षाओं की तैयारी के लिए विशेषज्ञ मार्गदर्शन
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;