import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const AdminCourseEditor = ({ onSave, initialData, onCancel }) => {
  const { t } = useTranslation();
  const [courseData, setCourseData] = useState(initialData || {
    title: '',
    titleHindi: '',
    description: '',
    descriptionHindi: '',
    price: '',
    duration: '',
    category: '',
    features: [],
    featuresHindi: [],
    isActive: true,
    image: null
  });

  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('title', courseData.title);
    formData.append('titleHindi', courseData.titleHindi);
    formData.append('description', courseData.description);
    formData.append('descriptionHindi', courseData.descriptionHindi);
    formData.append('price', courseData.price);
    formData.append('duration', courseData.duration);
    formData.append('category', courseData.category);
    formData.append('features', courseData.features.join(','));
    formData.append('featuresHindi', courseData.featuresHindi.join(','));
    formData.append('isActive', courseData.isActive);
    
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    onSave(formData);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setCourseData({ ...courseData, image: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">
        {initialData ? (t('editCourse') || 'कोर्स संपादित करें') : (t('createCourse') || 'नया कोर्स बनाएं')}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* द्विभाषी शीर्षक फ़ील्ड्स */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('titleEnglish') || 'शीर्षक (अंग्रेजी)'} *
            </label>
            <input
              type="text"
              value={courseData.title}
              onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="अंग्रेजी में कोर्स का नाम"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('titleHindi') || 'शीर्षक (हिंदी)'} *
            </label>
            <input
              type="text"
              value={courseData.titleHindi}
              onChange={(e) => setCourseData({ ...courseData, titleHindi: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent hindi"
              placeholder="हिंदी में कोर्स का नाम"
              required
            />
          </div>
        </div>

        {/* द्विभाषी विवरण फ़ील्ड्स */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('descriptionEnglish') || 'विवरण (अंग्रेजी)'} *
            </label>
            <textarea
              value={courseData.description}
              onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
              placeholder="अंग्रेजी में कोर्स का विवरण"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('descriptionHindi') || 'विवरण (हिंदी)'} *
            </label>
            <textarea
              value={courseData.descriptionHindi}
              onChange={(e) => setCourseData({ ...courseData, descriptionHindi: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32 hindi"
              placeholder="हिंदी में कोर्स का विवरण"
              required
            />
          </div>
        </div>

        {/* कीमत और अवधि */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('price') || 'कीमत (₹)'} *
            </label>
            <input
              type="number"
              value={courseData.price}
              onChange={(e) => setCourseData({ ...courseData, price: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
              min="0"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              ₹ में कोर्स की कीमत दर्ज करें
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('duration') || 'अवधि'} *
            </label>
            <input
              type="text"
              value={courseData.duration}
              onChange={(e) => setCourseData({ ...courseData, duration: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="जैसे: 6 महीने, 12 महीने, 1 वर्ष"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              उदाहरण: 3 महीने, 6 महीने, 1 वर्ष
            </p>
          </div>
        </div>

        {/* श्रेणी और विशेषताएँ (अंग्रेजी) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('category') || 'श्रेणी'} *
            </label>
            <select
              value={courseData.category}
              onChange={(e) => setCourseData({ ...courseData, category: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">{t('selectCategory') || 'श्रेणी चुनें'}</option>
              <option value="UPSC">{t('upsc') || 'यूपीएससी'}</option>
              <option value="PCS">{t('pcs') || 'राज्य पीसीएस'}</option>
              <option value="Optional Subjects">{t('optionalSubjects') || 'वैकल्पिक विषय'}</option>
              <option value="Current Affairs">{t('currentAffairs') || 'समसामयिकी'}</option>
              <option value="Test Series">{t('testSeries') || 'टेस्ट सीरीज'}</option>
              <option value="Foundation Course">{t('foundationCourse') || 'फाउंडेशन कोर्स'}</option>
              <option value="Prelims">{t('prelims') || 'प्रीलिम्स'}</option>
              <option value="Mains">{t('mains') || 'मेन्स'}</option>
              <option value="Interview">{t('interview') || 'साक्षात्कार'}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('featuresEnglish') || 'विशेषताएँ (अंग्रेजी)'}
            </label>
            <input
              type="text"
              value={courseData.features.join(', ')}
              onChange={(e) => setCourseData({ 
                ...courseData, 
                features: e.target.value.split(',').map(feature => feature.trim()).filter(feature => feature)
              })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="वीडियो लेक्चर, स्टडी मटेरियल, मॉक टेस्ट, ऑनलाइन डाउट सेशन"
            />
            <p className="mt-1 text-xs text-gray-500">
              कॉमा से अलग करें। उदाहरण: Video lectures, Study material, Mock tests
            </p>
          </div>
        </div>

        {/* विशेषताएँ (हिंदी) और इमेज */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('featuresHindi') || 'विशेषताएँ (हिंदी)'}
            </label>
            <input
              type="text"
              value={courseData.featuresHindi.join(', ')}
              onChange={(e) => setCourseData({ 
                ...courseData, 
                featuresHindi: e.target.value.split(',').map(feature => feature.trim()).filter(feature => feature)
              })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent hindi"
              placeholder="वीडियो व्याख्यान, अध्ययन सामग्री, मॉक टेस्ट, ऑनलाइन संदेह सत्र"
            />
            <p className="mt-1 text-xs text-gray-500 hindi">
              कॉमा से अलग करें। उदाहरण: वीडियो व्याख्यान, अध्ययन सामग्री, मॉक टेस्ट
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('courseImage') || 'कोर्स इमेज'}
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="course-image-upload"
              />
              <label htmlFor="course-image-upload" className="cursor-pointer block">
                <div className="flex flex-col items-center">
                  <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <p className="text-sm text-gray-600">
                    {imageFile ? imageFile.name : 'कोर्स इमेज अपलोड करने के लिए क्लिक करें'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, JPEG (अधिकतम 5MB)
                  </p>
                </div>
              </label>
            </div>
            
            {courseData.image && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">इमेज प्रिव्यू:</p>
                <img 
                  src={courseData.image} 
                  alt="कोर्स इमेज प्रिव्यू" 
                  className="h-48 w-full object-cover rounded-md shadow-sm"
                />
              </div>
            )}
          </div>
        </div>

        {/* सक्रिय स्थिति */}
        <div className="flex items-center p-4 bg-gray-50 rounded-lg">
          <input
            id="active"
            type="checkbox"
            checked={courseData.isActive}
            onChange={(e) => setCourseData({ ...courseData, isActive: e.target.checked })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="active" className="ml-3 block text-sm font-medium text-gray-900">
            {t('courseIsActive') || 'कोर्स सक्रिय है (उपयोगकर्ताओं को दिखाई देगा)'}
          </label>
        </div>

        {/* फॉर्म वैलिडेशन सारांश */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-800 mb-2">आवश्यक फ़ील्ड:</h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• शीर्षक (अंग्रेजी और हिंदी)</li>
            <li>• विवरण (अंग्रेजी और हिंदी)</li>
            <li>• कीमत</li>
            <li>• अवधि</li>
            <li>• श्रेणी</li>
          </ul>
        </div>

        {/* एक्शन बटन */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-400 transition-colors duration-200"
          >
            {t('cancel') || 'रद्द करें'}
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
          >
            {initialData ? (t('updateCourse') || 'कोर्स अपडेट करें') : (t('createCourse') || 'कोर्स बनाएं')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminCourseEditor;