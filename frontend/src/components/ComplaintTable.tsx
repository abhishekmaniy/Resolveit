import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Eye, Trash2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Complaint } from '@/types/complaint';

interface ComplaintTableProps {
  complaints: Complaint[];
  onStatusUpdate: (id: string, status: Complaint['status']) => void;
  onDelete: (id: string) => void;
  onView: (complaint: Complaint) => void;
}

export function ComplaintTable({ complaints, onStatusUpdate, onDelete, onView }: ComplaintTableProps) {
  const { toast } = useToast();
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

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

  const handleStatusUpdate = async (id: string, newStatus: Complaint['status']) => {
    setUpdatingStatus(id);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onStatusUpdate(id, newStatus);
      
      toast({
        title: "Status Updated",
        description: `📧 Email notification sent to admin confirming status update to "${newStatus}".`,
        variant: "default",
      });
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

  const handleDelete = (id: string) => {
    onDelete(id);
    toast({
      title: "Complaint Deleted",
      description: "The complaint has been successfully removed.",
      variant: "default",
    });
  };

  if (complaints.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground">No complaints found</h3>
          <p className="text-muted-foreground text-center mt-2">
            No complaints match your current filters, or there are no complaints to display.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complaint Management ({complaints.length} complaints)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
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
              {complaints.map((complaint) => (
                <TableRow key={complaint.id} className="hover:bg-muted/50">
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
                    <Select
                      value={complaint.status}
                      onValueChange={(value) => handleStatusUpdate(complaint.id, value as Complaint['status'])}
                      disabled={updatingStatus === complaint.id}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue>
                          <Badge className={getStatusColor(complaint.status)}>
                            {complaint.status}
                          </Badge>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDistanceToNow(complaint.dateSubmitted, { addSuffix: true })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onView(complaint)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Complaint</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this complaint? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(complaint.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}