import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Download, Calendar, Filter, Search, Eye } from 'lucide-react';
import { api } from '../utils/api';

const Pyqs = () => {
  const { t, i18n } = useTranslation();
  const [pyqs, setPyqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExam, setSelectedExam] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');

  useEffect(() => {
    fetchPyqs();
  }, []);

  const fetchPyqs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/pyqs');
      setPyqs(response.data);
    } catch (error) {
      console.error('Error fetching PYQs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter PYQs based on search and filters
  const filteredPyqs = pyqs.filter(pyq => {
    const matchesSearch = pyq.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pyq.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesExam = selectedExam === 'all' || pyq.exam === selectedExam;
    const matchesYear = selectedYear === 'all' || pyq.year.toString() === selectedYear;
    
    return matchesSearch && matchesExam && matchesYear;
  });

  // Get unique years and exams for filters
  const years = [...new Set(pyqs.map(pyq => pyq.year))].sort((a, b) => b - a);
  const exams = [...new Set(pyqs.map(pyq => pyq.exam))];

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading PYQs...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-4">
            <FileText className="h-8 w-8 text-green-600 mr-2" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Previous Year Questions
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Access previous years' question papers for various competitive examinations
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by title or subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Exam Filter */}
            <div>
              <select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Exams</option>
                {exams.map(exam => (
                  <option key={exam} value={exam}>{exam}</option>
                ))}
              </select>
            </div>

            {/* Year Filter */}
            <div>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Years</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* PYQs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredPyqs.length > 0 ? filteredPyqs.map((pyq) => (
            <div key={pyq._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-green-100">
              <div className="h-48 bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center relative">
                <FileText className="text-white" size={48} />
                <div className="absolute top-4 right-4 flex space-x-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-800 text-white">
                    {pyq.exam}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {pyq.category}
                  </span>
                  <span className="inline-flex items-center text-sm text-gray-500">
                    <Calendar size={14} className="mr-1" />
                    {pyq.year}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {i18n.language === 'hi' ? pyq.titleHindi : pyq.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {i18n.language === 'hi' ? pyq.descriptionHindi : pyq.description}
                </p>
                
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <span>Subject: {i18n.language === 'hi' ? pyq.subjectHindi : pyq.subject}</span>
                  {pyq.questions > 0 && (
                    <span>{pyq.questions} questions</span>
                  )}
                </div>

                <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                  <span className="flex items-center">
                    <Eye size={12} className="mr-1" />
                    {pyq.downloads} downloads
                  </span>
                  <span>Added: {new Date(pyq.createdAt).toLocaleDateString()}</span>
                </div>
                
                <a
                  href={`https://nitiias-chcohing-backend.onrender.com/${pyq.file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-md font-medium flex items-center justify-center transition-colors"
                  onClick={() => {
                    // Track download in your analytics
                    console.log('Downloaded:', pyq.title);
                  }}
                >
                  <Download size={16} className="mr-2" />
                  Download PDF
                </a>
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No PYQs Found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {/* Sample PYQs when no data available */}
        {pyqs.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No PYQs Available Yet</h3>
            <p className="text-gray-500 mb-6">Check back later for previous year question papers</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden border border-green-100 opacity-75">
                  <div className="h-48 bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
                    <FileText className="text-white" size={48} />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        UPSC
                      </span>
                      <span className="inline-flex items-center text-sm text-gray-500">
                        <Calendar size={14} className="mr-1" />
                        2023
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      UPSC Civil Services Preliminary {item === 1 ? 'GS Paper I' : item === 2 ? 'GS Paper II' : 'Optional Paper'}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4">
                      Complete question paper with answer key and solutions
                    </p>
                    
                    <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                      <span>Subject: General Studies</span>
                      <span>100 questions</span>
                    </div>
                    
                    <button className="w-full bg-gray-400 text-white py-3 px-4 rounded-md font-medium flex items-center justify-center cursor-not-allowed">
                      <Download size={16} className="mr-2" />
                      Coming Soon
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pyqs;  