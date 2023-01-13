import Chat from "./Chat.interface";
import DisplayTextBubble from "./DisplayTextBubble";

export default function DisplayTextContainer(props: { history: Chat[] }) {
  return (
    <section className="flex flex-col gap-4 w-3/4 overflow-y-scroll h-3/4">
      {props.history.map((chat) => (
        <DisplayTextBubble
          key={chat.createdOn}
          message={chat.message}
          fromWho={chat.byWho}
        />
      ))}
    </section>
  );
}
