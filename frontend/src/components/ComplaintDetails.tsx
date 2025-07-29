import { formatDistanceToNow, format } from 'date-fns';
import { X, Calendar, Tag, AlertTriangle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Complaint } from '@/types/complaint';

interface ComplaintDetailsProps {
  complaint: Complaint | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ComplaintDetails({ complaint, isOpen, onClose }: ComplaintDetailsProps) {
  if (!complaint) return null;

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-xl font-semibold">Complaint Details</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Header Information */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {complaint.title}
              </h2>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant={getPriorityColor(complaint.priority)} className="flex items-center space-x-1">
                  <AlertTriangle className="h-3 w-3" />
                  <span>{complaint.priority} Priority</span>
                </Badge>
                <Badge variant="outline" className="flex items-center space-x-1">
                  <Tag className="h-3 w-3" />
                  <span>{complaint.category}</span>
                </Badge>
                <Badge className={getStatusColor(complaint.status)}>
                  {complaint.status}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Timestamps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Date Submitted</p>
                <p className="text-sm text-muted-foreground">
                  {format(complaint.dateSubmitted, 'PPP')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(complaint.dateSubmitted, { addSuffix: true })}
                </p>
              </div>
            </div>
            
            {complaint.dateUpdated && (
              <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Last Updated</p>
                  <p className="text-sm text-muted-foreground">
                    {format(complaint.dateUpdated, 'PPP')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(complaint.dateUpdated, { addSuffix: true })}
                  </p>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Description */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Description</h3>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                {complaint.description}
              </p>
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-card border rounded-lg p-4">
            <h4 className="font-medium mb-3">Complaint Information</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">ID:</span>
                <span className="ml-2 font-mono text-xs">{complaint.id}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Category:</span>
                <span className="ml-2">{complaint.category}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Priority:</span>
                <span className="ml-2">{complaint.priority}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span>
                <span className="ml-2">{complaint.status}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}