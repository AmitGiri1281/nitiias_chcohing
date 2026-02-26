import React, { useEffect, useState, useRef, memo, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { api } from "../utils/api";
import HeroSection from "../components/HeroSection";

/* ================= TYPES ================= */
const DataState = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
};

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

const normalize = (data, key) => {
  if (!data || typeof data !== "object") return [];
  return Array.isArray(data) ? data : data[key] || [];
};

/* ================= REUSABLE COMPONENTS ================= */
const Loader = () => (
  <div className="text-center py-12">
    <div className="animate-spin h-10 w-10 border-b-2 border-primary-600 mx-auto" />
  </div>
);

const SkeletonLoader = memo(({ count = 3, className = "" }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={`skeleton-${i}`}
        className={`bg-gray-200 h-40 rounded-xl animate-pulse ${className}`}
      />
    ))}
  </>
));

const ErrorMessage = memo(({ message, onRetry }) => (
  <div className="text-center py-8">
    <p className="text-red-600 font-semibold mb-2">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
      >
        पुनः प्रयास करें
      </button>
    )}
  </div>
));

const EmptyState = memo(({ message }) => (
  <p className="col-span-full text-center text-gray-500 py-8">{message}</p>
));

const SectionHeader = memo(({ title, subtitle, link }) => (
  <div className="flex flex-col md:flex-row justify-between items-center mb-6">
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{title}</h2>
      {subtitle && (
        <p className="text-gray-600 mt-1 text-sm md:text-base">{subtitle}</p>
      )}
    </div>
    {link && (
      <Link
        to={link}
        className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700 transition-colors mt-2 md:mt-0 group"
      >
        सभी देखें
        <ArrowRight
          size={18}
          className="ml-1 transition-transform group-hover:translate-x-1"
        />
      </Link>
    )}
  </div>
));

/* ================= CARD COMPONENTS ================= */
const PyqCard = memo(({ pyq }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
    <h3 className="font-bold text-lg line-clamp-2 text-gray-800 mb-2">
      {pyq.titleHindi || pyq.title}
    </h3>
    <p className="text-sm text-gray-600 mb-3">
      {pyq.subjectHindi || pyq.subject}
    </p>
    {pyq.year && (
      <p className="text-xs text-gray-500 mb-3">वर्ष: {pyq.year}</p>
    )}
    <Link
      to={`/pyq/${pyq._id}`}
      className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700 transition-colors"
      aria-label={`${pyq.titleHindi || pyq.title} शुरू करें`}
    >
      शुरू करें
      <ArrowRight size={16} className="ml-1" />
    </Link>
  </div>
));

const CourseCard = memo(({ course }) => (
  <div className="border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white">
    <h3 className="font-bold text-lg line-clamp-2 text-gray-800 mb-2">
      {course.titleHindi || course.title}
    </h3>
    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
      {course.descriptionHindi || course.description}
    </p>
    <div className="flex justify-between items-center">
      <p className="font-bold text-primary-600 text-lg">
        {formatPrice(course.price || 0)}
      </p>
      <Link
        to={`/course/${course._id}`}
        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-semibold"
      >
        देखें
      </Link>
    </div>
  </div>
));

const BlogCard = memo(({ blog }) => (
  <Link
    to={`/blog/${blog._id}`}
    className="
      block bg-white border border-gray-200 rounded-xl p-5
      shadow-sm hover:shadow-lg
      transition-all duration-200
      hover:-translate-y-1
      cursor-pointer
      focus:outline-none focus:ring-2 focus:ring-primary-500
    "
    aria-label={`ब्लॉग पढ़ें: ${blog.titleHindi || blog.title}`}
  >
    <p className="text-xs text-gray-500 mb-2">
      {formatDate(blog.createdAt)}
    </p>

    <h3 className="font-bold text-lg line-clamp-2 text-gray-800 mb-2">
      {blog.titleHindi || blog.title}
    </h3>

    <p className="text-sm text-gray-600 line-clamp-3 mb-4">
      {blog.contentHindi?.slice(0, 150) || blog.content?.slice(0, 150)}...
    </p>

    <span className="inline-flex items-center text-primary-600 font-semibold">
      पढ़ें
      <ArrowRight size={16} className="ml-1" />
    </span>
  </Link>
));


