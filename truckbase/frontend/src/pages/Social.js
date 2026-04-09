import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const PLATFORMS = ['INSTAGRAM', 'FACEBOOK', 'TWITTER', 'TIKTOK'];
const TEMPLATES = ['location', 'event', 'daily'];

const Social = () => {
  const [posts, setPosts] = useState([]);
  const [generatedContent, setGeneratedContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [templateType, setTemplateType] = useState('location');
  const [platform, setPlatform] = useState('INSTAGRAM');
  const [variables, setVariables] = useState({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/social/posts`);
      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    try {
      const { data } = await axios.post(`${API_URL}/social/generate`, {
        templateType,
        platform,
        variables
      });
      setGeneratedContent(data.content);
    } catch (error) {
      alert('Failed to generate post');
    }
  };

  const handleSavePost = async () => {
    try {
      await axios.post(`${API_URL}/social/posts`, {
        platform,
        content: generatedContent
      });
      alert('Post saved as draft!');
      fetchPosts();
    } catch (error) {
      alert('Failed to save post');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">📱 Social Media</h1>
        <p className="text-gray-600 mt-2">Auto-generate posts for your food truck</p>
      </div>

      {/* Post Generator */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">✨ Generate Post</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-2">Template Type</label>
            <select
              value={templateType}
              onChange={(e) => setTemplateType(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg"
            >
              {TEMPLATES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg"
            >
              {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>

        {/* Dynamic Variables Based on Template */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {templateType === 'location' && (
            <>
              <input type="text" placeholder="Location Name" onChange={(e) => setVariables({...variables, LOCATION: e.target.value})} className="px-4 py-3 border rounded-lg" />
              <input type="text" placeholder="End Time" onChange={(e) => setVariables({...variables, TIME: e.target.value})} className="px-4 py-3 border rounded-lg" />
              <input type="text" placeholder="Cuisine Type" onChange={(e) => setVariables({...variables, CUISINE: e.target.value})} className="px-4 py-3 border rounded-lg" />
              <input type="text" placeholder="City" onChange={(e) => setVariables({...variables, CITY: e.target.value})} className="px-4 py-3 border rounded-lg" />
            </>
          )}
          {templateType === 'event' && (
            <>
              <input type="text" placeholder="Event Name" onChange={(e) => setVariables({...variables, 'EVENT NAME': e.target.value})} className="px-4 py-3 border rounded-lg" />
              <input type="text" placeholder="Date" onChange={(e) => setVariables({...variables, DATE: e.target.value})} className="px-4 py-3 border rounded-lg" />
              <input type="text" placeholder="Location" onChange={(e) => setVariables({...variables, LOCATION: e.target.value})} className="px-4 py-3 border rounded-lg" />
              <input type="text" placeholder="Time" onChange={(e) => setVariables({...variables, TIME: e.target.value})} className="px-4 py-3 border rounded-lg" />
            </>
          )}
          {templateType === 'daily' && (
            <>
              <input type="text" placeholder="Location" onChange={(e) => setVariables({...variables, LOCATION: e.target.value})} className="px-4 py-3 border rounded-lg" />
              <input type="text" placeholder="Hours" onChange={(e) => setVariables({...variables, HOURS: e.target.value})} className="px-4 py-3 border rounded-lg" />
              <input type="text" placeholder="Signature Dish" onChange={(e) => setVariables({...variables, SIGNATURE_DISH: e.target.value})} className="px-4 py-3 border rounded-lg" />
              <input type="text" placeholder="End Time" onChange={(e) => setVariables({...variables, TIME: e.target.value})} className="px-4 py-3 border rounded-lg" />
            </>
          )}
        </div>

        <button onClick={handleGenerate} className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
          ✨ Generate Post
        </button>

        {generatedContent && (
          <div className="mt-6">
            <label className="block text-gray-700 mb-2">Generated Content</label>
            <textarea
              value={generatedContent}
              onChange={(e) => setGeneratedContent(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg"
              rows={6}
            />
            <button onClick={handleSavePost} className="mt-4 px-6 py-3 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700">
              💾 Save as Draft
            </button>
          </div>
        )}
      </div>

      {/* Recent Posts */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">📝 Recent Posts</h2>
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-xs rounded-full mb-2">
                    {post.platform}
                  </span>
                  <p className="text-gray-900 whitespace-pre-wrap">{post.content}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Status: <span className="font-medium">{post.status}</span>
                    {post.postedAt && ` • Posted ${new Date(post.postedAt).toLocaleString()}`}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  post.status === 'POSTED' ? 'bg-green-100 text-green-700' :
                  post.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {post.status}
                </span>
              </div>
            </div>
          ))}
          {posts.length === 0 && <p className="text-gray-500">No posts yet. Generate your first one above!</p>}
        </div>
      </div>
    </div>
  );
};

export default Social;
