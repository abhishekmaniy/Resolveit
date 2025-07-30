import { ComplaintFilters } from '@/components/ComplaintFilters';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useComplaintStore } from '@/store/useComplaintStore';
import { Complaint, ComplaintFilters as FilterType } from '@/types/types';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { AlertTriangle, BarChart3, CheckCircle2, Clock } from 'lucide-react';
import { useMemo, useState } from 'react';

interface AdminDashboardProps {
  onDelete: (id: string) => void;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export function AdminDashboard({ onDelete, }: AdminDashboardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedPriority, setSelectedPriority] = useState<Complaint['priority'] | 'all'>('all');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterType>({});
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [updatingPriority, setUpdatingPriority] = useState<string | null>(null);
  const { updateComplaint, removeComplaint, complaints } = useComplaintStore()
  const [deletingComplaint, setDeletingComplaint] = useState<string | null>(null);

  const handleDeleteComplaint = async (id: string) => {
    setDeletingComplaint(id);
    try {
      await axios.delete(`${BACKEND_URL}/complaint/${id}`, { withCredentials: true });

      // Remove the complaint from the store
      removeComplaint(id);

      toast({
        title: "Complaint Deleted",
        description: "The complaint has been successfully deleted.",
      });

      // Close the modal after deletion
      setIsDetailsOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the complaint. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingComplaint(null);
    }
  };

  const stats = useMemo(() => {
    const total = complaints.length;
    const pending = complaints.filter(c => c.status === 'Pending').length;
    const inProgress = complaints.filter(c => c.status === 'In Progress').length;
    const resolved = complaints.filter(c => c.status === 'Resolved').length;
    const highPriority = complaints.filter(c => c.priority === 'High').length;

    return { total, pending, inProgress, resolved, highPriority };
  }, [complaints]);

  const filteredComplaints = useMemo(() => {
    return complaints.filter(complaint => {
      // Priority filter from sidebar
      if (selectedPriority !== 'all' && complaint.priority !== selectedPriority) return false;

      // Additional filters
      if (filters.status && complaint.status !== filters.status) return false;
      if (filters.category && complaint.category !== filters.category) return false;

      return true;
    });
  }, [complaints, selectedPriority, filters]);

  const priorityStats = useMemo(() => {
    const low = complaints.filter(c => c.priority === 'Low').length;
    const medium = complaints.filter(c => c.priority === 'Medium').length;
    const high = complaints.filter(c => c.priority === 'High').length;
    return { low, medium, high };
  }, [complaints]);

