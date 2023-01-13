"use client";

import { FormEvent, useState } from "react";
import query from "../../../service/ai";
import { Author } from "./Author.enum";
import Chat from "./Chat.interface";
import DisplayTextContainer from "./DisplayTextContainer";

async function getQueryResponse(prompt: string) {
  try {
    const responseText = await query(prompt);
    return responseText;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export default function LevelPage({ params }: any) {
  const [userInput, setUserInput] = useState("");
  const [sessionHistory, setSessionHistory] = useState<Chat[]>([]);

  const addToHistory = (text: string, createdOn: number, byWho: Author) => {
    const history = [...sessionHistory];
    history.push({
      message: text,
      createdOn: createdOn,
      byWho: byWho,
    });
    setSessionHistory(history);
  };

  const onFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    addToHistory(userInput, Date.now(), Author.Me);
    submitToGetResponse(userInput);
  };

  const submitToGetResponse = async (prompt: string) => {
    const responseText = await getQueryResponse(prompt);
    responseText !== null && addToHistory(responseText, Date.now(), Author.AI);
  };

  return (
    <>
      <h1>{params.id}</h1>
      <DisplayTextContainer history={sessionHistory} />
      <form onSubmit={onFormSubmit}>
        <input
          className="text-slate-800 w-10/12 mt-2 h-16 text-3xl px-4 rounded-full mr-4"
          type="text"
          onChange={(e) => setUserInput(e.target.value)}
        />
        <button
          type="submit"
          className="h-16 border border-neutral-50 text-lg hover:bg-white hover:text-slate-600 transition-all rounded-full px-5 lg:text-2xl lg:px-10"
        >
          Submit
        </button>
      </form>
    </>
  );
}
