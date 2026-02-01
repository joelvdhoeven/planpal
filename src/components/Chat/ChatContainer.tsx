import { MessageList } from './MessageList'
import { ChatInput } from './ChatInput'
import { useChat } from '../../hooks/useChat'

export function ChatContainer() {
  const { messages, sendMessage, isProcessing } = useChat()

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-md">
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Chat</h2>
        <p className="text-sm text-gray-500">Plan je events in het Nederlands</p>
      </div>
      <MessageList messages={messages} />
      <ChatInput onSend={sendMessage} disabled={isProcessing} />
    </div>
  )
}
