"use client";

import { FormEvent, useState, useEffect, useCallback } from "react";
import Timer from "./(components)/Timer";
import PlayerInputDisplay from "./(components)/PlayerInputDisplay";
import { Status } from "use-timer/lib/types";
import { AiOutlineSend } from "react-icons/ai";
import { getQueryResponse } from "../../(services)/aiService";
import { getLevels } from "../../(services)/levelService";
import ILevel from "../../levels/(models)/level.interface";
import ResponseDisplay from "./(components)/ResponseDisplay";
import _ from "lodash";

export default function LevelPage({ params }: any) {
  const [userInput, setUserInput] = useState("");
  const [responseText, setResponseText] = useState("");
  const [timerStatus, setTimerStatus] = useState<Status>("RUNNING");
  const [levels, setLevels] = useState<ILevel[]>([]);
  const [words, setWords] = useState<string[]>([]);
  const [target, setTarget] = useState<string | null>(null);
  const [pickedWords, setPickedWords] = useState<string[]>([]);

  const fetchLevels = useCallback(async () => {
    const levels = await getLevels();
    setLevels(levels);
    setWords(levels[params.id].words);
  }, [params.id]);

  useEffect(() => {
    fetchLevels();
  }, [fetchLevels]);

  const generateNewTarget = () => {
    var target = words[Math.floor(Math.random() * words.length)];
    setTarget(target);
    let picked = [...pickedWords];
    picked.push(target);
    setPickedWords(picked);
    let unused = [...words];
    _.remove(unused, target);
    setWords(unused);
  };

  const getRegexPattern = (target: string): RegExp => {
    return new RegExp(target.toLowerCase(), "gi");
  };

  const onFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    fetchResponse(userInput);
  };

  const fetchResponse = async (prompt: string) => {
    const responseText = await getQueryResponse(prompt);
    responseText && setResponseText(responseText);
    if (!responseText) throw Error("Response Failed!");
  };

  return (
    <section className="text-center h-screen pt-4 lg:pt-6">
      <h1 className="text-2xl lg:text-4xl">
        {levels.length > 0 && levels[params.id].name}
      </h1>
      <Timer timeStatus={timerStatus} />
      <section className="w-full h-4/5 flex flex-col justify-center items-center gap-16">
        <ResponseDisplay message={responseText} highlights={[]} />
        <PlayerInputDisplay inputMessage={userInput} />
      </section>
      <form onSubmit={onFormSubmit} className="fixed bottom-3 w-screen">
        <div className="flex items-center justify-center gap-4 px-4">
          <input
            className="text-white h-8 text-1xl lg:text-3xl lg:h-16 px-4 rounded-full flex-grow"
            type="text"
            onChange={(e) => setUserInput(e.target.value)}
          />
          <button type="submit" className="text-xl lg:text-3xl">
            <AiOutlineSend />
          </button>
        </div>
      </form>
    </section>
  );
}
