import { useState, useMemo } from 'react';
import { BarChart3, TrendingUp, Clock, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ComplaintFilters } from '@/components/ComplaintComp/ComplaintFilters';
import { ComplaintTable } from '@/components/ComplaintComp/ComplaintTable';
import { ComplaintDetails } from '@/components/ComplaintComp/ComplaintDetails';
import { Complaint, ComplaintFilters as FilterType } from '@/types/complaint';

interface AdminPageProps {
  complaints: Complaint[];
  onStatusUpdate: (id: string, status: Complaint['status']) => void;
  onDelete: (id: string) => void;
}

export function AdminPage({ complaints, onStatusUpdate, onDelete }: AdminPageProps) {
  const [filters, setFilters] = useState<FilterType>({});
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const filteredComplaints = useMemo(() => {
    return complaints.filter(complaint => {
      if (filters.status && complaint.status !== filters.status) return false;
      if (filters.priority && complaint.priority !== filters.priority) return false;
      if (filters.category && complaint.category !== filters.category) return false;
      return true;
    });
  }, [complaints, filters]);

  const stats = useMemo(() => {
    const total = complaints.length;
    const pending = complaints.filter(c => c.status === 'Pending').length;
    const inProgress = complaints.filter(c => c.status === 'In Progress').length;
    const resolved = complaints.filter(c => c.status === 'Resolved').length;
    const highPriority = complaints.filter(c => c.priority === 'High').length;

    return { total, pending, inProgress, resolved, highPriority };
  }, [complaints]);

  const handleViewComplaint = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedComplaint(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Manage and monitor all customer complaints from a centralized dashboard.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              All time submissions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">
              Being resolved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.resolved}</div>
            <p className="text-xs text-muted-foreground">
              Successfully closed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <ComplaintFilters 
        filters={filters} 
        onFiltersChange={setFilters} 
      />

      {/* Complaints Table */}
      <ComplaintTable
        complaints={filteredComplaints}
        onStatusUpdate={onStatusUpdate}
        onDelete={onDelete}
        onView={handleViewComplaint}
      />

      {/* Complaint Details Modal */}
      <ComplaintDetails
        complaint={selectedComplaint}
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
      />
    </div>
  );
}