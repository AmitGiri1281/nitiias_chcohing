import React, { useEffect, useState, memo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
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
  const [coursesLoading, setCoursesLoading] = useState(true);

  const [blogs, setBlogs] = useState([]);
  const [blogsLoading, setBlogsLoading] = useState(true);

  const [pyqs, setPyqs] = useState([]);
  const [pyqsLoading, setPyqsLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
    fetchBlogs();
    fetchPyqs();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get("/courses?limit=3");
      setCourses(res.data || []);
    } catch (err) {
      console.error("Courses load error:", err);
    } finally {
      setCoursesLoading(false);
    }
  };

  const fetchBlogs = async () => {
    try {
      const res = await api.get("/blogs?limit=3");
      setBlogs(res.data?.blogs || res.data || []);
    } catch (err) {
      console.error("Blogs load error:", err);
    } finally {
      setBlogsLoading(false);
    }
  };

  const fetchPyqs = async () => {
    try {
      const res = await api.get("/pyqs?limit=3");
      setPyqs(res.data?.pyqs || res.data || []);
    } catch (err) {
      console.error("PYQs load error:", err);
    } finally {
      setPyqsLoading(false);
    }
  };

  const renderSkeleton = (count = 3) =>
    Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-gray-200 h-40 rounded-xl animate-pulse"></div>
    ));

  return (
    <div>
      {/* HERO */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto text-center px-4">
          <h1 className="text-2xl md:text-5xl font-bold mb-4">
            सिविल सेवा सफलता का आपका मार्गदर्शक
          </h1>
          <p className="text-base md:text-xl max-w-3xl mx-auto mb-6 text-primary-100">
            UPSC, राज्य PCS और अन्य सिविल सेवा परीक्षाओं के लिए विशेषज्ञ मार्गदर्शन
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link
              to="/courses"
              className="bg-white text-primary-600 px-5 py-2.5 rounded-lg font-semibold"
            >
              कोर्सेज देखें
            </Link>
            <Link
              to="/pyqs"
              className="border-2 border-white px-5 py-2.5 rounded-lg font-semibold"
            >
              मुफ्त PYQs
            </Link>
          </div>
        </div>
      </section>

      {/* PYQS */}
      <section className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader
            title="पिछले वर्षों के प्रश्न"
            subtitle="वास्तविक परीक्षा पैटर्न के साथ अभ्यास करें"
            link="/pyqs"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pyqsLoading ? renderSkeleton() : pyqs.map((pyq) => (
              <div key={pyq._id} className="bg-white border rounded-xl p-4 shadow hover:shadow-lg">
                <h3 className="font-bold line-clamp-2">{pyq.titleHindi || pyq.title}</h3>
                <p className="text-sm text-gray-600">{pyq.subjectHindi || pyq.subject}</p>
                <Link to={`/pyq/${pyq._id}`} className="text-primary-600 font-semibold mt-2 inline-block">
                  Start →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COURSES */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader
            title="हमारे कोर्सेज"
            subtitle="सिविल सेवा सफलता के लिए व्यापक कार्यक्रम"
            link="/courses"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coursesLoading ? renderSkeleton() : courses.map((course) => (
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
        </div>
      </section>

      {/* BLOGS */}
      <section className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader
            title="नवीनतम लेख"
            subtitle="सिविल सेवा उम्मीदवारों के लिए टिप्स"
            link="/blog"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogsLoading ? renderSkeleton() : blogs.map((blog) => (
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
        </div>
      </section>
    </div>
  );
};

export default Home;
