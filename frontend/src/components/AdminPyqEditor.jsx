import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const AdminPyqEditor = ({ onSave, initialData, onCancel }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('basic');
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    questionNumber: 1,
    question: '',
    questionHindi: '',
    options: [
      { text: '', textHindi: '', isCorrect: false },
      { text: '', textHindi: '', isCorrect: false },
      { text: '', textHindi: '', isCorrect: false },
      { text: '', textHindi: '', isCorrect: false }
    ],
    answer: '',
    answerHindi: '',
    explanation: '',
    explanationHindi: '',
    difficulty: 'Medium',
    marks: 1,
    tags: '',
    category: ''
  });

  const [pyqData, setPyqData] = useState({
    title: '',
    titleHindi: '',
    description: '',
    descriptionHindi: '',
    exam: 'UPSC',
    year: new Date().getFullYear(),
    subject: '',
    subjectHindi: '',
    category: '',
    isPublished: false,
    timeLimit: 180,
    instructions: 'सभी प्रश्नों के उत्तर दें। प्रत्येक प्रश्न के लिए अंक निर्धारित हैं।',
    instructionsHindi: 'सभी प्रश्नों के उत्तर दें। प्रत्येक प्रश्न के लिए अंक निर्धारित हैं।',
    tags: ''
  });

  useEffect(() => {
    if (initialData) {
      setPyqData({
        title: initialData.title || '',
        titleHindi: initialData.titleHindi || '',
        description: initialData.description || '',
        descriptionHindi: initialData.descriptionHindi || '',
        exam: initialData.exam || 'UPSC',
        year: initialData.year || new Date().getFullYear(),
        subject: initialData.subject || '',
        subjectHindi: initialData.subjectHindi || '',
        category: initialData.category || '',
        isPublished: initialData.isPublished || false,
        timeLimit: initialData.timeLimit || 180,
        instructions: initialData.instructions || 'सभी प्रश्नों के उत्तर दें। प्रत्येक प्रश्न के लिए अंक निर्धारित हैं।',
        instructionsHindi: initialData.instructionsHindi || 'सभी प्रश्नों के उत्तर दें। प्रत्येक प्रश्न के लिए अंक निर्धारित हैं।',
        tags: initialData.tags?.join(', ') || ''
      });
      setQuestions(initialData.questions || []);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (questions.length === 0) {
      alert('कृपया कम से कम एक प्रश्न जोड़ें');
      return;
    }

    const formData = {
      ...pyqData,
      questions: JSON.stringify(questions.map((q, index) => ({
        ...q,
        questionNumber: index + 1
      })))
    };
    
    onSave(formData);
  };

  const addQuestion = () => {
    if (!currentQuestion.question.trim()) {
      alert('कृपया एक प्रश्न दर्ज करें');
      return;
    }

    const newQuestion = {
      ...currentQuestion,
      questionNumber: questions.length + 1,
      tags: currentQuestion.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    setQuestions([...questions, newQuestion]);
    
    // Reset current question
    setCurrentQuestion({
      questionNumber: questions.length + 2,
      question: '',
      questionHindi: '',
      options: [
        { text: '', textHindi: '', isCorrect: false },
        { text: '', textHindi: '', isCorrect: false },
        { text: '', textHindi: '', isCorrect: false },
        { text: '', textHindi: '', isCorrect: false }
      ],
      answer: '',
      answerHindi: '',
      explanation: '',
      explanationHindi: '',
      difficulty: 'Medium',
      marks: 1,
      tags: '',
      category: ''
    });
  };

  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setQuestions(updatedQuestions);
  };

  const deleteQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions.map((q, i) => ({ ...q, questionNumber: i + 1 })));
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear - i);

  const addOption = () => {
    const newOptions = [...currentQuestion.options, { text: '', textHindi: '', isCorrect: false }];
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

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">
        {initialData ? 'PYQ संपादित करें' : 'नया PYQ जोड़ें'}
      </h2>
      
      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            type="button"
            onClick={() => setActiveTab('basic')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'basic'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            मूल जानकारी
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('questions')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'questions'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            प्रश्न ({questions.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'settings'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            सेटिंग्स
          </button>
        </nav>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Basic Info Tab */}
        {activeTab === 'basic' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  शीर्षक (अंग्रेजी) *
                </label>
                <input
                  type="text"
                  value={pyqData.title}
                  onChange={(e) => setPyqData({ ...pyqData, title: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="जैसे, UPSC Civil Services Preliminary Exam 2023"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  शीर्षक (हिंदी) *
                </label>
                <input
                  type="text"
                  value={pyqData.titleHindi}
                  onChange={(e) => setPyqData({ ...pyqData, titleHindi: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent hindi"
                  placeholder="जैसे, यूपीएससी सिविल सेवा प्रारंभिक परीक्षा 2023"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  विवरण (अंग्रेजी)
                </label>
                <textarea
                  value={pyqData.description}
                  onChange={(e) => setPyqData({ ...pyqData, description: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent h-32"
                  placeholder="प्रश्न पत्र का विवरण"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  विवरण (हिंदी)
                </label>
                <textarea
                  value={pyqData.descriptionHindi}
                  onChange={(e) => setPyqData({ ...pyqData, descriptionHindi: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent h-32 hindi"
                  placeholder="प्रश्न पत्र का विवरण"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  परीक्षा प्रकार *
                </label>
                <select
                  value={pyqData.exam}
                  onChange={(e) => setPyqData({ ...pyqData, exam: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="UPSC">UPSC</option>
                  <option value="State PCS">राज्य PCS</option>
                  <option value="IAS">IAS</option>
                  <option value="Other">अन्य</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  वर्ष *
                </label>
                <select
                  value={pyqData.year}
                  onChange={(e) => setPyqData({ ...pyqData, year: parseInt(e.target.value) })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  विषय (अंग्रेजी) *
                </label>
                <input
                  type="text"
                  value={pyqData.subject}
                  onChange={(e) => setPyqData({ ...pyqData, subject: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="जैसे, General Studies"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  विषय (हिंदी) *
                </label>
                <input
                  type="text"
                  value={pyqData.subjectHindi}
                  onChange={(e) => setPyqData({ ...pyqData, subjectHindi: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent hindi"
                  placeholder="जैसे, सामान्य अध्ययन"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Questions Tab */}
        {activeTab === 'questions' && (
          <div className="space-y-6">
            {/* Add Question Form */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">नया प्रश्न जोड़ें</h3>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  प्रश्न (अंग्रेजी) *
                </label>
                <textarea
                  value={currentQuestion.question}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent h-32"
                  placeholder="प्रश्न टेक्स्ट दर्ज करें..."
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  प्रश्न (हिंदी)
                </label>
                <textarea
                  value={currentQuestion.questionHindi}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, questionHindi: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent h-32 hindi"
                  placeholder="प्रश्न दर्ज करें..."
                />
              </div>

              {/* Options */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    विकल्प (सही उत्तर चिह्नित करें)
                  </label>
                  <button
                    type="button"
                    onClick={addOption}
                    className="text-sm text-green-600 hover:text-green-800"
                  >
                    + विकल्प जोड़ें
                  </button>
                </div>
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-start space-x-2 p-3 border border-gray-200 rounded-lg">
                      <input
                        type="radio"
                        name="correctOption"
                        checked={option.isCorrect}
                        onChange={() => {
                          const newOptions = currentQuestion.options.map((opt, i) => ({
                            ...opt,
                            isCorrect: i === index
                          }));
                          setCurrentQuestion({ ...currentQuestion, options: newOptions });
                        }}
                        className="mt-2"
                      />
                      <div className="flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                          <input
                            type="text"
                            value={option.text}
                            onChange={(e) => updateOption(index, 'text', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder={`विकल्प ${String.fromCharCode(65 + index)} (अंग्रेजी)`}
                          />
                          <input
                            type="text"
                            value={option.textHindi}
                            onChange={(e) => updateOption(index, 'textHindi', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded hindi"
                            placeholder={`विकल्प ${String.fromCharCode(65 + index)} (हिंदी)`}
                          />
                        </div>
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => removeOption(index)}
                            className="text-xs text-red-600 hover:text-red-800"
                          >
                            हटाएं
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    कठिनाई स्तर
                  </label>
                  <select
                    value={currentQuestion.difficulty}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, difficulty: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="Easy">आसान</option>
                    <option value="Medium">मध्यम</option>
                    <option value="Hard">कठिन</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    अंक
                  </label>
                  <input
                    type="number"
                    value={currentQuestion.marks}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, marks: parseInt(e.target.value) || 1 })}
                    className="w-full p-2 border border-gray-300 rounded"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    टैग्स (कॉमा से अलग)
                  </label>
                  <input
                    type="text"
                    value={currentQuestion.tags}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, tags: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="जैसे, polity, constitution, history"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    स्पष्टीकरण (अंग्रेजी)
                  </label>
                  <textarea
                    value={currentQuestion.explanation}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, explanation: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded h-24"
                    placeholder="उत्तर का विस्तृत स्पष्टीकरण"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    स्पष्टीकरण (हिंदी)
                  </label>
                  <textarea
                    value={currentQuestion.explanationHindi}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, explanationHindi: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded h-24 hindi"
                    placeholder="उत्तर का विस्तृत स्पष्टीकरण"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={addQuestion}
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700"
              >
                प्रश्न जोड़ें
              </button>
            </div>

            {/* Question List */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">प्रश्न ({questions.length})</h3>
              {questions.length === 0 ? (
                <p className="text-gray-500 text-center py-8">अभी तक कोई प्रश्न नहीं जोड़ा गया</p>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {questions.map((question, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <span className="font-medium mr-2">प्र{question.questionNumber}:</span>
                            <div className="flex-1">
                              <p className="font-medium">{question.question}</p>
                              {question.questionHindi && (
                                <p className="text-gray-600 hindi mt-1">{question.questionHindi}</p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button
                            type="button"
                            onClick={() => updateQuestion(index, 'difficulty', 
                              question.difficulty === 'Easy' ? 'Medium' : 
                              question.difficulty === 'Medium' ? 'Hard' : 'Easy'
                            )}
                            className={`px-2 py-1 text-xs rounded ${
                              question.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                              question.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}
                          >
                            {question.difficulty === 'Easy' ? 'आसान' : 
                             question.difficulty === 'Medium' ? 'मध्यम' : 'कठिन'}
                          </button>
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                            {question.marks} अंक{question.marks !== 1 ? '' : ''}
                          </span>
                          <button
                            type="button"
                            onClick={() => deleteQuestion(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            हटाएं
                          </button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 ml-6">
                        {question.options.map((opt, optIndex) => (
                          <div key={optIndex} className={`flex items-center ${opt.isCorrect ? 'font-semibold text-green-700' : ''}`}>
                            <span className="mr-2">{String.fromCharCode(65 + optIndex)}.</span>
                            <span>{opt.text || opt.textHindi || '(खाली)'}</span>
                            {opt.isCorrect && <span className="ml-2">✓</span>}
                          </div>
                        ))}
                      </div>
                      {question.explanation && (
                        <div className="mt-2 text-sm text-gray-500 ml-6">
                          <span className="font-medium">स्पष्टीकरण:</span> {question.explanation}
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
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  श्रेणी *
                </label>
                <select
                  value={pyqData.category}
                  onChange={(e) => setPyqData({ ...pyqData, category: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="">श्रेणी चुनें</option>
                  <option value="Preliminary">प्रारंभिक</option>
                  <option value="Mains">मुख्य परीक्षा</option>
                  <option value="Optional">वैकल्पिक</option>
                  <option value="General Studies">सामान्य अध्ययन</option>
                  <option value="Aptitude">योग्यता</option>
                  <option value="Other">अन्य</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  समय सीमा (मिनट)
                </label>
                <input
                  type="number"
                  value={pyqData.timeLimit}
                  onChange={(e) => setPyqData({ ...pyqData, timeLimit: parseInt(e.target.value) })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  min="1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  निर्देश (अंग्रेजी)
                </label>
                <textarea
                  value={pyqData.instructions}
                  onChange={(e) => setPyqData({ ...pyqData, instructions: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent h-32"
                  placeholder="परीक्षा निर्देश"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  निर्देश (हिंदी)
                </label>
                <textarea
                  value={pyqData.instructionsHindi}
                  onChange={(e) => setPyqData({ ...pyqData, instructionsHindi: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent h-32 hindi"
                  placeholder="परीक्षा निर्देश"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                टैग्स (कॉमा से अलग)
              </label>
              <input
                type="text"
                value={pyqData.tags}
                onChange={(e) => setPyqData({ ...pyqData, tags: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="जैसे, upsc, prelims, general-studies, polity"
              />
            </div>

            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <input
                id="publish"
                type="checkbox"
                checked={pyqData.isPublished}
                onChange={(e) => setPyqData({ ...pyqData, isPublished: e.target.checked })}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="publish" className="ml-3 block text-sm font-medium text-gray-900">
                तुरंत प्रकाशित करें (उपयोगकर्ताओं के लिए दृश्यमान बनाएं)
              </label>
            </div>
          </div>
        )}

        {/* Navigation and Submit */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <div className="flex space-x-4">
            {activeTab !== 'basic' && (
              <button
                type="button"
                onClick={() => setActiveTab(activeTab === 'questions' ? 'basic' : 'questions')}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
              >
                पीछे
              </button>
            )}
          </div>
          
          <div className="flex space-x-4">
            {activeTab !== 'settings' && (
              <button
                type="button"
                onClick={() => setActiveTab(activeTab === 'basic' ? 'questions' : 'settings')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
              >
                आगे
              </button>
            )}
            {activeTab === 'settings' && (
              <>
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-400"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
                >
                  {initialData ? 'PYQ अपडेट करें' : 'PYQ बनाएं'}
                </button>
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminPyqEditor;