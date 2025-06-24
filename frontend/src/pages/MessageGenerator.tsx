import React, { useState } from 'react';
import { MessageSquare, Copy, RefreshCw, Sparkles, FileText, AlertTriangle } from 'lucide-react';
import { LinkedInProfile, PersonalizedMessageResponse } from '../types';
import { messageApi } from '../services/api';

const MessageGenerator: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [messageData, setMessageData] = useState<PersonalizedMessageResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const [formData, setFormData] = useState<LinkedInProfile>({
    name: 'John Doe',
    job_title: 'Software Engineer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    summary: 'Experienced software engineer with 5+ years in AI & ML, passionate about building scalable solutions and leading cross-functional teams.'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateMessage = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await messageApi.generatePersonalized(formData);
      setMessageData(response);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate message');
      console.error('Error generating message:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyMessage = async () => {
    if (!messageData?.message) return;
    
    try {
      await navigator.clipboard.writeText(messageData.message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };

  const clearForm = () => {
    setFormData({
      name: '',
      job_title: '',
      company: '',
      location: '',
      summary: ''
    });
    setMessageData(null);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">LinkedIn Message Generator</h1>
        <p className="text-gray-600">Generate personalized outreach messages using AI</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>LinkedIn Profile Information</span>
            </h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                  placeholder="e.g., John Doe"
                />
              </div>

              <div>
                <label htmlFor="job_title" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title *
                </label>
                <input
                  type="text"
                  id="job_title"
                  name="job_title"
                  value={formData.job_title}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                  placeholder="e.g., Software Engineer"
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                  Company *
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                  placeholder="e.g., TechCorp"
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                  placeholder="e.g., San Francisco, CA"
                />
              </div>

              <div>
                <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">
                  Professional Summary *
                </label>
                <textarea
                  id="summary"
                  name="summary"
                  value={formData.summary}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="input-field"
                  placeholder="Brief professional summary from their LinkedIn profile..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={generateMessage}
                  disabled={loading}
                  className="btn-primary flex-1 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <MessageSquare className="h-4 w-4" />
                  )}
                  <span>{loading ? 'Generating...' : 'Generate Message'}</span>
                </button>
                <button
                  onClick={clearForm}
                  className="btn-secondary"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Generated Message */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Generated Message</h2>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {messageData ? (
              <div className="space-y-4">
                {/* Message Source Indicator */}
                <div className="flex items-center space-x-2 mb-2">
                  {messageData.source === 'ai' ? (
                    <div className="flex items-center space-x-1 text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      <Sparkles className="h-3 w-3" />
                      <span>AI Generated</span>
                    </div>
                  ) : messageData.source === 'template' ? (
                    <div className="flex items-center space-x-1 text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      <FileText className="h-3 w-3" />
                      <span>Smart Template</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1 text-sm text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                      <AlertTriangle className="h-3 w-3" />
                      <span>Basic Template</span>
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 rounded-lg p-4 min-h-[200px]">
                  <p className="text-gray-900 whitespace-pre-wrap">{messageData.message}</p>
                </div>

                {/* Note if present */}
                {messageData.note && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-blue-700 text-sm">{messageData.note}</p>
                  </div>
                )}

                <div className="flex space-x-2">
                  <button
                    onClick={copyMessage}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Copy className="h-4 w-4" />
                    <span>{copied ? 'Copied!' : 'Copy Message'}</span>
                  </button>
                  <button
                    onClick={generateMessage}
                    disabled={loading}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Regenerate</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center min-h-[200px] flex items-center justify-center">
                <p className="text-gray-600">Fill in the profile information and click "Generate Message" to create a personalized outreach message.</p>
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="card bg-blue-50 border-blue-200">
            <h3 className="text-lg font-medium text-blue-900 mb-2">💡 Tips for Better Messages</h3>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Include specific details from their profile</li>
              <li>• Mention their current role and company</li>
              <li>• Keep the summary detailed but concise</li>
              <li>• Location helps with relevance and context</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageGenerator;
