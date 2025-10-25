import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../utils/api';
import { Clock, DollarSign, CheckCircle } from 'lucide-react';

const Courses = () => {
  const { t, i18n } = useTranslation();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', 'UPSC', 'PCS', 'Current Affairs', 'Optional Subjects'];

  const filteredCourses = selectedCategory === 'all' 
    ? courses 
    : courses.filter(course => course.category === selectedCategory);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('courses')}</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Comprehensive preparation programs for all civil service examinations
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-2 rounded-full font-medium ${
              selectedCategory === category
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category === 'all' ? 'All Courses' : category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {filteredCourses.map((course) => (
          <div key={course._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {course.image && (
              <img 
                src={`http://localhost:5000/${course.image}`} 
                alt={course.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6">
              <span className="text-sm text-primary-600 font-semibold">{course.category}</span>
              <h3 className="text-xl font-semibold mb-2 mt-2">
                {i18n.language === 'hi' ? course.titleHindi : course.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {i18n.language === 'hi' ? course.descriptionHindi : course.description}
              </p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Clock size={16} className="mr-1" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center text-lg font-bold text-primary-600">
                  <DollarSign size={16} className="mr-1" />
                  <span>₹{course.price.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="font-semibold mb-2">{t('courseFeatures')}:</h4>
                <ul className="space-y-1">
                  {(i18n.language === 'hi' ? course.featuresHindi : course.features).slice(0, 3).map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <CheckCircle size={16} className="text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <button className="w-full bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700 transition-colors">
                {t('enrollNow')}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">{t('noCourses')}</p>
        </div>
      )}
    </div>
  );
};

export default Courses;