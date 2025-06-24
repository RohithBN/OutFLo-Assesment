import React from 'react';
import { Link } from 'react-router-dom';
import { Target, MessageSquare } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Target className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">OutFlo</span>
          </Link>
          
          <nav className="flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              to="/campaigns/new" 
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              New Campaign
            </Link>
            <Link 
              to="/message-generator" 
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Message Generator</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
