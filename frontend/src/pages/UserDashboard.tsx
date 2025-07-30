import { useState, useMemo } from 'react';
import { Plus, FileText, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ComplaintForm } from '@/components/ComplaintComp/ComplaintForm';
import { ComplaintDetails } from '@/components/ComplaintComp/ComplaintDetails';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { Complaint, ComplaintFormData } from '@/types/types';

interface UserDashboardProps {
  complaints: Complaint[];
  onSubmitComplaint: (data: ComplaintFormData) => void;
}

export function UserDashboard({ complaints, onSubmitComplaint }: UserDashboardProps) {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<'form' | 'complaint'>('form');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  const userComplaints = complaints;

  const stats = useMemo(() => {
    const total = userComplaints.length;
    const pending = userComplaints.filter(c => c.status === 'Pending').length;
    const inProgress = userComplaints.filter(c => c.status === 'In Progress').length;
    const resolved = userComplaints.filter(c => c.status === 'Resolved').length;

    return { total, pending, inProgress, resolved };
  }, [userComplaints]);

  const handleComplaintClick = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setActiveView('complaint');
  };

  const handleCreateNewComplaint = () => {
    setSelectedComplaint(null);
    setActiveView('form');
  };

  const getPriorityIcon = (priority: Complaint['priority']) => {
    switch (priority) {
      case 'High': return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'Medium': return <Clock className="h-4 w-4 text-warning" />;
      case 'Low': return <CheckCircle2 className="h-4 w-4 text-success" />;
    }
  };

  const getStatusColor = (status: Complaint['status']) => {
    switch (status) {
      case 'Resolved': return 'bg-success text-success-foreground';
      case 'In Progress': return 'bg-warning text-warning-foreground';
      case 'Pending': return 'bg-muted text-muted-foreground';
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
                  <h2 className="text-lg font-semibold">Welcome back!</h2>
                  <p className="text-sm text-muted-foreground">{user?.name}</p>
                </div>
                <SidebarTrigger />
              </div>
            </div>

            <SidebarContent>
              {/* Create Complaint Button */}
              <div className="p-4">
                <Button 
                  onClick={handleCreateNewComplaint}
                  className="w-full"
                  variant={activeView === 'form' && !selectedComplaint ? 'default' : 'outline'}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Complaint
                </Button>
              </div>

              {/* Stats */}
              <div className="px-4 pb-4">
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

              {/* Complaints List */}
              <SidebarGroup>
                <SidebarGroupLabel className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  Your Complaints ({userComplaints.length})
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {userComplaints.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">
                        <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No complaints yet</p>
                        <p className="text-xs">Create your first complaint above</p>
                      </div>
                    ) : (
                      userComplaints.map((complaint) => (
                        <SidebarMenuItem key={complaint._id}>
                          <SidebarMenuButton 
                            onClick={() => handleComplaintClick(complaint)}
                            className={`w-full justify-start p-3 h-auto ${
                              selectedComplaint?._id === complaint._id ? 'bg-accent' : ''
                            }`}
                          >
                            <div className="flex items-start space-x-3 w-full">
                              {getPriorityIcon(complaint.priority)}
                              <div className="flex-1 min-w-0">
                                <div className="font-medium truncate text-sm">
                                  {complaint.title}
                                </div>
                                <div className="flex items-center space-x-2 mt-1">
                                  <Badge 
                                    className={`text-xs ${getStatusColor(complaint.status)}`}
                                  >
                                    {complaint.status}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(complaint.dateSubmitted, { addSuffix: true })}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))
                    )}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>

          {/* Main Content */}
          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              {activeView === 'form' && !selectedComplaint && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold">Create New Complaint</h1>
                    <p className="text-muted-foreground mt-2">
                      Please provide detailed information about your complaint. We'll review it and get back to you promptly.
                    </p>
                  </div>
                  <ComplaintForm onSubmit={onSubmitComplaint} />
                </div>
              )}

              {activeView === 'complaint' && selectedComplaint && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-3xl font-bold">Complaint Details</h1>
                      <p className="text-muted-foreground mt-2">
                        Review your complaint details and current status.
                      </p>
                    </div>
                    <Button onClick={handleCreateNewComplaint} variant="outline">
                      <Plus className="mr-2 h-4 w-4" />
                      Create New
                    </Button>
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center space-x-2">
                          {getPriorityIcon(selectedComplaint.priority)}
                          <span>{selectedComplaint.title}</span>
                        </CardTitle>
                        <Badge className={getStatusColor(selectedComplaint.status)}>
                          {selectedComplaint.status}
                        </Badge>
                      </div>
                      <CardDescription>
                        Submitted {formatDistanceToNow(selectedComplaint.dateSubmitted, { addSuffix: true })}
                        {selectedComplaint.dateUpdated && (
                          <> • Updated {formatDistanceToNow(selectedComplaint.dateUpdated, { addSuffix: true })}</>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Category</h4>
                        <Badge variant="outline">{selectedComplaint.category}</Badge>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Priority</h4>
                        <div className="flex items-center space-x-2">
                          {getPriorityIcon(selectedComplaint.priority)}
                          <span>{selectedComplaint.priority}</span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Description</h4>
                        <p className="text-muted-foreground leading-relaxed">
                          {selectedComplaint.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}