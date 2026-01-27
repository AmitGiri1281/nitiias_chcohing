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
      {/* ================= HERO ================= */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-10 md:py-16">
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

      {/* ================= PYQs ================= */}
      <section className="py-8 md:py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader title="पिछले वर्षों के प्रश्न" link="/pyqs" />

          {loading ? <Loader /> : (
            <Grid>
              {pyqs.slice(0, 3).map((pyq) => (
                <Card key={pyq._id} icon={<FileText size={32} />}>
                  <h3 className="font-bold text-base line-clamp-2">{pyq.titleHindi || pyq.title}</h3>
                  <p className="text-sm text-gray-600">{pyq.subjectHindi || pyq.subject}</p>
                  <Link to={`/pyq/${pyq._id}`} className="btn-green">Start</Link>
                </Card>
              ))}
            </Grid>
          )}
        </div>
      </section>

      {/* ================= COURSES ================= */}
      <section className="py-8 md:py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader title="हमारे कोर्सेज" link="/courses" />

          {loading ? <Loader /> : (
            <Grid>
              {courses.slice(0, 3).map((course) => (
                <Card key={course._id} icon={<BookOpen size={32} />}>
                  <h3 className="font-bold text-base line-clamp-2">{course.titleHindi || course.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{course.descriptionHindi || course.description}</p>
                  <p className="text-primary-600 font-bold">{formatPrice(course.price)}</p>
                  <Link to={`/course/${course._id}`} className="btn-primary">देखें</Link>
                </Card>
              ))}
            </Grid>
          )}
        </div>
      </section>

      {/* ================= BLOGS ================= */}
      <section className="py-8 md:py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader title="नवीनतम लेख" link="/blog" />

          {loading ? <Loader /> : (
            <Grid>
              {blogs.slice(0, 3).map((blog) => (
                <Card key={blog._id}>
                  <p className="text-xs text-gray-500">{formatDate(blog.createdAt)}</p>
                  <h3 className="font-bold text-base line-clamp-2">{blog.titleHindi || blog.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {blog.contentHindi?.substring(0, 80) || blog.content?.substring(0, 80)}...
                  </p>
                  <Link to={`/blog/${blog._id}`} className="text-primary-600 font-semibold">पढ़ें →</Link>
                </Card>
              ))}
            </Grid>
          )}
        </div>
      </section>
    </div>
  );
};

/* ================= SMALL COMPONENTS ================= */

const SectionHeader = ({ title, link }) => (
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl md:text-3xl font-bold">{title}</h2>
    <Link to={link} className="text-primary-600 font-semibold">सभी देखें →</Link>
  </div>
);

const Grid = ({ children }) => (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">{children}</div>
);

const Card = ({ children, icon }) => (
  <div className="bg-white border rounded-xl p-3 md:p-5 shadow hover:shadow-lg transition">
    {icon && <div className="h-24 flex items-center justify-center text-primary-600">{icon}</div>}
    <div className="space-y-2">{children}</div>
  </div>
);

const Loader = () => (
  <div className="text-center py-10">
    <div className="animate-spin h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
  </div>
);

export default Home;
