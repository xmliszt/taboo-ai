"use client";

import { FormEvent, useState, useEffect, useRef } from "react";
import Timer from "./(components)/Timer";
import { AiOutlineSend } from "react-icons/ai";
import { getQueryResponse } from "../../(services)/aiService";
import { getLevels } from "../../(services)/levelService";
import InputDisplay from "./(components)/InputDisplay";
import _ from "lodash";
import { Author } from "./(models)/Author.enum";
import ProgressBar from "./(components)/ProgressBar";
import { CONSTANTS } from "../../constants";
import { useTimer } from "use-timer";
import { useRouter } from "next/navigation";

export default function LevelPage({ params }: any) {
  const [userInput, setUserInput] = useState<string>("");
  const [responseText, setResponseText] = useState<string>("");
  const [words, setWords] = useState<string[]>([]);
  const [target, setTarget] = useState<string | null>(null);
  const [pickedWords, setPickedWords] = useState<string[]>([]);
  const [highlights, setHighlights] = useState<number[]>([]);
  const [userInputHighlights, setUserInputHighlights] = useState<number[]>([]);
  const [isValidInput, setIsValidInput] = useState<boolean>(true);
  const [currentProgress, setCurrentProgress] = useState<number>(1);
  const { time, start, pause, reset, status } = useTimer({
    initialTime: 0,
    timerType: "INCREMENTAL",
  });
  const inputTextField = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const fetchLevels = async () => {
    const levels = await getLevels();
    setWords(levels[params.id].words);
    generateNewTarget(levels[params.id].words);
    setCurrentProgress(1);
  };

  const generateNewTarget = (words: string[]) => {
    var target = words[Math.floor(Math.random() * words.length)];
    setTarget(target);
    let picked = [...pickedWords];
    picked.push(target);
    setPickedWords(picked);
    let unused = [...words];
    _.remove(unused, (s) => s === target);
    setWords(unused);
    reset();
    start();
    inputTextField.current?.focus();
  };
  const getRegexPattern = (target: string): RegExp => {
    return new RegExp(target.toLowerCase(), "gi");
  };

  const onFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    isValidInput && fetchResponse(userInput);
    // TODO: Show error message for user if input is invalid
  };

  const fetchResponse = async (prompt: string) => {
    // TODO: Loading animation
    const responseText = await getQueryResponse(prompt);
    responseText && setResponseText(responseText);
    if (!responseText) throw Error("Response Failed!");
  };

  const nextQuestion = () => {
    if (currentProgress === CONSTANTS.numberOfQuestionsPerGame) {
      // TODO: Game Ends, Go to result page
      router.push("/levels");
    }
    generateNewTarget(words);
    setCurrentProgress((progress) => progress + 1);
    setUserInput("");
  };

  // * At the start of the game
  useEffect(() => {
    fetchLevels();
  }, []);

  // * Compute higlight match
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

  // * Compute user input valiation match
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

  // * Next Question Condition
  useEffect(() => {
    highlights.length > 0 && nextQuestion();
  }, [highlights]);

  // * User input validation condition
  useEffect(() => {
    setIsValidInput(userInputHighlights.length == 0);
  }, [userInputHighlights]);

  return (
    <section className="text-center h-screen pt-4 lg:pt-6">
      <h1 className="text-2xl lg:text-4xl">
        Target Word: <span className="text-green-400">{target}</span>
      </h1>
      <Timer time={time} />
      <section className="w-full h-4/5 flex flex-col justify-center items-center gap-16 px-24">
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
      <section className="fixed bottom-3 w-screen flex flex-col gap-8">
        <ProgressBar
          current={currentProgress}
          total={CONSTANTS.numberOfQuestionsPerGame}
        />
        <form onSubmit={onFormSubmit} className="">
          <div className="flex items-center justify-center gap-4 px-4">
            <input
              className="text-black h-8 text-1xl lg:text-3xl lg:h-16 px-4 rounded-full flex-grow"
              ref={inputTextField}
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
            <button type="submit" className="text-xl lg:text-3xl">
              <AiOutlineSend />
            </button>
          </div>
        </form>
      </section>
    </section>
  );
}
