import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../utils/api';
import { Calendar, User, Eye, FileText, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Blog = () => {
  const { t, i18n } = useTranslation();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchBlogs();
  }, [currentPage]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/blogs?page=${currentPage}&limit=9`);
      setBlogs(response.data.blogs);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('ब्लॉग लोड करने में त्रुटि:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('hi-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getCategoryHindi = (category) => {
    switch(category) {
      case 'Exam Tips': return 'परीक्षा टिप्स';
      case 'Study Material': return 'अध्ययन सामग्री';
      case 'Current Affairs': return 'समसामयिकी';
      case 'Success Stories': return 'सफलता की कहानियाँ';
      case 'Strategy': return 'रणनीति';
      case 'Motivation': return 'प्रेरणा';
      default: return category;
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">ब्लॉग लोड हो रहे हैं...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="inline-block p-3 bg-primary-100 rounded-full mb-4">
          <FileText className="h-8 w-8 text-primary-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">ब्लॉग</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto hindi">
          सिविल सेवा उम्मीदवारों के लिए अंतर्दृष्टि, टिप्स और अपडेट्स
        </p>
      </div>

      {/* Blogs Grid */}
      {blogs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {blogs.map((blog) => (
              <div key={blog._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100">
                {blog.image && (
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={`http://localhost:5000/${blog.image}`} 
                      alt={i18n.language === 'hi' ? blog.titleHindi : blog.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-primary-600 text-white text-xs font-semibold rounded-full">
                        {getCategoryHindi(blog.category)}
                      </span>
                    </div>
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <div className="flex items-center mr-4">
                      <User size={16} className="mr-1" />
                      <span>{blog.author?.name || 'निति आईएएस'}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-1" />
                      <span>{formatDate(blog.createdAt)}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 min-h-[56px]">
                    {i18n.language === 'hi' ? blog.titleHindi : blog.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3 min-h-[72px]">
                    {i18n.language === 'hi' 
                      ? (blog.contentHindi ? blog.contentHindi.substring(0, 150) + '...' : '')
                      : blog.content.substring(0, 150) + '...'
                    }
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-500">
                      <Eye size={16} className="mr-1" />
                      <span>{blog.views || 0} बार देखा गया</span>
                    </div>
                    <Link
                      to={`/blog/${blog._id}`}
                      className="text-primary-600 hover:text-primary-700 font-semibold flex items-center"
                    >
                      पूरा पढ़ें
                      <ChevronRight size={16} className="ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mb-12">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-colors"
              >
                <ChevronLeft size={18} className="mr-1" />
                पिछला
              </button>
              
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 rounded-lg min-w-[40px] ${
                        currentPage === pageNum
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <>
                    <span className="px-2 py-2">...</span>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-colors"
              >
                अगला
                <ChevronRight size={18} className="ml-1" />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">कोई ब्लॉग नहीं मिले</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            वर्तमान में कोई ब्लॉग उपलब्ध नहीं हैं। कृपया बाद में पुनः प्रयास करें।
          </p>
        </div>
      )}

      {/* Newsletter Signup */}
      <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl p-8 text-center border border-primary-100">
        <h3 className="text-2xl font-bold text-gray-900 mb-3">नियमित अपडेट प्राप्त करें</h3>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          सिविल सेवा परीक्षाओं के लिए नवीनतम अपडेट, टिप्स और संसाधन सीधे अपने इनबॉक्स में प्राप्त करें।
        </p>
        <div className="max-w-md mx-auto flex gap-2">
          <input
            type="email"
            placeholder="अपना ईमेल दर्ज करें"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <button className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors">
            सब्सक्राइब करें
          </button>
        </div>
      </div>
    </div>
  );
};

export default Blog;