  const handleComplaintClick = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setIsDetailsOpen(true);
  };

  const handleStatusUpdate = async (id: string, newStatus: Complaint['status']) => {
    setUpdatingStatus(id);

    try {
      const response = await axios.put(`${BACKEND_URL}/complaint/${id}/status`, { status: newStatus }, { withCredentials: true });

      // Update the complaint in the store
      updateComplaint({
        ...selectedComplaint,
        status: newStatus,
        dateUpdated: new Date(),
      });

      toast({
        title: "Status Updated",
        description: response.data.message || `Complaint status changed to "${newStatus}".`,
      });

      if (selectedComplaint?._id === id) {
        setSelectedComplaint({
          ...selectedComplaint,
          status: newStatus,
          dateUpdated: new Date(),
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handlePriorityUpdate = async (priority: Complaint['priority'], id: string) => {
    setUpdatingPriority(id);
    try {
      const response = await axios.put(`${BACKEND_URL}/complaint/${id}/priority`, { priority }, {
        withCredentials: true
      });

      // Update the complaint in the store
      updateComplaint({
        ...selectedComplaint,
        priority,
        dateUpdated: new Date(),
      });

      toast({
        title: "Priority Updated",
        description: response.data.message || `Priority changed to "${priority}".`,
      });

      if (selectedComplaint?._id === id) {
        setSelectedComplaint({
          ...selectedComplaint,
          priority,
          dateUpdated: new Date(),
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to update priority.",
        variant: "destructive",
      });
    } finally {
      setUpdatingPriority(null);
    }
  };

  const getPriorityColor = (priority: Complaint['priority']) => {
    switch (priority) {
      case 'High': return 'destructive';
      case 'Medium': return 'default';
      case 'Low': return 'secondary';
    }
  };

  const getStatusColor = (status: Complaint['status']) => {
    switch (status) {
      case 'Resolved': return 'bg-success text-success-foreground';
      case 'In Progress': return 'bg-warning text-warning-foreground';
      case 'Pending': return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityIcon = (priority: Complaint['priority']) => {
    switch (priority) {
      case 'High': return <AlertTriangle className="h-4 w-4" />;
      case 'Medium': return <Clock className="h-4 w-4" />;
      case 'Low': return <CheckCircle2 className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SidebarProvider>
        <div className="flex w-full min-h-screen">
          {/* Sidebar */}
          <Sidebar className="w-80">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Admin Dashboard</h2>
                  <p className="text-sm text-muted-foreground">Welcome, {user?.name}</p>
                </div>
                <SidebarTrigger />
              </div>
            </div>

            <SidebarContent>
              {/* Overall Stats */}
              <div className="p-4">
                <div className="grid grid-cols-2 gap-2">
                  <Card className="p-3">
                    <div className="text-center">
                      <div className="text-lg font-bold">{stats.total}</div>
                      <div className="text-xs text-muted-foreground">Total</div>
                    </div>
                  </Card>
                  <Card className="p-3">
                    <div className="text-center">
                      <div className="text-lg font-bold text-warning">{stats.pending}</div>
                      <div className="text-xs text-muted-foreground">Pending</div>
                    </div>
                  </Card>
                  <Card className="p-3">
                    <div className="text-center">
                      <div className="text-lg font-bold text-primary">{stats.inProgress}</div>
                      <div className="text-xs text-muted-foreground">In Progress</div>
                    </div>
                  </Card>
                  <Card className="p-3">
                    <div className="text-center">
                      <div className="text-lg font-bold text-success">{stats.resolved}</div>
                      <div className="text-xs text-muted-foreground">Resolved</div>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Priority Filter */}
              <SidebarGroup>
                <SidebarGroupLabel>Filter by Priority</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        onClick={() => setSelectedPriority('all')}
                        className={selectedPriority === 'all' ? 'bg-accent' : ''}
                      >
                        <BarChart3 className="mr-2 h-4 w-4" />
                        All Complaints ({stats.total})
                      </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                      <SidebarMenuButton
                        onClick={() => setSelectedPriority('High')}
                        className={selectedPriority === 'High' ? 'bg-accent' : ''}
                      >
                        <AlertTriangle className="mr-2 h-4 w-4 text-destructive" />
                        High Priority ({priorityStats.high})
                      </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                      <SidebarMenuButton
                        onClick={() => setSelectedPriority('Medium')}
                        className={selectedPriority === 'Medium' ? 'bg-accent' : ''}
                      >
                        <Clock className="mr-2 h-4 w-4 text-warning" />
                        Medium Priority ({priorityStats.medium})
                      </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                      <SidebarMenuButton
                        onClick={() => setSelectedPriority('Low')}
                        className={selectedPriority === 'Low' ? 'bg-accent' : ''}
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4 text-success" />
                        Low Priority ({priorityStats.low})
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>

          {/* Main Content */}
          <main className="flex-1 p-6">
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold">
                  {selectedPriority === 'all'
                    ? 'All Complaints'
                    : `${selectedPriority} Priority Complaints`
                  }
                </h1>
                <p className="text-muted-foreground mt-2">
                  {selectedPriority === 'all'
                    ? 'Manage and monitor all customer complaints from a centralized dashboard.'
                    : `Viewing ${selectedPriority.toLowerCase()} priority complaints that require attention.`
                  }
                </p>
              </div>

              {/* Additional Filters */}
              <ComplaintFilters
                filters={filters}
                onFiltersChange={setFilters}
              />

              {/* Complaints Table */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    Complaints List ({filteredComplaints.length} of {stats.total})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {filteredComplaints.length === 0 ? (
                    <div className="text-center py-12">
                      <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-muted-foreground">No complaints found</h3>
                      <p className="text-muted-foreground">
                        No complaints match your current filters.
                      </p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Submitted</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredComplaints.map((complaint) => (
                          <TableRow
                            key={complaint._id}
                            className="hover:bg-muted/50 cursor-pointer"
                            onClick={() => handleComplaintClick(complaint)}
                          >
                            <TableCell className="font-medium max-w-xs">
                              <div className="truncate" title={complaint.title}>
                                {complaint.title}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{complaint.category}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={getPriorityColor(complaint.priority)}>
                                {complaint.priority}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(complaint.status)}>
                                {complaint.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {formatDistanceToNow(complaint.dateSubmitted, { addSuffix: true })}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleComplaintClick(complaint);
                                }}
                              >
                                View Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </SidebarProvider>

      {/* Complaint Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          {selectedComplaint && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  {getPriorityIcon(selectedComplaint.priority)}
                  <span>{selectedComplaint.title}</span>
                </DialogTitle>
                <DialogDescription>
                  Submitted {formatDistanceToNow(selectedComplaint.dateSubmitted, { addSuffix: true })}
                  {selectedComplaint.dateUpdated && (
                    <> • Updated {formatDistanceToNow(selectedComplaint.dateUpdated, { addSuffix: true })}</>
                  )}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Category</label>
                    <Badge variant="outline">{selectedComplaint.category}</Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Priority</label>
                    <Select
                      value={selectedComplaint.priority}
                      onValueChange={(value) => handlePriorityUpdate(value as Complaint['priority'], selectedComplaint._id)}
                      disabled={updatingPriority === selectedComplaint._id}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Status</label>
                  <Select
                    value={selectedComplaint.status}
                    onValueChange={(value) => handleStatusUpdate(selectedComplaint._id, value as Complaint['status'])}
                    disabled={updatingStatus === selectedComplaint._id}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="leading-relaxed">{selectedComplaint.description}</p>
                  </div>
                </div>
              </div>

              {/* Footer with Delete Button */}
              <div className="flex justify-end mt-6">
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteComplaint(selectedComplaint._id)}
                  disabled={deletingComplaint === selectedComplaint._id}
                >
                  {deletingComplaint === selectedComplaint._id ? "Deleting..." : "Delete Complaint"}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}