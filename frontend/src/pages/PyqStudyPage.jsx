import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { BookOpen, Clock, Users, Target, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';

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
      setPyq(response.data);
      
      // Initialize expanded state for all questions
      const expanded = {};
      response.data.questions?.forEach((_, index) => {
        expanded[index] = false;
      });
      setExpandedQuestions(expanded);
    } catch (err) {
      setError('Failed to load PYQ');
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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading study material...</p>
        </div>
      </div>
    );
  }

  if (error || !pyq) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">{pyq.title}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center">
              <BookOpen className="text-green-600 mr-3" size={24} />
              <div>
                <p className="text-sm text-gray-500">Subject</p>
                <p className="text-lg font-semibold">{pyq.subject}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Clock className="text-green-600 mr-3" size={24} />
              <div>
                <p className="text-sm text-gray-500">Year</p>
                <p className="text-lg font-semibold">{pyq.year}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Target className="text-green-600 mr-3" size={24} />
              <div>
                <p className="text-sm text-gray-500">Questions</p>
                <p className="text-lg font-semibold">{pyq.totalQuestions || pyq.questions?.length || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Description</h3>
          <p className="text-gray-700">{pyq.description}</p>
          {pyq.descriptionHindi && (
            <p className="text-gray-700 hindi mt-2">{pyq.descriptionHindi}</p>
          )}
        </div>

        <div className="flex space-x-4">
          <button
            onClick={() => navigate(`/pyq/${id}`)}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
          >
            Take Test
          </button>
          <button
            onClick={() => navigate('/pyqs')}
            className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-400"
          >
            Back to PYQs
          </button>
        </div>
      </div>

      {/* Questions List */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Questions & Answers</h2>
        <div className="space-y-4">
          {pyq.questions?.map((question, index) => (
            <div key={index} className="bg-white rounded-lg shadow border">
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  <span className="font-bold text-lg mr-4">Q{index + 1}</span>
                  <div>
                    <h3 className="font-medium text-gray-900">{question.question}</h3>
                    {question.questionHindi && (
                      <p className="text-gray-600 hindi text-sm mt-1">{question.questionHindi}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center">
                  <span className={`px-3 py-1 rounded text-xs mr-4 ${
                    question.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                    question.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {question.difficulty}
                  </span>
                  {expandedQuestions[index] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </button>

              {expandedQuestions[index] && (
                <div className="p-6 pt-0 border-t">
                  {/* Options */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-3">Options:</h4>
                    <div className="space-y-2">
                      {question.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className={`p-3 border rounded-lg ${option.isCorrect ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
                        >
                          <div className="flex items-center">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                              option.isCorrect ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
                            }`}>
                              {String.fromCharCode(65 + optIndex)}
                            </span>
                            <div>
                              <p>{option.text}</p>
                              {option.textHindi && (
                                <p className="text-gray-600 hindi text-sm mt-1">{option.textHindi}</p>
                              )}
                            </div>
                            {option.isCorrect && (
                              <CheckCircle className="ml-2 text-green-600" size={20} />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Answer */}
                  {(question.answer || question.answerHindi) && (
                    <div className="mb-6">
                      <h4 className="font-medium mb-2">Answer:</h4>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-gray-900">{question.answer}</p>
                        {question.answerHindi && (
                          <p className="text-gray-700 hindi mt-2">{question.answerHindi}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Explanation */}
                  {(question.explanation || question.explanationHindi) && (
                    <div className="mb-6">
                      <h4 className="font-medium mb-2">Explanation:</h4>
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <p className="text-gray-900">{question.explanation}</p>
                        {question.explanationHindi && (
                          <p className="text-gray-700 hindi mt-2">{question.explanationHindi}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <span className="font-medium mr-1">Marks:</span>
                      {question.marks || 1}
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium mr-1">Tags:</span>
                      {question.tags?.join(', ') || 'No tags'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">PYQ Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{pyq.totalQuestions || 0}</div>
            <div className="text-sm text-gray-600">Total Questions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{pyq.totalMarks || 0}</div>
            <div className="text-sm text-gray-600">Total Marks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{pyq.attempts || 0}</div>
            <div className="text-sm text-gray-600">Total Attempts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{pyq.averageScore?.toFixed(1) || 0}%</div>
            <div className="text-sm text-gray-600">Average Score</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PyqStudyPage;