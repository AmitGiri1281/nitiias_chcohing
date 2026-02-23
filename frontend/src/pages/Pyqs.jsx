import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../utils/api';
import { Search, Filter, Calendar, FileText, BookOpen, RefreshCw, XCircle } from 'lucide-react';

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
      const params = Object.fromEntries([...searchParams]);
      const queryString = new URLSearchParams(params).toString();
      const res = await api.get(`/pyqs${queryString ? `?${queryString}` : ''}`);
      setPyqs(res.data || []);
    } catch (err) {
      console.error(err);
      setPyqs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    const params = {};
    Object.entries(newFilters).forEach(([k, v]) => v && (params[k] = v));
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({ search: '', exam: '', year: '', category: '', subject: '' });
    setSearchParams({});
  };

  const getCategoryHindi = (c) => ({
    Preliminary: 'प्रारंभिक',
    Mains: 'मुख्य परीक्षा',
    Optional: 'वैकल्पिक',
    'General Studies': 'सामान्य अध्ययन',
    Aptitude: 'योग्यता',
    Other: 'अन्य'
  }[c] || c);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-5">

      {/* Header */}
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900">पिछले वर्षों के प्रश्न</h1>
      <p className="text-gray-600 text-sm mb-4">UPSC और PCS PYQs</p>

      {/* Filters */}
      <div className="bg-white rounded-lg border p-3 mb-4">
        <div className="flex items-center mb-3">
          <Filter size={18} className="text-green-600 mr-2" />
          <h3 className="font-semibold text-sm">फिल्टर</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 text-sm">
          <input placeholder="Search..."
            value={filters.search}
            onChange={e => handleFilterChange('search', e.target.value)}
            className="border p-2 rounded" />

          <select value={filters.exam} onChange={e => handleFilterChange('exam', e.target.value)} className="border p-2 rounded">
            <option value="">Exam</option>
            {exams.map(e => <option key={e}>{e}</option>)}
          </select>

          <select value={filters.year} onChange={e => handleFilterChange('year', e.target.value)} className="border p-2 rounded">
            <option value="">Year</option>
            {years.map(y => <option key={y}>{y}</option>)}
          </select>

          <select value={filters.category} onChange={e => handleFilterChange('category', e.target.value)} className="border p-2 rounded">
            <option value="">Category</option>
            {categories.map(c => <option key={c} value={c}>{getCategoryHindi(c)}</option>)}
          </select>

          <input placeholder="Subject..."
            value={filters.subject}
            onChange={e => handleFilterChange('subject', e.target.value)}
            className="border p-2 rounded" />
        </div>

        <div className="flex justify-between items-center mt-3 text-sm">
          <span className="text-gray-500">{pyqs.length} PYQs</span>
          <div className="flex gap-2">
            <button onClick={clearFilters} className="bg-gray-200 px-3 py-1.5 rounded">Clear</button>
            <button onClick={fetchPyqs} className="bg-green-600 text-white px-3 py-1.5 rounded">Refresh</button>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : pyqs.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No PYQs found</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

          {pyqs.map(pyq => (
            <div key={pyq._id} className="border rounded-lg p-3 hover:shadow">

              <div className="flex gap-3 mb-2">
                <div className="w-9 h-9 bg-green-100 rounded flex items-center justify-center">
                  <FileText size={18} className="text-green-600" />
                </div>

                <div>
                  <h3 className="font-semibold text-sm line-clamp-2">{pyq.titleHindi || pyq.title}</h3>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar size={12} /> {pyq.year}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 text-xs mb-2">
                <span className="bg-blue-100 px-2 rounded">{pyq.exam}</span>
                <span className="bg-purple-100 px-2 rounded">{getCategoryHindi(pyq.category)}</span>
                <span className="bg-gray-100 px-2 rounded">{pyq.subjectHindi || pyq.subject}</span>
              </div>

              <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                {pyq.descriptionHindi || pyq.description || 'कोई विवरण नहीं'}
              </p>

             <div className="flex gap-2 text-sm">
  <Link to={`/pyq/${pyq._id}`} className="flex-1 bg-green-600 text-white py-1.5 rounded text-center">
    Start
  </Link>
  <Link to={`/pyq/${pyq._id}/study`} className="flex-1 bg-blue-600 text-white py-1.5 rounded text-center">
    Study
  </Link>
</div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default Pyqs;
