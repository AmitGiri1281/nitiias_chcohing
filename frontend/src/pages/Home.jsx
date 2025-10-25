import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, BookOpen, Users, Award } from 'lucide-react';

const Home = () => {
  const { t } = useTranslation();

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">{t('welcome')}</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">{t('tagline')}</p>
            <a
              href="/courses"
              className="inline-flex items-center bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
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
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Study Material</h3>
              <p className="text-gray-600">
                Comprehensive and updated study materials curated by industry experts
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Experienced Faculty</h3>
              <p className="text-gray-600">
                Learn from experienced educators who understand the exam patterns
              </p>
            </div>

            <div className="text-center">
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

      {/* Courses Preview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Courses
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive preparation programs for all levels
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Course cards would be mapped from API data */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-primary-600"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">UPSC Prelims + Mains</h3>
                <p className="text-gray-600 mb-4">
                  Complete preparation package for UPSC examinations
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-primary-600">₹25,000</span>
                  <a href="/courses" className="text-primary-600 hover:text-primary-700 font-semibold">
                    View Details
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-primary-600"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">State PCS</h3>
                <p className="text-gray-600 mb-4">
                  Specialized courses for state public service commissions
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-primary-600">₹18,000</span>
                  <a href="/courses" className="text-primary-600 hover:text-primary-700 font-semibold">
                    View Details
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-primary-600"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Current Affairs</h3>
                <p className="text-gray-600 mb-4">
                  Regular updates and analysis of current events
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-primary-600">₹8,000</span>
                  <a href="/courses" className="text-primary-600 hover:text-primary-700 font-semibold">
                    View Details
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <a
              href="/courses"
              className="inline-flex items-center bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              View All Courses
              <ArrowRight className="ml-2" size={20} />
            </a>
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Latest from Our Blog
            </h2>
            <p className="text-xl text-gray-600">
              Insights, tips, and updates for civil service aspirants
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Blog cards would be mapped from API data */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-6">
                <span className="text-sm text-primary-600 font-semibold">UPSC</span>
                <h3 className="text-xl font-semibold mb-2 mt-2">How to Prepare for UPSC Prelims</h3>
                <p className="text-gray-600 mb-4">
                  Essential tips and strategies for cracking the UPSC preliminary examination
                </p>
                <a href="/blog" className="text-primary-600 hover:text-primary-700 font-semibold">
                  Read More
                </a>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-6">
                <span className="text-sm text-primary-600 font-semibold">Current Affairs</span>
                <h3 className="text-xl font-semibold mb-2 mt-2">Monthly Current Affairs Digest</h3>
                <p className="text-gray-600 mb-4">
                  Important national and international events from the past month
                </p>
                <a href="/blog" className="text-primary-600 hover:text-primary-700 font-semibold">
                  Read More
                </a>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-6">
                <span className="text-sm text-primary-600 font-semibold">Study Tips</span>
                <h3 className="text-xl font-semibold mb-2 mt-2">Time Management for Aspirants</h3>
                <p className="text-gray-600 mb-4">
                  Effective time management strategies for busy aspirants
                </p>
                <a href="/blog" className="text-primary-600 hover:text-primary-700 font-semibold">
                  Read More
                </a>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <a
              href="/blog"
              className="inline-flex items-center bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Read More Articles
              <ArrowRight className="ml-2" size={20} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;