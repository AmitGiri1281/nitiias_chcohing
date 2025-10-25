import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { api } from '../utils/api';
import { Calendar, User, Eye, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BlogPost = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/blogs/${id}`);
      setBlog(response.data);
    } catch (error) {
      console.error('Error fetching blog:', error);
      setError('Blog not found');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('error')}</h2>
          <p className="text-gray-600">{error || 'Blog not found'}</p>
          <button
            onClick={() => navigate('/blog')}
            className="mt-4 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
          >
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/blog')}
        className="flex items-center text-primary-600 hover:text-primary-700 mb-6"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Blog
      </button>

      <article className="bg-white rounded-lg shadow-md overflow-hidden">
        {blog.image && (
          <img 
            src={`http://localhost:5000/${blog.image}`} 
            alt={blog.title}
            className="w-full h-64 object-cover"
          />
        )}
        
        <div className="p-8">
          <span className="text-sm text-primary-600 font-semibold">{blog.category}</span>
          
          <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-4">
            {i18n.language === 'hi' ? blog.titleHindi : blog.title}
          </h1>
          
          <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
            <div className="flex items-center">
              <User size={16} className="mr-2" />
              <span>{blog.author?.name}</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Calendar size={16} className="mr-2" />
                <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <Eye size={16} className="mr-2" />
                <span>{blog.views} {t('views')}</span>
              </div>
            </div>
          </div>
          
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ 
              __html: i18n.language === 'hi' ? blog.contentHindi : blog.content 
            }}
          />
        </div>
      </article>
    </div>
  );
};

export default BlogPost;