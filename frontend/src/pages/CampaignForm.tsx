import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { CreateCampaignData, UpdateCampaignData } from '../types';
import { campaignApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

interface CampaignFormProps {
  isEdit?: boolean;
}

const CampaignForm: React.FC<CampaignFormProps> = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    leads: [''],
    accountIDs: ['']
  });

  useEffect(() => {
    if (isEdit && id) {
      fetchCampaign();
    }
  }, [isEdit, id]);

  const fetchCampaign = async () => {
    try {
      setLoading(true);
      const campaign = await campaignApi.getById(id!);
      setFormData({
        name: campaign.name,
        description: campaign.description,
        leads: campaign.leads.length > 0 ? campaign.leads : [''],
        accountIDs: campaign.accountIDs.length > 0 ? campaign.accountIDs : ['']
      });
      setError(null);
    } catch (err) {
      setError('Failed to fetch campaign');
      console.error('Error fetching campaign:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayChange = (index: number, value: string, field: 'leads' | 'accountIDs') => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field: 'leads' | 'accountIDs') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (index: number, field: 'leads' | 'accountIDs') => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSubmitLoading(true);
      setError(null);

      // Filter out empty strings from arrays
      const cleanedData = {
        ...formData,
        leads: formData.leads.filter(lead => lead.trim() !== ''),
        accountIDs: formData.accountIDs.filter(id => id.trim() !== '')
      };

      if (isEdit && id) {
        await campaignApi.update(id, cleanedData as UpdateCampaignData);
      } else {
        await campaignApi.create(cleanedData as CreateCampaignData);
      }

      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save campaign');
      console.error('Error saving campaign:', err);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEdit ? 'Edit Campaign' : 'Create New Campaign'}
        </h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Campaign Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="input-field"
            placeholder="Enter campaign name"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows={4}
            className="input-field"
            placeholder="Describe your campaign"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            LinkedIn Profile URLs
          </label>
          {formData.leads.map((lead, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="url"
                value={lead}
                onChange={(e) => handleArrayChange(index, e.target.value, 'leads')}
                className="input-field"
                placeholder="https://linkedin.com/in/profile-name"
              />
              {formData.leads.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem(index, 'leads')}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem('leads')}
            className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
          >
            <Plus className="h-4 w-4" />
            <span>Add LinkedIn Profile</span>
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Account IDs
          </label>
          {formData.accountIDs.map((accountId, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={accountId}
                onChange={(e) => handleArrayChange(index, e.target.value, 'accountIDs')}
                className="input-field"
                placeholder="Enter account ID"
              />
              {formData.accountIDs.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem(index, 'accountIDs')}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem('accountIDs')}
            className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
          >
            <Plus className="h-4 w-4" />
            <span>Add Account ID</span>
          </button>
        </div>

        <div className="flex justify-end space-x-4 pt-6">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitLoading}
            className="btn-primary"
          >
            {submitLoading ? 'Saving...' : isEdit ? 'Update Campaign' : 'Create Campaign'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CampaignForm;
