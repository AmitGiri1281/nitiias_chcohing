import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  BookOpen,
  Users,
  Award,
  FileText,
  Download,
  Calendar,
} from "lucide-react";
import { api } from "../utils/api";

const BASE_URL = import.meta.env.VITE_API_URL;

const Home = () => {
  const { t } = useTranslation();

  const [courses, setCourses] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [pyqs, setPyqs] = useState([]);
  const [loading, setLoading] = useState(true);

  const stats = [
    { label: "Students Trained", value: "2500+" },
    { label: "Success Rate", value: "85%" },
    { label: "Years of Experience", value: "5+" },
    { label: "Free Resources", value: "100+" },
  ];

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
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
      console.error("Home API error:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div>
      {/* ================= HERO ================= */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {t("welcome")}
          </h1>
          <p className="text-xl max-w-3xl mx-auto mb-10">
            {t("tagline")}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            {stats.map((s) => (
              <div key={s.label}>
                <h3 className="text-3xl font-bold">{s.value}</h3>
                <p className="text-primary-200">{s.label}</p>
              </div>
            ))}
          </div>

          <Link
            to="/courses"
            className="inline-flex items-center bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold shadow-lg hover:bg-gray-100"
          >
            Explore Courses
            <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Niti IAS?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: "Expert Study Material",
                desc: "Updated, exam-oriented content curated by experienced mentors.",
              },
              {
                icon: Users,
                title: "Experienced Faculty",
                desc: "Learn from mentors who understand UPSC & PCS deeply.",
              },
              {
                icon: Award,
                title: "Proven Results",
                desc: "Consistent success across UPSC & State PCS exams.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="p-6 text-center rounded-lg hover:shadow-lg transition"
              >
                <div className="w-16 h-16 bg-primary-100 mx-auto flex items-center justify-center rounded-full mb-4">
                  <f.icon className="text-primary-600" size={30} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PYQS ================= */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Previous Year Questions
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {!loading &&
              pyqs.map((pyq) => (
                <div
                  key={pyq._id}
                  className="bg-white border rounded-lg shadow hover:shadow-lg"
                >
                  <div className="h-40 bg-green-600 flex items-center justify-center">
                    <FileText className="text-white" size={40} />
                  </div>

                  <div className="p-5">
                    <div className="flex justify-between text-sm text-gray-500 mb-2">
                      <span>{pyq.exam}</span>
                      <span>
                        <Calendar size={14} className="inline mr-1" />
                        {pyq.year}
                      </span>
                    </div>

                    <h3 className="font-semibold mb-3 line-clamp-2">
                      {pyq.title}
                    </h3>

                    <a
                      href={`${BASE_URL}/${pyq.file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Download PYQ PDF"
                      className="w-full flex items-center justify-center bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
                    >
                      <Download size={16} className="mr-2" />
                      Download PDF
                    </a>
                  </div>
                </div>
              ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/pyqs"
              className="inline-flex items-center bg-green-600 text-white px-8 py-3 rounded-lg font-semibold"
            >
              View All PYQs
              <ArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= COURSES ================= */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Our Courses
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {!loading &&
              courses.map((course) => (
                <div
                  key={course._id}
                  className="border rounded-lg shadow hover:shadow-lg"
                >
                  <div className="h-40 bg-primary-600 flex items-center justify-center">
                    <BookOpen className="text-white" size={40} />
                  </div>

                  <div className="p-5">
                    <h3 className="font-semibold mb-2 line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {course.description}
                    </p>

                    <div className="flex justify-between items-center">
                      <span className="font-bold text-primary-600">
                        {formatPrice(course.price)}
                      </span>
                      <Link
                        to="/courses"
                        className="text-primary-600 font-semibold"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* ================= BLOG ================= */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Latest Articles
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {!loading &&
              blogs.map((blog) => (
                <div
                  key={blog._id}
                  className="bg-white border rounded-lg shadow hover:shadow-lg"
                >
                  <div className="p-5">
                    <h3 className="font-semibold mb-2 line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {blog.excerpt ||
                        blog.content?.slice(0, 120) + "..."}
                    </p>
                    <div className="text-sm text-gray-500 mb-3">
                      {formatDate(blog.createdAt)}
                    </div>
                    <Link
                      to={`/blog/${blog._id}`}
                      className="text-primary-600 font-semibold"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
