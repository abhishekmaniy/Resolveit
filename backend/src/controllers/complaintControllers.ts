import { Request, Response } from "express";
import Complaint from "../models/Complaint";


export const createComplaint = async (req: Request, res: Response) => {
    try {
        const { title, description, category, priority } = req.body;

        // if (!req.user || !req.user.id) {
        //     return res.status(401).json({ message: 'Unauthorized: No user ID found.' });
        // }

        const complaint = await Complaint.create({
            title,
            description,
            category,
            priority,
            // userId: req.user.id,
            userId: "6888b92d07a12ba0962c3153"
        });

        res.status(201).json({ complaint, message: 'Complaint submitted successfully.' });
    } catch (error) {
        console.error('Error creating complaint:', error);
        res.status(500).json({ message: 'Server error while submitting complaint.' });
    }
};


export const updateStatus = async (req: Request, res: Response) => {
    try {
        const { status } = req.body;
        const { complaintId } = req.params;

        if (!['Pending', 'In Progress', 'Resolved'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value.' });
        }

        const updatedComplaint = await Complaint.findByIdAndUpdate(
            complaintId,
            {
                status,
                dateUpdated: new Date(),
            },
            { new: true }
        );

        if (!updatedComplaint) {
            return res.status(404).json({ message: 'Complaint not found.' });
        }

        res.json({
            message: `Status updated to "${status}" successfully.`,
            complaint: updatedComplaint,
        });
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ message: 'Server error while updating status.' });
    }
};

export const updatePriority = async (req: Request, res: Response) => {
    try {
        const { priority } = req.body;
        const { complaintId } = req.params;

        if (!['Low', 'Medium', 'High'].includes(priority)) {
            return res.status(400).json({ message: 'Invalid priority value.' });
        }

        const updatedComplaint = await Complaint.findByIdAndUpdate(
            complaintId,
            {
                priority,
                dateUpdated: new Date(),
            },
            { new: true }
        );

        if (!updatedComplaint) {
            return res.status(404).json({ message: 'Complaint not found.' });
        }

        res.json({
            message: `Priority updated to "${priority}" successfully.`,
            complaint: updatedComplaint,
        });
    } catch (error) {
        console.error('Error updating priority:', error);
        res.status(500).json({ message: 'Server error while updating priority.' });
    }
};


export const getComplaints = async (req: Request, res: Response) => {
    try {
        const complaints = await Complaint.find()
        res.status(200).json(complaints);
    } catch (error) {
        console.error('Error fetching complaints:', error);
        res.status(500).json({ message: 'Server error while fetching complaints.' });
    }
};