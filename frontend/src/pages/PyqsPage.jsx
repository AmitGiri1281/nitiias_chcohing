import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../utils/api';
import { Search, Filter, Calendar, FileText, Users, Target, BookOpen, RefreshCw, XCircle, Clock } from 'lucide-react';

const PyqsPage = () => {
  const [pyqs, setPyqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: '',
    exam: '',
    year: '',
    category: '',
    subject: ''
  });

  const exams = ['UPSC', 'State PCS', 'IAS', 'Other'];
  const categories = ['Preliminary', 'Mains', 'Optional', 'General Studies', 'Aptitude', 'Other'];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear - i);

  useEffect(() => {
    fetchPyqs();
  }, [searchParams]);

  const fetchPyqs = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchParams.get('search')) params.search = searchParams.get('search');
      if (searchParams.get('exam')) params.exam = searchParams.get('exam');
      if (searchParams.get('year')) params.year = searchParams.get('year');
      if (searchParams.get('category')) params.category = searchParams.get('category');
      if (searchParams.get('subject')) params.subject = searchParams.get('subject');

      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`/pyqs${queryString ? `?${queryString}` : ''}`);
      setPyqs(response.data || []);
    } catch (err) {
      console.error('Error fetching PYQs:', err);
      setPyqs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    const params = {};
    if (newFilters.search) params.search = newFilters.search;
    if (newFilters.exam) params.exam = newFilters.exam;
    if (newFilters.year) params.year = newFilters.year;
    if (newFilters.category) params.category = newFilters.category;
    if (newFilters.subject) params.subject = newFilters.subject;
    
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      exam: '',
      year: '',
      category: '',
      subject: ''
    });
    setSearchParams({});
  };

  const getCategoryHindi = (category) => {
    switch(category) {
      case 'Preliminary': return 'प्रारंभिक';
      case 'Mains': return 'मुख्य परीक्षा';
      case 'Optional': return 'वैकल्पिक';
      case 'General Studies': return 'सामान्य अध्ययन';
      case 'Aptitude': return 'योग्यता';
      case 'Other': return 'अन्य';
      default: return category;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 text-gray-900">पिछले वर्षों के प्रश्न</h1>
      <p className="text-gray-600 mb-8">प्रामाणिक PYQs के साथ अभ्यास करें और अपनी प्रगति को ट्रैक करें</p>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center mb-4">
          <Filter className="text-green-600 mr-2" size={20} />
          <h3 className="text-lg font-semibold">फिल्टर</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">खोजें</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="PYQs खोजें..."
                className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">परीक्षा</label>
            <select
              value={filters.exam}
              onChange={(e) => handleFilterChange('exam', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">सभी परीक्षाएं</option>
              {exams.map(exam => (
                <option key={exam} value={exam}>{exam}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">वर्ष</label>
            <select
              value={filters.year}
              onChange={(e) => handleFilterChange('year', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">सभी वर्ष</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">श्रेणी</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">सभी श्रेणियाँ</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{getCategoryHindi(cat)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">विषय</label>
            <input
              type="text"
              value={filters.subject}
              onChange={(e) => handleFilterChange('subject', e.target.value)}
              placeholder="विषय दर्ज करें..."
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            {pyqs.length} PYQs मिले
          </div>
          <div className="flex gap-2">
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 flex items-center transition-colors"
            >
              <XCircle size={16} className="mr-2" />
              फिल्टर साफ़ करें
            </button>
            <button
              onClick={fetchPyqs}
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 flex items-center transition-colors"
            >
              <RefreshCw size={16} className="mr-2" />
              रिफ्रेश करें
            </button>
          </div>
        </div>
      </div>

      {/* PYQs Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">PYQs लोड हो रहे हैं...</p>
        </div>
      ) : pyqs.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">कोई PYQs नहीं मिले</h3>
          <p className="text-gray-500 mb-4">अपने फिल्टर समायोजित करें या बाद में पुनः प्रयास करें।</p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
          >
            सभी फिल्टर हटाएं
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pyqs.map((pyq) => (
            <div key={pyq._id} className="bg-white border border-gray-200 rounded-lg shadow hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                      <FileText className="text-green-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg line-clamp-2 text-gray-900">
                        {pyq.titleHindi || pyq.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Calendar size={14} className="mr-1" />
                        वर्ष: {pyq.year}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {pyq.exam}
                    </span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded hindi">
                      {getCategoryHindi(pyq.category)}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded hindi">
                      {pyq.subjectHindi || pyq.subject}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {pyq.descriptionHindi || pyq.description || 'कोई विवरण नहीं'}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-5">
                  <div className="text-center bg-gray-50 p-2 rounded">
                    <Target className="mx-auto h-5 w-5 text-green-600 mb-1" />
                    <div className="text-sm font-semibold">{pyq.totalQuestions || 0}</div>
                    <div className="text-xs text-gray-500">प्रश्न</div>
                  </div>
                  <div className="text-center bg-gray-50 p-2 rounded">
                    <Users className="mx-auto h-5 w-5 text-blue-600 mb-1" />
                    <div className="text-sm font-semibold">{pyq.attempts || 0}</div>
                    <div className="text-xs text-gray-500">प्रयास</div>
                  </div>
                  <div className="text-center bg-gray-50 p-2 rounded">
                    <Clock className="mx-auto h-5 w-5 text-purple-600 mb-1" />
                    <div className="text-sm font-semibold">{pyq.totalMarks || 0}</div>
                    <div className="text-xs text-gray-500">अंक</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Link
                    to={`/pyq/${pyq._id}`}
                    className="flex-1 text-center bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 flex items-center justify-center transition-colors"
                  >
                    <BookOpen size={16} className="mr-2" />
                    परीक्षा दें
                  </Link>
                  <Link
                    to={`/study/${pyq._id}`}
                    className="flex-1 text-center bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center transition-colors"
                  >
                    <FileText size={16} className="mr-2" />
                    अध्ययन मोड
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PyqsPage;