import React, { useState, useEffect } from 'react';

const AdminPyqEditor = ({ onSave, initialData, onCancel }) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    questionNumber: 1,
    question: '', // Only Hindi
    options: [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false }
    ],
    answer: '',
    explanation: '',
    difficulty: 'Medium',
    marks: 1,
    tags: '',
    category: ''
  });
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(null);
  const [customSubject, setCustomSubject] = useState('');

  const [pyqData, setPyqData] = useState({
    title: '',
    description: '',
    exam: 'UPSC',
    year: new Date().getFullYear(),
    subject: '',
    category: '',
    isPublished: false,
    timeLimit: 180,
    instructions: 'सभी प्रश्नों के उत्तर दें। प्रत्येक प्रश्न के लिए अंक निर्धारित हैं।',
    tags: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      // Parse questions from JSON string if exists
      let parsedQuestions = [];
      try {
        parsedQuestions = initialData.questions ? 
          (typeof initialData.questions === 'string' ? 
            JSON.parse(initialData.questions) : 
            initialData.questions) : 
          [];
      } catch (error) {
        console.error('Questions parsing error:', error);
        parsedQuestions = [];
      }

      // Handle custom subject if "other" is selected
      const subject = initialData.subject || '';
      let customSub = '';
      let displaySubject = subject;
      
      const predefinedSubjects = [
        'इतिहास', 'भूगोल', 'राजनीति विज्ञान', 'अर्थशास्त्र', 'विज्ञान एवं प्रौद्योगिकी',
        'पर्यावरण', 'नैतिकता', 'अंतर्राष्ट्रीय संबंध', 'आंतरिक सुरक्षा', 'समाजशास्त्र'
      ];
      
      if (subject && !predefinedSubjects.includes(subject)) {
        displaySubject = 'other';
        customSub = subject;
      }

      // ✅ FIX 1: Ensure numbers are valid
      const year = parseInt(initialData.year) || new Date().getFullYear();
      const timeLimit = parseInt(initialData.timeLimit) || 180;

      setPyqData({
        title: initialData.title || '',
        description: initialData.description || '',
        exam: initialData.exam || 'UPSC',
        year: year, // ✅ Fixed: Ensure valid number
        subject: displaySubject,
        category: initialData.category || '',
        isPublished: initialData.isPublished || false,
        timeLimit: timeLimit, // ✅ Fixed: Ensure valid number
        instructions: initialData.instructions || 'सभी प्रश्नों के उत्तर दें। प्रत्येक प्रश्न के लिए अंक निर्धारित हैं।',
        tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : (initialData.tags || '')
      });
      
      setCustomSubject(customSub);
      
      // ✅ FIX 2: Ensure questions have valid numbers
      const validatedQuestions = parsedQuestions.map(q => ({
        ...q,
        marks: parseInt(q.marks) || 1, // ✅ Ensure marks is a number
        questionNumber: parseInt(q.questionNumber) || 1
      }));
      
      setQuestions(validatedQuestions);
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!pyqData.title.trim()) {
      newErrors.title = 'शीर्षक आवश्यक है';
    }
    
    // Handle subject validation with custom subject
    const actualSubject = pyqData.subject === 'other' ? customSubject : pyqData.subject;
    if (!actualSubject.trim()) {
      newErrors.subject = 'विषय आवश्यक है';
    }
    
    if (!pyqData.category) {
      newErrors.category = 'श्रेणी चुनें';
    }
    
    if (questions.length === 0) {
      newErrors.questions = 'कम से कम एक प्रश्न जोड़ें';
    }
    
    // ✅ FIX 3: Validate numbers
    if (isNaN(pyqData.year) || pyqData.year < 2000 || pyqData.year > new Date().getFullYear()) {
      newErrors.year = 'वर्ष 2000 से वर्तमान वर्ष के बीच होना चाहिए';
    }
    
    if (isNaN(pyqData.timeLimit) || pyqData.timeLimit < 1 || pyqData.timeLimit > 300) {
      newErrors.timeLimit = 'समय सीमा 1 से 300 मिनट के बीच होनी चाहिए';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert('कृपया सभी आवश्यक फ़ील्ड भरें');
      return;
    }

    // ✅ Handle custom subject properly
    const actualSubject = pyqData.subject === 'other' ? customSubject : pyqData.subject;

    // ✅ FIX 4: Safe tags handling - tags might already be an array
    const getTagsArray = (tags) => {
      if (Array.isArray(tags)) return tags;
      if (typeof tags === 'string') return tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      return [];
    };

    // ✅ FIX 5: Safe question tags handling
    const processQuestionTags = (q) => {
      if (Array.isArray(q.tags)) return q.tags;
      if (typeof q.tags === 'string' && q.tags.trim()) {
        return q.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      }
      return [];
    };

    // ✅ NO API CHANGES - Same structure as before
    const formData = {
      ...pyqData,
      subject: actualSubject, // Use actual subject value
      titleHindi: pyqData.title, // Keep both fields for API compatibility
      descriptionHindi: pyqData.description,
      subjectHindi: actualSubject,
      instructionsHindi: pyqData.instructions,
      tags: getTagsArray(pyqData.tags), // ✅ Fixed: Use safe function
      questions: JSON.stringify(questions.map((q, index) => ({
        ...q,
        questionNumber: index + 1,
        questionHindi: q.question, // For compatibility
        answerHindi: q.answer,
        explanationHindi: q.explanation,
        marks: parseInt(q.marks) || 1, // ✅ Ensure marks is a number
        options: q.options.map(opt => ({
          textHindi: opt.text,
          isCorrect: opt.isCorrect
        })),
        // ✅ Documented: Question-level tags are for internal filtering
        questionTags: processQuestionTags(q) // ✅ Fixed: Use safe function
      })))
    };
    
    onSave(formData);
  };

  const addQuestion = () => {
    if (!currentQuestion.question.trim()) {
      alert('कृपया प्रश्न हिंदी में दर्ज करें');
      return;
    }

    // ✅ FIXED: Allow multiple correct answers for future compatibility
    const hasCorrectOption = currentQuestion.options.some(opt => opt.isCorrect);
    if (!hasCorrectOption) {
      alert('कृपया कम से कम एक सही उत्तर चुनें');
      return;
    }

    const newQuestion = {
      ...currentQuestion,
      questionNumber: questions.length + 1,
      marks: parseInt(currentQuestion.marks) || 1, // ✅ Ensure marks is a number
      tags: currentQuestion.tags // Keep as string for editing
    };

    if (editingQuestionIndex !== null) {
      // ✅ FIXED: Edit existing question
      const updatedQuestions = [...questions];
      updatedQuestions[editingQuestionIndex] = newQuestion;
      setQuestions(updatedQuestions);
      setEditingQuestionIndex(null);
    } else {
      setQuestions([...questions, newQuestion]);
    }
    
    // Reset current question
    setCurrentQuestion({
      questionNumber: questions.length + 2,
      question: '',
      options: [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
      ],
      answer: '',
      explanation: '',
      difficulty: 'Medium',
      marks: 1,
      tags: '',
      category: ''
    });
  };

  // ✅ FIXED: Function to edit existing question
  const editQuestion = (index) => {
    const questionToEdit = questions[index];
    
    // ✅ FIX 6: Handle tags when editing (could be array or string)
    let tagsValue = '';
    if (Array.isArray(questionToEdit.tags)) {
      tagsValue = questionToEdit.tags.join(', ');
    } else if (typeof questionToEdit.tags === 'string') {
      tagsValue = questionToEdit.tags;
    }
    
    setCurrentQuestion({
      ...questionToEdit,
      tags: tagsValue,
      marks: parseInt(questionToEdit.marks) || 1 // ✅ Ensure marks is a number
    });
    
    setEditingQuestionIndex(index);
    // Scroll to question form
    document.querySelector('.add-question-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setQuestions(updatedQuestions);
  };

  const deleteQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions.map((q, i) => ({ ...q, questionNumber: i + 1 })));
    if (editingQuestionIndex === index) {
      setEditingQuestionIndex(null);
      setCurrentQuestion({
        questionNumber: updatedQuestions.length + 1,
        question: '',
        options: [
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false }
        ],
        answer: '',
        explanation: '',
        difficulty: 'Medium',
        marks: 1,
        tags: '',
        category: ''
      });
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear - i);

  const addOption = () => {
    if (currentQuestion.options.length >= 6) {
      alert('अधिकतम 6 विकल्प ही जोड़ सकते हैं');
      return;
    }
    const newOptions = [...currentQuestion.options, { text: '', isCorrect: false }];
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  const removeOption = (index) => {
    if (currentQuestion.options.length <= 1) {
      alert('कम से कम एक विकल्प आवश्यक है');
      return;
    }
    const newOptions = currentQuestion.options.filter((_, i) => i !== index);
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  const updateOption = (index, field, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  // ✅ FIXED: Toggle correct answer
  const handleOptionCorrectToggle = (index) => {
    const newOptions = currentQuestion.options.map((opt, i) => ({
      ...opt,
      isCorrect: i === index
    }));
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  // ✅ FIX 7: Safe number input handlers
  const handleNumberChange = (field, value) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue > 0) {
      setPyqData({ ...pyqData, [field]: numValue });
    } else if (value === '') {
      setPyqData({ ...pyqData, [field]: '' });
    }
  };

  const handleMarksChange = (value) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue > 0) {
      setCurrentQuestion({ ...currentQuestion, marks: numValue });
    } else if (value === '') {
      setCurrentQuestion({ ...currentQuestion, marks: '' });
    }
  };

  const examTypes = [
    { value: 'UPSC', label: 'UPSC' },
    { value: 'State PCS', label: 'राज्य PCS' },
    { value: 'UPPCS', label: 'UPPCS' },
    { value: 'MPPSC', label: 'MPPSC' },
    { value: 'BPSC', label: 'BPSC' },
    { value: 'Other', label: 'अन्य' }
  ];

  const categories = [
    { value: 'Preliminary', label: 'प्रारंभिक परीक्षा' },
    { value: 'Mains', label: 'मुख्य परीक्षा' },
    { value: 'GS Paper 1', label: 'सामान्य अध्ययन पेपर 1' },
    { value: 'GS Paper 2', label: 'सामान्य अध्ययन पेपर 2' },
    { value: 'GS Paper 3', label: 'सामान्य अध्ययन पेपर 3' },
    { value: 'GS Paper 4', label: 'सामान्य अध्ययन पेपर 4' },
    { value: 'Optional', label: 'वैकल्पिक विषय' },
    { value: 'Essay', label: 'निबंध' },
    { value: 'Aptitude', label: 'योग्यता परीक्षा' }
  ];

  const subjects = [
    'इतिहास', 'भूगोल', 'राजनीति विज्ञान', 'अर्थशास्त्र', 'विज्ञान एवं प्रौद्योगिकी',
    'पर्यावरण', 'नैतिकता', 'अंतर्राष्ट्रीय संबंध', 'आंतरिक सुरक्षा', 'समाजशास्त्र'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                {initialData ? '📝 PYQ संपादित करें' : '➕ नया PYQ जोड़ें'}
              </h1>
              <p className="text-green-100 mt-2">
                {initialData ? 'पिछले वर्ष के प्रश्नपत्र में संशोधन करें' : 'नया पिछले वर्ष का प्रश्नपत्र बनाएं'}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <span className="inline-block px-4 py-2 bg-green-800 text-white rounded-full text-sm font-semibold">
                प्रश्न: {questions.length}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {[
              { id: 'basic', label: 'मूल जानकारी', icon: '📋' },
              { id: 'questions', label: 'प्रश्न', icon: '❓' },
              { id: 'settings', label: 'सेटिंग्स', icon: '⚙️' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-4 font-medium text-sm md:text-base whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-b-2 border-green-600 text-green-600 bg-green-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="mr-2 text-lg">{tab.icon}</span>
                {tab.label}
                {tab.id === 'questions' && questions.length > 0 && (
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    {questions.length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <span className="text-red-500">*</span> शीर्षक
                  </label>
                  <input
                    type="text"
                    value={pyqData.title}
                    onChange={(e) => {
                      setPyqData({ ...pyqData, title: e.target.value });
                      if (errors.title) setErrors({ ...errors, title: '' });
                    }}
                    className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg ${
                      errors.title ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="जैसे: UPSC सिविल सेवा प्रारंभिक परीक्षा 2023"
                    required
                  />
                  {errors.title && (
                    <p className="mt-2 text-sm text-red-600">{errors.title}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <span className="text-red-500">*</span> विषय
                  </label>
                  <select
                    value={pyqData.subject}
                    onChange={(e) => {
                      setPyqData({ ...pyqData, subject: e.target.value });
                      if (errors.subject) setErrors({ ...errors, subject: '' });
                    }}
                    className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg ${
                      errors.subject ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="">विषय चुनें</option>
                    {subjects.map((subject) => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                    <option value="other">अन्य</option>
                  </select>
                  
                  {/* ✅ FIXED: Custom subject input with separate state */}
                  {pyqData.subject === 'other' && (
                    <div className="mt-2">
                      <input
                        type="text"
                        value={customSubject}
                        onChange={(e) => setCustomSubject(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        placeholder="अपना विषय दर्ज करें..."
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        कस्टम विषय दर्ज करें (उदाहरण: कृषि, कला एवं संस्कृति, आदि)
                      </p>
                    </div>
                  )}
                  
                  {errors.subject && (
                    <p className="mt-2 text-sm text-red-600">{errors.subject}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  विवरण
                </label>
                <textarea
                  value={pyqData.description}
                  onChange={(e) => setPyqData({ ...pyqData, description: e.target.value })}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent h-32 text-lg"
                  placeholder="प्रश्न पत्र का विस्तृत विवरण लिखें..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <span className="text-red-500">*</span> परीक्षा प्रकार
                  </label>
                  <select
                    value={pyqData.exam}
                    onChange={(e) => setPyqData({ ...pyqData, exam: e.target.value })}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                    required
                  >
                    {examTypes.map((exam) => (
                      <option key={exam.value} value={exam.value}>{exam.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <span className="text-red-500">*</span> वर्ष
                  </label>
                  <select
                    value={pyqData.year}
                    onChange={(e) => handleNumberChange('year', e.target.value)}
                    className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg ${
                      errors.year ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="">वर्ष चुनें</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  {errors.year && (
                    <p className="mt-2 text-sm text-red-600">{errors.year}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    PYQ टैग्स (कॉमा से अलग)
                  </label>
                  <input
                    type="text"
                    value={pyqData.tags}
                    onChange={(e) => setPyqData({ ...pyqData, tags: e.target.value })}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                    placeholder="जैसे: upsc, prelims, general-studies"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    संपूर्ण PYQ के लिए टैग्स (सर्च और फ़िल्टर में उपयोग)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Questions Tab */}
          {activeTab === 'questions' && (
            <div className="space-y-8 animate-fadeIn">
              {/* Add/Edit Question Form */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-2xl border-2 border-dashed border-gray-300 add-question-form">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center">
                    {editingQuestionIndex !== null ? (
                      <>
                        <span className="mr-3">✏️</span> प्रश्न संपादित करें (प्र. {editingQuestionIndex + 1})
                      </>
                    ) : (
                      <>
                        <span className="mr-3">➕</span> नया प्रश्न जोड़ें
                      </>
                    )}
                  </h3>
                  {editingQuestionIndex !== null && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingQuestionIndex(null);
                        setCurrentQuestion({
                          questionNumber: questions.length + 1,
                          question: '',
                          options: [
                            { text: '', isCorrect: false },
                            { text: '', isCorrect: false },
                            { text: '', isCorrect: false },
                            { text: '', isCorrect: false }
                          ],
                          answer: '',
                          explanation: '',
                          difficulty: 'Medium',
                          marks: 1,
                          tags: '',
                          category: ''
                        });
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                    >
                      नया प्रश्न जोड़ें
                    </button>
                  )}
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <span className="text-red-500">*</span> प्रश्न
                  </label>
                  <textarea
                    value={currentQuestion.question}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent h-40 text-lg"
                    placeholder="प्रश्न हिंदी में लिखें..."
                    required
                  />
                </div>

                {/* Options */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">
                        <span className="text-red-500">*</span> विकल्प (सही उत्तर चुनें)
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        ✅ सही उत्तर के लिए रेडियो बटन पर क्लिक करें
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addOption}
                      className="flex items-center text-green-600 hover:text-green-800 font-medium"
                    >
                      <span className="text-lg mr-1">+</span> विकल्प जोड़ें
                    </button>
                  </div>
                  <div className="space-y-4">
                    {currentQuestion.options.map((option, index) => (
                      <div key={index} className="bg-white p-4 rounded-xl border border-gray-300 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => handleOptionCorrectToggle(index)}
                              className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center mt-2 ${
                                option.isCorrect 
                                  ? 'bg-green-500 border-green-600 text-white' 
                                  : 'border-gray-300 hover:border-green-400'
                              }`}
                              title={option.isCorrect ? 'सही उत्तर' : 'सही उत्तर चुनें'}
                            >
                              {option.isCorrect && '✓'}
                            </button>
                            <p className="text-xs text-gray-500 mt-1 text-center">
                              {String.fromCharCode(65 + index)}
                            </p>
                          </div>
                          <div className="flex-1">
                            <input
                              type="text"
                              value={option.text}
                              onChange={(e) => updateOption(index, 'text', e.target.value)}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                              placeholder={`विकल्प ${String.fromCharCode(65 + index)} लिखें...`}
                              required
                            />
                            <div className="flex justify-end mt-2">
                              {currentQuestion.options.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeOption(index)}
                                  className="text-sm text-red-600 hover:text-red-800 font-medium"
                                >
                                  ❌ विकल्प हटाएं
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      कठिनाई स्तर
                    </label>
                    <select
                      value={currentQuestion.difficulty}
                      onChange={(e) => setCurrentQuestion({ ...currentQuestion, difficulty: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="Easy">🟢 आसान</option>
                      <option value="Medium">🟡 मध्यम</option>
                      <option value="Hard">🔴 कठिन</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      अंक
                    </label>
                    <input
                      type="number"
                      value={currentQuestion.marks}
                      onChange={(e) => handleMarksChange(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      min="1"
                      max="10"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      प्रश्न टैग्स (कॉमा से अलग)
                    </label>
                    <input
                      type="text"
                      value={currentQuestion.tags}
                      onChange={(e) => setCurrentQuestion({ ...currentQuestion, tags: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="जैसे: polity, constitution"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      प्रश्न-विशिष्ट टैग्स (विस्तृत फ़िल्टरिंग के लिए)
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    स्पष्टीकरण
                  </label>
                  <textarea
                    value={currentQuestion.explanation}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, explanation: e.target.value })}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent h-32 text-lg"
                    placeholder="उत्तर का विस्तृत स्पष्टीकरण लिखें..."
                  />
                </div>

                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={addQuestion}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-green-500/30 transition-all hover:scale-105"
                  >
                    {editingQuestionIndex !== null ? '✅ प्रश्न अपडेट करें' : '✅ प्रश्न जोड़ें'}
                  </button>
                </div>
              </div>

              {/* Questions List */}
              <div className="mt-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    प्रश्नों की सूची ({questions.length})
                  </h3>
                  {questions.length > 0 && (
                    <div className="flex items-center gap-4">
                      <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full font-semibold">
                        कुल अंक: {questions.reduce((sum, q) => sum + (parseInt(q.marks) || 1), 0)}
                      </span>
                      <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-semibold">
                        प्रश्न: {questions.length}
                      </span>
                    </div>
                  )}
                </div>
                
                {questions.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
                    <div className="text-5xl mb-4">📝</div>
                    <p className="text-gray-500 text-xl">अभी तक कोई प्रश्न नहीं जोड़ा गया</p>
                    <p className="text-gray-400 mt-2">ऊपर दिए गए फॉर्म से अपना पहला प्रश्न जोड़ें</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {questions.map((question, index) => (
                      <div key={index} className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-green-400 hover:shadow-lg transition-all">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-start">
                              <div className="mr-4 flex-shrink-0">
                                <span className="font-bold text-2xl text-green-600">प्र.{index + 1}</span>
                              </div>
                              <div className="flex-1">
                                <p className="text-lg font-medium text-gray-900 mb-2">
                                  {question.question}
                                </p>
                                <div className="space-y-2 ml-4">
                                  {question.options.map((opt, optIndex) => (
                                    <div 
                                      key={optIndex} 
                                      className={`flex items-center p-3 rounded-lg ${opt.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}
                                    >
                                      <span className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 font-medium ${
                                        opt.isCorrect ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
                                      }`}>
                                        {String.fromCharCode(65 + optIndex)}
                                      </span>
                                      <span className={opt.isCorrect ? 'font-semibold text-green-800' : 'text-gray-700'}>
                                        {opt.text || '(खाली)'}
                                      </span>
                                      {opt.isCorrect && (
                                        <span className="ml-auto text-green-600 font-bold">✅ सही उत्तर</span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2 ml-4">
                            <div className="flex gap-2">
                              <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                                question.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                                question.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {question.difficulty === 'Easy' ? '🟢 आसान' : 
                                 question.difficulty === 'Medium' ? '🟡 मध्यम' : '🔴 कठिन'}
                              </span>
                              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
                                {parseInt(question.marks) || 1} अंक
                              </span>
                            </div>
                            <div className="flex gap-2 mt-2">
                              <button
                                type="button"
                                onClick={() => editQuestion(index)}
                                className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium text-sm"
                              >
                                ✏️ संपादित करें
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteQuestion(index)}
                                className="px-3 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-medium text-sm"
                              >
                                🗑️ हटाएं
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        {question.explanation && (
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center text-gray-600 mb-2">
                              <span className="font-semibold mr-2">💡 स्पष्टीकरण:</span>
                            </div>
                            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                              {question.explanation}
                            </p>
                          </div>
                        )}
                        
                        {question.tags && (Array.isArray(question.tags) ? question.tags.length > 0 : question.tags.trim()) && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="flex flex-wrap gap-2">
                              {/* ✅ FIX 8: Safe tags rendering */}
                              {(Array.isArray(question.tags) ? question.tags : [question.tags])
                                .filter(tag => tag && tag.trim())
                                .map((tag, tagIndex) => (
                                  <span key={tagIndex} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                                    #{tag}
                                  </span>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <span className="text-red-500">*</span> श्रेणी
                  </label>
                  <select
                    value={pyqData.category}
                    onChange={(e) => {
                      setPyqData({ ...pyqData, category: e.target.value });
                      if (errors.category) setErrors({ ...errors, category: '' });
                    }}
                    className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg ${
                      errors.category ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="">श्रेणी चुनें</option>
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-2 text-sm text-red-600">{errors.category}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    समय सीमा (मिनट)
                  </label>
                  <input
                    type="number"
                    value={pyqData.timeLimit}
                    onChange={(e) => handleNumberChange('timeLimit', e.target.value)}
                    className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg ${
                      errors.timeLimit ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    min="1"
                    max="300"
                  />
                  {errors.timeLimit && (
                    <p className="mt-2 text-sm text-red-600">{errors.timeLimit}</p>
                  )}
                  <p className="mt-2 text-sm text-gray-500">
                    डिफ़ॉल्ट: 3 घंटे (180 मिनट) - UPSC प्रारंभिक परीक्षा के लिए
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  निर्देश
                </label>
                <textarea
                  value={pyqData.instructions}
                  onChange={(e) => setPyqData({ ...pyqData, instructions: e.target.value })}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent h-40 text-lg"
                  placeholder="परीक्षा के निर्देश लिखें..."
                />
              </div>

              <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
                <div className="flex items-center">
                  <input
                    id="publish"
                    type="checkbox"
                    checked={pyqData.isPublished}
                    onChange={(e) => setPyqData({ ...pyqData, isPublished: e.target.checked })}
                    className="h-6 w-6 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="publish" className="ml-4 text-lg font-semibold text-gray-900">
                    तुरंत प्रकाशित करें
                  </label>
                </div>
                <p className="mt-2 ml-10 text-gray-600">
                  इसे चेक करने पर यह PYQ उपयोगकर्ताओं को दिखाई देगा। यदि अनचेक छोड़ें तो यह ड्राफ्ट के रूप में सहेजा जाएगा।
                </p>
              </div>

              {/* Form Validation Summary */}
              {Object.keys(errors).length > 0 && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <h4 className="font-semibold text-red-800 mb-2">कृपया निम्नलिखित त्रुटियाँ सुधारें:</h4>
                  <ul className="list-disc list-inside text-red-700">
                    {Object.entries(errors).map(([key, error]) => (
                      <li key={key}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Navigation and Submit */}
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 mt-8 border-t border-gray-200 gap-4">
            <div className="flex space-x-4">
              {activeTab !== 'basic' && (
                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab === 'questions' ? 'basic' : 'questions')}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors flex items-center"
                >
                  ← पिछला
                </button>
              )}
            </div>
            
            <div className="flex space-x-4">
              {activeTab !== 'settings' && (
                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab === 'basic' ? 'questions' : 'settings')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center"
                >
                  अगला →
                </button>
              )}
              {activeTab === 'settings' && (
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={onCancel}
                    className="px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-gray-500/30 transition-all"
                  >
                    रद्द करें
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-green-500/30 transition-all hover:scale-105"
                  >
                    {initialData ? '🔄 PYQ अपडेट करें' : '🚀 PYQ बनाएं'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </form>

        {/* Footer Stats */}
        <div className="bg-gray-50 border-t border-gray-200 p-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-white rounded-lg">
                <div className="text-2xl font-bold text-green-600">{questions.length}</div>
                <div className="text-sm text-gray-600">कुल प्रश्न</div>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {questions.reduce((sum, q) => sum + (parseInt(q.marks) || 1), 0)}
                </div>
                <div className="text-sm text-gray-600">कुल अंक</div>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {pyqData.timeLimit}
                </div>
                <div className="text-sm text-gray-600">मिनट</div>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {pyqData.isPublished ? 'प्रकाशित' : 'ड्राफ्ट'}
                </div>
                <div className="text-sm text-gray-600">स्थिति</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPyqEditor;