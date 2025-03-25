import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaCamera, FaTimes } from 'react-icons/fa';

export interface ChatBoxProps {
  appointmentId: string;
  customerName: string;
  providerName: string;
  userRole: 'PROVIDER' | 'CUSTOMER';
  onClose?: () => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'PROVIDER' | 'CUSTOMER';
  timestamp: Date;
}

export default function ChatBox({ appointmentId, customerName, providerName, userRole, onClose }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const chatRef = useRef<HTMLDivElement>(null);
  const [showTemplates, setShowTemplates] = useState(false);

  const messageTemplates = [
    'Yola çıkıyorum',
    'Aracınıza vardım',
    'Yıkama işlemi başladı',
    'Yıkama işlemi tamamlandı',
    'Aracınız hazır, teslim alabilirsiniz',
  ];

  const handleSendMessage = (text: string = newMessage) => {
    if (!text.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      text,
      sender: userRole,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setNewMessage('');
    setShowTemplates(false);
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h3 className="font-semibold text-black">{customerName}</h3>
          <p className="text-sm text-gray-600">Randevu #{appointmentId}</p>
        </div>
        {onClose && (
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
            aria-label="Kapat"
          >
            <FaTimes className="text-xl" />
          </button>
        )}
      </div>

      <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === userRole ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.sender === userRole
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-black'
              }`}
            >
              <p>{message.text}</p>
              <p className="text-xs mt-1 opacity-70">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t">
        {userRole === 'PROVIDER' && (
          <div className="mb-4">
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="text-blue-600 text-sm hover:underline mb-2"
            >
              Hazır Mesajlar
            </button>
            {showTemplates && (
              <div className="grid grid-cols-2 gap-2">
                {messageTemplates.map((template) => (
                  <button
                    key={template}
                    onClick={() => handleSendMessage(template)}
                    className="text-sm p-2 bg-gray-100 rounded hover:bg-gray-200 text-left text-black"
                  >
                    {template}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Mesajınızı yazın..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-blue-600 text-black"
          />
          <button
            onClick={() => handleSendMessage()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Gönder
          </button>
        </div>
      </div>
    </div>
  );
} 