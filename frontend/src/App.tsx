import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import CampaignForm from './pages/CampaignForm';
import MessageGenerator from './pages/MessageGenerator';
import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/campaigns/new" element={<CampaignForm />} />
            <Route path="/campaigns/edit/:id" element={<CampaignForm isEdit />} />
            <Route path="/message-generator" element={<MessageGenerator />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
