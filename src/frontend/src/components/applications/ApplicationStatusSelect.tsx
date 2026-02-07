import { useUpdateApplicationStatus } from '@/hooks/useApplications';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ApplicationId, ApplicationStatus } from '@/backend';
import { toast } from 'sonner';

interface ApplicationStatusSelectProps {
  applicationId: ApplicationId;
  currentStatus: ApplicationStatus;
}

export default function ApplicationStatusSelect({ applicationId, currentStatus }: ApplicationStatusSelectProps) {
  const updateStatus = useUpdateApplicationStatus();

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateStatus.mutateAsync({
        applicationId,
        status: newStatus as ApplicationStatus,
      });
      toast.success('Application status updated');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status');
    }
  };

  const getStatusLabel = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.hired:
        return 'Hired';
      case ApplicationStatus.rejected:
        return 'Rejected';
      case ApplicationStatus.interview:
        return 'Interview';
      case ApplicationStatus.reviewed:
        return 'Reviewed';
      case ApplicationStatus.submitted:
      default:
        return 'Submitted';
    }
  };

  return (
    <Select value={currentStatus} onValueChange={handleStatusChange} disabled={updateStatus.isPending}>
      <SelectTrigger className="w-[140px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ApplicationStatus.submitted}>Submitted</SelectItem>
        <SelectItem value={ApplicationStatus.reviewed}>Reviewed</SelectItem>
        <SelectItem value={ApplicationStatus.interview}>Interview</SelectItem>
        <SelectItem value={ApplicationStatus.rejected}>Rejected</SelectItem>
        <SelectItem value={ApplicationStatus.hired}>Hired</SelectItem>
      </SelectContent>
    </Select>
  );
}
