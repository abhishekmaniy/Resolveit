import express from 'express';
import { createComplaint, getComplaints, updatePriority, updateStatus } from '../controllers/complaintControllers';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/new', createComplaint);
router.put('/:complaintId/status' , updateStatus)
router.put('/:complaintId/priority', updatePriority);
router.get('/', getComplaints)

export default router;
