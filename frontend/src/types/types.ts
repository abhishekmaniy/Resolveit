
export type UserRole = 'User' | 'Admin';
export type ComplaintStatus = 'Pending' | 'In Progress' | 'Resolved';
export type ComplaintPriority = 'Low' | 'Medium' | 'High';
export type ComplaintCategory = 'Product' | 'Service' | 'Support';

export interface User {
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
}

export interface Complaint {
  _id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  dateSubmitted: string;
  dateUpdated?: string | Date;
  userId: string | User;
}

export interface ComplaintFormData {
  title: string;
  description: string;
  category: Complaint['category'];
  priority: Complaint['priority'];
}

export interface ComplaintFilters {
  status?: Complaint['status'];
  priority?: Complaint['priority'];
  category?: Complaint['category'];
}