import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../utils/api";
import {
  Calendar,
  User,
  Eye,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const Blog = () => {
  const { t, i18n } = useTranslation();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchBlogs();
  }, [currentPage]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/blogs?page=${currentPage}&limit=9`);
      setBlogs(res.data.blogs || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("ब्लॉग लोड करने में त्रुटि:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString(
      i18n.language === "hi" ? "hi-IN" : "en-IN",
      { day: "numeric", month: "long", year: "numeric" }
    );

  const getCategory = (category) => {
    const map = {
      "Exam Tips": i18n.language === "hi" ? "परीक्षा टिप्स" : "Exam Tips",
      "Study Material": i18n.language === "hi" ? "अध्ययन सामग्री" : "Study Material",
      "Current Affairs": i18n.language === "hi" ? "समसामयिकी" : "Current Affairs",
      "Success Stories": i18n.language === "hi" ? "सफलता की कहानियाँ" : "Success Stories",
      "Strategy": i18n.language === "hi" ? "रणनीति" : "Strategy",
      "Motivation": i18n.language === "hi" ? "प्रेरणा" : "Motivation",
    };
    return map[category] || category;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="text-center py-10">
          <div className="animate-spin h-10 w-10 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-3 text-gray-600">
            {i18n.language === "hi" ? "ब्लॉग लोड हो रहे हैं..." : "Loading blogs..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* ================= HEADER ================= */}
      <div className="text-center mb-8">
        <div className="inline-block p-2 bg-primary-100 rounded-full mb-3">
          <FileText className="h-7 w-7 text-primary-600" />
        </div>
        <h1 className="text-2xl md:text-4xl font-bold mb-2">
          {i18n.language === "hi" ? "ब्लॉग" : "Blog"}
        </h1>
        <p className="text-gray-600 text-sm md:text-lg max-w-2xl mx-auto">
          {i18n.language === "hi"
            ? "सिविल सेवा उम्मीदवारों के लिए अंतर्दृष्टि, टिप्स और अपडेट्स"
            : "Insights, tips and updates for civil service aspirants"}
        </p>
      </div>

      {/* ================= BLOG GRID ================= */}
      {blogs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-white rounded-lg border shadow-sm hover:shadow-lg transition-all overflow-hidden"
              >
                {blog.image && (
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={`${import.meta.env.VITE_API_URL}/${blog.image}`}
                      alt={i18n.language === "hi" ? blog.titleHindi : blog.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                    <span className="absolute top-2 left-2 px-3 py-1 bg-primary-600 text-white text-xs font-semibold rounded-full">
                      {getCategory(blog.category)}
                    </span>
                  </div>
                )}

                <div className="p-4">
                  <div className="flex items-center text-xs text-gray-500 mb-2">
                    <span className="flex items-center mr-3">
                      <User size={14} className="mr-1" />
                      {blog.author?.name || "Niti IAS"}
                    </span>
                    <span className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      {formatDate(blog.createdAt)}
                    </span>
                  </div>

                  <h3 className="font-bold text-base md:text-lg mb-2 line-clamp-2">
                    {i18n.language === "hi" ? blog.titleHindi : blog.title}
                  </h3>

                  <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                    {i18n.language === "hi"
                      ? (blog.contentHindi || "").substring(0, 140)
                      : (blog.content || "").substring(0, 140)}
                    ...
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t text-sm">
                    <span className="flex items-center text-gray-500">
                      <Eye size={14} className="mr-1" />
                      {blog.views || 0}
                    </span>

                    <Link
                      to={`/blog/${blog._id}`}
                      className="text-primary-600 font-semibold hover:text-primary-700 flex items-center"
                    >
                      {i18n.language === "hi" ? "पढ़ें" : "Read"}
                      <ChevronRight size={16} className="ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ================= PAGINATION ================= */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mb-8">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
              >
                <ChevronLeft size={18} />
              </button>

              <span className="px-4 py-2 bg-primary-600 text-white rounded">
                {currentPage} / {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-lg border">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <p className="text-gray-500">
            {i18n.language === "hi" ? "कोई ब्लॉग उपलब्ध नहीं" : "No blogs available"}
          </p>
        </div>
      )}
    </div>
  );
};

export default Blog;
