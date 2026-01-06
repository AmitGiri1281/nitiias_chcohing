import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../utils/api';
import { Clock, DollarSign, CheckCircle, BookOpen, Users, Award, Target, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

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
      console.error('कोर्स लोड करने में त्रुटि:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', label: 'सभी कोर्सेज', icon: BookOpen },
    { id: 'UPSC', label: 'UPSC', icon: Target },
    { id: 'PCS', label: 'राज्य PCS', icon: Users },
    { id: 'Current Affairs', label: 'समसामयिकी', icon: Award },
    { id: 'Optional Subjects', label: 'वैकल्पिक विषय', icon: BookOpen }
  ];

  const getCategoryHindi = (category) => {
    switch(category) {
      case 'UPSC': return 'UPSC';
      case 'PCS': return 'राज्य PCS';
      case 'Current Affairs': return 'समसामयिकी';
      case 'Optional Subjects': return 'वैकल्पिक विषय';
      default: return category;
    }
  };

  const filteredCourses = selectedCategory === 'all' 
    ? courses 
    : courses.filter(course => course.category === selectedCategory);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">कोर्सेज लोड हो रहे हैं...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-block p-4 bg-primary-100 rounded-full mb-6">
          <BookOpen className="h-10 w-10 text-primary-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">हमारे कोर्सेज</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto hindi">
          सभी सिविल सेवा परीक्षाओं के लिए व्यापक तैयारी कार्यक्रम
        </p>
      </div>

      {/* Why Choose Us */}
      <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl p-8 mb-12 border border-primary-100">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">हमें क्यों चुनें?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="inline-block p-3 bg-white rounded-full shadow-sm mb-4">
              <Users className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">अनुभवी संकाय</h3>
            <p className="text-gray-600 text-sm">UPSC टॉपर्स और विषय विशेषज्ञों से सीखें</p>
          </div>
          <div className="text-center">
            <div className="inline-block p-3 bg-white rounded-full shadow-sm mb-4">
              <Target className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">लक्षित तैयारी</h3>
            <p className="text-gray-600 text-sm">परीक्षा के अनुरूप व्यक्तिगत मार्गदर्शन</p>
          </div>
          <div className="text-center">
            <div className="inline-block p-3 bg-white rounded-full shadow-sm mb-4">
              <Award className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">सिद्ध सफलता</h3>
            <p className="text-gray-600 text-sm">हर वर्ष 100+ सफल छात्र</p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-12">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">श्रेणियाँ</h3>
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSelectedCategory(id)}
              className={`px-5 py-3 rounded-full font-medium flex items-center transition-all ${
                selectedCategory === id
                  ? 'bg-primary-600 text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Icon size={18} className="mr-2" />
              {label}
            </button>
          ))}
        </div>
        <div className="text-center mt-4 text-sm text-gray-500">
          {filteredCourses.length} कोर्स उपलब्ध
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredCourses.map((course) => (
            <div key={course._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-2 border border-gray-100">
              {course.image && (
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={`http://localhost:5000/${course.image}`} 
                    alt={i18n.language === 'hi' ? course.titleHindi : course.title}
                    className="w-full h-full object-cover transition-transform hover:scale-110 duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-primary-600 text-white text-xs font-semibold rounded-full">
                      {getCategoryHindi(course.category)}
                    </span>
                  </div>
                  {course.isPopular && (
                    <div className="absolute top-3 right-3">
                      <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-full flex items-center">
                        <Star size={12} className="mr-1" />
                        लोकप्रिय
                      </span>
                    </div>
                  )}
                </div>
              )}
              
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <div className="flex items-center">
                    <Users size={16} className="mr-1" />
                    <span>{course.enrolledStudents || 0} छात्र</span>
                  </div>
                  <div className="mx-2">•</div>
                  <div className="flex items-center">
                    <Award size={16} className="mr-1" />
                    <span>{course.successRate || '90%'} सफलता दर</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {i18n.language === 'hi' ? course.titleHindi : course.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {i18n.language === 'hi' ? course.descriptionHindi : course.description}
                </p>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock size={16} className="mr-2" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center text-xl font-bold text-primary-600">
                    <span className="text-sm mr-1">₹</span>
                    <span>{course.price.toLocaleString('hi-IN')}</span>
                    {course.originalPrice && (
                      <span className="text-sm text-gray-400 line-through ml-2">
                        ₹{course.originalPrice.toLocaleString('hi-IN')}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <CheckCircle size={18} className="mr-2 text-green-500" />
                    विशेषताएं:
                  </h4>
                  <ul className="space-y-2">
                    {(i18n.language === 'hi' && course.featuresHindi ? course.featuresHindi : course.features).slice(0, 3).map((feature, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <CheckCircle size={14} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex gap-3">
                  <button className="flex-1 bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center">
                    अभी एनरोल करें
                    <ArrowRight size={18} className="ml-2" />
                  </button>
                  <Link
                    to={`/course/${course._id}`}
                    className="px-4 py-3 border-2 border-primary-600 text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-colors flex items-center"
                  >
                    विवरण देखें
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
          <BookOpen className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">कोई कोर्स नहीं मिले</h3>
          <p className="text-gray-500 mb-4">चयनित श्रेणी में वर्तमान में कोई कोर्स उपलब्ध नहीं हैं।</p>
          <button
            onClick={() => setSelectedCategory('all')}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
          >
            सभी कोर्सेज देखें
          </button>
        </div>
      )}

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-primary-600 to-blue-600 rounded-2xl p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-4">अभी एनरोल करें और अपनी सफलता सुनिश्चित करें</h2>
        <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
          UPSC और राज्य PCS परीक्षाओं की तैयारी के लिए विशेषज्ञ मार्गदर्शन के साथ अपनी यात्रा शुरू करें।
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button className="px-8 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center">
            <BookOpen size={20} className="mr-2" />
            निःशुल्क ट्रायल शुरू करें
          </button>
          <button className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors flex items-center">
            <Users size={20} className="mr-2" />
            मुफ्त परामर्श बुक करें
          </button>
        </div>
      </div>
    </div>
  );
};

export default Courses;