import { useState } from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useMessages, useSendMessage } from '@/hooks/useMessages';
import { useApplication } from '@/hooks/useApplications';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import MessageThread from '@/components/messages/MessageThread';
import MessageComposer from '@/components/messages/MessageComposer';
import AuthGate from '@/components/auth/AuthGate';

export default function MessagesThreadPage() {
  const { applicationId } = useParams({ from: '/messages/$applicationId' });
  const { identity } = useInternetIdentity();
  const { data: application, isLoading: applicationLoading } = useApplication(BigInt(applicationId));
  const { data: messages, isLoading: messagesLoading, refetch, isRefetching } = useMessages(BigInt(applicationId));
  const sendMessage = useSendMessage();
  const [messageContent, setMessageContent] = useState('');

  if (!identity) {
    return <AuthGate />;
  }

  if (applicationLoading || messagesLoading) {
    return (
      <div className="container py-8 max-w-4xl">
        <Skeleton className="h-12 w-64 mb-6" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="container py-20">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Application Not Found</CardTitle>
            <CardDescription>The application you're looking for doesn't exist.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const handleSendMessage = async () => {
    if (!messageContent.trim()) return;

    try {
      await sendMessage.mutateAsync({
        applicationId: BigInt(applicationId),
        content: messageContent.trim(),
      });
      setMessageContent('');
    } catch (error: any) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="container py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="ghost" 
          onClick={() => window.history.back()}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isRefetching}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Messages</CardTitle>
          <CardDescription>
            Application #{applicationId}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MessageThread messages={messages || []} currentUserPrincipal={identity.getPrincipal()} />
        </CardContent>
      </Card>

      <MessageComposer
        value={messageContent}
        onChange={setMessageContent}
        onSend={handleSendMessage}
        isSending={sendMessage.isPending}
      />
    </div>
  );
}
