import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';
import AdminBlogEditor from '../components/AdminBlogEditor';
import AdminCourseEditor from '../components/AdminCourseEditor';
import AdminPyqEditor from '../components/AdminPyqEditor'; // Add this import
import { Edit, Trash2, Eye, Plus, FileText } from 'lucide-react'; // Add FileText icon

const AdminDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('blogs');
  const [blogs, setBlogs] = useState([]);
  const [courses, setCourses] = useState([]);
  const [pyqs, setPyqs] = useState([]); // Add PYQs state
  const [editingBlog, setEditingBlog] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingPyq, setEditingPyq] = useState(null); // Add PYQ editing state
  const [showBlogEditor, setShowBlogEditor] = useState(false);
  const [showCourseEditor, setShowCourseEditor] = useState(false);
  const [showPyqEditor, setShowPyqEditor] = useState(false); // Add PYQ editor state
  const [loading, setLoading] = useState(true);

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
        setBlogs(response.data.blogs);
      } else if (activeTab === 'courses') {
        const response = await api.get('/courses');
        setCourses(response.data);
      } else if (activeTab === 'pyqs') {
        // Fetch PYQs for admin
        try {
          const response = await api.get('/pyqs/admin');
          setPyqs(response.data);
        } catch (error) {
          console.error('Error fetching PYQs:', error);
          setPyqs([]);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  /** ---------------- BLOG HANDLERS ---------------- */
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
      console.error('Error saving blog:', error);
    }
  };

  const handleDeleteBlog = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await api.delete(`/blogs/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting blog:', error);
      }
    }
  };

  /** ---------------- COURSE HANDLERS ---------------- */
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
      console.error('Error saving course:', error);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await api.delete(`/courses/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };

  /** ---------------- PYQ HANDLERS ---------------- */
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
      if (editingPyq) {
        await api.put(`/pyqs/${editingPyq._id}`, formData);
      } else {
        await api.post('/pyqs', formData);
      }
      setShowPyqEditor(false);
      setEditingPyq(null);
      fetchData();
    } catch (error) {
      console.error('Error saving PYQ:', error);
    }
  };

  const handleDeletePyq = async (id) => {
    if (window.confirm('Are you sure you want to delete this PYQ?')) {
      try {
        await api.delete(`/pyqs/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting PYQ:', error);
      }
    }
  };

  /** ---------------- ACCESS CHECK ---------------- */
  if (user?.role !== 'admin') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">You need to be an admin to access this page.</p>
        </div>
      </div>
    );
  }

  /** ---------------- EDITOR MODALS ---------------- */
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

  /** ---------------- MAIN RENDER ---------------- */
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('dashboard')}</h1>
      
      {/* Tabs */}
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
            {t('blogManagement')}
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'courses'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {t('courseManagement')}
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
            PYQ Management
          </button>
        </nav>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('loading')}</p>
        </div>
      ) : activeTab === 'blogs' ? (
        /* Blog Management Section */
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">{t('blogManagement')}</h2>
            <button
              onClick={handleCreateBlog}
              className="bg-primary-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-primary-700"
            >
              <Plus size={20} className="mr-2" />
              {t('createNew')}
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
                              {blog.isPublished ? t('published') : t('draft')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">
                            {new Date(blog.createdAt).toLocaleDateString()} • {blog.views} {t('views')}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => window.open(`/blog/${blog._id}`, '_blank')}
                          className="text-gray-400 hover:text-gray-500"
                          title={t('view')}
                        >
                          <Eye size={20} />
                        </button>
                        <button
                          onClick={() => handleEditBlog(blog)}
                          className="text-blue-400 hover:text-blue-500"
                          title={t('edit')}
                        >
                          <Edit size={20} />
                        </button>
                        <button
                          onClick={() => handleDeleteBlog(blog._id)}
                          className="text-red-400 hover:text-red-500"
                          title={t('delete')}
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
                <p className="text-gray-500">{t('noBlogs')}</p>
              </div>
            )}
          </div>
        </div>
      ) : activeTab === 'courses' ? (
        /* Course Management Section */
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Course Management</h2>
            <button
              onClick={handleCreateCourse}
              className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700"
            >
              <Plus size={20} className="mr-2" />
              Create New Course
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
                              {course.isActive ? 'Active' : 'Inactive'}
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
                          title="Edit"
                        >
                          <Edit size={20} />
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course._id)}
                          className="text-red-400 hover:text-red-500"
                          title="Delete"
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
                <p className="text-gray-500">No courses found</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* PYQ Management Section */
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">PYQ Management</h2>
            <button
              onClick={handleCreatePyq}
              className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-green-700"
            >
              <Plus size={20} className="mr-2" />
              Add New PYQ
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
                              {pyq.isPublished ? 'Published' : 'Draft'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">
                            {pyq.exam} • {pyq.year} • {pyq.subject} • {pyq.downloads || 0} downloads
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => window.open(`https://nitiias-chcohing-backend.onrender.com/${pyq.file}`, '_blank')}
                          className="text-gray-400 hover:text-gray-500"
                          title="View PDF"
                        >
                          <Eye size={20} />
                        </button>
                        <button
                          onClick={() => handleEditPyq(pyq)}
                          className="text-blue-400 hover:text-blue-500"
                          title="Edit"
                        >
                          <Edit size={20} />
                        </button>
                        <button
                          onClick={() => handleDeletePyq(pyq._id)}
                          className="text-red-400 hover:text-red-500"
                          title="Delete"
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
                <p className="text-gray-500">No PYQs found</p>
                <p className="text-sm text-gray-400 mt-2">Add your first PYQ using the "Add New PYQ" button</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;