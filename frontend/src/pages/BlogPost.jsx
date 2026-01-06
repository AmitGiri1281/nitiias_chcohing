import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { api } from '../utils/api';
import { Calendar, User, Eye, ArrowLeft, Clock, Share2, Bookmark, Facebook, Twitter, Linkedin, AlertCircle, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BlogPost = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    fetchBlog();
    // Check if blog is bookmarked
    const bookmarks = JSON.parse(localStorage.getItem('bookmarkedBlogs') || '[]');
    setIsBookmarked(bookmarks.includes(id));
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/blogs/${id}`);
      setBlog(response.data);
    } catch (error) {
      console.error('ब्लॉग लोड करने में त्रुटि:', error);
      setError('ब्लॉग नहीं मिला');
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

  const handleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarkedBlogs') || '[]');
    if (isBookmarked) {
      const newBookmarks = bookmarks.filter(blogId => blogId !== id);
      localStorage.setItem('bookmarkedBlogs', JSON.stringify(newBookmarks));
      setIsBookmarked(false);
    } else {
      bookmarks.push(id);
      localStorage.setItem('bookmarkedBlogs', JSON.stringify(bookmarks));
      setIsBookmarked(true);
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = blog?.titleHindi || blog?.title;
    
    switch(platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`, '_blank');
        break;
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">ब्लॉग लोड हो रहा है...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <AlertCircle className="mx-auto h-16 w-16 text-red-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">त्रुटि</h2>
          <p className="text-gray-600 mb-6">{error || 'ब्लॉग नहीं मिला'}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/blog')}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 flex items-center transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              ब्लॉग पर वापस जाएं
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 flex items-center transition-colors"
            >
              <Home size={20} className="mr-2" />
              होम पेज पर जाएं
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/blog')}
          className="flex items-center text-primary-600 hover:text-primary-700 font-medium"
        >
          <ArrowLeft size={20} className="mr-2" />
          ब्लॉग पर वापस जाएं
        </button>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleBookmark}
            className={`p-2 rounded-full ${isBookmarked ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            title={isBookmarked ? 'बुकमार्क हटाएं' : 'बुकमार्क करें'}
          >
            <Bookmark size={20} fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={() => handleShare('facebook')}
            className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200"
            title="फेसबुक पर शेयर करें"
          >
            <Facebook size={20} />
          </button>
          <button
            onClick={() => handleShare('twitter')}
            className="p-2 bg-sky-100 text-sky-600 rounded-full hover:bg-sky-200"
            title="ट्विटर पर शेयर करें"
          >
            <Twitter size={20} />
          </button>
          <button
            onClick={() => handleShare('linkedin')}
            className="p-2 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100"
            title="लिंक्डइन पर शेयर करें"
          >
            <Linkedin size={20} />
          </button>
        </div>
      </div>

      {/* Blog Article */}
      <article className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        {blog.image && (
          <div className="relative h-80 overflow-hidden">
            <img 
              src={`http://localhost:5000/${blog.image}`} 
              alt={i18n.language === 'hi' ? blog.titleHindi : blog.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className="px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-lg">
                {getCategoryHindi(blog.category)}
              </span>
            </div>
          </div>
        )}
        
        <div className="p-8">
          {/* Meta Information */}
          <div className="flex flex-wrap items-center justify-between mb-6 pb-6 border-b border-gray-100">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <div className="flex items-center">
                <User size={18} className="mr-2 text-gray-500" />
                <span className="text-gray-700 font-medium">{blog.author?.name || 'निति आईएएस'}</span>
              </div>
              <div className="flex items-center">
                <Calendar size={18} className="mr-2 text-gray-500" />
                <span className="text-gray-600">{formatDate(blog.createdAt)}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Eye size={18} className="mr-2 text-gray-500" />
                <span className="text-gray-600">{blog.views || 0} बार देखा गया</span>
              </div>
              <div className="flex items-center">
                <Clock size={18} className="mr-2 text-gray-500" />
                <span className="text-gray-600">5 मिनट पढ़ने का समय</span>
              </div>
            </div>
          </div>
          
          {/* Blog Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
            {i18n.language === 'hi' ? blog.titleHindi : blog.title}
          </h1>
          
          {/* Blog Content */}
          <div className="prose prose-lg max-w-none mb-8">
            <div 
              className="text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: i18n.language === 'hi' ? blog.contentHindi : blog.content 
              }}
            />
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mb-8 pt-6 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">टैग्स:</h3>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Author Bio */}
          <div className="bg-gray-50 rounded-lg p-6 mt-8">
            <div className="flex items-start">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <User size={24} className="text-primary-600" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {blog.author?.name || 'निति आईएएस टीम'} के बारे में
                </h4>
                <p className="text-gray-600">
                  {blog.author?.bio || 'निति आईएएस टीम UPSC और राज्य सिविल सेवा परीक्षाओं के लिए विशेषज्ञ मार्गदर्शन प्रदान करती है। हमारा उद्देश्य उम्मीदवारों को गुणवत्तापूर्ण शिक्षा और संसाधन उपलब्ध कराना है।'}
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-8 text-center bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3">और भी सीखना चाहते हैं?</h3>
            <p className="text-gray-600 mb-4">
              UPSC और राज्य PCS परीक्षाओं की तैयारी के लिए अधिक संसाधन और मार्गदर्शन प्राप्त करें।
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate('/courses')}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                हमारे कोर्सेज देखें
              </button>
              <button
                onClick={() => navigate('/pyqs')}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                PYQs प्रैक्टिस करें
              </button>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts (Placeholder) */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">संबंधित ब्लॉग</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <h4 className="font-semibold text-gray-900 mb-2">UPSC प्रारंभिक परीक्षा की तैयारी कैसे करें?</h4>
            <p className="text-gray-600 text-sm">UPSC प्रारंभिक परीक्षा की तैयारी के लिए सर्वोत्तम रणनीति और टिप्स</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <h4 className="font-semibold text-gray-900 mb-2">समसामयिकी तैयारी के लिए महत्वपूर्ण स्रोत</h4>
            <p className="text-gray-600 text-sm">UPSC परीक्षा के लिए समसामयिकी तैयारी के सर्वोत्तम स्रोत</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <h4 className="font-semibold text-gray-900 mb-2">मुख्य परीक्षा उत्तर लेखन कला</h4>
            <p className="text-gray-600 text-sm">UPSC मुख्य परीक्षा में उच्च अंक प्राप्त करने के लिए उत्तर लेखन कला</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;