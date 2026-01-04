import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { Clock, Users, Target, BookOpen, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

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
      setPyq(response.data);
      setTimeLeft(response.data.timeLimit * 60);
    } catch (err) {
      setError('Failed to load PYQ');
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
    setAnswers({
      ...answers,
      [questionIndex]: optionIndex
    });
  };

  const handleSubmitTest = async () => {
    try {
      const response = await api.post(`/pyqs/${id}/submit`, { answers });
      setResults(response.data);
      setTestSubmitted(true);
    } catch (err) {
      console.error('Error submitting test:', err);
      alert('Failed to submit test');
    }
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading test...</p>
        </div>
      </div>
    );
  }

  if (error || !pyq) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
          <h3 className="text-lg font-medium text-red-800 mb-2">{error || 'PYQ not found'}</h3>
          <button
            onClick={() => navigate('/pyqs')}
            className="text-green-600 hover:text-green-800 font-medium"
          >
            ← Back to PYQs
          </button>
        </div>
      </div>
    );
  }

  // Test instructions page
  if (!testStarted) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-900">{pyq.title}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Clock className="text-green-600 mr-3" size={24} />
                <div>
                  <p className="text-sm text-gray-500">Time Limit</p>
                  <p className="text-lg font-semibold">{pyq.timeLimit} minutes</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Target className="text-green-600 mr-3" size={24} />
                <div>
                  <p className="text-sm text-gray-500">Total Questions</p>
                  <p className="text-lg font-semibold">{pyq.totalQuestions || pyq.questions?.length || 0}</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Users className="text-green-600 mr-3" size={24} />
                <div>
                  <p className="text-sm text-gray-500">Total Marks</p>
                  <p className="text-lg font-semibold">{pyq.totalMarks || 0}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-yellow-800 mb-3">Instructions:</h3>
            <div className="space-y-2 text-yellow-700">
              <p>{pyq.instructions || 'Answer all questions. Each question carries marks as indicated.'}</p>
              {pyq.instructionsHindi && (
                <p className="hindi">{pyq.instructionsHindi}</p>
              )}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Test Details:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Exam</p>
                <p className="font-medium">{pyq.exam}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Year</p>
                <p className="font-medium">{pyq.year}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Subject</p>
                <p className="font-medium">{pyq.subject}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-medium">{pyq.category}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigate('/pyqs')}
              className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-400"
            >
              Back
            </button>
            <button
              onClick={handleStartTest}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 flex items-center"
            >
              <BookOpen className="mr-2" size={20} />
              Start Test
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
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Test Results</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-green-50 p-6 rounded-lg text-center">
              <div className="text-3xl font-bold text-green-700">{results.score}/{results.totalMarks}</div>
              <div className="text-sm text-green-600">Score</div>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <div className="text-3xl font-bold text-blue-700">{results.percentage}%</div>
              <div className="text-sm text-blue-600">Percentage</div>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg text-center">
              <div className="text-3xl font-bold text-purple-700">{(results.statistics?.attempts || 0) + 1}</div>
              <div className="text-sm text-purple-600">Total Attempts</div>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-semibold">Question-wise Results</h3>
            {results.results.map((result, index) => (
              <div key={index} className={`border rounded-lg p-4 ${result.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-medium">Q{result.questionNumber}:</span>
                    <span className="ml-2">{pyq.questions?.[index]?.question}</span>
                  </div>
                  <div className={`px-3 py-1 rounded flex items-center ${result.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {result.isCorrect ? <CheckCircle size={16} className="mr-1" /> : <XCircle size={16} className="mr-1" />}
                    {result.isCorrect ? 'Correct' : 'Incorrect'}
                  </div>
                </div>
                <div className="text-sm text-gray-600 ml-6">
                  <div className="mb-1">
                    <span className="font-medium">Your Answer:</span>{' '}
                    {result.userAnswer !== null ? String.fromCharCode(65 + result.userAnswer) : 'Not answered'}
                  </div>
                  <div className="mb-1">
                    <span className="font-medium">Correct Answer:</span>{' '}
                    {String.fromCharCode(65 + result.correctAnswer)}
                  </div>
                  {result.explanation && (
                    <div className="mt-2">
                      <span className="font-medium">Explanation:</span> {result.explanation}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigate('/pyqs')}
              className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-400"
            >
              Back to PYQs
            </button>
            <button
              onClick={() => {
                setTestStarted(false);
                setTestSubmitted(false);
                setResults(null);
                setAnswers({});
                setCurrentQuestion(0);
              }}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
            >
              Retake Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Test in progress
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Test Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{pyq.title}</h1>
            <p className="text-gray-600">{pyq.exam} • {pyq.year} • {pyq.subject}</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">{formatTime(timeLeft)}</div>
            <div className="text-sm text-gray-500">Time Remaining</div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-xl font-bold">{currentQuestion + 1}</div>
            <div className="text-sm text-gray-500">Current</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">{pyq.totalQuestions || pyq.questions?.length || 0}</div>
            <div className="text-sm text-gray-500">Total</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">{pyq.totalMarks || 0}</div>
            <div className="text-sm text-gray-500">Marks</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">{Object.keys(answers).length}</div>
            <div className="text-sm text-gray-500">Answered</div>
          </div>
        </div>
      </div>

      {/* Question Navigation */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="flex flex-wrap gap-2">
          {pyq.questions?.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                index === currentQuestion
                  ? 'bg-green-600 text-white'
                  : answers[index] !== undefined
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700'
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
            Question {currentQuestion + 1} of {pyq.questions?.length}
          </span>
          <div className="flex justify-between items-center mt-1">
            <h3 className="text-lg font-semibold">
              {pyq.questions?.[currentQuestion]?.question}
            </h3>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded text-sm ${
                pyq.questions?.[currentQuestion]?.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                pyq.questions?.[currentQuestion]?.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {pyq.questions?.[currentQuestion]?.difficulty || 'Medium'}
              </span>
              <span className="px-3 py-1 bg-gray-100 rounded text-sm">
                {pyq.questions?.[currentQuestion]?.marks || 1} mark
                {(pyq.questions?.[currentQuestion]?.marks || 1) !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
          {pyq.questions?.[currentQuestion]?.questionHindi && (
            <p className="mt-2 text-gray-600 hindi">
              {pyq.questions[currentQuestion].questionHindi}
            </p>
          )}
        </div>

        {/* Options */}
        <div className="space-y-3">
          {pyq.questions?.[currentQuestion]?.options?.map((option, index) => (
            <div
              key={index}
              onClick={() => handleAnswerSelect(currentQuestion, index)}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                answers[currentQuestion] === index
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full border flex items-center justify-center mr-3 ${
                  answers[currentQuestion] === index
                    ? 'border-green-500 bg-green-500 text-white'
                    : 'border-gray-300'
                }`}>
                  {String.fromCharCode(65 + index)}
                </div>
                <div>
                  {option.text && <div>{option.text}</div>}
                  {option.textHindi && <div className="text-gray-600 hindi mt-1">{option.textHindi}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Question Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className={`px-6 py-2 rounded-lg ${
              currentQuestion === 0
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentQuestion(Math.min((pyq.questions?.length || 0) - 1, currentQuestion + 1))}
            disabled={currentQuestion === (pyq.questions?.length || 0) - 1}
            className={`px-6 py-2 rounded-lg ${
              currentQuestion === (pyq.questions?.length || 0) - 1
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <div className="text-center">
        <button
          onClick={handleSubmitTest}
          className="px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 text-lg"
        >
          Submit Test
        </button>
        <p className="text-sm text-gray-500 mt-2">
          {Object.keys(answers).length} of {pyq.questions?.length || 0} questions answered
        </p>
      </div>
    </div>
  );
};

export default PyqTestPage;