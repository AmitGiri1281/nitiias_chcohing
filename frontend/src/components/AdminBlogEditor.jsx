import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { 
  FaBold, 
  FaItalic, 
  FaUnderline, 
  FaListUl, 
  FaListOl,
  FaLink,
  FaImage,
  FaHeading,
  FaSave,
  FaTimes,
  FaUpload,
  FaEye,
  FaEyeSlash,
  FaExclamationCircle,
  FaPalette,
  FaFont,
  FaMagic
} from "react-icons/fa";

const AdminBlogEditor = ({ onSave, initialData, onCancel }) => {
  const { t } = useTranslation();
  const textareaRef = useRef(null);

  const [blogData, setBlogData] = useState(
    initialData || {
      titleHindi: "",
      contentHindi: "",
      category: "",
      tags: [],
      isPublished: false,
      image: null,
    }
  );

  const [imageFile, setImageFile] = useState(null);
  const [isPreview, setIsPreview] = useState(false);
  const [errors, setErrors] = useState({});
  const [imageError, setImageError] = useState("");
  const [fontStyle, setFontStyle] = useState("default");

  // Available font styles
  const fonts = {
    default: "font-sans",
    modern: "font-['Inter']",
    elegant: "font-['Playfair_Display']",
    clean: "font-['Poppins']",
    traditional: "font-['Noto_Sans_Devanagari']",
    creative: "font-['Montserrat']"
  };

  // Auto-save draft
  useEffect(() => {
    const timer = setTimeout(() => {
      if (blogData.contentHindi || blogData.titleHindi) {
        try {
          localStorage.setItem('blogDraft_hindi', JSON.stringify({
            ...blogData,
            autoSaved: new Date().toLocaleTimeString()
          }));
        } catch (e) {
          console.log("Auto-save failed:", e);
        }
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [blogData]);

  // Load draft on mount
  useEffect(() => {
    if (!initialData) {
      try {
        const savedDraft = localStorage.getItem('blogDraft_hindi');
        if (savedDraft) {
          const draftData = JSON.parse(savedDraft);
          setBlogData(prev => ({
            ...prev,
            ...draftData,
            id: prev.id
          }));
        }
      } catch (e) {
        console.log("Failed to load draft:", e);
      }
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {};
    
    if (!blogData.titleHindi.trim()) {
      newErrors.titleHindi = "शीर्षक आवश्यक है";
    } else if (blogData.titleHindi.length > 60) {
      newErrors.titleHindi = "शीर्षक 60 अक्षरों से कम होना चाहिए";
    }
    
    if (!blogData.contentHindi.trim()) {
      newErrors.contentHindi = "ब्लॉग सामग्री आवश्यक है";
    } else if (blogData.contentHindi.length < 100) {
      newErrors.contentHindi = "ब्लॉग सामग्री कम से कम 100 अक्षरों की होनी चाहिए";
    }
    
    if (!blogData.category) {
      newErrors.category = "श्रेणी चुनना आवश्यक है";
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.keys(newErrors)[0];
      document.querySelector(`[data-field="${firstError}"]`)?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
      return;
    }
    
    // Clear draft on successful submit
    localStorage.removeItem('blogDraft_hindi');
    
    const formData = new FormData();

    // ✅ SAME API KEYS (IMPORTANT - NO CHANGES)
    formData.append("title", blogData.titleHindi);
    formData.append("titleHindi", blogData.titleHindi);
    formData.append("content", blogData.contentHindi);
    formData.append("contentHindi", blogData.contentHindi);
    formData.append("category", blogData.category);
    formData.append("tags", blogData.tags.join(","));
    formData.append("isPublished", blogData.isPublished);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    onSave(formData);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setImageError("केवल JPEG, PNG, WEBP फ़ाइलें अनुमत हैं");
      e.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setImageError("फ़ाइल का आकार 2MB से कम होना चाहिए");
      e.target.value = "";
      return;
    }

    setImageError("");
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) =>
      setBlogData({ ...blogData, image: e.target.result });
    reader.readAsDataURL(file);
  };

  const handleFormatText = (format) => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = blogData.contentHindi.substring(start, end);
    let formattedText = "";

    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'underline':
        formattedText = `<u>${selectedText}</u>`;
        break;
      case 'h2':
        formattedText = `## ${selectedText}`;
        break;
      case 'h3':
        formattedText = `### ${selectedText}`;
        break;
      case 'link':
        formattedText = `[${selectedText}](https://example.com)`;
        break;
      case 'quote':
        formattedText = `> ${selectedText}`;
        break;
      case 'ul':
        formattedText = `\n- ${selectedText}`;
        break;
      case 'ol':
        formattedText = `\n1. ${selectedText}`;
        break;
      default:
        formattedText = selectedText;
    }

    const newContent = blogData.contentHindi.substring(0, start) + 
                      formattedText + 
                      blogData.contentHindi.substring(end);
    
    setBlogData({ ...blogData, contentHindi: newContent });
    
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + formattedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const formatPreview = (content) => {
    const sanitizeHTML = (html) => {
      const div = document.createElement('div');
      div.textContent = html;
      return div.innerHTML;
    };

    let formatted = sanitizeHTML(content);
    
    formatted = formatted
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-gray-800">$1</em>')
      .replace(/<u>(.*?)<\/u>/g, '<u class="underline decoration-2 decoration-blue-400">$1</u>')
      .replace(/## (.*?)(\n|$)/g, '<h2 class="text-3xl font-bold mt-8 mb-4 text-gray-900 tracking-tight">$1</h2>')
      .replace(/### (.*?)(\n|$)/g, '<h3 class="text-2xl font-semibold mt-6 mb-3 text-gray-800">$1</h3>')
      .replace(/> (.*?)(\n|$)/g, '<blockquote class="border-l-4 border-blue-500 pl-4 italic text-gray-700 bg-blue-50 py-2 my-4">$1</blockquote>')
      .replace(/\n- (.*?)(\n|$)/g, '<li class="ml-6 list-disc mb-2 text-gray-700 pl-2">$1</li>')
      .replace(/\n1\. (.*?)(\n|$)/g, '<li class="ml-6 list-decimal mb-2 text-gray-700 pl-2">$1</li>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 font-medium underline decoration-dotted hover:decoration-solid transition-colors" target="_blank">$1</a>')
      .replace(/\n\n/g, '</p><p class="mb-6 text-gray-700 leading-relaxed">')
      .replace(/\n/g, '<br>');
    
    return `<div class="prose prose-lg max-w-none ${fonts[fontStyle]}"><p class="mb-6 text-gray-700 leading-relaxed">${formatted}</p></div>`;
  };

  const handleTagsChange = (value) => {
    const tagsArray = value.split(",")
      .map(t => t.trim().replace(/[^a-zA-Z0-9-अ-ह़-॥\s]/g, ''))
      .filter(t => t.length > 0 && t.length < 30)
      .filter((t, i, self) => self.indexOf(t) === i)
      .slice(0, 10);
    
    setBlogData({
      ...blogData,
      tags: tagsArray
    });
  };

  const clearDraft = () => {
    if (window.confirm("क्या आप सचमुच ड्राफ्ट हटाना चाहते हैं?")) {
      localStorage.removeItem('blogDraft_hindi');
      setBlogData({
        titleHindi: "",
        contentHindi: "",
        category: "",
        tags: [],
        isPublished: false,
        image: null,
      });
      setImageFile(null);
      setFontStyle("default");
    }
  };

  const insertSample = () => {
    if (!blogData.contentHindi) {
      setBlogData({
        ...blogData,
        contentHindi: `## स्वागत है नए ब्लॉग लेखक!

आप अपने पहले ब्लॉग को एक शानदार शुरुआत देने जा रहे हैं। यहाँ कुछ टिप्स हैं:

## 🎯 मुख्य बिंदु

- **शीर्षक महत्वपूर्ण है**: आकर्षक और स्पष्ट शीर्षक चुनें
- *गुणवत्ता सामग्री*: शोधपूर्ण और मूल्यवान जानकारी दें
- संरचना: पैराग्राफ में लिखें, हेडिंग का प्रयोग करें

### ✨ प्रारूपण उदाहरण

1. परिचय लिखें
2. मुख्य बिंदुओं को समझाएं
3. उदाहरण और केस स्टडी जोड़ें
4. निष्कर्ष दें

> याद रखें: अच्छा ब्लॉग पाठक को मूल्य देता है और उसकी समस्याओं का समाधान करता है।

[अधिक जानकारी के लिए यहाँ क्लिक करें](https://example.com)

<u>सफलता की कुंजी</u>: नियमितता और गुणवत्ता!`
      });
    }
  };

  // Font style options
  const fontOptions = [
    { id: "default", name: "डिफ़ॉल्ट", icon: "🔄" },
    { id: "modern", name: "आधुनिक", icon: "🚀" },
    { id: "elegant", name: "एलिगेंट", icon: "✨" },
    { id: "clean", name: "क्लीन", icon: "🧹" },
    { id: "traditional", name: "पारंपरिक", icon: "🕌" },
    { id: "creative", name: "क्रिएटिव", icon: "🎨" }
  ];

  return (
    <div className={`bg-gradient-to-br from-gray-50 via-white to-blue-50/30 p-8 rounded-3xl shadow-2xl max-w-5xl mx-auto border border-gray-300/50 backdrop-blur-sm ${fonts[fontStyle]}`}>
      {/* Stylish Header */}
      <div className="relative mb-10">
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-xl"></div>
        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 rounded-full blur-xl"></div>
        
        <div className="relative flex justify-between items-center">
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-700 to-purple-600 bg-clip-text text-transparent tracking-tight">
              {initialData ? "✏️ ब्लॉग अपडेट करें" : "📝 नया हिंदी ब्लॉग लिखें"}
            </h2>
            <p className="text-gray-600 mt-2 text-lg font-medium">
              {initialData ? "अपने ब्लॉग को और बेहतर बनाएं ✨" : "अपनी कहानी दुनिया के सामने लाएं 🌟"}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Font Style Selector */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all font-medium">
                <FaFont className="text-lg" />
                <span className="hidden md:inline">फ़ॉन्ट</span>
              </button>
              
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 p-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="text-xs text-gray-500 font-medium mb-2 px-2">फ़ॉन्ट स्टाइल चुनें</div>
                {fontOptions.map((font) => (
                  <button
                    key={font.id}
                    type="button"
                    onClick={() => setFontStyle(font.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 hover:bg-gray-100 transition-colors ${fontStyle === font.id ? 'bg-blue-50 text-blue-600' : ''}`}
                  >
                    <span className="text-xl">{font.icon}</span>
                    <span className="font-medium">{font.name}</span>
                    {fontStyle === font.id && (
                      <span className="ml-auto text-blue-500">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            <button
              type="button"
              onClick={() => setIsPreview(!isPreview)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all font-medium"
            >
              {isPreview ? <FaEyeSlash /> : <FaEye />}
              <span className="hidden md:inline">
                {isPreview ? "एडिटर" : "प्रीव्यू"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Draft Save Indicator */}
      {!initialData && (
        <div className="mb-8 p-4 bg-gradient-to-r from-amber-50/80 to-yellow-50/80 border border-amber-200 rounded-2xl flex justify-between items-center backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full flex items-center justify-center">
              <FaMagic className="text-white text-sm" />
            </div>
            <div>
              <span className="font-semibold text-amber-800">💾 ऑटो-सेव सक्रिय</span>
              <p className="text-sm text-amber-700">आपका कार्य स्वचालित रूप से सहेजा जा रहा है</p>
            </div>
          </div>
          <button
            type="button"
            onClick={clearDraft}
            className="text-sm font-medium text-amber-700 hover:text-amber-900 underline bg-amber-100 hover:bg-amber-200 px-3 py-1 rounded-lg transition-colors"
          >
            ड्राफ्ट हटाएं
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ===== TITLE SECTION ===== */}
        <div 
          className="relative overflow-hidden bg-gradient-to-r from-blue-50/80 to-indigo-50/80 p-6 rounded-2xl border-2 border-blue-200/50 backdrop-blur-sm shadow-lg"
          data-field="titleHindi"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-400/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
          
          <div className="flex justify-between items-center mb-3 relative z-10">
            <label className="block text-lg font-bold text-gray-800">
              <span className="text-2xl mr-2">📌</span> ब्लॉग शीर्षक (हिंदी) 
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="flex items-center gap-2">
              <span className={`text-sm px-3 py-1 rounded-full font-medium ${
                blogData.titleHindi.length > 50 
                  ? 'bg-red-100 text-red-700' 
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {blogData.titleHindi.length}/60
              </span>
            </div>
          </div>
          
          <input
            type="text"
            required
            value={blogData.titleHindi}
            onChange={(e) => {
              setBlogData({ ...blogData, titleHindi: e.target.value });
              if (errors.titleHindi) setErrors({...errors, titleHindi: ""});
            }}
            className={`w-full p-5 text-xl rounded-xl focus:ring-4 transition-all font-bold tracking-wide placeholder-gray-400 ${
              errors.titleHindi 
                ? "border-2 border-red-400 focus:border-red-500 focus:ring-red-100 bg-red-50/50" 
                : "border-2 border-blue-300/50 focus:border-blue-500 focus:ring-blue-100/50 bg-white/80"
            }`}
            placeholder="✍️ एक आकर्षक हिंदी शीर्षक लिखें..."
            maxLength={60}
          />
          
          {errors.titleHindi ? (
            <div className="mt-3 p-3 bg-gradient-to-r from-red-50/80 to-pink-50/80 rounded-lg border border-red-200 flex items-center gap-3">
              <FaExclamationCircle className="text-red-500 text-lg" />
              <span className="text-red-700 font-medium">{errors.titleHindi}</span>
            </div>
          ) : (
            <div className="mt-3 flex items-center gap-2 text-gray-600">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-sm font-medium">शीर्षक स्पष्ट, आकर्षक और 60 अक्षरों से कम</span>
            </div>
          )}
        </div>

        {/* ===== CONTENT EDITOR/PREVIEW ===== */}
        <div 
          className="relative bg-white/90 p-6 rounded-2xl border-2 border-gray-300/50 shadow-lg backdrop-blur-sm"
          data-field="contentHindi"
        >
          <div className="absolute -top-3 left-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1.5 rounded-full text-sm font-bold">
            📝 मुख्य सामग्री
          </div>
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4 pt-4">
            <div>
              <label className="block text-lg font-bold text-gray-800">
                <span className="text-2xl mr-2">✨</span> ब्लॉग सामग्री (हिंदी) 
                <span className="text-red-500 ml-1">*</span>
              </label>
              <p className="text-gray-600 text-sm">अपनी कहानी विस्तार से साझा करें</p>
            </div>
            
            {!isPreview && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <button
                  type="button"
                  onClick={insertSample}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all font-medium text-sm"
                >
                  <FaMagic className="text-sm" />
                  नमूना डालें
                </button>
                
                <div className="flex flex-wrap gap-2 bg-gradient-to-r from-gray-100 to-gray-200/80 p-3 rounded-2xl border border-gray-300/50 shadow-inner">
                  <button
                    type="button"
                    onClick={() => handleFormatText('h2')}
                    className="p-2.5 hover:bg-white rounded-xl transition-all hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
                    title="हेडिंग २"
                    aria-label="हेडिंग २"
                  >
                    <FaHeading className="text-lg text-gray-700" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFormatText('bold')}
                    className="p-2.5 hover:bg-white rounded-xl transition-all hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
                    title="बोल्ड"
                    aria-label="बोल्ड"
                  >
                    <FaBold className="text-gray-700" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFormatText('italic')}
                    className="p-2.5 hover:bg-white rounded-xl transition-all hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
                    title="इटैलिक"
                    aria-label="इटैलिक"
                  >
                    <FaItalic className="text-gray-700" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFormatText('underline')}
                    className="p-2.5 hover:bg-white rounded-xl transition-all hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
                    title="अंडरलाइन"
                    aria-label="अंडरलाइन"
                  >
                    <FaUnderline className="text-gray-700" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFormatText('ul')}
                    className="p-2.5 hover:bg-white rounded-xl transition-all hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
                    title="बुलेट लिस्ट"
                    aria-label="बुलेट लिस्ट"
                  >
                    <FaListUl className="text-gray-700" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFormatText('ol')}
                    className="p-2.5 hover:bg-white rounded-xl transition-all hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
                    title="नंबर्ड लिस्ट"
                    aria-label="नंबर्ड लिस्ट"
                  >
                    <FaListOl className="text-gray-700" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFormatText('link')}
                    className="p-2.5 hover:bg-white rounded-xl transition-all hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
                    title="लिंक जोड़ें"
                    aria-label="लिंक जोड़ें"
                  >
                    <FaLink className="text-gray-700" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFormatText('quote')}
                    className="p-2.5 hover:bg-white rounded-xl transition-all hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
                    title="उद्धरण"
                    aria-label="उद्धरण"
                  >
                    <span className="text-gray-700 font-bold text-lg">"</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {isPreview ? (
            <div 
              className="w-full p-8 border-2 border-dashed border-gray-400/50 rounded-2xl min-h-[400px] bg-gradient-to-br from-gray-50 to-white/50 backdrop-blur-sm prose prose-lg max-w-none overflow-auto shadow-inner"
              dangerouslySetInnerHTML={{ __html: formatPreview(blogData.contentHindi) }}
            />
          ) : (
            <>
              <textarea
                ref={textareaRef}
                name="content"
                required
                value={blogData.contentHindi}
                onChange={(e) => {
                  setBlogData({ ...blogData, contentHindi: e.target.value });
                  if (errors.contentHindi) setErrors({...errors, contentHindi: ""});
                }}
                className={`w-full p-6 text-lg rounded-2xl focus:ring-4 transition-all leading-relaxed tracking-wide placeholder-gray-500/70 shadow-inner min-h-[400px] font-medium ${
                  errors.contentHindi 
                    ? "border-2 border-red-400/50 focus:border-red-500 focus:ring-red-100/50 bg-red-50/30" 
                    : "border-2 border-gray-400/30 focus:border-blue-500 focus:ring-blue-100/50 bg-white/50"
                }`}
                placeholder="🌟 अपना ब्लॉग यहाँ लिखें... कहानी शुरू करें, विचार साझा करें, ज्ञान बाँटें!

• रोचक परिचय से शुरुआत करें
• मुख्य बिंदुओं को विस्तार से समझाएँ
• उदाहरण और कहानियाँ जोड़ें
• पाठक के लिए मूल्यवान जानकारी दें
• प्रेरणादायक समापन लिखें"
              />
              {errors.contentHindi && (
                <div className="mt-4 p-4 bg-gradient-to-r from-red-50/80 to-orange-50/80 rounded-xl border border-red-300/50 flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                    <FaExclamationCircle className="text-white text-lg" />
                  </div>
                  <div>
                    <span className="text-red-700 font-bold">{errors.contentHindi}</span>
                    <p className="text-red-600 text-sm mt-1">कृपया विस्तृत और मूल्यवान सामग्री लिखें</p>
                  </div>
                </div>
              )}
            </>
          )}
          
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-gray-300/50">
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    blogData.contentHindi.length > 500 ? 'bg-green-500' : 
                    blogData.contentHindi.length > 100 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-700">
                    {blogData.contentHindi.length} अक्षर
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm font-medium text-gray-700">
                    लगभग {Math.ceil(blogData.contentHindi.length / 1500)} मिनट पढ़ने का समय
                  </span>
                </div>
              </div>
              
              {blogData.contentHindi.length < 500 && !errors.contentHindi && (
                <div className="flex items-center gap-2 text-amber-700 bg-amber-50/50 px-3 py-1.5 rounded-lg border border-amber-200">
                  <span className="text-sm">📝</span>
                  <span className="text-sm font-medium">500+ अक्षर जोड़ने की सलाह (विस्तृत ब्लॉग के लिए)</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium ${
                imageFile 
                  ? 'bg-gradient-to-r from-emerald-50 to-green-50/50 border border-emerald-300/50 text-emerald-800' 
                  : 'bg-gradient-to-r from-gray-100 to-gray-200/50 border border-gray-300/50 text-gray-700'
              }`}>
                <FaImage className={imageFile ? 'text-emerald-600' : 'text-gray-500'} />
                <span>{imageFile ? "✅ छवि चयनित" : "📷 छवि जोड़ें"}</span>
              </div>
              
              <div className="hidden sm:block">
                <div className="text-xs text-gray-500 font-medium">फ़ॉन्ट:</div>
                <div className="text-sm font-medium text-gray-700">{fontOptions.find(f => f.id === fontStyle)?.name}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== CATEGORY & TAGS ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* CATEGORY */}
          <div 
            className="relative bg-gradient-to-br from-purple-50/80 to-pink-50/80 p-6 rounded-2xl border-2 border-purple-300/50 shadow-lg backdrop-blur-sm"
            data-field="category"
          >
            <div className="absolute -top-3 left-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1.5 rounded-full text-sm font-bold">
              🏷️ श्रेणी
            </div>
            
            <div className="pt-4">
              <label className="block text-lg font-bold text-gray-800 mb-4">
                <span className="text-2xl mr-2">📚</span> ब्लॉग श्रेणी 
                <span className="text-red-500 ml-1">*</span>
              </label>
              
              <div className="relative">
                <select
                  required
                  value={blogData.category}
                  onChange={(e) => {
                    setBlogData({ ...blogData, category: e.target.value });
                    if (errors.category) setErrors({...errors, category: ""});
                  }}
                  className={`w-full p-4 text-lg rounded-xl appearance-none focus:ring-4 transition-all font-medium shadow-inner ${
                    errors.category 
                      ? "border-2 border-red-400/50 focus:border-red-500 focus:ring-red-100/50 bg-red-50/30" 
                      : "border-2 border-purple-300/50 focus:border-purple-500 focus:ring-purple-100/50 bg-white/80"
                  }`}
                >
                  <option value="" className="text-gray-400">👉 एक श्रेणी चुनें...</option>
                  <option value="UPSC" className="font-bold text-gray-800">📚 UPSC परीक्षा</option>
                  <option value="PCS" className="font-bold text-gray-800">⚖️ PCS/राज्य सेवा</option>
                  <option value="Study Tips" className="font-bold text-gray-800">🎯 अध्ययन तकनीकें</option>
                  <option value="Current Affairs" className="font-bold text-gray-800">📰 समसामयिक मुद्दे</option>
                  <option value="Interview Tips" className="font-bold text-gray-800">💼 साक्षात्कार तैयारी</option>
                  <option value="Success Stories" className="font-bold text-gray-800">🏆 सफलता की कहानियाँ</option>
                </select>
                
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">▼</span>
                  </div>
                </div>
              </div>
              
              {errors.category && (
                <div className="mt-4 p-3 bg-gradient-to-r from-red-50/80 to-pink-50/80 rounded-lg border border-red-300/50 flex items-center gap-3">
                  <FaExclamationCircle className="text-red-500" />
                  <span className="text-red-700 font-medium">{errors.category}</span>
                </div>
              )}
              
              {blogData.category && (
                <div className="mt-4 p-3 bg-gradient-to-r from-purple-100/50 to-pink-100/50 rounded-lg border border-purple-300/30">
                  <span className="text-sm text-purple-800 font-medium">
                    ✅ चयनित: {blogData.category}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* TAGS */}
          <div className="relative bg-gradient-to-br from-emerald-50/80 to-teal-50/80 p-6 rounded-2xl border-2 border-emerald-300/50 shadow-lg backdrop-blur-sm">
            <div className="absolute -top-3 left-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-1.5 rounded-full text-sm font-bold">
              🔖 टैग्स
            </div>
            
            <div className="pt-4">
              <div className="flex justify-between items-center mb-4">
                <label className="block text-lg font-bold text-gray-800">
                  <span className="text-2xl mr-2">🏷️</span> ब्लॉग टैग्स
                </label>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                  blogData.tags.length >= 8 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : blogData.tags.length >= 4 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-800'
                }`}>
                  {blogData.tags.length}/10
                </span>
              </div>
              
              <input
                type="text"
                value={blogData.tags.join(", ")}
                onChange={(e) => handleTagsChange(e.target.value)}
                className="w-full p-4 text-lg border-2 border-emerald-300/50 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100/50 bg-white/80 shadow-inner font-medium placeholder-gray-400"
                placeholder="टैग्स कॉमा से अलग करें, जैसे: upsc, study-tips, hindi-blog, success"
                maxLength={200}
              />
              
              <div className="flex flex-wrap gap-3 mt-6">
                {blogData.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="group relative px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
                    onClick={() => {
                      setBlogData({
                        ...blogData,
                        tags: blogData.tags.filter((_, i) => i !== index)
                      });
                    }}
                  >
                    <span className="font-bold">#</span>
                    {tag}
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-sm">✕</span>
                  </span>
                ))}
                
                {blogData.tags.length === 0 && (
                  <div className="w-full p-4 bg-gradient-to-r from-emerald-100/50 to-teal-100/50 rounded-xl border-2 border-dashed border-emerald-300/50 text-center">
                    <span className="text-gray-600 font-medium">
                      टैग जोड़ने के लिए ऊपर टाइप करें (अधिकतम 10)
                    </span>
                  </div>
                )}
              </div>
              
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <span>टैग्स खोज इंजन ऑप्टिमाइजेशन में मदद करते हैं</span>
              </div>
            </div>
          </div>
        </div>

        {/* ===== IMAGE UPLOAD ===== */}
        <div className="relative bg-gradient-to-br from-amber-50/80 to-orange-50/80 p-8 rounded-2xl border-2 border-dashed border-amber-400/50 shadow-lg backdrop-blur-sm">
          <div className="absolute -top-3 left-6 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-4 py-1.5 rounded-full text-sm font-bold">
            🖼️ फ़ीचर्ड इमेज
          </div>
          
          {imageError && (
            <div className="mb-6 p-4 bg-gradient-to-r from-red-50/80 to-orange-50/80 rounded-xl border border-red-300/50 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                  <FaExclamationCircle className="text-white text-lg" />
                </div>
                <div>
                  <span className="text-red-700 font-bold">{imageError}</span>
                  <p className="text-red-600 text-sm mt-1">कृपया सही फॉर्मेट की फ़ाइल चुनें</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="pt-4">
            <label className="block text-lg font-bold text-gray-800 mb-6">
              <span className="text-2xl mr-2">🎨</span> ब्लॉग के लिए मुख्य छवि
            </label>
            
            <div className="flex flex-col xl:flex-row gap-8 items-start xl:items-stretch">
              {/* Upload Area */}
              <div className="flex-1">
                <label className="flex flex-col items-center justify-center w-full h-full p-8 border-3 border-dashed border-amber-400/50 rounded-2xl cursor-pointer bg-gradient-to-br from-white/80 to-amber-100/30 hover:from-white hover:to-amber-100/50 transition-all shadow-inner hover:shadow-lg group">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <FaUpload className="w-10 h-10 text-white" />
                    </div>
                    <p className="mb-2 text-lg font-bold text-gray-800">
                      <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                        छवि अपलोड करें
                      </span>
                    </p>
                    <p className="text-sm text-gray-600 text-center">
                      PNG, JPG, WEBP फ़ाइलें (अधिकतम 2MB)
                    </p>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      ⚡ क्लिक करें या फ़ाइल खींचकर लाएँ
                    </p>
                  </div>
                  <input 
                    type="file" 
                    accept="image/jpeg, image/jpg, image/png, image/webp" 
                    onChange={handleImageChange} 
                    className="hidden" 
                  />
                </label>
              </div>
              
              {/* Preview Area */}
              <div className="flex-1">
                {blogData.image ? (
                  <div className="relative h-full overflow-hidden rounded-2xl shadow-2xl group">
                    <img
                      src={blogData.image}
                      alt="preview"
                      className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                      <div className="text-white font-bold text-lg">Featured Image</div>
                      <div className="text-white/90 text-sm">मुख्य प्रदर्शन छवि</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setBlogData({ ...blogData, image: null });
                        setImageFile(null);
                        setImageError("");
                      }}
                      className="absolute top-4 right-4 w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full flex items-center justify-center hover:shadow-lg hover:scale-110 transition-all font-bold text-lg"
                      aria-label="Remove image"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-400/30 rounded-2xl bg-gradient-to-br from-gray-100/30 to-white/50">
                    <div className="w-24 h-24 bg-gradient-to-r from-gray-300 to-gray-400 rounded-2xl flex items-center justify-center mb-4 opacity-50">
                      <FaImage className="w-12 h-12 text-white" />
                    </div>
                    <p className="text-gray-500 font-medium text-lg">छवि प्रीव्यू</p>
                    <p className="text-gray-400 text-sm text-center mt-2">
                      कोई छवि चयनित नहीं<br/>
                      प्रीव्यू यहाँ दिखाई देगा
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-6 flex items-center justify-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span>उच्च गुणवत्ता वाली छवि ब्लॉग को आकर्षक बनाती है</span>
              </div>
            </div>
          </div>
        </div>

        {/* ===== PUBLISH OPTIONS ===== */}
        <div className="relative bg-gradient-to-br from-rose-50/80 to-pink-50/80 p-8 rounded-2xl border-2 border-rose-300/50 shadow-lg backdrop-blur-sm">
          <div className="absolute -top-3 left-6 bg-gradient-to-r from-rose-600 to-pink-600 text-white px-4 py-1.5 rounded-full text-sm font-bold">
            🌐 प्रकाशन विकल्प
          </div>
          
          <div className="pt-4">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-6">
                  {/* Toggle Switch */}
                  <div className="relative">
                    <div 
                      className={`w-20 h-10 flex items-center rounded-full p-1.5 cursor-pointer transition-all duration-300 ${
                        blogData.isPublished 
                          ? 'bg-gradient-to-r from-emerald-500 to-green-500 shadow-lg shadow-emerald-500/30' 
                          : 'bg-gradient-to-r from-gray-400 to-gray-500 shadow-inner'
                      }`}
                      onClick={() => setBlogData({ ...blogData, isPublished: !blogData.isPublished })}
                      role="switch"
                      aria-checked={blogData.isPublished}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setBlogData({ ...blogData, isPublished: !blogData.isPublished });
                        }
                      }}
                    >
                      <div className={`bg-white w-8 h-8 rounded-full shadow-xl transform transition-all duration-300 ${
                        blogData.isPublished ? 'translate-x-10' : ''
                      }`} />
                    </div>
                    
                    {/* Animated Rings */}
                    {blogData.isPublished && (
                      <>
                        <div className="absolute -inset-2 border-2 border-emerald-400/30 rounded-full animate-ping"></div>
                        <div className="absolute -inset-4 border-2 border-emerald-400/20 rounded-full animate-ping delay-300"></div>
                      </>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">
                      {blogData.isPublished ? "🌐 लाइव प्रकाशित करें" : "📁 ड्राफ्ट में सहेजें"}
                    </h3>
                    <p className="text-gray-600 mt-2 max-w-md">
                      {blogData.isPublished 
                        ? "ब्लॉग तुरंत वेबसाइट पर प्रकाशित हो जाएगा और सभी विजिटर्स को दिखाई देगा।" 
                        : "ब्लॉग सहेजा जाएगा लेकिन प्रकाशित नहीं होगा। आप इसे बाद में एडिट और प्रकाशित कर सकते हैं।"}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Status Badge */}
              <div className="text-center">
                <div className="text-sm font-medium text-gray-500 mb-2">वर्तमान स्थिति</div>
                <div className={`px-6 py-3 rounded-xl font-bold text-lg shadow-lg ${
                  blogData.isPublished 
                    ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white' 
                    : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                }`}>
                  {blogData.isPublished ? '🚀 LIVE' : '📄 DRAFT'}
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  {blogData.isPublished ? 'सार्वजनिक रूप से दृश्यमान' : 'केवल आपको दिखाई देगा'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== ACTION BUTTONS ===== */}
        <div className="relative pt-8 border-t border-gray-300/50">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            {/* Left Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="group flex items-center gap-3 px-8 py-3.5 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all shadow-xl hover:shadow-2xl font-bold text-lg min-w-[160px] justify-center"
              >
                <FaTimes className="group-hover:rotate-90 transition-transform" />
                रद्द करें
              </button>
              
              {!initialData && (
                <button
                  type="button"
                  onClick={clearDraft}
                  className="group flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl font-bold text-lg"
                >
                  <span className="text-xl">🗑️</span>
                  ड्राफ्ट साफ करें
                </button>
              )}
            </div>
            
            {/* Right Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={() => setIsPreview(!isPreview)}
                className="group flex items-center gap-3 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl hover:from-blue-700 hover:to-cyan-600 transition-all shadow-xl hover:shadow-2xl font-bold text-lg min-w-[160px] justify-center"
              >
                {isPreview ? <FaEyeSlash /> : <FaEye />}
                {isPreview ? "✏️ एडिट करें" : "👁️ प्रीव्यू"}
              </button>
              
              <button
                type="submit"
                className="group relative overflow-hidden flex items-center gap-3 px-10 py-3.5 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl hover:from-emerald-600 hover:to-green-600 transition-all shadow-xl hover:shadow-2xl font-bold text-lg min-w-[180px] justify-center"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                <FaSave className="relative z-10 group-hover:scale-110 transition-transform" />
                <span className="relative z-10">
                  {initialData ? "🔄 अपडेट करें" : "💾 ब्लॉग सहेजें"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* ===== ENHANCED WRITING TIPS ===== */}
      <div className="mt-12 p-8 bg-gradient-to-br from-indigo-50/80 to-blue-50/80 rounded-3xl border-2 border-blue-300/50 shadow-xl backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl flex items-center justify-center">
            <span className="text-2xl">💡</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">ब्लॉग लेखन मास्टरक्लास</h3>
            <p className="text-gray-600">पेशेवर ब्लॉग लिखने के गुर</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: "🎯",
              title: "शीर्षक कला",
              tips: [
                "खोजशब्द शामिल करें",
                "60 अक्षरों के भीतर रहें",
                "जिज्ञासा जगाएँ"
              ]
            },
            {
              icon: "📖",
              title: "सामग्री संरचना",
              tips: [
                "पैराग्राफ में लिखें",
                "हेडिंग का प्रयोग करें",
                "बुलेट पॉइंट्स जोड़ें"
              ]
            },
            {
              icon: "🖼️",
              title: "विजुअल अपील",
              tips: [
                "उच्च गुणवत्ता छवि",
                "प्रासंगिक चित्र",
                "उचित आकार अनुपात"
              ]
            }
          ].map((section, idx) => (
            <div key={idx} className="bg-white/80 p-6 rounded-2xl border border-blue-200/50 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{section.icon}</span>
                <h4 className="text-xl font-bold text-gray-800">{section.title}</h4>
              </div>
              <ul className="space-y-3">
                {section.tips.map((tip, tipIdx) => (
                  <li key={tipIdx} className="flex items-center gap-3 text-gray-700">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-8 pt-6 border-t border-blue-300/50">
          <h4 className="text-lg font-bold text-gray-800 mb-4">फॉर्मेटिंग शॉर्टकट्स</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { code: "## Text", result: "बड़ा हेडिंग", class: "text-2xl font-bold" },
              { code: "**Text**", result: "बोल्ड टेक्स्ट", class: "font-bold" },
              { code: "*Text*", result: "इटैलिक टेक्स्ट", class: "italic" },
              { code: "> Text", result: "ब्लॉककोट", class: "border-l-4 border-blue-500 pl-4 italic" }
            ].map((item, idx) => (
              <div key={idx} className="bg-white/50 p-4 rounded-xl border border-blue-200/30">
                <div className="text-sm font-mono text-gray-600 mb-2">{item.code}</div>
                <div className={`text-gray-800 ${item.class}`}>{item.result}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-2 text-gray-500 text-sm">
          <div className="w-1 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          <span>✨ आपका ब्लॉग {Math.ceil(blogData.contentHindi.length / 1500)} मिनट में पढ़ा जा सकेगा</span>
          <div className="w-1 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default AdminBlogEditor;