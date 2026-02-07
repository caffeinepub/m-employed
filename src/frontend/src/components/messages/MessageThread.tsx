import { Card } from '@/components/ui/card';
import { Message } from '@/backend';
import { Principal } from '@icp-sdk/core/principal';
import { User } from 'lucide-react';
import EmptyState from '@/components/common/EmptyState';

interface MessageThreadProps {
  messages: Message[];
  currentUserPrincipal: Principal;
}

export default function MessageThread({ messages, currentUserPrincipal }: MessageThreadProps) {
  if (messages.length === 0) {
    return (
      <EmptyState
        icon={User}
        title="No messages yet"
        description="Start the conversation by sending a message"
      />
    );
  }

  return (
    <div className="space-y-4 max-h-[500px] overflow-y-auto">
      {messages.map(message => {
        const isCurrentUser = message.sender.toString() === currentUserPrincipal.toString();
        
        return (
          <div
            key={message.id.toString()}
            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
          >
            <Card className={`max-w-[80%] ${isCurrentUser ? 'bg-primary text-primary-foreground' : ''}`}>
              <div className="p-3 space-y-1">
                <p className="text-sm font-medium">
                  {isCurrentUser ? 'You' : 'Other Party'}
                </p>
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs ${isCurrentUser ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                  {new Date(Number(message.timestamp) / 1000000).toLocaleString()}
                </p>
              </div>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
