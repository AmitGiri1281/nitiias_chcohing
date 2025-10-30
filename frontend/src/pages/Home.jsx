import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, BookOpen, Users, Award, FileText, Download, Calendar } from 'lucide-react';
import { api } from '../utils/api';

const Home = () => {
  const { t } = useTranslation();
  const [courses, setCourses] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [pyqs, setPyqs] = useState([]);
  const [loading, setLoading] = useState({
    courses: true,
    blogs: true,
    pyqs: true
  });
  const [stats, setStats] = useState({
    students: 2500,
    successRate: '85%',
    years: 5
  });

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      // Fetch courses, blogs, and PYQs
      const [coursesRes, blogsRes, pyqsRes] = await Promise.allSettled([
        api.get('/courses?limit=3'),
        api.get('/blogs?limit=3'),
        api.get('/pyqs?limit=3')
      ]);

      if (coursesRes.status === 'fulfilled') {
        setCourses(coursesRes.value.data || []);
      }
      if (blogsRes.status === 'fulfilled') {
        setBlogs(blogsRes.value.data?.blogs || blogsRes.value.data || []);
      }
      if (pyqsRes.status === 'fulfilled') {
        setPyqs(pyqsRes.value.data?.pyqs || pyqsRes.value.data || []);
      }
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading({ courses: false, blogs: false, pyqs: false });
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">{t('welcome')}</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">{t('tagline')}</p>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold">{stats.students}+</div>
                <div className="text-primary-200">Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{stats.successRate}</div>
                <div className="text-primary-200">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{stats.years}+</div>
                <div className="text-primary-200">Years</div>
              </div>
            </div>
            
            <a
              href="/courses"
              className="inline-flex items-center bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              {t('cta')}
              <ArrowRight className="ml-2" size={20} />
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Niti IAS?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive preparation resources for all civil service examinations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Study Material</h3>
              <p className="text-gray-600">
                Comprehensive and updated study materials curated by industry experts
              </p>
            </div>

            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Experienced Faculty</h3>
              <p className="text-gray-600">
                Learn from experienced educators who understand the exam patterns
              </p>
            </div>

            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Proven Results</h3>
              <p className="text-gray-600">
                Track record of successful candidates in various civil service exams
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PYQs Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex justify-center items-center mb-4">
              <FileText className="h-8 w-8 text-green-600 mr-2" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Previous Year Questions
              </h2>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Practice with actual questions from previous years' examinations
            </p>
          </div>

          {loading.pyqs ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading PYQs...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {pyqs.length > 0 ? pyqs.map((pyq) => (
                  <div key={pyq._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-green-100">
                    <div className="h-48 bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
                      <FileText className="text-white" size={48} />
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {pyq.exam}
                        </span>
                        <span className="inline-flex items-center text-sm text-gray-500">
                          <Calendar size={14} className="mr-1" />
                          {pyq.year}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {pyq.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {pyq.description}
                      </p>
                      
                      <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                        <span>Subject: {pyq.subject}</span>
                        {pyq.questions > 0 && (
                          <span>{pyq.questions} questions</span>
                        )}
                      </div>
                      
                      <a
                        href={pyq.file ? `http://localhost:5000/${pyq.file}` : '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md font-medium flex items-center justify-center transition-colors"
                      >
                        <Download size={16} className="mr-2" />
                        Download PDF
                      </a>
                    </div>
                  </div>
                )) : (
                  // Sample PYQs when no data available
                  [1, 2, 3].map((item) => (
                    <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden border border-green-100">
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
                          UPSC Civil Services Preliminary {item === 1 ? 'GS Paper I' : item === 2 ? 'GS Paper II' : 'Optional'}
                        </h3>
                        
                        <p className="text-gray-600 text-sm mb-4">
                          Complete question paper with answer key and solutions
                        </p>
                        
                        <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                          <span>Subject: General Studies</span>
                          <span>100 questions</span>
                        </div>
                        
                        <button className="w-full bg-gray-400 text-white py-2 px-4 rounded-md font-medium flex items-center justify-center cursor-not-allowed">
                          <Download size={16} className="mr-2" />
                          Coming Soon
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="text-center">
                <a
                  href="/pyqs"
                  className="inline-flex items-center bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg"
                >
                  <FileText size={20} className="mr-2" />
                  View All PYQs
                  <ArrowRight className="ml-2" size={20} />
                </a>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Courses Preview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Courses
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive preparation programs for all levels
            </p>
          </div>

          {loading.courses ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading courses...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {courses.length > 0 ? courses.map((course) => (
                  <div key={course._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-200">
                    {course.image ? (
                      <img 
                        src={`https://nitiias-chcohing-backend.onrender.com/${course.image}`} 
                        alt={course.title}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`h-48 bg-primary-600 flex items-center justify-center ${course.image ? 'hidden' : 'flex'}`}>
                      <BookOpen className="text-white" size={48} />
                    </div>
                    <div className="p-6">
                      <span className="text-sm text-primary-600 font-semibold">{course.category}</span>
                      <h3 className="text-xl font-semibold mb-2 mt-1 line-clamp-2">{course.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {course.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-primary-600">
                          {formatPrice(course.price)}
                        </span>
                        <a href="/courses" className="text-primary-600 hover:text-primary-700 font-semibold">
                          View Details
                        </a>
                      </div>
                    </div>
                  </div>
                )) : (
                  // Sample courses when no data available
                  [1, 2, 3].map((item) => (
                    <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                      <div className="h-48 bg-primary-600 flex items-center justify-center">
                        <BookOpen className="text-white" size={48} />
                      </div>
                      <div className="p-6">
                        <span className="text-sm text-primary-600 font-semibold">
                          {item === 1 ? 'UPSC' : item === 2 ? 'State PCS' : 'Current Affairs'}
                        </span>
                        <h3 className="text-xl font-semibold mb-2 mt-1">
                          {item === 1 ? 'UPSC Complete Course 2024' : item === 2 ? 'State PCS Master Course' : 'Current Affairs Program'}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {item === 1 ? 'Complete preparation package for UPSC examinations' : 
                           item === 2 ? 'Specialized courses for state public service commissions' : 
                           'Regular updates and analysis of current events'}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold text-primary-600">
                            {formatPrice(item === 1 ? 25000 : item === 2 ? 18000 : 8000)}
                          </span>
                          <a href="/courses" className="text-primary-600 hover:text-primary-700 font-semibold">
                            View Details
                          </a>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="text-center">
                <a
                  href="/courses"
                  className="inline-flex items-center bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-lg"
                >
                  View All Courses
                  <ArrowRight className="ml-2" size={20} />
                </a>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Latest from Our Blog
            </h2>
            <p className="text-xl text-gray-600">
              Insights, tips, and updates for civil service aspirants
            </p>
          </div>

          {loading.blogs ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading blogs...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {blogs.length > 0 ? blogs.map((blog) => (
                  <div key={blog._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-200">
                    {blog.image ? (
                      <img 
                        src={`https://nitiias-chcohing-backend.onrender.com/${blog.image}`} 
                        alt={blog.title}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`h-48 bg-gray-200 flex items-center justify-center ${blog.image ? 'hidden' : 'flex'}`}>
                      <BookOpen className="text-gray-400" size={48} />
                    </div>
                    <div className="p-6">
                      <span className="text-sm text-primary-600 font-semibold">{blog.category}</span>
                      <h3 className="text-xl font-semibold mb-2 mt-1 line-clamp-2">{blog.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {blog.content}
                      </p>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>{formatDate(blog.createdAt)}</span>
                        <span>{blog.views || 0} views</span>
                      </div>
                      <a href={`/blog/${blog._id}`} className="text-primary-600 hover:text-primary-700 font-semibold mt-4 inline-block">
                        Read More
                      </a>
                    </div>
                  </div>
                )) : (
                  // Sample blogs when no data available
                  [1, 2, 3].map((item) => (
                    <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                      <div className="h-48 bg-gray-200 flex items-center justify-center">
                        <BookOpen className="text-gray-400" size={48} />
                      </div>
                      <div className="p-6">
                        <span className="text-sm text-primary-600 font-semibold">
                          {item === 1 ? 'UPSC' : item === 2 ? 'Current Affairs' : 'Study Tips'}
                        </span>
                        <h3 className="text-xl font-semibold mb-2 mt-1">
                          {item === 1 ? 'How to Prepare for UPSC Prelims 2024' : 
                           item === 2 ? 'Monthly Current Affairs Digest' : 
                           'Time Management for Aspirants'}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {item === 1 ? 'Essential tips and strategies for cracking the UPSC preliminary examination' : 
                           item === 2 ? 'Important national and international events from the past month' : 
                           'Effective time management strategies for busy aspirants'}
                        </p>
                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <span>{formatDate(new Date())}</span>
                          <span>0 views</span>
                        </div>
                        <a href="/blog" className="text-primary-600 hover:text-primary-700 font-semibold mt-4 inline-block">
                          Read More
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="text-center">
                <a
                  href="/blog"
                  className="inline-flex items-center bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-lg"
                >
                  Read More Articles
                  <ArrowRight className="ml-2" size={20} />
                </a>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;