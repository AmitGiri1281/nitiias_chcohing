
// now no need becacuse it is siffited in hindi website
import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex space-x-2">
      <button
        onClick={() => changeLanguage('en')}
        className={`px-3 py-1 rounded-md text-sm font-medium ${
          i18n.language === 'en' 
            ? 'bg-primary-600 text-white' 
            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => changeLanguage('hi')}
        className={`px-3 py-1 rounded-md text-sm font-medium ${
          i18n.language === 'hi' 
            ? 'bg-primary-600 text-white' 
            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
        }`}
      >
        HI
      </button>
    </div>
  );
};

export default LanguageSwitcher;