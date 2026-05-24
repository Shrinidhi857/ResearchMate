const MessageBubble = ({
  message,
}: {
  message: { isOutgoing: boolean; text: string };
}) => {
  return (
    <div
      className={`flex w-full mb-4 ${
        message.isOutgoing ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[70%] rounded-lg px-4 py-2 ${
          message.isOutgoing
            ? "bg-primary text-primary-foreground rounded-br-sm"
            : "bg-muted text-muted-foreground rounded-bl-sm"
        }`}
      >
        <p className="text-sm">{message.text}</p>
      </div>
    </div>
  );
};
export default MessageBubble;
