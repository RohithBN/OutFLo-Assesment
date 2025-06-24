import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, AlertCircle } from 'lucide-react';
import { Campaign } from '../types';
import { campaignApi } from '../services/api';
import CampaignCard from '../components/CampaignCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const data = await campaignApi.getAll();
      setCampaigns(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch campaigns');
      console.error('Error fetching campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: 'ACTIVE' | 'INACTIVE') => {
    try {
      const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      await campaignApi.update(id, { status: newStatus });
      
      setCampaigns(campaigns.map(campaign => 
        campaign._id === id ? { ...campaign, status: newStatus } : campaign
      ));
    } catch (err) {
      console.error('Error updating campaign status:', err);
      setError('Failed to update campaign status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) {
      return;
    }

    try {
      await campaignApi.delete(id);
      setCampaigns(campaigns.filter(campaign => campaign._id !== id));
    } catch (err) {
      console.error('Error deleting campaign:', err);
      setError('Failed to delete campaign');
    }
  };

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCampaigns = campaigns.filter(c => c.status === 'ACTIVE').length;
  const totalLeads = campaigns.reduce((sum, c) => sum + (c.leadCount || 0), 0);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campaign Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your outreach campaigns and track performance</p>
        </div>
        <Link to="/campaigns/new" className="btn-primary inline-flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>New Campaign</span>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Campaigns</p>
              <p className="text-2xl font-bold text-gray-900">{campaigns.length}</p>
            </div>
            <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <Plus className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
              <p className="text-2xl font-bold text-gray-900">{activeCampaigns}</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <div className="h-6 w-6 bg-green-600 rounded-full"></div>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Leads</p>
              <p className="text-2xl font-bold text-gray-900">{totalLeads}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Search className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 input-field"
            />
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Campaigns Grid */}
      {filteredCampaigns.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Plus className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {campaigns.length === 0 ? 'No campaigns yet' : 'No campaigns found'}
          </h3>
          <p className="text-gray-600 mb-6">
            {campaigns.length === 0 
              ? 'Get started by creating your first campaign.'
              : 'Try adjusting your search terms.'
            }
          </p>
          {campaigns.length === 0 && (
            <Link to="/campaigns/new" className="btn-primary inline-flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Create Campaign</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCampaigns.map((campaign) => (
            <CampaignCard
              key={campaign._id}
              campaign={campaign}
              onStatusToggle={handleStatusToggle}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
