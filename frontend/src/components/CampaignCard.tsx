import React from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, Users, Calendar, ToggleLeft, ToggleRight } from 'lucide-react';
import { Campaign } from '../types';

interface CampaignCardProps {
  campaign: Campaign;
  onStatusToggle: (id: string, currentStatus: 'ACTIVE' | 'INACTIVE') => void;
  onDelete: (id: string) => void;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, onStatusToggle, onDelete }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{campaign.name}</h3>
          <p className="text-gray-600 mb-3">{campaign.description}</p>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{campaign.leadCount || 0} leads</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>Created {formatDate(campaign.createdAt)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`${campaign.status === 'ACTIVE' ? 'status-active' : 'status-inactive'}`}>
            {campaign.status}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onStatusToggle(campaign._id, campaign.status as 'ACTIVE' | 'INACTIVE')}
            className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            {campaign.status === 'ACTIVE' ? (
              <ToggleRight className="h-4 w-4 text-green-600" />
            ) : (
              <ToggleLeft className="h-4 w-4 text-gray-400" />
            )}
            <span>{campaign.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Link
            to={`/campaigns/edit/${campaign._id}`}
            className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          >
            <Edit2 className="h-4 w-4" />
          </Link>
          <button
            onClick={() => onDelete(campaign._id)}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;
