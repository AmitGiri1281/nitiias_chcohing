import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const AdminPyqEditor = ({ onSave, initialData, onCancel }) => {
  const { t } = useTranslation();
  const [pyqData, setPyqData] = useState(initialData || {
    title: '',
    titleHindi: '',
    description: '',
    descriptionHindi: '',
    exam: 'UPSC',
    year: new Date().getFullYear(),
    subject: '',
    subjectHindi: '',
    questions: '',
    category: '',
    isPublished: false,
    file: null
  });

  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate file for new PYQs
    if (!initialData && !file) {
      setFileError('Please select a PDF file');
      return;
    }
    
    const formData = new FormData();
    formData.append('title', pyqData.title);
    formData.append('titleHindi', pyqData.titleHindi);
    formData.append('description', pyqData.description);
    formData.append('descriptionHindi', pyqData.descriptionHindi);
    formData.append('exam', pyqData.exam);
    formData.append('year', pyqData.year);
    formData.append('subject', pyqData.subject);
    formData.append('subjectHindi', pyqData.subjectHindi);
    formData.append('questions', pyqData.questions || '0');
    formData.append('category', pyqData.category);
    formData.append('isPublished', pyqData.isPublished);
    
    if (file) {
      formData.append('file', file);
    }
    
    onSave(formData);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check if file is PDF
      if (selectedFile.type !== 'application/pdf') {
        setFileError('Please select a PDF file');
        setFile(null);
        return;
      }
      
      // Check file size (10MB limit)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setFileError('File size must be less than 10MB');
        setFile(null);
        return;
      }
      
      setFile(selectedFile);
      setFileError('');
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear - i);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">
        {initialData ? 'Edit PYQ' : 'Add New PYQ'}
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
              value={pyqData.title}
              onChange={(e) => setPyqData({ ...pyqData, title: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., UPSC Civil Services Preliminary Exam"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title (Hindi) *
            </label>
            <input
              type="text"
              value={pyqData.titleHindi}
              onChange={(e) => setPyqData({ ...pyqData, titleHindi: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent hindi"
              placeholder="e.g., यूपीएससी सिविल सेवा प्रारंभिक परीक्षा"
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
              value={pyqData.description}
              onChange={(e) => setPyqData({ ...pyqData, description: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent h-32"
              placeholder="Description of the question paper, topics covered, etc."
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Hindi) *
            </label>
            <textarea
              value={pyqData.descriptionHindi}
              onChange={(e) => setPyqData({ ...pyqData, descriptionHindi: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent h-32 hindi"
              placeholder="प्रश्न पत्र का विवरण, शामिल विषय, आदि।"
              required
            />
          </div>
        </div>

        {/* Exam, Year, and Questions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Exam Type *
            </label>
            <select
              value={pyqData.exam}
              onChange={(e) => setPyqData({ ...pyqData, exam: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            >
              <option value="UPSC">UPSC</option>
              <option value="State PCS">State PCS</option>
              <option value="IAS">IAS</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Year *
            </label>
            <select
              value={pyqData.year}
              onChange={(e) => setPyqData({ ...pyqData, year: parseInt(e.target.value) })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Questions
            </label>
            <input
              type="number"
              value={pyqData.questions}
              onChange={(e) => setPyqData({ ...pyqData, questions: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., 100"
              min="0"
            />
          </div>
        </div>

        {/* Bilingual Subject Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject (English) *
            </label>
            <input
              type="text"
              value={pyqData.subject}
              onChange={(e) => setPyqData({ ...pyqData, subject: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., General Studies, Mathematics, etc."
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject (Hindi) *
            </label>
            <input
              type="text"
              value={pyqData.subjectHindi}
              onChange={(e) => setPyqData({ ...pyqData, subjectHindi: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent hindi"
              placeholder="e.g., सामान्य अध्ययन, गणित, आदि"
              required
            />
          </div>
        </div>

        {/* Category and File Upload */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              value={pyqData.category}
              onChange={(e) => setPyqData({ ...pyqData, category: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            >
              <option value="">Select Category</option>
              <option value="Preliminary">Preliminary</option>
              <option value="Mains">Mains</option>
              <option value="Optional">Optional</option>
              <option value="General Studies">General Studies</option>
              <option value="Aptitude">Aptitude</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              PDF File {!initialData && '*'}
            </label>
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
            {fileError && (
              <p className="mt-2 text-sm text-red-600">{fileError}</p>
            )}
            {file && (
              <p className="mt-2 text-sm text-green-600">
                ✅ Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
            {initialData?.file && !file && (
              <p className="mt-2 text-sm text-gray-600">
                📄 Current file: {initialData.file.split('/').pop()}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Maximum file size: 10MB • Only PDF files allowed
            </p>
          </div>
        </div>

        {/* Publish Option */}
        <div className="flex items-center p-4 bg-gray-50 rounded-lg">
          <input
            id="publish"
            type="checkbox"
            checked={pyqData.isPublished}
            onChange={(e) => setPyqData({ ...pyqData, isPublished: e.target.checked })}
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
          <label htmlFor="publish" className="ml-3 block text-sm font-medium text-gray-900">
            Publish immediately (make visible to users)
          </label>
        </div>

        {/* Form Validation Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Required Fields:</h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Title (English & Hindi)</li>
            <li>• Description (English & Hindi)</li>
            <li>• Exam Type, Year, and Category</li>
            <li>• Subject (English & Hindi)</li>
            <li>• PDF File (for new PYQs)</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-400 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 flex items-center"
          >
            {initialData ? 'Update PYQ' : 'Add PYQ'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminPyqEditor;