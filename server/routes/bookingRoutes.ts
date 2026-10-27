import { Router } from 'express';
import { createBooking, getMyBookings, cancelBooking } from '../controllers/bookingController';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.put('/:id/cancel', protect, cancelBooking);

export default router;
