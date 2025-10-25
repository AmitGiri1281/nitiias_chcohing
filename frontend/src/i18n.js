import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      home: 'Home',
      courses: 'Courses',
      blog: 'Blog',
      admin: 'Admin',
      login: 'Login',
      logout: 'Logout',
      
      // Hero section
      welcome: 'Welcome to Niti IAS',
      tagline: 'Your premier destination for UPSC, IAS, PCS and State PCS exam preparation',
      cta: 'Explore Courses',
      
      // Blog editor
      blogEditor: 'Blog Editor',
      titleEnglish: 'Title (English)',
      titleHindi: 'Title (Hindi)',
      contentEnglish: 'Content (English)',
      contentHindi: 'Content (Hindi)',
      category: 'Category',
      selectCategory: 'Select Category',
      tags: 'Tags',
      commaSeparated: 'Comma separated',
      featuredImage: 'Featured Image',
      cancel: 'Cancel',
      savePublish: 'Save & Publish',
      editBlog: 'Edit Blog',
      createBlog: 'Create New Blog',
      
      // Categories
      upsc: 'UPSC',
      pcs: 'PCS',
      studyTips: 'Study Tips',
      currentAffairs: 'Current Affairs',
      
      // Admin Dashboard
      dashboard: 'Dashboard',
      blogManagement: 'Blog Management',
      courseManagement: 'Course Management',
      createNew: 'Create New',
      edit: 'Edit',
      delete: 'Delete',
      published: 'Published',
      draft: 'Draft',
      
      // Common
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      submit: 'Submit',
      actions: 'Actions',
      view: 'View',
      
      // Auth
      email: 'Email',
      password: 'Password',
      loginToAccount: 'Login to your account',
      registerAccount: 'Register new account',
      name: 'Name',
      confirmPassword: 'Confirm Password',
      
      // Blog
      readMore: 'Read More',
      by: 'By',
      views: 'views',
      noBlogs: 'No blogs found',
      
      // Courses
      courseDuration: 'Duration',
      coursePrice: 'Price',
      courseFeatures: 'Features',
      enrollNow: 'Enroll Now',
      noCourses: 'No courses available',
    }
  },
  hi: {
    translation: {
      // Navigation
      home: 'होम',
      courses: 'कोर्सेज',
      blog: 'ब्लॉग',
      admin: 'एडमिन',
      login: 'लॉगिन',
      logout: 'लॉगआउट',
      
      // Hero section
      welcome: 'नीति आईएएस में आपका स्वागत है',
      tagline: 'यूपीएससी, आईएएस, पीसीएस और राज्य पीसीएस परीक्षा की तैयारी के लिए आपका प्रमुख स्थान',
      cta: 'कोर्सेज देखें',
      
      // Blog editor
      blogEditor: 'ब्लॉग संपादक',
      titleEnglish: 'शीर्षक (अंग्रेजी)',
      titleHindi: 'शीर्षक (हिंदी)',
      contentEnglish: 'सामग्री (अंग्रेजी)',
      contentHindi: 'सामग्री (हिंदी)',
      category: 'श्रेणी',
      selectCategory: 'श्रेणी चुनें',
      tags: 'टैग',
      commaSeparated: 'कॉमा से अलग किए गए',
      featuredImage: 'फीचर्ड इमेज',
      cancel: 'रद्द करें',
      savePublish: 'सहेजें और प्रकाशित करें',
      editBlog: 'ब्लॉग संपादित करें',
      createBlog: 'नया ब्लॉग बनाएं',
      
      // Categories
      upsc: 'यूपीएससी',
      pcs: 'पीसीएस',
      studyTips: 'अध्ययन युक्तियाँ',
      currentAffairs: 'चालू मामले',
      
      // Admin Dashboard
      dashboard: 'डैशबोर्ड',
      blogManagement: 'ब्लॉग प्रबंधन',
      courseManagement: 'कोर्स प्रबंधन',
      createNew: 'नया बनाएं',
      edit: 'संपादित करें',
      delete: 'हटाएं',
      published: 'प्रकाशित',
      draft: 'ड्राफ्ट',
      
      // Common
      loading: 'लोड हो रहा है...',
      error: 'त्रुटि',
      success: 'सफलता',
      submit: 'जमा करें',
      actions: 'कार्रवाई',
      view: 'देखें',
      
      // Auth
      email: 'ईमेल',
      password: 'पासवर्ड',
      loginToAccount: 'अपने अकाउंट में लॉगिन करें',
      registerAccount: 'नया अकाउंट बनाएं',
      name: 'नाम',
      confirmPassword: 'पासवर्ड की पुष्टि करें',
      
      // Blog
      readMore: 'अधिक पढ़ें',
      by: 'द्वारा',
      views: 'विचार',
      noBlogs: 'कोई ब्लॉग नहीं मिला',
      
      // Courses
      courseDuration: 'अवधि',
      coursePrice: 'मूल्य',
      courseFeatures: 'विशेषताएं',
      enrollNow: 'अभी नामांकन करें',
      noCourses: 'कोई कोर्स उपलब्ध नहीं है',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;