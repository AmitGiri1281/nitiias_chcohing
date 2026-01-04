import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../utils/api';
import { Search, Filter, Calendar, FileText, Users, Target } from 'lucide-react';

const Pyqs = () => {
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Previous Year Questions</h1>
      <p className="text-gray-600 mb-8">Practice with authentic PYQs and track your progress</p>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search PYQs..."
                className="pl-10 w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Exam</label>
            <select
              value={filters.exam}
              onChange={(e) => handleFilterChange('exam', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="">All Exams</option>
              {exams.map(exam => (
                <option key={exam} value={exam}>{exam}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <select
              value={filters.year}
              onChange={(e) => handleFilterChange('year', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input
              type="text"
              value={filters.subject}
              onChange={(e) => handleFilterChange('subject', e.target.value)}
              placeholder="Enter subject..."
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-500">
            Found {pyqs.length} PYQs
          </div>
          <button
            onClick={clearFilters}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* PYQs Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading PYQs...</p>
        </div>
      ) : pyqs.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No PYQs Found</h3>
          <p className="text-gray-500">Try adjusting your filters or check back later.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pyqs.map((pyq) => (
            <div key={pyq._id} className="bg-white border rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <FileText className="text-green-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg line-clamp-2">{pyq.title}</h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Calendar size={14} className="mr-1" />
                        {pyq.year}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {pyq.exam}
                    </span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                      {pyq.category}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                      {pyq.subject}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2">{pyq.description}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center">
                    <Target className="mx-auto h-5 w-5 text-green-600 mb-1" />
                    <div className="text-sm font-semibold">{pyq.totalQuestions || 0}</div>
                    <div className="text-xs text-gray-500">Questions</div>
                  </div>
                  <div className="text-center">
                    <Users className="mx-auto h-5 w-5 text-blue-600 mb-1" />
                    <div className="text-sm font-semibold">{pyq.attempts || 0}</div>
                    <div className="text-xs text-gray-500">Attempts</div>
                  </div>
                  <div className="text-center">
                    <FileText className="mx-auto h-5 w-5 text-purple-600 mb-1" />
                    <div className="text-sm font-semibold">{pyq.totalMarks || 0}</div>
                    <div className="text-xs text-gray-500">Marks</div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Link
                    to={`/pyq/${pyq._id}`}
                    className="flex-1 text-center bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700"
                  >
                    Take Test
                  </Link>
                  <Link
                    to={`/pyq/${pyq._id}/study`}
                    className="flex-1 text-center bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700"
                  >
                    Study Mode
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

export default Pyqs;