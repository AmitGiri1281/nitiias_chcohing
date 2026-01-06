import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowRight,
  BookOpen,
  Users,
  Award,
  FileText,
  Calendar,
  Target,
  Clock,
  Trophy,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";
import { api } from "../utils/api";

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [pyqs, setPyqs] = useState([]);
  const [loading, setLoading] = useState(true);

  const stats = [
    { label: "प्रशिक्षित छात्र", value: "2500+", icon: Users },
    { label: "सफलता दर", value: "85%", icon: Trophy },
    { label: "वर्षों का अनुभव", value: "5+", icon: Clock },
    { label: "मुफ्त संसाधन", value: "100+", icon: FileText },
  ];

  const features = [
    {
      icon: BookOpen,
      title: "विशेषज्ञ अध्ययन सामग्री",
      desc: "अनुभवी मेंटर्स द्वारा तैयार अद्यतन, परीक्षा-उन्मुख सामग्री।",
    },
    {
      icon: GraduationCap,
      title: "अनुभवी संकाय",
      desc: "UPSC और PCS को गहराई से समझने वाले मेंटर्स से सीखें।",
    },
    {
      icon: Award,
      title: "सिद्ध परिणाम",
      desc: "UPSC और राज्य PCS परीक्षाओं में लगातार सफलता।",
    },
    {
      icon: ShieldCheck,
      title: "व्यक्तिगत मार्गदर्शन",
      desc: "प्रत्येक छात्र के लिए व्यक्तिगत ध्यान और समर्थन।",
    },
  ];

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      const [c, b, p] = await Promise.allSettled([
        api.get("/courses?limit=3"),
        api.get("/blogs?limit=3"),
        api.get("/pyqs?limit=3"),
      ]);

      if (c.status === "fulfilled") setCourses(c.value.data || []);
      if (b.status === "fulfilled")
        setBlogs(b.value.data?.blogs || b.value.data || []);
      if (p.status === "fulfilled")
        setPyqs(p.value.data?.pyqs || p.value.data || []);
    } catch (err) {
      console.error("डेटा लोड करने में त्रुटि:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("hi-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("hi-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div>
      {/* ================= हीरो सेक्शन ================= */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto text-center px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">
            सिविल सेवा सफलता का आपका मार्गदर्शक
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-primary-100">
            UPSC, राज्य PCS और अन्य सिविल सेवा परीक्षाओं के लिए विशेषज्ञ मार्गदर्शन
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10">
            {stats.map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-white/10 p-4 rounded-xl">
                <div className="flex items-center justify-center mb-2">
                  <Icon className="text-primary-200 mr-2" size={20} />
                  <h3 className="text-2xl md:text-3xl font-bold">{value}</h3>
                </div>
                <p className="text-primary-200 text-xs md:text-sm">{label}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/courses"
              className="inline-flex items-center bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all"
            >
              कोर्सेज देखें
              <ArrowRight className="ml-2" size={18} />
            </Link>
            <Link
              to="/pyqs"
              className="inline-flex items-center bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-all"
            >
              मुफ्त PYQs प्रैक्टिस करें
            </Link>
          </div>
        </div>
      </section>

      {/* ================= विशेषताएं ================= */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">निति आईएएस क्यों चुनें?</h2>
          <p className="text-gray-600 text-center mb-8 md:mb-12 max-w-2xl mx-auto">
            भारत की सर्वश्रेष्ठ सिविल सेवा कोचिंग में शामिल हों
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="p-4 md:p-6 text-center rounded-xl border border-gray-100 hover:border-primary-200 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 md:w-16 md:h-16 bg-primary-50 mx-auto flex items-center justify-center rounded-full mb-3 md:mb-4">
                  <Icon className="text-primary-600" size={24} />
                </div>
                <h3 className="text-base md:text-lg font-semibold mb-2">{title}</h3>
                <p className="text-gray-600 text-xs md:text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= पिछले वर्षों के प्रश्न ================= */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">पिछले वर्षों के प्रश्न</h2>
              <p className="text-gray-600 mt-1 md:mt-2">वास्तविक परीक्षा पैटर्न के साथ अभ्यास करें</p>
            </div>
            <Link
              to="/pyqs"
              className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700 mt-3 md:mt-0"
            >
              सभी PYQs देखें
              <ArrowRight className="ml-1" size={18} />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">PYQs लोड हो रहे हैं...</p>
            </div>
          ) : pyqs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pyqs.slice(0, 3).map((pyq) => (
                <div
                  key={pyq._id}
                  className="bg-white border border-gray-200 rounded-xl shadow hover:shadow-lg transition-all"
                >
                  <div className="h-32 bg-gradient-to-r from-green-600 to-emerald-700 flex items-center justify-center">
                    <FileText className="text-white" size={40} />
                  </div>

                  <div className="p-4 md:p-5">
                    <div className="flex justify-between text-sm text-gray-500 mb-2">
                      <span className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        {pyq.year}
                      </span>
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                        {pyq.totalQuestions || 0} प्रश्न
                      </span>
                    </div>

                    <h3 className="font-bold text-base md:text-lg mb-2 line-clamp-2">
                      {pyq.titleHindi || pyq.title}
                    </h3>

                    <p className="text-sm text-gray-600 mb-3">
                      {pyq.subjectHindi || pyq.subject}
                    </p>

                    <div className="flex gap-2">
                      <Link
                        to={`/pyq/${pyq._id}`}
                        className="flex-1 flex items-center justify-center bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        <Target size={16} className="mr-2" />
                        परीक्षा दें
                      </Link>
                      <Link
                        to={`/study/${pyq._id}`}
                        className="flex-1 flex items-center justify-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        <BookOpen size={16} className="mr-2" />
                        अध्ययन
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">PYQs जल्द ही उपलब्ध होंगे</p>
            </div>
          )}
        </div>
      </section>

      {/* ================= कोर्सेज ================= */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">हमारे कोर्सेज</h2>
              <p className="text-gray-600 mt-1 md:mt-2">सिविल सेवा सफलता के लिए व्यापक कार्यक्रम</p>
            </div>
            <Link
              to="/courses"
              className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700 mt-3 md:mt-0"
            >
              सभी कोर्सेज देखें
              <ArrowRight className="ml-1" size={18} />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">कोर्सेज लोड हो रहे हैं...</p>
            </div>
          ) : courses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.slice(0, 3).map((course) => (
                <div
                  key={course._id}
                  className="border border-gray-200 rounded-xl shadow hover:shadow-lg transition-all"
                >
                  <div className="h-32 bg-gradient-to-r from-primary-600 to-blue-700 flex items-center justify-center">
                    <BookOpen className="text-white" size={40} />
                  </div>

                  <div className="p-4 md:p-5">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs md:text-sm font-medium bg-primary-50 text-primary-700 px-2 py-1 rounded">
                        {course.category}
                      </span>
                      <span className="font-bold text-primary-600">
                        {formatPrice(course.price)}
                      </span>
                    </div>

                    <h3 className="font-bold text-base md:text-lg mb-2 line-clamp-2">
                      {course.titleHindi || course.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {course.descriptionHindi || course.description}
                    </p>

                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <Clock size={14} className="mr-1" />
                      <span>{course.duration}</span>
                    </div>

                    <Link
                      to={`/course/${course._id}`}
                      className="w-full flex items-center justify-center bg-primary-600 text-white py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors text-sm"
                    >
                      कोर्स देखें
                      <ArrowRight className="ml-2" size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">कोर्सेज जल्द ही उपलब्ध होंगे</p>
            </div>
          )}
        </div>
      </section>

      {/* ================= ब्लॉग ================= */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">नवीनतम लेख</h2>
              <p className="text-gray-600 mt-1 md:mt-2">सिविल सेवा उम्मीदवारों के लिए टिप्स और अंतर्दृष्टि</p>
            </div>
            <Link
              to="/blog"
              className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700 mt-3 md:mt-0"
            >
              सभी लेख देखें
              <ArrowRight className="ml-1" size={18} />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">लेख लोड हो रहे हैं...</p>
            </div>
          ) : blogs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.slice(0, 3).map((blog) => (
                <div
                  key={blog._id}
                  className="bg-white border border-gray-200 rounded-xl shadow hover:shadow-lg transition-all"
                >
                  <div className="p-4 md:p-5">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Calendar size={14} className="mr-2" />
                      <span>{formatDate(blog.createdAt)}</span>
                    </div>
                    
                    <h3 className="font-bold text-base md:text-lg mb-2 line-clamp-2">
                      {blog.titleHindi || blog.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                      {blog.excerpt || (blog.contentHindi ? 
                        blog.contentHindi.substring(0, 100) + "..." : 
                        blog.content?.substring(0, 100) + "...")
                      }
                    </p>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center text-sm text-gray-500">
                        <Users size={14} className="mr-1" />
                        <span>{blog.author?.name || 'निति आईएएस'}</span>
                      </div>
                      <Link
                        to={`/blog/${blog._id}`}
                        className="text-primary-600 font-semibold flex items-center hover:text-primary-700 text-sm"
                      >
                        पढ़ें
                        <ArrowRight className="ml-1" size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">लेख जल्द ही उपलब्ध होंगे</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;