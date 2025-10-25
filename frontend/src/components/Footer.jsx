import React from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, MapPin, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Niti IAS</h3>
            <p className="text-gray-300 mb-4">{t('tagline')}</p>
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/nitiias?igsh=MWdhdzY0dzN2eXB5aQ==" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white"
              >
                <Instagram size={24} />
              </a>
              <a 
                href="https://youtube.com/@nitiias?si=DJcs44QXx_m1-Y3G" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white"
              >
                <Youtube size={24} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-2">
              <div className="flex items-center">
                <Phone size={18} className="mr-2" />
                <span>+91 9795902017</span>
              </div>
              <div className="flex items-center">
                <Mail size={18} className="mr-2" />
                <span>info@nitiias.com</span>
              </div>
              <div className="flex items-center">
                <MapPin size={18} className="mr-2" />
                <span>Delhi, India</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-white">Home</a></li>
              <li><a href="/courses" className="text-gray-300 hover:text-white">Courses</a></li>
              <li><a href="/blog" className="text-gray-300 hover:text-white">Blog</a></li>
              <li><a href="/login" className="text-gray-300 hover:text-white">Login</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Niti IAS Counselling Institute. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;