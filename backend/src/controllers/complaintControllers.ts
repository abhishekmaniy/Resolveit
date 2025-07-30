import { Request, Response } from "express";
import Complaint from "../models/Complaint";
import User from "../models/User";
import { sendMail } from "../utils/sendMail";
import jwt from "jsonwebtoken";

const BACKEND_URL = process.env.BACKEND_URL


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

    const user = await User.findById(complaint.userId);

    sendMail({
      to: process.env.EMAIL_ADMIN!,
      subject: 'New Complaint Submitted',
      text: `A new complaint has been submitted.`,
      html: `
    <div style="font-family: 'Segoe UI', sans-serif; background-color: #0f1117; padding: 40px; color: #ffffff;">
      <table width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: auto; background-color: #1a1d29; border-radius: 12px;">
        <tr>
          <td style="padding: 24px; text-align: center;">
            <img src="https://i.ibb.co/F8P1h90/logo-resolvelt.png" alt="ResolvElt" style="height: 40px; margin-bottom: 20px;" />
            <h2 style="color: #a855f7;">New Complaint Submitted</h2>
          </td>
        </tr>
        <tr>
          <td style="padding: 0 24px 24px; color: #cbd5e1;">
            <p><strong>Title:</strong> ${title}</p>
            <p><strong>Category:</strong> ${category}</p>
            <p><strong>Priority:</strong> ${priority}</p>
            <p><strong>Description:</strong></p>
            <p style="background-color: #1e293b; padding: 12px; border-radius: 8px;">${description}</p>
            <p style="margin-top: 20px;">Submitted by: ${user?.name || 'Unknown User'}</p>
          </td>
        </tr>
      </table>
    </div>
  `
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

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found.' });
    }

    const token = jwt.sign(
      {
        complaintId,
        action: 'update_status',
        newValue: status,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    const confirmUrl = `${BACKEND_URL}/complaint/${complaintId}/confirm-update?token=${token}`;

    await sendMail({
      to: process.env.EMAIL_ADMIN!,
      subject: 'Confirm Status Update for Complaint',
      text: `Please confirm the status update for the complaint "${complaint.title}". Current status: ${complaint.status}. Requested new status: ${status}. Click here to confirm: ${confirmUrl}`,
      html: `
      <div style="font-family: 'Segoe UI', sans-serif; background-color: #0f1117; padding: 40px; color: #ffffff;">
        <table width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: auto; background-color: #1a1d29; border-radius: 12px;">
          <tr>
            <td style="padding: 24px; text-align: center;">
              <img src="https://i.ibb.co/F8P1h90/logo-resolvelt.png" alt="ResolvElt" style="height: 40px; margin-bottom: 20px;" />
              <h2 style="color: #38bdf8;">Confirm Status Update</h2>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 24px 24px; color: #cbd5e1;">
              <p><strong>Complaint:</strong> ${complaint.title}</p>
              <p><strong>Current Status:</strong> ${complaint.status}</p>
              <p><strong>Requested New Status:</strong> ${status}</p>
              <p><a href="${confirmUrl}" style="color: #a855f7;">Click here to confirm update</a></p>
            </td>
          </tr>
        </table>
      </div>
      `
    });

    return res.json({ message: 'Confirmation email sent. Please confirm the update from your email.' });
  } catch (error) {
    console.error('Error requesting status update:', error);
    return res.status(500).json({ message: 'Server error while requesting status update.' });
  }
};


export const updatePriority = async (req: Request, res: Response) => {
  try {
    const { priority } = req.body;
    const { complaintId } = req.params;

    if (!['Low', 'Medium', 'High'].includes(priority)) {
      return res.status(400).json({ message: 'Invalid priority value.' });
    }

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found.' });
    }

    const token = jwt.sign(
      {
        complaintId,
        action: 'update_priority',
        newValue: priority,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    const confirmUrl = `${BACKEND_URL}/complaint/${complaintId}/confirm-update?token=${token}`;

    await sendMail({
      to: process.env.EMAIL_ADMIN!,
      subject: 'Confirm Priority Update for Complaint',
      text: `Please confirm the status update for the complaint "${complaint.title}". Current status: ${complaint.priority}. Requested new status: ${priority}. Click here to confirm: ${confirmUrl}`,
      html: `
      <div style="font-family: 'Segoe UI', sans-serif; background-color: #0f1117; padding: 40px; color: #ffffff;">
        <table width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: auto; background-color: #1a1d29; border-radius: 12px;">
          <tr>
            <td style="padding: 24px; text-align: center;">
              <img src="https://i.ibb.co/F8P1h90/logo-resolvelt.png" alt="ResolvElt" style="height: 40px; margin-bottom: 20px;" />
              <h2 style="color: #38bdf8;">Confirm Status Update</h2>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 24px 24px; color: #cbd5e1;">
              <p><strong>Complaint:</strong> ${complaint.title}</p>
              <p><strong>Current Status:</strong> ${complaint.priority}</p>
              <p><strong>Requested New Status:</strong> ${priority}</p>
              <p><a href="${confirmUrl}" style="color: #a855f7;">Click here to confirm update</a></p>
            </td>
          </tr>
        </table>
      </div>
      `
    });


    return res.json({ message: 'Confirmation email sent. Please confirm the update from your email.' });

  } catch (error) {
    console.error('Error updating priority:', error);
    res.status(500).json({ message: 'Server error while updating priority.' });
  }
};


export const getComplaints = async (req: Request, res: Response) => {
  try {
    console.log(req.user)
    if (req.user.role === "User") {

      const Complains = await Complaint.find({ userId: req.user.id })
      console.log(Complains)
      res.status(200).json(Complains);

    } else {
      const Complains = await Complaint.find()
      res.status(200).json(Complains);
    }
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ message: 'Server error while fetching complaints.' });
  }
};

export const deleteComplaint = async (req: Request, res: Response) => {
  try {
    if (req.user.role === "Admin") {
      const { complaintId } = req.params;

      const deletedComplaint = await Complaint.findByIdAndDelete(complaintId);

      return res.status(200).json({
        message: 'Complaint deleted successfully.',
        complaint: deletedComplaint
      });
    } else {
      return res.status(403).json({ message: 'Forbidden: Only admins can delete complaints.' });
    }

  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ message: 'Server error while Deleting complaints.' });
  }
}