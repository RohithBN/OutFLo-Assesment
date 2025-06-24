import { Request, Response } from 'express';
import { z } from 'zod';
import { Campaign, ICampaign } from '../models/Campaign';
import { createCampaignSchema, updateCampaignSchema } from '../validation/schemas';
import { asyncHandler } from '../middleware/errorHandler';


export const getCampaigns = asyncHandler(async (req: Request, res: Response) => {
  const campaigns = await Campaign.find({ status: { $ne: 'DELETED' } })
    .sort({ createdAt: -1 })
    .select('-__v');

  res.status(200).json({
    success: true,
    count: campaigns.length,
    data: campaigns
  });
});


export const getCampaign = asyncHandler(async (req: Request, res: Response) => {
  const campaign = await Campaign.findById(req.params.id).select('-__v');

  if (!campaign || campaign.status === 'DELETED') {
    return res.status(404).json({
      success: false,
      error: 'Campaign not found'
    });
  }

  res.status(200).json({
    success: true,
    data: campaign
  });
});

export const createCampaign = asyncHandler(async (req: Request, res: Response) => {
  try {
    const validatedData = createCampaignSchema.parse(req.body);
    const campaign = await Campaign.create(validatedData);

    res.status(201).json({
      success: true,
      data: campaign
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: error.errors[0].message
      });
    }
    throw error;
  }
});


export const updateCampaign = asyncHandler(async (req: Request, res: Response) => {
  try {
    const validatedData = updateCampaignSchema.parse(req.body);
    
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign || campaign.status === 'DELETED') {
      return res.status(404).json({
        success: false,
        error: 'Campaign not found'
      });
    }

    const updatedCampaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      validatedData,
      {
        new: true,
        runValidators: true
      }
    ).select('-__v');

    res.status(200).json({
      success: true,
      data: updatedCampaign
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: error.errors[0].message
      });
    }
    throw error;
  }
});


export const deleteCampaign = asyncHandler(async (req: Request, res: Response) => {
  const campaign = await Campaign.findById(req.params.id);

  if (!campaign || campaign.status === 'DELETED') {
    return res.status(404).json({
      success: false,
      error: 'Campaign not found'
    });
  }

  await Campaign.findByIdAndUpdate(req.params.id, { status: 'DELETED' });

  res.status(200).json({
    success: true,
    message: 'Campaign deleted successfully'
  });
});
