'use client';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';

interface GroupMessage {
  id: string;
  content: string;
  user_id: string;
  group_id: string;
  createdAt: string;
}

interface GroupChatProps {
  groupId: string;
  currentUserId: string;
}

export default function GroupChat({ groupId, currentUserId }: GroupChatProps) {
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch messages
  useEffect(() => {
    fetchMessages();
    // Set up polling for new messages (every 3 seconds)
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [groupId]);

  async function fetchMessages() {
    setLoading(true);
    try {
      const res = await fetch(`/api/groups/${groupId}/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      } else {
        toast.error('Failed to load messages');
      }
    } catch {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage() {
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const res = await fetch(`/api/groups/${groupId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newMessage }),
      });

      if (res.ok) {
        setNewMessage('');
        // Immediately fetch messages to show the new message
        await fetchMessages();
      } else {
        toast.error('Failed to send message');
      }
    } catch {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  // Group messages by date
  const groupedMessages = messages.reduce(
    (groups, message) => {
      const date = new Date(message.createdAt).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
      return groups;
    },
    {} as Record<string, GroupMessage[]>
  );

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Messages Area */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {loading && messages.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            Loading messages...
          </div>
        ) : (
          Object.entries(groupedMessages).map(([date, dayMessages]) => (
            <div key={date}>
              {/* Date Separator */}
              <div className="mb-4 flex items-center justify-center">
                <div className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                  {formatDate(date)}
                </div>
              </div>

              {/* Messages for this date */}
              {dayMessages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-3 flex ${
                    message.user_id === currentUserId
                      ? 'justify-end'
                      : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs rounded-lg px-4 py-2 lg:max-w-md ${
                      message.user_id === currentUserId
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {message.user_id !== currentUserId && (
                      <div className="mb-1 text-xs text-gray-600">
                        {message.user_id.substring(0, 8)}...
                      </div>
                    )}
                    <div className="break-words">{message.content}</div>
                    <div
                      className={`mt-1 text-xs ${
                        message.user_id === currentUserId
                          ? 'text-blue-100'
                          : 'text-gray-500'
                      }`}
                    >
                      {formatTime(message.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}

        {messages.length === 0 && !loading && (
          <div className="py-8 text-center text-gray-500">
            <div className="mb-2 text-lg">👋</div>
            <p>No messages yet. Start the conversation!</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            disabled={sending}
            className="flex-1"
          />
          <Button
            onClick={sendMessage}
            disabled={!newMessage.trim() || sending}
            size="sm"
          >
            <PaperAirplaneIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
