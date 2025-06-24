import mongoose, { Document, Schema } from 'mongoose';

export interface ICampaign extends Document {
  name: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DELETED';
  leads: string[];
  accountIDs: string[];
  createdAt: Date;
  updatedAt: Date;
}

const campaignSchema = new Schema<ICampaign>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'DELETED'],
    default: 'ACTIVE',
    required: true
  },
  leads: [{
    type: String,
    trim: true,
    validate: {
      validator: function(url: string) {
        return /^https?:\/\/(?:www\.)?linkedin\.com\/in\/[\w-]+\/?$/.test(url);
      },
      message: 'Invalid LinkedIn profile URL format'
    }
  }],
  accountIDs: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

campaignSchema.index({ status: 1, createdAt: -1 });
campaignSchema.index({ name: 1 });

campaignSchema.virtual('leadCount').get(function() {
  return this.leads?.length || 0;
});

campaignSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'DELETED') {
    this.status = 'DELETED';
  }
  next();
});

export const Campaign = mongoose.model<ICampaign>('Campaign', campaignSchema);
