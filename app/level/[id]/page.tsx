/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { FormEvent, useState, useEffect } from "react";
import { Author } from "./Author.enum";
import Chat from "./Chat.interface";
import DisplayTextContainer from "./DisplayTextContainer";
import Timer from "./Timer";

async function getQueryResponse(prompt: string) {
  try {
    const response = await fetch("/api/ai", {
      method: "POST",
      mode: "cors",
      body: JSON.stringify({ prompt }),
      cache: "no-store",
    });
    const json = await response.json();
    return json.response;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export default function LevelPage({ params }: any) {
  const target = "Burger";
  const [userInput, setUserInput] = useState("");
  const [responseText, setResponseText] = useState("");
  const [playerHistory, setPlayerHistory] = useState<Chat[]>([]);
  const [robotHistory, setRobotHistory] = useState<Chat[]>([]);

  const getRegexPattern = (target: string): RegExp => {
    return new RegExp(target.toLowerCase(), "gi");
  };

  const addToHistory = (text: string, createdOn: number, forWho: Author) => {
    const history =
      forWho === Author.AI ? [...robotHistory] : [...playerHistory];
    history.push({
      message: text,
      target: target,
      highlights: [],
      createdOn: createdOn,
      byWho: forWho,
    });
    forWho === Author.AI ? setRobotHistory(history) : setPlayerHistory(history);
  };

  const onFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    addToHistory(userInput, Date.now(), Author.Me);
  };

  const submitToGetResponse = async (prompt: string) => {
    const responseText = await getQueryResponse(prompt);
    setResponseText(responseText);
    addToHistory(responseText, Date.now(), Author.AI);
  };

  useEffect(() => {
    console.log("Response Text Changed");
    if (robotHistory.length > 0 && robotHistory.length % 2 === 0) {
      const history = [...robotHistory];
      const regex = getRegexPattern(target);
      var match;
      while ((match = regex.exec(responseText.toLowerCase()))) {
        history[history.length - 1].highlights.push(match.index);
      }
      setRobotHistory(history);
      if (history[history.length - 1].highlights.length === 0) {
        // TODO: show no match!
        console.log("No Match!");
      } else {
        // TODO: End this round! Change next target! Record duration!
        console.log("You win!");
      }
    }
  }, [responseText]);

  useEffect(() => {
    console.log("Player History Changed", userInput);
    userInput && submitToGetResponse(userInput);
  }, [playerHistory]);

  return (
    <>
      <Timer />
      <DisplayTextContainer
        robotHistory={robotHistory}
        playerHistory={playerHistory}
      />
      <form onSubmit={onFormSubmit} className="fixed bottom-3 w-screen">
        <div className="flex items-center justify-center gap-4 px-4">
          <input
            className="text-slate-800 h-8 text-3xl px-4 rounded-full flex-grow"
            type="text"
            onChange={(e) => setUserInput(e.target.value)}
          />
          <button
            type="submit"
            className="h-8 border border-neutral-50 text-lg  transition-all rounded-full px-5 hover:bg-white hover:text-slate-600 lg:text-2xl lg:px-6"
          >
            Submit
          </button>
        </div>
      </form>
    </>
  );
}
