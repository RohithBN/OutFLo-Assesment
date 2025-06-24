import express from 'express';
import {
  getCampaigns,
  getCampaign,
  createCampaign,
  updateCampaign,
  deleteCampaign
} from '../controllers/campaignController';

const router = express.Router();

router.route('/')
  .get(getCampaigns)
  .post(createCampaign);

router.route('/:id')
  .get(getCampaign)
  .put(updateCampaign)
  .delete(deleteCampaign);

export default router;
