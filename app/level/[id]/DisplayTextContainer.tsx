import Chat from "./Chat.interface";
import DisplayTextBubble from "./DisplayTextBubble";
import { useMemo } from "react";

const mergeHistory = (robotHistory: Chat[], playerHistory: Chat[]) => {
  var history = [];
  for (var index = 0; index < robotHistory.length; index++) {
    history.push({ ...playerHistory[index] }, robotHistory[index]);
  }
  return history;
};

export default function DisplayTextContainer(props: {
  robotHistory: Chat[];
  playerHistory: Chat[];
}) {
  const history = useMemo(
    () => mergeHistory(props.robotHistory, props.playerHistory),
    [props.robotHistory, props.playerHistory]
  );

  return (
    <section className="flex flex-col gap-4 w-3/4 overflow-y-scroll h-3/4">
      {history.map((chat) => (
        <DisplayTextBubble
          key={chat.createdOn}
          createdOn={chat.createdOn}
          message={chat.message}
          target={chat.target}
          highlights={chat.highlights}
          byWho={chat.byWho}
        />
      ))}
    </section>
  );
}
