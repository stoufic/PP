import React from 'react';
import { Award, Target, Rocket, BookOpen, Briefcase, Globe, Code, Heart } from 'lucide-react';

const VisionBoard = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl p-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-800">Future Vision Board</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Next Week Goals */}
          <div className="bg-blue-50 p-6 -xl">
            <h2 className="text-2xl font-seroundedmibold mb-4 flex items-center">
              <Target className="mr-3 text-blue-600" />
              Next Week
            </h2>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Code className="mr-2 text-blue-500" />
                Complete CS project prototype
              </li>
              <li className="flex items-center">
                <BookOpen className="mr-2 text-blue-500" />
                Finish two online tutorials on React
              </li>
              <li className="flex items-center">
                <Briefcase className="mr-2 text-blue-500" />
                Update LinkedIn and resume
              </li>
            </ul>
          </div>

          {/* Next Month Goals */}
          <div className="bg-green-50 p-6 rounded-xl">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Rocket className="mr-3 text-green-600" />
              Next Month
            </h2>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Award className="mr-2 text-green-500" />
                Apply to 5 internships
              </li>
              <li className="flex items-center">
                <Globe className="mr-2 text-green-500" />
                Learn advanced React state management
              </li>
              <li className="flex items-center">
                <Heart className="mr-2 text-green-500" />
                Join a tech community network
              </li>
            </ul>
          </div>

          {/* Next Semester Goals */}
          <div className="bg-purple-50 p-6 rounded-xl">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <BookOpen className="mr-3 text-purple-600" />
              Next Semester
            </h2>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Code className="mr-2 text-purple-500" />
                Complete advanced software engineering project
              </li>
              <li className="flex items-center">
                <Briefcase className="mr-2 text-purple-500" />
                Secure summer tech internship
              </li>
              <li className="flex items-center">
                <Globe className="mr-2 text-purple-500" />
                Begin preparing for tech certifications
              </li>
            </ul>
          </div>

          {/* 5-Year Vision */}
          <div className="bg-orange-50 p-6 rounded-xl">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Rocket className="mr-3 text-orange-600" />
              5-Year Vision
            </h2>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Award className="mr-2 text-orange-500" />
                Complete Master's in Computer Science
              </li>
              <li className="flex items-center">
                <Briefcase className="mr-2 text-orange-500" />
                Establish career in software engineering
              </li>
              <li className="flex items-center">
                <Globe className="mr-2 text-orange-500" />
                Contribute to open-source AI projects
              </li>
              <li className="flex items-center">
                <Heart className="mr-2 text-orange-500" />
                Mentor junior developers
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center mt-8 bg-blue-100 p-6 rounded-xl">
          <h3 className="text-2xl font-bold mb-4 text-blue-800">Guiding Principles</h3>
          <p className="text-lg text-blue-700">
            Continuous Learning • Persistent Growth • Meaningful Impact
          </p>
        </div>
      </div>
    </div>
  );
};

export default VisionBoard;
