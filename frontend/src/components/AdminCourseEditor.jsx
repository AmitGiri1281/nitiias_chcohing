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
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">
        {initialData ? 'Edit Course' : 'Create New Course'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Bilingual Title Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title (English) *
            </label>
            <input
              type="text"
              value={courseData.title}
              onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title (Hindi) *
            </label>
            <input
              type="text"
              value={courseData.titleHindi}
              onChange={(e) => setCourseData({ ...courseData, titleHindi: e.target.value })}
              className="input-field hindi"
              required
            />
          </div>
        </div>

        {/* Bilingual Description Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (English) *
            </label>
            <textarea
              value={courseData.description}
              onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
              className="input-field h-32"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Hindi) *
            </label>
            <textarea
              value={courseData.descriptionHindi}
              onChange={(e) => setCourseData({ ...courseData, descriptionHindi: e.target.value })}
              className="input-field h-32 hindi"
              required
            />
          </div>
        </div>

        {/* Price and Duration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price (₹) *
            </label>
            <input
              type="number"
              value={courseData.price}
              onChange={(e) => setCourseData({ ...courseData, price: e.target.value })}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration *
            </label>
            <input
              type="text"
              value={courseData.duration}
              onChange={(e) => setCourseData({ ...courseData, duration: e.target.value })}
              className="input-field"
              placeholder="e.g., 6 months, 12 months"
              required
            />
          </div>
        </div>

        {/* Category and Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              value={courseData.category}
              onChange={(e) => setCourseData({ ...courseData, category: e.target.value })}
              className="input-field"
              required
            >
              <option value="">Select Category</option>
              <option value="UPSC">UPSC</option>
              <option value="PCS">State PCS</option>
              <option value="Optional Subjects">Optional Subjects</option>
              <option value="Current Affairs">Current Affairs</option>
              <option value="Test Series">Test Series</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Features (English, comma separated)
            </label>
            <input
              type="text"
              value={courseData.features.join(', ')}
              onChange={(e) => setCourseData({ 
                ...courseData, 
                features: e.target.value.split(',').map(feature => feature.trim()) 
              })}
              className="input-field"
              placeholder="Video lectures, Study material, Mock tests"
            />
          </div>
        </div>

        {/* Hindi Features and Image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Features (Hindi, comma separated)
            </label>
            <input
              type="text"
              value={courseData.featuresHindi.join(', ')}
              onChange={(e) => setCourseData({ 
                ...courseData, 
                featuresHindi: e.target.value.split(',').map(feature => feature.trim()) 
              })}
              className="input-field"
              placeholder="वीडियो व्याख्यान, अध्ययन सामग्री, मॉक टेस्ट"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="input-field"
            />
            {courseData.image && (
              <div className="mt-4">
                <img 
                  src={courseData.image} 
                  alt="Preview" 
                  className="h-32 w-full object-cover rounded-md"
                />
              </div>
            )}
          </div>
        </div>

        {/* Active Status */}
        <div className="flex items-center">
          <input
            id="active"
            type="checkbox"
            checked={courseData.isActive}
            onChange={(e) => setCourseData({ ...courseData, isActive: e.target.checked })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
            Course is active
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {initialData ? 'Update Course' : 'Create Course'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminCourseEditor;