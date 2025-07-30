import express from 'express';
import { createComplaint, deleteComplaint, getComplaints, updatePriority, updateStatus } from '../controllers/complaintControllers';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/new',protect , createComplaint);
router.put('/:complaintId/status',protect , updateStatus)
router.put('/:complaintId/priority',protect ,  updatePriority);
router.delete('/:complaintId',protect , deleteComplaint); 
router.get('/',protect ,  getComplaints)

export default router;
