import React, { useEffect, useState, memo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Users,
  FileText,
  Calendar,
  Target,
  Clock,
  Trophy,
} from "lucide-react";
import { api } from "../utils/api";

/* ================= HELPERS ================= */

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

/* ================= REUSABLE ================= */

const Loader = () => (
  <div className="text-center py-12">
    <div className="animate-spin h-10 w-10 border-b-2 border-primary-600 mx-auto"></div>
  </div>
);

const SectionHeader = memo(({ title, subtitle, link }) => (
  <div className="flex flex-col md:flex-row justify-between items-center mb-6">
    <div>
      <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
      {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
    </div>
    <Link to={link} className="text-primary-600 font-semibold flex items-center">
      सभी देखें <ArrowRight size={18} className="ml-1" />
    </Link>
  </div>
));

/* ================= MAIN ================= */

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [pyqs, setPyqs] = useState([]);
  const [loading, setLoading] = useState(true);

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
      if (b.status === "fulfilled") setBlogs(b.value.data?.blogs || b.value.data || []);
      if (p.status === "fulfilled") setPyqs(p.value.data?.pyqs || p.value.data || []);
    } catch (e) {
      console.error("Home load error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* ============ HERO ============ */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto text-center px-4">
          <h1 className="text-2xl md:text-5xl font-bold mb-4">
            सिविल सेवा सफलता का आपका मार्गदर्शक
          </h1>
          <p className="text-base md:text-xl max-w-3xl mx-auto mb-6 text-primary-100">
            UPSC, राज्य PCS और अन्य सिविल सेवा परीक्षाओं के लिए विशेषज्ञ मार्गदर्शन
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link to="/courses" className="bg-white text-primary-600 px-5 py-2.5 rounded-lg font-semibold">
              कोर्सेज देखें
            </Link>
            <Link to="/pyqs" className="border-2 border-white px-5 py-2.5 rounded-lg font-semibold">
              मुफ्त PYQs
            </Link>
          </div>
        </div>
      </section>

      {/* ============ PYQS ============ */}
      <section className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader
            title="पिछले वर्षों के प्रश्न"
            subtitle="वास्तविक परीक्षा पैटर्न के साथ अभ्यास करें"
            link="/pyqs"
          />

          {loading ? <Loader /> : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pyqs.map((pyq) => (
                <div key={pyq._id} className="bg-white border rounded-xl p-4 shadow hover:shadow-lg">
                  <h3 className="font-bold line-clamp-2">{pyq.titleHindi || pyq.title}</h3>
                  <p className="text-sm text-gray-600">{pyq.subjectHindi || pyq.subject}</p>
                  <Link to={`/pyq/${pyq._id}`} className="text-primary-600 font-semibold mt-2 inline-block">
                    Start →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============ COURSES ============ */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader
            title="हमारे कोर्सेज"
            subtitle="सिविल सेवा सफलता के लिए व्यापक कार्यक्रम"
            link="/courses"
          />

          {loading ? <Loader /> : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course._id} className="border rounded-xl p-4 shadow hover:shadow-lg">
                  <h3 className="font-bold line-clamp-2">{course.titleHindi || course.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {course.descriptionHindi || course.description}
                  </p>
                  <p className="font-bold text-primary-600">{formatPrice(course.price)}</p>
                  <Link to={`/course/${course._id}`} className="btn-primary mt-2 inline-block">
                    देखें →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============ BLOGS ============ */}
      <section className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader
            title="नवीनतम लेख"
            subtitle="सिविल सेवा उम्मीदवारों के लिए टिप्स"
            link="/blog"
          />

          {loading ? <Loader /> : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <div key={blog._id} className="bg-white border rounded-xl p-4 shadow hover:shadow-lg">
                  <p className="text-xs text-gray-500">{formatDate(blog.createdAt)}</p>
                  <h3 className="font-bold line-clamp-2">{blog.titleHindi || blog.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {blog.contentHindi?.slice(0, 100) || blog.content?.slice(0, 100)}...
                  </p>
                  <Link to={`/blog/${blog._id}`} className="text-primary-600 font-semibold">
                    पढ़ें →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
