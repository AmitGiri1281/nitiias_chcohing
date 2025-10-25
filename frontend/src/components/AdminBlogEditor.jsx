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
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">
        {initialData ? t('editBlog') : t('createBlog')}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Bilingual Title Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('titleEnglish')} *
            </label>
            <input
              type="text"
              value={blogData.title}
              onChange={(e) => setBlogData({ ...blogData, title: e.target.value })}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('titleHindi')} *
            </label>
            <input
              type="text"
              value={blogData.titleHindi}
              onChange={(e) => setBlogData({ ...blogData, titleHindi: e.target.value })}
              className="input-field hindi"
              required
            />
          </div>
        </div>

        {/* Bilingual Content Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('contentEnglish')} *
            </label>
            <textarea
              value={blogData.content}
              onChange={(e) => setBlogData({ ...blogData, content: e.target.value })}
              className="input-field h-64"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('contentHindi')} *
            </label>
            <textarea
              value={blogData.contentHindi}
              onChange={(e) => setBlogData({ ...blogData, contentHindi: e.target.value })}
              className="input-field h-64 hindi"
              required
            />
          </div>
        </div>

        {/* Category and Tags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('category')} *
            </label>
            <select
              value={blogData.category}
              onChange={(e) => setBlogData({ ...blogData, category: e.target.value })}
              className="input-field"
              required
            >
              <option value="">{t('selectCategory')}</option>
              <option value="UPSC">{t('upsc')}</option>
              <option value="PCS">{t('pcs')}</option>
              <option value="Study Tips">{t('studyTips')}</option>
              <option value="Current Affairs">{t('currentAffairs')}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('tags')} ({t('commaSeparated')})
            </label>
            <input
              type="text"
              value={blogData.tags.join(', ')}
              onChange={(e) => setBlogData({ 
                ...blogData, 
                tags: e.target.value.split(',').map(tag => tag.trim()) 
              })}
              className="input-field"
              placeholder="UPSC, IAS, Preparation"
            />
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('featuredImage')}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="input-field"
          />
          {blogData.image && (
            <div className="mt-4">
              <img 
                src={blogData.image} 
                alt="Preview" 
                className="h-48 w-full object-cover rounded-md"
              />
            </div>
          )}
        </div>

        {/* Publish Option */}
        <div className="flex items-center">
          <input
            id="publish"
            type="checkbox"
            checked={blogData.isPublished}
            onChange={(e) => setBlogData({ ...blogData, isPublished: e.target.checked })}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="publish" className="ml-2 block text-sm text-gray-900">
            {t('published')}
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
          >
            {t('cancel')}
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            {initialData ? t('submit') : t('savePublish')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminBlogEditor; // This line was missing!