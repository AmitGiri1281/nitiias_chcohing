import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const AdminBlogEditor = ({ onSave, initialData, onCancel }) => {
  const { t, i18n } = useTranslation();
  const [blogData, setBlogData] = useState(initialData || {
    title: '',
    titleHindi: '',
    content: '',
    contentHindi: '',
    category: '',
    tags: [],
    isPublished: false,
    image: null
  });

  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('title', blogData.title);
    formData.append('titleHindi', blogData.titleHindi);
    formData.append('content', blogData.content);
    formData.append('contentHindi', blogData.contentHindi);
    formData.append('category', blogData.category);
    formData.append('tags', blogData.tags.join(','));
    formData.append('isPublished', blogData.isPublished);
    
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
        setBlogData({ ...blogData, image: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">
        {initialData ? (t('editBlog') || 'ब्लॉग संपादित करें') : (t('createBlog') || 'नया ब्लॉग बनाएं')}
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
              value={blogData.title}
              onChange={(e) => setBlogData({ ...blogData, title: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="ब्लॉग का अंग्रेजी शीर्षक"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('titleHindi') || 'शीर्षक (हिंदी)'} *
            </label>
            <input
              type="text"
              value={blogData.titleHindi}
              onChange={(e) => setBlogData({ ...blogData, titleHindi: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent hindi"
              placeholder="ब्लॉग का हिंदी शीर्षक"
              required
            />
          </div>
        </div>

        {/* द्विभाषी सामग्री फ़ील्ड्स */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('contentEnglish') || 'सामग्री (अंग्रेजी)'} *
            </label>
            <textarea
              value={blogData.content}
              onChange={(e) => setBlogData({ ...blogData, content: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent h-64"
              placeholder="अंग्रेजी में ब्लॉग सामग्री लिखें..."
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('contentHindi') || 'सामग्री (हिंदी)'} *
            </label>
            <textarea
              value={blogData.contentHindi}
              onChange={(e) => setBlogData({ ...blogData, contentHindi: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent h-64 hindi"
              placeholder="हिंदी में ब्लॉग सामग्री लिखें..."
              required
            />
          </div>
        </div>

        {/* श्रेणी और टैग्स */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('category') || 'श्रेणी'} *
            </label>
            <select
              value={blogData.category}
              onChange={(e) => setBlogData({ ...blogData, category: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            >
              <option value="">{t('selectCategory') || 'श्रेणी चुनें'}</option>
              <option value="UPSC">{t('upsc') || 'यूपीएससी'}</option>
              <option value="PCS">{t('pcs') || 'राज्य पीसीएस'}</option>
              <option value="Study Tips">{t('studyTips') || 'अध्ययन सुझाव'}</option>
              <option value="Current Affairs">{t('currentAffairs') || 'समसामयिकी'}</option>
              <option value="Interview Tips">{t('interviewTips') || 'साक्षात्कार सुझाव'}</option>
              <option value="Success Stories">{t('successStories') || 'सफलता की कहानियाँ'}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('tags') || 'टैग्स'} ({t('commaSeparated') || 'कॉमा से अलग करें'})
            </label>
            <input
              type="text"
              value={blogData.tags.join(', ')}
              onChange={(e) => setBlogData({ 
                ...blogData, 
                tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
              })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="यूपीएससी, आईएएस, तैयारी, समसामयिकी"
            />
            <p className="mt-1 text-xs text-gray-500">
              उदाहरण: upsc-preparation, current-affairs, study-tips
            </p>
          </div>
        </div>

        {/* फ़ीचर्ड इमेज अपलोड */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('featuredImage') || 'फ़ीचर्ड इमेज'}
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer block">
              <div className="flex flex-col items-center">
                <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <p className="text-sm text-gray-600">
                  {imageFile ? imageFile.name : 'इमेज अपलोड करने के लिए क्लिक करें'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, JPEG (अधिकतम 5MB)
                </p>
              </div>
            </label>
          </div>
          
          {blogData.image && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">इमेज प्रिव्यू:</p>
              <img 
                src={blogData.image} 
                alt="इमेज प्रिव्यू" 
                className="h-48 w-full object-cover rounded-md shadow-sm"
              />
            </div>
          )}
        </div>

        {/* पब्लिश विकल्प */}
        <div className="flex items-center p-4 bg-gray-50 rounded-lg">
          <input
            id="publish"
            type="checkbox"
            checked={blogData.isPublished}
            onChange={(e) => setBlogData({ ...blogData, isPublished: e.target.checked })}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="publish" className="ml-3 block text-sm font-medium text-gray-900">
            {t('published') || 'तुरंत प्रकाशित करें (उपयोगकर्ताओं को दिखाई देगा)'}
          </label>
        </div>

        {/* फॉर्म वैलिडेशन सारांश */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-800 mb-2">आवश्यक फ़ील्ड:</h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• शीर्षक (अंग्रेजी और हिंदी)</li>
            <li>• सामग्री (अंग्रेजी और हिंदी)</li>
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
            className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200"
          >
            {initialData ? (t('submit') || 'अपडेट करें') : (t('savePublish') || 'सहेजें और प्रकाशित करें')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminBlogEditor;