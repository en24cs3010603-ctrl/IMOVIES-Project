import { Router } from 'express';
import { getShows, getShowById, createShow } from '../controllers/showController';
import { protect, adminOnly } from '../middleware/auth';

const router = Router();

router.get('/', getShows);
router.get('/:id', getShowById);
router.post('/', protect, adminOnly, createShow);

export default router;
