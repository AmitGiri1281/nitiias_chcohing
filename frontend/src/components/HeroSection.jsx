import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import heroImg from "../images/upsc nitiias image.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">

      {/* ========== Background Image ========== */}
      <img
        src={heroImg}
        alt="UPSC preparation"
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />

      {/* ========== Dark Overlay ========== */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* ========== Glow Effects (Premium Look) ========== */}
      <div className="absolute -top-24 left-0 w-96 h-96 bg-orange-500/20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-500/20 blur-3xl rounded-full"></div>

      {/* ========== Container ========== */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-10">

        {/* ========== Content ========== */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl text-white"
        >
          {/* Trust Badge */}
          <p className="uppercase tracking-widest text-xs md:text-sm text-orange-300 mb-4">
            Trusted by 50,000+ Aspirants Across India
          </p>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            भारत की सर्वोच्च सेवाओं में सफलता के लिए{" "}
            <span className="block text-orange-400 mt-2">
              स्मार्ट, संरचित और भरोसेमंद तैयारी
            </span>
          </h1>

          {/* Description */}
          <p className="text-base md:text-lg text-gray-200 mb-10 leading-relaxed">
            UPSC, PCS और अन्य सिविल सेवा परीक्षाओं के लिए टेस्ट सीरीज, PYQs,
            करेंट अफेयर्स और एक्सपर्ट गाइडेंस — सब एक ही प्लेटफॉर्म पर।
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/courses"
              className="bg-orange-500 hover:bg-orange-600 px-8 py-3 rounded-xl font-semibold text-center transition-all shadow-lg"
            >
              कोर्सेज देखें
            </Link>

            <Link
              to="/pyqs"
              className="border border-white px-8 py-3 rounded-xl text-center hover:bg-white hover:text-black transition"
            >
              मुफ्त PYQs
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;