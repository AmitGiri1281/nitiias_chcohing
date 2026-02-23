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
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [readTime, setReadTime] = useState('');

  useEffect(() => {
    fetchBlog();
    // Check if blog is bookmarked
    const bookmarks = JSON.parse(localStorage.getItem('bookmarkedBlogs') || '[]');
    setIsBookmarked(bookmarks.includes(id));
  }, [id, i18n.language]);

  useEffect(() => {
    if (blog) {
      calculateReadTime();
    }
  }, [blog]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/blogs/${id}`);
      
      // ✅ API RESPONSE MATCHING AdminBlogEditor
      const blogData = {
        // Title fields
        title: response.data.title || response.data.titleHindi || '',
        titleHindi: response.data.titleHindi || response.data.title || '',
        
        // Content fields
        content: response.data.content || response.data.contentHindi || '',
        contentHindi: response.data.contentHindi || response.data.content || '',
        
        // Metadata
        category: response.data.category || '',
        tags: Array.isArray(response.data.tags) ? response.data.tags : 
              (typeof response.data.tags === 'string' ? response.data.tags.split(',') : []),
        
        // Author and dates
        author: response.data.author || { name: 'निति आईएएस टीम' },
        createdAt: response.data.createdAt || response.data.created_at || new Date().toISOString(),
        updatedAt: response.data.updatedAt || response.data.updated_at,
        
        // Stats
        views: response.data.views || response.data.viewCount || 0,
        likes: response.data.likes || 0,
        shares: response.data.shares || 0,
        
        // Image
        image: response.data.image || response.data.imageUrl || response.data.coverImage || null,
        
        // Status
        isPublished: response.data.isPublished !== false,
        isFeatured: response.data.isFeatured || false
      };
      
      setBlog(blogData);
      
      // Fetch related blogs based on category
      if (blogData.category) {
        fetchRelatedBlogs(blogData.category, id);
      }
      
    } catch (error) {
      console.error('ब्लॉग लोड करने में त्रुटि:', error);
      setError('ब्लॉग नहीं मिला');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedBlogs = async (category, excludeId) => {
    try {
      const response = await api.get('/blogs', {
        params: {
          category: category,
          limit: 3,
          exclude: excludeId
        }
      });
      
      if (response.data && Array.isArray(response.data)) {
        setRelatedBlogs(response.data.slice(0, 3));
      }
    } catch (error) {
      console.error('संबंधित ब्लॉग लोड करने में त्रुटि:', error);
    }
  };

  const calculateReadTime = () => {
    if (!blog) return;
    
    const content = i18n.language === 'hi' ? blog.contentHindi : blog.content;
    if (!content) return;
    
    // Average reading speed: 200 words per minute
    const wordCount = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(wordCount / 200);
    
    if (minutes < 1) {
      setReadTime('1 मिनट से कम');
    } else if (minutes === 1) {
      setReadTime('1 मिनट');
    } else {
      setReadTime(`${minutes} मिनट`);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'तारीख उपलब्ध नहीं';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'तारीख उपलब्ध नहीं';
      
      return date.toLocaleDateString('hi-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      return 'तारीख उपलब्ध नहीं';
    }
  };

  const getCategoryHindi = (category) => {
    if (!category) return 'सामान्य';
    
    const categoryMap = {
      'UPSC': 'UPSC परीक्षा',
      'PCS': 'PCS/राज्य सेवा',
      'Study Tips': 'अध्ययन तकनीकें',
      'Current Affairs': 'समसामयिक मुद्दे',
      'Interview Tips': 'साक्षात्कार तैयारी',
      'Success Stories': 'सफलता की कहानियाँ',
      'Exam Tips': 'परीक्षा टिप्स',
      'Study Material': 'अध्ययन सामग्री',
      'Strategy': 'रणनीति',
      'Motivation': 'प्रेरणा'
    };
    
    return categoryMap[category] || category;
  };

  const formatContentForDisplay = (content) => {
    if (!content) return '';
    
    // Escape HTML to prevent XSS
    const escapeHTML = (str) => {
      if (!str) return '';
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    };
    
    let formatted = escapeHTML(content);
    
    // Apply formatting similar to AdminBlogEditor's preview
    formatted = formatted
      // Headings
      .replace(/## (.*?)(\n|$)/g, '<h2 class="text-3xl font-bold mt-8 mb-4 text-gray-900 tracking-tight">$1</h2>')
      .replace(/### (.*?)(\n|$)/g, '<h3 class="text-2xl font-semibold mt-6 mb-3 text-gray-800">$1</h3>')
      
      // Bold and Italic
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-gray-800">$1</em>')
      
      // Underline
      .replace(/<u>(.*?)<\/u>/g, '<u class="underline decoration-2 decoration-blue-400">$1</u>')
      
      // Blockquotes
      .replace(/> (.*?)(\n|$)/g, '<blockquote class="border-l-4 border-blue-500 pl-4 italic text-gray-700 bg-blue-50 py-2 my-4">$1</blockquote>')
      
      // Lists
      .replace(/\n- (.*?)(\n|$)/g, '<li class="ml-6 list-disc mb-2 text-gray-700 pl-2">$1</li>')
      .replace(/\n1\. (.*?)(\n|$)/g, '<li class="ml-6 list-decimal mb-2 text-gray-700 pl-2">$1</li>')
      
      // Links
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 font-medium underline decoration-dotted hover:decoration-solid transition-colors" target="_blank" rel="noopener noreferrer">$1</a>')
      
      // Paragraphs and line breaks
      .replace(/\n\n/g, '</p><p class="mb-6 text-gray-700 leading-relaxed">')
      .replace(/\n/g, '<br>');
    
    return `<div class="prose prose-lg max-w-none"><p class="mb-6 text-gray-700 leading-relaxed">${formatted}</p></div>`;
  };

  const handleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarkedBlogs') || '[]');
    if (isBookmarked) {
      const newBookmarks = bookmarks.filter(blogId => blogId !== id);
      localStorage.setItem('bookmarkedBlogs', JSON.stringify(newBookmarks));
      setIsBookmarked(false);
    } else {
      const updatedBookmarks = [...bookmarks, id];
      localStorage.setItem('bookmarkedBlogs', JSON.stringify(updatedBookmarks));
      setIsBookmarked(true);
    }
  };

  const handleShare = (platform) => {
    if (!blog) return;
    
    const url = window.location.href;
    const title = i18n.language === 'hi' ? blog.titleHindi : blog.title;
    const text = i18n.language === 'hi' ? 
      `देखिए: ${blog.titleHindi}` : 
      `Check out: ${blog.title}`;
    
    switch(platform) {
      case 'facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`,
          '_blank',
          'noopener,noreferrer'
        );
        break;
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
          '_blank',
          'noopener,noreferrer'
        );
        break;
      case 'linkedin':
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
          '_blank',
          'noopener,noreferrer'
        );
        break;
      case 'whatsapp':
        window.open(
          `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
          '_blank',
          'noopener,noreferrer'
        );
        break;
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        alert('लिंक कॉपी किया गया!');
      })
      .catch(err => {
        console.error('लिंक कॉपी करने में त्रुटि:', err);
      });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-500 border-t-transparent mx-auto"></div>
            <p className="mt-6 text-xl text-gray-700 font-medium">ब्लॉग लोड हो रहा है...</p>
            <p className="mt-2 text-gray-500">कृपया प्रतीक्षा करें</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <AlertCircle className="mx-auto h-20 w-20 text-red-400 mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">त्रुटि</h2>
            <p className="text-gray-600 mb-6 text-lg">{error || 'ब्लॉग नहीं मिला'}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate('/blog')}
                className="px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/30 transition-all flex items-center"
              >
                <ArrowLeft size={20} className="mr-2" />
                ब्लॉग पर वापस जाएं
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-gray-500/30 transition-all flex items-center"
              >
                <Home size={20} className="mr-2" />
                होम पेज पर जाएं
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation and Share Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <button
            onClick={() => navigate('/blog')}
            className="flex items-center text-primary-600 hover:text-primary-700 font-semibold text-lg group"
          >
            <ArrowLeft size={24} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            सभी ब्लॉग देखें
          </button>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleBookmark}
              className={`p-3 rounded-xl flex items-center justify-center transition-all ${
                isBookmarked 
                  ? 'bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-600 shadow-lg shadow-amber-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:shadow-md'
              }`}
              title={isBookmarked ? 'बुकमार्क हटाएं' : 'बुकमार्क करें'}
            >
              <Bookmark size={22} fill={isBookmarked ? 'currentColor' : 'none'} />
            </button>
            
            <div className="relative group">
              <button className="p-3 bg-gradient-to-r from-green-100 to-emerald-100 text-emerald-600 rounded-xl hover:shadow-md transition-all flex items-center justify-center">
                <Share2 size={22} />
              </button>
              
              <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 p-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 flex gap-1">
                <button
                  onClick={() => handleShare('facebook')}
                  className="p-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  title="फेसबुक पर शेयर करें"
                >
                  <Facebook size={20} />
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  className="p-3 bg-sky-50 text-sky-600 rounded-lg hover:bg-sky-100 transition-colors"
                  title="ट्विटर पर शेयर करें"
                >
                  <Twitter size={20} />
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                  title="लिंक्डइन पर शेयर करें"
                >
                  <Linkedin size={20} />
                </button>
                <button
                  onClick={handleCopyLink}
                  className="p-3 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
                  title="लिंक कॉपी करें"
                >
                  🔗
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Article */}
        <article className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200/50">
          {/* Featured Image */}
          {blog.image && (
            <div className="relative h-96 overflow-hidden">
              <img 
                src={blog.image.startsWith('http') ? blog.image : `http://localhost:5000/${blog.image}`}
                alt={i18n.language === 'hi' ? blog.titleHindi : blog.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              
              {/* Category Badge */}
              <div className="absolute top-6 left-6">
                <span className="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm font-bold rounded-xl shadow-lg">
                  {getCategoryHindi(blog.category)}
                </span>
              </div>
              
              {/* Blog Title on Image for large screens */}
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight drop-shadow-lg">
                  {i18n.language === 'hi' ? blog.titleHindi : blog.title}
                </h1>
              </div>
            </div>
          )}

          {/* Blog Content */}
          <div className="p-8">
            {/* Meta Information Row */}
            <div className="flex flex-wrap items-center justify-between mb-8 pb-8 border-b border-gray-100">
              <div className="flex items-center space-x-6 mb-4 sm:mb-0">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary-100 to-primary-200 rounded-full flex items-center justify-center mr-3">
                    <User size={18} className="text-primary-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{blog.author?.name || 'निति आईएएस टीम'}</p>
                    <p className="text-sm text-gray-500">लेखक</p>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Calendar size={18} className="mr-2" />
                  <span>{formatDate(blog.createdAt)}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="flex items-center text-gray-600">
                  <Eye size={18} className="mr-2" />
                  <span className="font-medium">{blog.views || 0}</span>
                  <span className="ml-1">व्यूज</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Clock size={18} className="mr-2" />
                  <span>{readTime || 'पढ़ने का समय'}</span>
                </div>
              </div>
            </div>

            {/* Blog Title (if no image or on small screens) */}
            {!blog.image && (
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight">
                {i18n.language === 'hi' ? blog.titleHindi : blog.title}
              </h1>
            )}

            {/* Blog Content */}
            <div className="mb-8">
              <div 
                className="text-gray-800 leading-relaxed text-lg"
                dangerouslySetInnerHTML={{ 
                  __html: formatContentForDisplay(
                    i18n.language === 'hi' ? blog.contentHindi : blog.content
                  )
                }}
              />
            </div>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mb-8 pt-6 border-t border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">संबंधित टैग्स:</h3>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-medium rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                    >
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Author Bio */}
            {/* <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8 mt-8">
              <div className="flex items-start">
                <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mr-6 flex-shrink-0 shadow-lg">
                  <User size={28} className="text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">
                    {blog.author?.name || 'निति आईएएस टीम'} के बारे में
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    {blog.author?.bio || 'निति आईएएस टीम UPSC और राज्य सिविल सेवा परीक्षाओं के लिए विशेषज्ञ मार्गदर्शन प्रदान करती है। हमारा उद्देश्य उम्मीदवारों को गुणवत्तापूर्ण शिक्षा और संसाधन उपलब्ध कराना है। हमारे पास अनुभवी फैकल्टी और सफल उम्मीदवारों का नेटवर्क है जो आपकी तैयारी में मदद करते हैं।'}
                  </p>
                </div>
              </div>
            </div> */}

            {/* Call to Action */}
            <div className="mt-8 text-center bg-gradient-to-r from-primary-50 via-blue-50 to-primary-50 rounded-3xl p-8 border-2 border-dashed border-primary-200">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">🎯</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">और भी सीखना चाहते हैं?</h3>
              <p className="text-gray-600 mb-6 text-lg">
                UPSC और राज्य PCS परीक्षाओं की तैयारी के लिए अधिक संसाधन और मार्गदर्शन प्राप्त करें।
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => navigate('/courses')}
                  className="px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-primary-500/30 transition-all"
                >
                  हमारे कोर्सेज देखें
                </button>
                <button
                  onClick={() => navigate('/pyqs')}
                  className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
                >
                  PYQs प्रैक्टिस करें
                </button>
                <button
                  onClick={() => navigate('/blog')}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/30 transition-all"
                >
                  और ब्लॉग पढ़ें
                </button>
              </div>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        {(relatedBlogs.length > 0) && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-3xl font-bold text-gray-900">संबंधित ब्लॉग</h3>
              <button
                onClick={() => navigate('/blog')}
                className="text-primary-600 hover:text-primary-700 font-semibold flex items-center"
              >
                सभी देखें
                <ArrowLeft size={20} className="ml-2 rotate-180" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedBlogs.map((relatedBlog) => (
                <div 
                  key={relatedBlog._id || relatedBlog.id}
                  className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:shadow-2xl hover:border-primary-300 transition-all duration-300 cursor-pointer group"
                  onClick={() => navigate(`/blog/${relatedBlog._id || relatedBlog.id}`)}
                >
                  {relatedBlog.image && (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={relatedBlog.image.startsWith('http') ? relatedBlog.image : `http://localhost:5000/${relatedBlog.image}`}
                        alt={relatedBlog.titleHindi || relatedBlog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full">
                        {getCategoryHindi(relatedBlog.category)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDate(relatedBlog.createdAt)}
                      </span>
                    </div>
                    
                    <h4 className="font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {i18n.language === 'hi' ? relatedBlog.titleHindi : relatedBlog.title}
                    </h4>
                    
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {i18n.language === 'hi' 
                        ? (relatedBlog.contentHindi || '').substring(0, 100) + '...'
                        : (relatedBlog.content || '').substring(0, 100) + '...'
                      }
                    </p>
                    
                    <div className="flex items-center text-gray-500 text-sm">
                      <Clock size={14} className="mr-1" />
                      <span>~{Math.ceil(((relatedBlog.contentHindi || relatedBlog.content || '').length || 0) / 1500)} मिनट</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Back to Top Button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 p-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-full shadow-2xl hover:shadow-primary-500/50 transition-all hover:scale-110"
          title="ऊपर जाएं"
        >
          ↑
        </button>
      </div>
    </div>
  );
};

export default BlogPost;