import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../utils/api';
import { Clock, CheckCircle, BookOpen, Users, Award, Target, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Courses = () => {
  const { i18n } = useTranslation();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => { fetchCourses(); }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get('/courses');
      setCourses(res.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const categories = [
    { id: 'all', label: 'सभी', icon: BookOpen },
    { id: 'UPSC', label: 'UPSC', icon: Target },
    { id: 'PCS', label: 'PCS', icon: Users },
    { id: 'Current Affairs', label: 'CA', icon: Award },
    { id: 'Optional Subjects', label: 'Optional', icon: BookOpen }
  ];

  const filtered = selectedCategory === 'all'
    ? courses
    : courses.filter(c => c.category === selectedCategory);

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-5">

      {/* Header */}
      <div className="text-center mb-5">
        <h1 className="text-xl sm:text-3xl font-bold">हमारे कोर्सेज</h1>
        <p className="text-sm sm:text-base text-gray-600">UPSC & PCS तैयारी</p>
      </div>

      {/* Category */}
      <div className="flex flex-wrap justify-center gap-2 mb-5 text-sm">
        {categories.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setSelectedCategory(id)}
            className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 border
              ${selectedCategory === id ? 'bg-primary-600 text-white' : 'bg-white'}`}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

        {filtered.map(course => (
          <div key={course._id} className="border rounded-lg overflow-hidden hover:shadow">

            {/* Image */}
            {course.image && (
              <div className="h-36 sm:h-44 overflow-hidden">
                <img
                  src={`http://localhost:5000/${course.image}`}
                  className="w-full h-full object-cover"
                  alt=""
                />
              </div>
            )}

            <div className="p-3">

              {/* Meta */}
              <div className="flex text-xs text-gray-500 justify-between mb-1">
                <span className="flex items-center gap-1"><Users size={12} /> {course.enrolledStudents || 0}</span>
                <span className="flex items-center gap-1"><Award size={12} /> {course.successRate || '90%'}</span>
              </div>

              {/* Title */}
              <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                {i18n.language === 'hi' ? course.titleHindi : course.title}
              </h3>

              {/* Desc */}
              <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                {i18n.language === 'hi' ? course.descriptionHindi : course.description}
              </p>

              {/* Price */}
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="flex items-center gap-1 text-gray-500"><Clock size={14} /> {course.duration}</span>
                <span className="font-bold text-primary-600">₹{course.price}</span>
              </div>

              {/* Features */}
              <ul className="text-xs text-gray-600 mb-2 space-y-1">
                {(i18n.language === 'hi' ? course.featuresHindi : course.features)?.slice(0, 2).map((f, i) => (
                  <li key={i} className="flex gap-1.5">
                    <CheckCircle size={12} className="text-green-500 mt-0.5" /> {f}
                  </li>
                ))}
              </ul>

              {/* Buttons */}
              <div className="flex gap-2 text-sm">
                <Link to={`/course/${course._id}`} className="flex-1 border border-primary-600 text-primary-600 py-1.5 rounded text-center">
                  Details
                </Link>
                <button className="flex-1 bg-primary-600 text-white py-1.5 rounded">
                  Enroll
                </button>
              </div>

            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default Courses;
