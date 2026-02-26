import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { Clock, Users, Target, BookOpen, CheckCircle, XCircle, AlertCircle, ArrowLeft, Play, Save, ChevronLeft, ChevronRight, Trophy } from 'lucide-react';

const PyqTestPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pyq, setPyq] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [testStarted, setTestStarted] = useState(false);
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [results, setResults] = useState(null);
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
      setTimeLeft(pyqData.timeLimit * 60);
    } catch (err) {
      setError('PYQ लोड करने में विफल');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let timer;
    if (testStarted && timeLeft > 0 && !testSubmitted) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && testStarted && !testSubmitted) {
      handleSubmitTest();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, testStarted, testSubmitted]);

  const handleStartTest = () => {
    setTestStarted(true);
  };

 const handleAnswerSelect = (questionIndex, optionIndex) => {
  const questionId = pyq.questions[questionIndex]._id;

  setAnswers(prev => ({
    ...prev,
    [questionId]: optionIndex
  }));
};

  const handleSubmitTest = async () => {
    try {
      const response = await api.post(`/pyqs/${id}/submit`, { answers });
      setResults(response.data);
      setTestSubmitted(true);
    } catch (err) {
      console.error('Error submitting test:', err);
      alert('परीक्षा जमा करने में विफल');
    }
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateTotalMarks = () => {
    if (!pyq?.questions) return 0;
    return pyq.questions.reduce((total, question) => total + (question.marks || 1), 0);
  };

  const calculateAnsweredCount = () => {
    return Object.keys(answers).filter(key => answers[key] !== undefined).length;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">परीक्षा लोड हो रही है...</p>
        </div>
      </div>
    );
  }

  if (error || !pyq) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
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

  // Test instructions page
  if (!testStarted) {
    const totalMarks = calculateTotalMarks();
    
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-900">{pyq.titleHindi || pyq.title}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center">
                <Clock className="text-green-600 mr-3" size={24} />
                <div>
                  <p className="text-sm text-gray-500">समय सीमा</p>
                  <p className="text-lg font-semibold">{pyq.timeLimit} मिनट</p>
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
            <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center">
                <Users className="text-green-600 mr-3" size={24} />
                <div>
                  <p className="text-sm text-gray-500">कुल अंक</p>
                  <p className="text-lg font-semibold">{totalMarks}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-yellow-800 mb-3">निर्देश:</h3>
            <div className="space-y-2 text-yellow-700">
              {pyq.instructionsHindi ? (
                <p className="hindi">{pyq.instructionsHindi}</p>
              ) : (
                <p>{pyq.instructions || 'सभी प्रश्नों के उत्तर दें। प्रत्येक प्रश्न के लिए अंक निर्धारित हैं।'}</p>
              )}
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>प्रत्येक प्रश्न का केवल एक सही उत्तर है</li>
                <li>समय समाप्त होने पर परीक्षा स्वतः जमा हो जाएगी</li>
                <li>आप किसी भी समय प्रश्नों के बीच जा सकते हैं</li>
                <li>परीक्षा समाप्त होने के बाद आप अपने परिणाम देख सकते हैं</li>
              </ul>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">परीक्षा विवरण:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-3 rounded border">
                <p className="text-sm text-gray-500">परीक्षा</p>
                <p className="font-medium">{pyq.exam}</p>
              </div>
              <div className="bg-white p-3 rounded border">
                <p className="text-sm text-gray-500">वर्ष</p>
                <p className="font-medium">{pyq.year}</p>
              </div>
              <div className="bg-white p-3 rounded border">
                <p className="text-sm text-gray-500">विषय</p>
                <p className="font-medium">{pyq.subjectHindi || pyq.subject}</p>
              </div>
              <div className="bg-white p-3 rounded border">
                <p className="text-sm text-gray-500">श्रेणी</p>
                <p className="font-medium">{pyq.category}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/pyqs')}
              className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-400 flex items-center transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              वापस जाएं
            </button>
            <button
              onClick={handleStartTest}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 flex items-center transition-colors"
            >
              <Play size={20} className="mr-2" />
              परीक्षा प्रारंभ करें
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Test results page
  if (testSubmitted && results) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
              <Trophy className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">परीक्षा परिणाम</h2>
            <p className="text-gray-600">{pyq.titleHindi || pyq.title}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-green-50 p-6 rounded-lg text-center border border-green-100">
              <div className="text-3xl font-bold text-green-700 mb-2">{results.score}/{results.totalMarks}</div>
              <div className="text-sm text-green-600">अंक</div>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg text-center border border-blue-100">
              <div className="text-3xl font-bold text-blue-700 mb-2">{results.percentage}%</div>
              <div className="text-sm text-blue-600">प्रतिशत</div>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg text-center border border-purple-100">
              <div className="text-3xl font-bold text-purple-700 mb-2">{(results.statistics?.attempts || 0) + 1}</div>
              <div className="text-sm text-purple-600">कुल प्रयास</div>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-semibold">प्रश्न-वार परिणाम</h3>
            {results.results?.map((result, index) => {
              const question = pyq.questions?.[index];
              return (
                <div key={index} className={`border rounded-lg p-4 ${result.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <span className="font-medium">प्र{result.questionNumber}:</span>
                      <span className="ml-2">{question?.questionHindi || question?.question}</span>
                    </div>
                    <div className={`px-3 py-1 rounded flex items-center ${result.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {result.isCorrect ? <CheckCircle size={16} className="mr-1" /> : <XCircle size={16} className="mr-1" />}
                      {result.isCorrect ? 'सही' : 'गलत'}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 ml-6 space-y-2">
                    <div>
                      <span className="font-medium">आपका उत्तर:</span>{' '}
                      {result.userAnswer !== null && result.userAnswer !== undefined ? 
                        `${String.fromCharCode(65 + result.userAnswer)} - ${question?.options?.[result.userAnswer]?.textHindi || question?.options?.[result.userAnswer]?.text || 'उत्तर दिया गया'}` : 
                        'उत्तर नहीं दिया गया'}
                    </div>
                    <div>
                      <span className="font-medium">सही उत्तर:</span>{' '}
                      {String.fromCharCode(65 + result.correctAnswer)} - {question?.options?.[result.correctAnswer]?.textHindi || question?.options?.[result.correctAnswer]?.text}
                    </div>
                    {result.explanation && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <span className="font-medium">स्पष्टीकरण:</span> {result.explanation}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/pyqs')}
              className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-400 flex items-center transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              PYQs पर वापस जाएं
            </button>
            <button
              onClick={() => {
                setTestStarted(false);
                setTestSubmitted(false);
                setResults(null);
                setAnswers({});
                setCurrentQuestion(0);
                setTimeLeft(pyq.timeLimit * 60);
              }}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 flex items-center transition-colors"
            >
              <Play size={20} className="mr-2" />
              फिर से प्रयास करें
            </button>
            <button
              onClick={() => navigate(`/pyq/${id}/study`)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center transition-colors"
            >
              <BookOpen size={20} className="mr-2" />
              अध्ययन मोड देखें
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Test in progress
  const totalMarks = calculateTotalMarks();
  const answeredCount = calculateAnsweredCount();
  const totalQuestions = pyq.questions?.length || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Test Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{pyq.titleHindi || pyq.title}</h1>
            <p className="text-gray-600">{pyq.exam} • {pyq.year} • {pyq.subjectHindi || pyq.subject}</p>
          </div>
          <div className="text-center">
            <div className={`text-3xl font-bold ${timeLeft < 300 ? 'text-red-600 animate-pulse' : 'text-gray-800'}`}>
              {formatTime(timeLeft)}
            </div>
            <div className="text-sm text-gray-500">शेष समय</div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-xl font-bold">{currentQuestion + 1}</div>
            <div className="text-sm text-gray-500">वर्तमान प्रश्न</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">{totalQuestions}</div>
            <div className="text-sm text-gray-500">कुल प्रश्न</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">{totalMarks}</div>
            <div className="text-sm text-gray-500">कुल अंक</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">{answeredCount}</div>
            <div className="text-sm text-gray-500">उत्तर दिए गए</div>
          </div>
        </div>
      </div>

      {/* Question Navigation */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <p className="text-sm font-medium text-gray-700 mb-2">प्रश्न नेविगेशन:</p>
        <div className="flex flex-wrap gap-2">
          {pyq.questions?.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                index === currentQuestion
                  ? 'bg-green-600 text-white shadow-md'
                  : answers[pyq.questions[index]._id] !== undefined
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Current Question */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="mb-4">
          <span className="text-sm font-medium text-gray-500">
            प्रश्न {currentQuestion + 1} का {totalQuestions}
          </span>
          <div className="flex flex-wrap justify-between items-center mt-1 gap-2">
            <h3 className="text-lg font-semibold flex-1">
              {pyq.questions?.[currentQuestion]?.questionHindi || pyq.questions?.[currentQuestion]?.question}
            </h3>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded text-sm ${
                pyq.questions?.[currentQuestion]?.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                pyq.questions?.[currentQuestion]?.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {pyq.questions?.[currentQuestion]?.difficulty === 'Easy' ? 'आसान' : 
                 pyq.questions?.[currentQuestion]?.difficulty === 'Medium' ? 'मध्यम' : 'कठिन'}
              </span>
              <span className="px-3 py-1 bg-gray-100 rounded text-sm">
                {pyq.questions?.[currentQuestion]?.marks || 1} अंक
              </span>
            </div>
          </div>
          {pyq.questions?.[currentQuestion]?.questionHindi && pyq.questions?.[currentQuestion]?.question && 
           pyq.questions?.[currentQuestion]?.questionHindi !== pyq.questions?.[currentQuestion]?.question && (
            <p className="mt-2 text-gray-600">
              {pyq.questions?.[currentQuestion]?.question}
            </p>
          )}
        </div>

        {/* Options */}
<div className="space-y-3">
  {pyq.questions?.[currentQuestion]?.options?.map((option, index) => {
    const questionId = pyq.questions[currentQuestion]._id;

    return (
      <div
        key={index}
        onClick={() => handleAnswerSelect(currentQuestion, index)}
        className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-sm ${
          answers[questionId] === index
            ? 'border-green-500 bg-green-50 shadow-sm'
            : 'border-gray-200 hover:bg-gray-50'
        }`}
      >
        <div className="flex items-start">
          <div
            className={`w-8 h-8 rounded-full border flex items-center justify-center mr-3 mt-1 flex-shrink-0 ${
              answers[questionId] === index
                ? 'border-green-500 bg-green-500 text-white'
                : 'border-gray-300'
            }`}
          >
            {String.fromCharCode(65 + index)}
          </div>

          <div className="flex-1">
            {option.textHindi ? (
              <>
                <div className="hindi">{option.textHindi}</div>
                {option.text && option.textHindi !== option.text && (
                  <div className="text-gray-600 text-sm mt-1">
                    {option.text}
                  </div>
                )}
              </>
            ) : (
              <div>{option.text || '(कोई टेक्स्ट नहीं)'}</div>
            )}
          </div>
        </div>
      </div>
    );
  })}
</div>

        {/* Question Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className={`px-6 py-2 rounded-lg flex items-center ${
              currentQuestion === 0
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            <ChevronLeft size={20} className="mr-2" />
            पिछला
          </button>
          <button
            onClick={() => setCurrentQuestion(Math.min(totalQuestions - 1, currentQuestion + 1))}
            disabled={currentQuestion === totalQuestions - 1}
            className={`px-6 py-2 rounded-lg flex items-center ${
              currentQuestion === totalQuestions - 1
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            अगला
            <ChevronRight size={20} className="ml-2" />
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <div className="text-center">
        <button
          onClick={handleSubmitTest}
          className="px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 text-lg flex items-center mx-auto transition-colors"
        >
          <Save size={20} className="mr-2" />
          परीक्षा जमा करें
        </button>
        <p className="text-sm text-gray-500 mt-2">
          {answeredCount} में से {totalQuestions} प्रश्नों के उत्तर दिए गए हैं
        </p>
        <p className="text-xs text-yellow-600 mt-1">
          सावधानी: एक बार जमा करने के बाद आप उत्तर नहीं बदल सकते
        </p>
      </div>
    </div>
  );
};

export default PyqTestPage;