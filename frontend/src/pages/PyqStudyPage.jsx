import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { BookOpen, Clock, Users, Target, CheckCircle, ChevronDown, ChevronUp, ArrowLeft, BookCheck } from 'lucide-react';

const PyqStudyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pyq, setPyq] = useState(null);
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPyq();
  }, [id]);

  const fetchPyq = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/pyqs/${id}`);
      const pyqData = response.data;
      
      // Parse questions if they're stored as JSON string
      if (typeof pyqData.questions === 'string') {
        try {
          pyqData.questions = JSON.parse(pyqData.questions);
        } catch (err) {
          console.error('Error parsing questions:', err);
          pyqData.questions = [];
        }
      }
      
      setPyq(pyqData);
      
      // Initialize expanded state for all questions
      const expanded = {};
      pyqData.questions?.forEach((_, index) => {
        expanded[index] = false;
      });
      setExpandedQuestions(expanded);
    } catch (err) {
      setError('PYQ लोड करने में विफल');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleQuestion = (index) => {
    setExpandedQuestions({
      ...expandedQuestions,
      [index]: !expandedQuestions[index]
    });
  };

  const toggleAllQuestions = () => {
    if (pyq?.questions) {
      const allExpanded = Object.values(expandedQuestions).every(val => val);
      const newState = {};
      pyq.questions.forEach((_, index) => {
        newState[index] = !allExpanded;
      });
      setExpandedQuestions(newState);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">अध्ययन सामग्री लोड हो रही है...</p>
        </div>
      </div>
    );
  }

  if (error || !pyq) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-medium text-red-800 mb-2">{error || 'PYQ नहीं मिला'}</h3>
          <button
            onClick={() => navigate('/pyqs')}
            className="flex items-center justify-center mx-auto text-green-600 hover:text-green-800 font-medium"
          >
            <ArrowLeft size={16} className="mr-2" />
            PYQs पर वापस जाएं
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{pyq.titleHindi || pyq.title}</h1>
            {pyq.titleHindi && pyq.title !== pyq.titleHindi && (
              <p className="text-gray-600 mt-2">{pyq.title}</p>
            )}
          </div>
          <button
            onClick={toggleAllQuestions}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium"
          >
            {Object.values(expandedQuestions).every(val => val) ? 'सभी बंद करें' : 'सभी खोलें'}
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center">
              <BookOpen className="text-green-600 mr-3" size={24} />
              <div>
                <p className="text-sm text-gray-500">विषय</p>
                <p className="text-lg font-semibold">{pyq.subjectHindi || pyq.subject}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center">
              <Clock className="text-green-600 mr-3" size={24} />
              <div>
                <p className="text-sm text-gray-500">वर्ष</p>
                <p className="text-lg font-semibold">{pyq.year}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center">
              <Target className="text-green-600 mr-3" size={24} />
              <div>
                <p className="text-sm text-gray-500">कुल प्रश्न</p>
                <p className="text-lg font-semibold">{pyq.questions?.length || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">विवरण</h3>
          {pyq.descriptionHindi ? (
            <>
              <p className="text-gray-700 hindi">{pyq.descriptionHindi}</p>
              {pyq.description && pyq.description !== pyq.descriptionHindi && (
                <p className="text-gray-600 mt-2">{pyq.description}</p>
              )}
            </>
          ) : (
            <p className="text-gray-700">{pyq.description}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => navigate(`/pyq/${id}`)}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 flex items-center transition-colors"
          >
            <BookCheck size={20} className="mr-2" />
            परीक्षा दें
          </button>
          <button
            onClick={() => navigate('/pyqs')}
            className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-400 flex items-center transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            PYQs पर वापस जाएं
          </button>
        </div>
      </div>

      {/* Questions List */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">प्रश्न और उत्तर</h2>
          <span className="text-gray-600">
            {pyq.questions?.length || 0} प्रश्न
          </span>
        </div>
        <div className="space-y-4">
          {pyq.questions?.map((question, index) => (
            <div key={index} className="bg-white rounded-lg shadow border hover:shadow-md transition-shadow">
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50 rounded-lg"
              >
                <div className="flex items-start">
                  <span className="font-bold text-lg mr-4 min-w-8">प्र{index + 1}</span>
                  <div className="text-left">
                    <h3 className="font-medium text-gray-900 mb-1">
                      {question.questionHindi || question.question}
                    </h3>
                    {question.questionHindi && question.question && question.questionHindi !== question.question && (
                      <p className="text-gray-600 text-sm">{question.question}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center">
                  <span className={`px-3 py-1 rounded text-xs mr-4 ${
                    question.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                    question.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {question.difficulty === 'Easy' ? 'आसान' : 
                     question.difficulty === 'Medium' ? 'मध्यम' : 'कठिन'}
                  </span>
                  {expandedQuestions[index] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </button>

              {expandedQuestions[index] && (
                <div className="p-6 pt-0 border-t">
                  {/* Options */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-3">विकल्प:</h4>
                    <div className="space-y-2">
                      {question.options?.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className={`p-3 border rounded-lg ${option.isCorrect ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:bg-gray-50'} transition-colors`}
                        >
                          <div className="flex items-start">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0 ${
                              option.isCorrect ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
                            }`}>
                              {String.fromCharCode(65 + optIndex)}
                            </span>
                            <div className="flex-1">
                              <p>{option.textHindi || option.text || '(कोई टेक्स्ट नहीं)'}</p>
                              {option.textHindi && option.text && option.textHindi !== option.text && (
                                <p className="text-gray-600 text-sm mt-1">{option.text}</p>
                              )}
                            </div>
                            {option.isCorrect && (
                              <CheckCircle className="ml-2 text-green-600 flex-shrink-0" size={20} />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Answer */}
                  {(question.answer || question.answerHindi) && (
                    <div className="mb-6">
                      <h4 className="font-medium mb-2">उत्तर:</h4>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        {question.answerHindi ? (
                          <>
                            <p className="text-gray-900 hindi">{question.answerHindi}</p>
                            {question.answer && question.answerHindi !== question.answer && (
                              <p className="text-gray-700 mt-2">{question.answer}</p>
                            )}
                          </>
                        ) : (
                          <p className="text-gray-900">{question.answer}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Explanation */}
                  {(question.explanation || question.explanationHindi) && (
                    <div className="mb-6">
                      <h4 className="font-medium mb-2">स्पष्टीकरण:</h4>
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        {question.explanationHindi ? (
                          <>
                            <p className="text-gray-900 hindi">{question.explanationHindi}</p>
                            {question.explanation && question.explanationHindi !== question.explanation && (
                              <p className="text-gray-700 mt-2">{question.explanation}</p>
                            )}
                          </>
                        ) : (
                          <p className="text-gray-900">{question.explanation}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <span className="font-medium mr-1">अंक:</span>
                      {question.marks || 1}
                    </div>
                    {question.tags && question.tags.length > 0 && (
                      <div className="flex items-center">
                        <span className="font-medium mr-1">टैग:</span>
                        {Array.isArray(question.tags) ? question.tags.join(', ') : question.tags}
                      </div>
                    )}
                    {question.category && (
                      <div className="flex items-center">
                        <span className="font-medium mr-1">श्रेणी:</span>
                        {question.category}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      {pyq.totalQuestions || pyq.totalMarks || pyq.attempts || pyq.averageScore ? (
        <div className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
          <h3 className="text-lg font-semibold mb-4">PYQ आँकड़े</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{pyq.questions?.length || 0}</div>
              <div className="text-sm text-gray-600">कुल प्रश्न</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {pyq.questions?.reduce((sum, q) => sum + (q.marks || 1), 0) || 0}
              </div>
              <div className="text-sm text-gray-600">कुल अंक</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{pyq.attempts || 0}</div>
              <div className="text-sm text-gray-600">कुल प्रयास</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {pyq.averageScore ? `${pyq.averageScore.toFixed(1)}%` : '0%'}
              </div>
              <div className="text-sm text-gray-600">औसत स्कोर</div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default PyqStudyPage;