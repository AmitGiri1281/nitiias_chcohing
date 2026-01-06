import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';
import AdminBlogEditor from '../components/AdminBlogEditor';
import AdminCourseEditor from '../components/AdminCourseEditor';
import AdminPyqEditor from '../components/AdminPyqEditor';
import { Edit, Trash2, Eye, Plus, FileText, Users, Clock, Target } from 'lucide-react';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('blogs');
  const [blogs, setBlogs] = useState([]);
  const [courses, setCourses] = useState([]);
  const [pyqs, setPyqs] = useState([]);
  const [editingBlog, setEditingBlog] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingPyq, setEditingPyq] = useState(null);
  const [showBlogEditor, setShowBlogEditor] = useState(false);
  const [showCourseEditor, setShowCourseEditor] = useState(false);
  const [showPyqEditor, setShowPyqEditor] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pyqStats, setPyqStats] = useState({
    total: 0,
    published: 0,
    totalQuestions: 0,
    totalMarks: 0
  });

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchData();
    }
  }, [user, activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'blogs') {
        const response = await api.get('/blogs/admin');
        setBlogs(response.data.blogs || []);
      } else if (activeTab === 'courses') {
        const response = await api.get('/courses');
        setCourses(response.data || []);
      } else if (activeTab === 'pyqs') {
        // नया एडमिन एंडपॉइंट उपयोग करें
        try {
          const response = await api.get('/pyqs/admin/list');
          const pyqsData = response.data || [];
          setPyqs(pyqsData);
          
          // आँकड़े गणना
          const stats = {
            total: pyqsData.length,
            published: pyqsData.filter(p => p.isPublished).length,
            totalQuestions: pyqsData.reduce((sum, pyq) => sum + (pyq.totalQuestions || 0), 0),
            totalMarks: pyqsData.reduce((sum, pyq) => sum + (pyq.totalMarks || 0), 0)
          };
          setPyqStats(stats);
        } catch (error) {
          console.error('PYQs प्राप्त करने में त्रुटि:', error);
          setPyqs([]);
          setPyqStats({ total: 0, published: 0, totalQuestions: 0, totalMarks: 0 });
        }
      }
    } catch (error) {
      console.error('डेटा प्राप्त करने में त्रुटि:', error);
    } finally {
      setLoading(false);
    }
  };

  /** ---------------- ब्लॉग हैंडलर्स ---------------- */
  const handleCreateBlog = () => {
    setEditingBlog(null);
    setShowBlogEditor(true);
  };

  const handleEditBlog = (blog) => {
    setEditingBlog(blog);
    setShowBlogEditor(true);
  };

  const handleSaveBlog = async (formData) => {
    try {
      if (editingBlog) {
        await api.put(`/blogs/${editingBlog._id}`, formData);
      } else {
        await api.post('/blogs', formData);
      }
      setShowBlogEditor(false);
      setEditingBlog(null);
      fetchData();
    } catch (error) {
      console.error('ब्लॉग सहेजने में त्रुटि:', error);
    }
  };

  const handleDeleteBlog = async (id) => {
    if (window.confirm('क्या आप वाकई इस ब्लॉग को हटाना चाहते हैं?')) {
      try {
        await api.delete(`/blogs/${id}`);
        fetchData();
      } catch (error) {
        console.error('ब्लॉग हटाने में त्रुटि:', error);
      }
    }
  };

  /** ---------------- कोर्स हैंडलर्स ---------------- */
  const handleCreateCourse = () => {
    setEditingCourse(null);
    setShowCourseEditor(true);
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setShowCourseEditor(true);
  };

  const handleSaveCourse = async (formData) => {
    try {
      if (editingCourse) {
        await api.put(`/courses/${editingCourse._id}`, formData);
      } else {
        await api.post('/courses', formData);
      }
      setShowCourseEditor(false);
      setEditingCourse(null);
      fetchData();
    } catch (error) {
      console.error('कोर्स सहेजने में त्रुटि:', error);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm('क्या आप वाकई इस कोर्स को हटाना चाहते हैं?')) {
      try {
        await api.delete(`/courses/${id}`);
        fetchData();
      } catch (error) {
        console.error('कोर्स हटाने में त्रुटि:', error);
      }
    }
  };

  /** ---------------- PYQ हैंडलर्स ---------------- */
  const handleCreatePyq = () => {
    setEditingPyq(null);
    setShowPyqEditor(true);
  };

  const handleEditPyq = (pyq) => {
    setEditingPyq(pyq);
    setShowPyqEditor(true);
  };

  const handleSavePyq = async (formData) => {
    try {
      // फॉर्म डेटा को FormData ऑब्जेक्ट में बदलें
      const formDataObj = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'questions') {
          formDataObj.append(key, formData[key]);
        } else {
          formDataObj.append(key, formData[key]);
        }
      });

      if (editingPyq) {
        await api.put(`/pyqs/admin/${editingPyq._id}`, formDataObj);
      } else {
        await api.post('/pyqs/admin', formDataObj);
      }
      setShowPyqEditor(false);
      setEditingPyq(null);
      fetchData();
    } catch (error) {
      console.error('PYQ सहेजने में त्रुटि:', error.response?.data || error.message);
      alert(`PYQ सहेजने में त्रुटि: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDeletePyq = async (id) => {
    if (window.confirm('क्या आप वाकई इस PYQ को हटाना चाहते हैं?')) {
      try {
        await api.delete(`/pyqs/admin/${id}`);
        fetchData();
      } catch (error) {
        console.error('PYQ हटाने में त्रुटि:', error);
      }
    }
  };

  const handleViewPyq = (pyq) => {
    // PYQ टेस्ट पेज पर नेविगेट करें
    window.open(`/pyq/${pyq._id}`, '_blank');
  };

  /** ---------------- एक्सेस चेक ---------------- */
  if (user?.role !== 'admin') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">अभिगम निषेध</h2>
          <p className="text-gray-600">इस पेज तक पहुँचने के लिए आपको एडमिन होना चाहिए।</p>
        </div>
      </div>
    );
  }

  /** ---------------- एडिटर मोडल ---------------- */
  if (showBlogEditor) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminBlogEditor
          onSave={handleSaveBlog}
          initialData={editingBlog}
          onCancel={() => {
            setShowBlogEditor(false);
            setEditingBlog(null);
          }}
        />
      </div>
    );
  }

  if (showCourseEditor) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminCourseEditor
          onSave={handleSaveCourse}
          initialData={editingCourse}
          onCancel={() => {
            setShowCourseEditor(false);
            setEditingCourse(null);
          }}
        />
      </div>
    );
  }

  if (showPyqEditor) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminPyqEditor
          onSave={handleSavePyq}
          initialData={editingPyq}
          onCancel={() => {
            setShowPyqEditor(false);
            setEditingPyq(null);
          }}
        />
      </div>
    );
  }

  /** ---------------- मुख्य रेंडर ---------------- */
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('dashboard') || 'डैशबोर्ड'}</h1>
      
      {/* टैब्स */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('blogs')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'blogs'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {t('blogManagement') || 'ब्लॉग प्रबंधन'}
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'courses'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {t('courseManagement') || 'कोर्स प्रबंधन'}
          </button>
          <button
            onClick={() => setActiveTab('pyqs')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'pyqs'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FileText size={16} className="mr-2" />
            {t('pyqManagement') || 'PYQ प्रबंधन'}
          </button>
        </nav>
      </div>

      {/* सामग्री */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('loading') || 'लोड हो रहा है...'}</p>
        </div>
      ) : activeTab === 'blogs' ? (
        /* ब्लॉग प्रबंधन अनुभाग */
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">{t('blogManagement') || 'ब्लॉग प्रबंधन'}</h2>
            <button
              onClick={handleCreateBlog}
              className="bg-primary-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-primary-700"
            >
              <Plus size={20} className="mr-2" />
              {t('createNew') || 'नया बनाएं'}
            </button>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {blogs.map((blog) => (
                <li key={blog._id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          {blog.image ? (
                            <img className="h-10 w-10 rounded-full" src={`https://nitiias-chcohing-backend.onrender.com/${blog.image}`} alt="" />
                          ) : (
                            <span className="text-gray-400">📝</span>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <h3 className="text-sm font-medium text-gray-900">{blog.title}</h3>
                            <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              blog.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {blog.isPublished ? (t('published') || 'प्रकाशित') : (t('draft') || 'ड्राफ्ट')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">
                            {new Date(blog.createdAt).toLocaleDateString('hi-IN')} • {blog.views} {t('views') || 'दृश्य'}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => window.open(`/blog/${blog._id}`, '_blank')}
                          className="text-gray-400 hover:text-gray-500"
                          title={t('view') || 'देखें'}
                        >
                          <Eye size={20} />
                        </button>
                        <button
                          onClick={() => handleEditBlog(blog)}
                          className="text-blue-400 hover:text-blue-500"
                          title={t('edit') || 'संपादित करें'}
                        >
                          <Edit size={20} />
                        </button>
                        <button
                          onClick={() => handleDeleteBlog(blog._id)}
                          className="text-red-400 hover:text-red-500"
                          title={t('delete') || 'हटाएं'}
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            {blogs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">{t('noBlogs') || 'कोई ब्लॉग नहीं मिला'}</p>
              </div>
            )}
          </div>
        </div>
      ) : activeTab === 'courses' ? (
        /* कोर्स प्रबंधन अनुभाग */
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">{t('courseManagement') || 'कोर्स प्रबंधन'}</h2>
            <button
              onClick={handleCreateCourse}
              className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700"
            >
              <Plus size={20} className="mr-2" />
              {t('createNewCourse') || 'नया कोर्स बनाएं'}
            </button>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {courses.map((course) => (
                <li key={course._id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          {course.image ? (
                            <img className="h-10 w-10 rounded-full" src={`https://nitiias-chcohing-backend.onrender.com/${course.image}`} alt="" />
                          ) : (
                            <span className="text-gray-400">📚</span>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <h3 className="text-sm font-medium text-gray-900">{course.title}</h3>
                            <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              course.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {course.isActive ? (t('active') || 'सक्रिय') : (t('inactive') || 'निष्क्रिय')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">
                            {course.category} • ₹{course.price} • {course.duration}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditCourse(course)}
                          className="text-blue-400 hover:text-blue-500"
                          title={t('edit') || 'संपादित करें'}
                        >
                          <Edit size={20} />
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course._id)}
                          className="text-red-400 hover:text-red-500"
                          title={t('delete') || 'हटाएं'}
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            {courses.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">{t('noCourses') || 'कोई कोर्स नहीं मिला'}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* PYQ प्रबंधन अनुभाग */
        <div>
          {/* PYQ आँकड़े */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg mr-4">
                  <FileText className="text-green-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">कुल PYQs</p>
                  <p className="text-2xl font-bold">{pyqStats.total}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg mr-4">
                  <Target className="text-blue-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">प्रकाशित</p>
                  <p className="text-2xl font-bold">{pyqStats.published}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg mr-4">
                  <Users className="text-purple-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">कुल प्रश्न</p>
                  <p className="text-2xl font-bold">{pyqStats.totalQuestions}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg mr-4">
                  <Clock className="text-yellow-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">कुल अंक</p>
                  <p className="text-2xl font-bold">{pyqStats.totalMarks}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">{t('pyqManagement') || 'PYQ प्रबंधन'}</h2>
            <button
              onClick={handleCreatePyq}
              className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-green-700"
            >
              <Plus size={20} className="mr-2" />
              {t('addNewPYQ') || 'नया PYQ जोड़ें'}
            </button>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {pyqs.map((pyq) => (
                <li key={pyq._id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <FileText className="text-gray-500" size={20} />
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <h3 className="text-sm font-medium text-gray-900">{pyq.title}</h3>
                            <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              pyq.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {pyq.isPublished ? (t('published') || 'प्रकाशित') : (t('draft') || 'ड्राफ्ट')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">
                            {pyq.exam} • {pyq.year} • {pyq.subject} • {pyq.totalQuestions || 0} प्रश्न
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-gray-400">
                              <Users size={12} className="inline mr-1" />
                              {pyq.attempts || 0} प्रयास
                            </span>
                            <span className="text-xs text-gray-400">
                              <Eye size={12} className="inline mr-1" />
                              {pyq.views || 0} दृश्य
                            </span>
                            <span className="text-xs text-gray-400">
                              <Target size={12} className="inline mr-1" />
                              औसत: {(pyq.averageScore || 0).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewPyq(pyq)}
                          className="text-gray-400 hover:text-gray-500"
                          title={t('viewTest') || 'टेस्ट देखें'}
                        >
                          <Eye size={20} />
                        </button>
                        <button
                          onClick={() => handleEditPyq(pyq)}
                          className="text-blue-400 hover:text-blue-500"
                          title={t('edit') || 'संपादित करें'}
                        >
                          <Edit size={20} />
                        </button>
                        <button
                          onClick={() => handleDeletePyq(pyq._id)}
                          className="text-red-400 hover:text-red-500"
                          title={t('delete') || 'हटाएं'}
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            {pyqs.length === 0 && (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">{t('noPYQs') || 'कोई PYQ नहीं मिला'}</p>
                <p className="text-sm text-gray-400 mt-2">"नया PYQ जोड़ें" बटन का उपयोग करके अपना पहला PYQ जोड़ें</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;