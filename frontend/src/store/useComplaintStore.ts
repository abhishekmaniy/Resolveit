import { Complaint } from '@/types/types';
import { create } from 'zustand';

interface ComplaintState {
    complaints: Complaint[];
    setComplaints: (complaints: Complaint[]) => void;
    addComplaint: (complaint: Complaint) => void;
    updateComplaint: (updated: Complaint) => void;
    removeComplaint: (id: string) => void;
}

export const useComplaintStore = create<ComplaintState>((set) => ({
    complaints: [],
    setComplaints: (complaints) => set({ complaints }),
    addComplaint: (complaint) =>
        set((state) => ({ complaints: [complaint, ...state.complaints] })),
    updateComplaint: (updated) =>
        set((state) => ({
            complaints: state.complaints.map((c) =>
                c._id === updated._id ? updated : c
            ),
        })),
    removeComplaint: (id) =>
        set((state) => ({
            complaints: state.complaints.filter((c) => c._id !== id),
        })),
}));
