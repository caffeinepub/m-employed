import { Badge } from '@/components/ui/badge';
import { ApplicationStatus } from '@/backend';

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus;
}

export default function ApplicationStatusBadge({ status }: ApplicationStatusBadgeProps) {
  const getVariant = () => {
    switch (status) {
      case ApplicationStatus.hired:
        return 'default';
      case ApplicationStatus.rejected:
        return 'destructive';
      case ApplicationStatus.interview:
        return 'default';
      case ApplicationStatus.reviewed:
        return 'secondary';
      case ApplicationStatus.submitted:
      default:
        return 'outline';
    }
  };

  const getLabel = () => {
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

  return <Badge variant={getVariant()}>{getLabel()}</Badge>;
}
