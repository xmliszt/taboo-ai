"use client";

import { FormEvent, useState, useEffect } from "react";
import Timer from "./(components)/Timer";
import { Status } from "use-timer/lib/types";
import { AiOutlineSend } from "react-icons/ai";
import { getQueryResponse } from "../../(services)/aiService";
import { getLevels } from "../../(services)/levelService";
import ILevel from "../../levels/(models)/level.interface";
import InputDisplay from "./(components)/InputDisplay";
import _ from "lodash";
import { Author } from "./(models)/Author.enum";

export default function LevelPage({ params }: any) {
  const [userInput, setUserInput] = useState<string>("");
  const [responseText, setResponseText] = useState<string>("");
  const [timerStatus, setTimerStatus] = useState<Status>("RUNNING");
  const [levels, setLevels] = useState<ILevel[]>([]);
  const [words, setWords] = useState<string[]>([]);
  const [target, setTarget] = useState<string | null>(null);
  const [pickedWords, setPickedWords] = useState<string[]>([]);
  const [highlights, setHighlights] = useState<number[]>([]);
  const [userInputHighlights, setUserInputHighlights] = useState<number[]>([]);
  const [isValidInput, setIsValidInput] = useState<boolean>(true);

  const fetchLevels = async () => {
    const levels = await getLevels();
    setLevels(levels);
    setWords(levels[params.id].words);
    generateNewTarget(levels[params.id].words);
  };

  const generateNewTarget = (words: string[]) => {
    var target = words[Math.floor(Math.random() * words.length)];
    setTarget(target);
    let picked = [...pickedWords];
    picked.push(target);
    setPickedWords(picked);
    let unused = [...words];
    _.remove(unused, target);
    setWords(unused);
    console.log(target, words, pickedWords);
  };
  const getRegexPattern = (target: string): RegExp => {
    return new RegExp(target.toLowerCase(), "gi");
  };

  const onFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    isValidInput && fetchResponse(userInput);
  };

  const fetchResponse = async (prompt: string) => {
    const responseText = await getQueryResponse(prompt);
    responseText && setResponseText(responseText);
    if (!responseText) throw Error("Response Failed!");
  };

  useEffect(() => {
    fetchLevels();
  }, []);

  useEffect(() => {
    if (target !== null) {
      let regex = getRegexPattern(target);
      var result;
      var highlights: number[] = [];
      while ((result = regex.exec(responseText))) {
        let startIndex = result.index;
        highlights.push(startIndex);
      }
      setHighlights(highlights);
    }
  }, [responseText]);

  useEffect(() => {
    if (target !== null) {
      let regex = getRegexPattern(target);
      var result;
      var highlights: number[] = [];
      while ((result = regex.exec(userInput))) {
        let startIndex = result.index;
        highlights.push(startIndex);
      }
      setUserInputHighlights(highlights);
    }
  }, [userInput]);

  useEffect(() => {
    setIsValidInput(userInputHighlights.length == 0);
  }, [userInputHighlights]);

  return (
    <section className="text-center h-screen pt-4 lg:pt-6">
      <h1 className="text-2xl lg:text-4xl">
        Target Word: <span className="text-green-400">{target}</span>
      </h1>
      <Timer timeStatus={timerStatus} />
      <section className="w-full h-4/5 flex flex-col justify-center items-center gap-16">
        <InputDisplay
          target={target}
          message={responseText}
          highlights={highlights}
          author={Author.AI}
        />
        <InputDisplay
          target={target}
          message={userInput}
          highlights={userInputHighlights}
          author={Author.Me}
        />
      </section>
      <form onSubmit={onFormSubmit} className="fixed bottom-3 w-screen">
        <div className="flex items-center justify-center gap-4 px-4">
          <input
            className="text-black h-8 text-1xl lg:text-3xl lg:h-16 px-4 rounded-full flex-grow"
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
