import express from 'express';
import { createComplaint, deleteComplaint, getComplaints, updatePriority, updateStatus } from '../controllers/complaintControllers';
import { protect } from '../middlewares/authMiddleware';
import { confirmUpdate } from '../controllers/userControllers';

const router = express.Router();

router.post('/new',protect , createComplaint);
router.put('/:complaintId/status',protect , updateStatus)
router.put('/:complaintId/priority',protect ,  updatePriority);
router.delete('/:complaintId',protect , deleteComplaint); 
router.get('/:complaintId/confirm-update' , confirmUpdate)
router.get('/',protect ,  getComplaints)

export default router;