/* ================= DATA HOOK ================= */
 const useFetchData = () => {
  const [data, setData] = useState({
    courses: [],
    blogs: [],
    pyqs: [],
  });

  const [status, setStatus] = useState({
    courses: DataState.IDLE,
    blogs: DataState.IDLE,
    pyqs: DataState.IDLE,
  });

  const [error, setError] = useState({
  courses: null,
  blogs: null,
  pyqs: null,
});


  const fetchData = useCallback(async (controller) => {
    try {
      setStatus((prev) => ({
  ...prev,
  courses: DataState.LOADING,
  blogs: DataState.LOADING,
  pyqs: DataState.LOADING,
}));

     setError({
  courses: null,
  blogs: null,
  pyqs: null,
});


      const results = await Promise.allSettled([
  api.get("/courses?limit=3", { signal: controller.signal }),
  api.get("/blogs?limit=3", { signal: controller.signal }),
  api.get("/pyqs?limit=3", { signal: controller.signal }),
]);

const [coursesRes, blogsRes, pyqsRes] = results;

setData({
  courses:
    coursesRes.status === "fulfilled"
      ? normalize(coursesRes.value?.data, "courses")
      : [],
  blogs:
    blogsRes.status === "fulfilled"
      ? normalize(blogsRes.value?.data, "blogs")
      : [],
  pyqs:
    pyqsRes.status === "fulfilled"
      ? normalize(pyqsRes.value?.data, "pyqs")
      : [],
});

setStatus((prev) => ({
  ...prev,
  courses:
    coursesRes.status === "fulfilled"
      ? DataState.SUCCESS
      : DataState.ERROR,
  blogs:
    blogsRes.status === "fulfilled"
      ? DataState.SUCCESS
      : DataState.ERROR,
  pyqs:
    pyqsRes.status === "fulfilled"
      ? DataState.SUCCESS
      : DataState.ERROR,
}));


    } catch (err) {
     if (err.code === "ERR_CANCELED") return;


      
      console.error("Fetch error:", err);
setError({
  courses: err?.response?.data?.message || "कोर्स लोड नहीं हुआ",
  blogs: err?.response?.data?.message || "ब्लॉग लोड नहीं हुआ",
  pyqs: err?.response?.data?.message || "PYQ लोड नहीं हुआ",
});

setStatus((prev) => ({
  ...prev,
  courses: DataState.ERROR,
  blogs: DataState.ERROR,
  pyqs: DataState.ERROR,
}));

    }
  }, []);

  return { data, status, error, fetchData };
};

/* ================= MAIN COMPONENT ================= */
const Home = () => {
  const { data, status, error, fetchData } = useFetchData();
  const abortControllerRef = useRef(null);


 useEffect(() => {
  const controller = new AbortController();
  abortControllerRef.current = controller;

  fetchData(controller);

  return () => {
    controller.abort();
  };
}, [fetchData]);


  const handleRetry = useCallback(() => {
    abortControllerRef.current?.abort();


    const controller = new AbortController();
abortControllerRef.current = controller;

    fetchData(controller);
 }, [fetchData]);


 
  const renderContent = useCallback((type) => {
    const currentStatus = status[type];
    const currentData = data[type];
    const isEmpty = currentData.length === 0;

    if (currentStatus === DataState.LOADING) {
      return <SkeletonLoader count={3} className="h-48" />;
    }
if (currentStatus === DataState.ERROR) {
  return (
    <ErrorMessage
      message={error[type] || "डेटा लोड करने में समस्या आई"}
      onRetry={handleRetry}
    />
  );
}



    if (currentStatus === DataState.SUCCESS && isEmpty) {
      return <EmptyState message={`कोई ${type} उपलब्ध नहीं है`} />;
    }

    if (currentStatus === DataState.SUCCESS) {
      switch (type) {
        case "pyqs":
          return currentData.map((pyq) => (
            <PyqCard key={pyq._id} pyq={pyq} />
          ));
        case "courses":
          return currentData.map((course) => (
            <CourseCard key={course._id} course={course} />
          ));
        case "blogs":
          return currentData.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ));
        default:
          return null;
      }
    }

    return null;
  }, [data, status, handleRetry]);

  return (
    <div className="min-h-screen">
      <HeroSection />
{/* 
       {(error.courses || error.blogs || error.pyqs) && (

        <div className="max-w-7xl mx-auto px-4 mt-4">
          <ErrorMessage
  message={
    error.courses || error.blogs || error.pyqs || "डेटा लोड नहीं हुआ"
  }
  onRetry={handleRetry}
/>

        </div>
      )}  */}

      {/* PYQS Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader
            title="पिछले वर्षों के प्रश्न"
            subtitle="वास्तविक परीक्षा पैटर्न के साथ अभ्यास करें"
            link="/pyqs"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderContent("pyqs")}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader
            title="हमारे कोर्सेज"
            subtitle="सिविल सेवा सफलता के लिए व्यापक कार्यक्रम"
            link="/courses"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderContent("courses")}
          </div>
        </div>
      </section>

      {/* Blogs Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader
            title="नवीनतम लेख"
            subtitle="सिविल सेवा उम्मीदवारों के लिए टिप्स"
            link="/blog"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderContent("blogs")}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;