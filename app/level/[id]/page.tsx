"use client";

import { FormEvent, useState, useEffect, useRef, ChangeEvent } from "react";
import Timer from "./(components)/Timer";
import { AiOutlineSend } from "react-icons/ai";
import { getQueryResponse } from "../../(services)/aiService";
import InputDisplay from "./(components)/InputDisplay";
import _ from "lodash";
import { Author } from "./(models)/Author.enum";
import ProgressBar from "./(components)/ProgressBar";
import { CONSTANTS } from "../../constants";
import { useTimer } from "use-timer";
import { useRouter } from "next/navigation";
import { cacheScore, clearScores, getLevelCache } from "../../(caching)/cache";
import { Highlight } from "./(models)/Chat.interface";
import BackButton from "../../(components)/BackButton";
import Loading from "../../(components)/Loading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LevelPage() {
  const [userInput, setUserInput] = useState<string>("");
  const [responseText, setResponseText] = useState<string>("");
  const [words, setWords] = useState<string[]>([]);
  const [target, setTarget] = useState<string | null>(null);
  const [pickedWords, setPickedWords] = useState<string[]>([]);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [userInputHighlights, setUserInputHighlights] = useState<Highlight[]>(
    []
  );
  const [isValidInput, setIsValidInput] = useState<boolean>(true);
  const [isEmptyInput, setIsEmptyInput] = useState<boolean>(true);
  const [currentProgress, setCurrentProgress] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isResponseFaded, setIsResponseFaded] = useState<boolean>(false);
  const { time, start, pause, reset, status } = useTimer({
    initialTime: 0,
    timerType: "INCREMENTAL",
  });
  const inputTextField = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const generateNewTarget = (words: string[]) => {
    cacheScore({
      id: currentProgress,
      question: userInput,
      response: responseText,
      completion: time,
    });
    reset();
    start();
    var target = words[Math.floor(Math.random() * words.length)];
    setTarget(target);
    let picked = [...pickedWords];
    picked.push(target);
    setPickedWords(picked);
    let unused = [...words];
    _.remove(unused, (s) => s === target);
    setWords(unused);
    inputTextField.current?.focus();
  };

  const getRegexPattern = (target: string): RegExp => {
    const magicSeperator = "\\W*";
    const groupRegexString = `(${target.split("").join(magicSeperator)})`;
    return new RegExp(groupRegexString, "gi");
  };

  const generateHighlights = (
    target: string,
    str: string,
    isFullMatch: boolean
  ): Highlight[] => {
    var parts = isFullMatch ? [target] : target.split(" ");
    var highlights: Highlight[] = [];
    for (let part of parts) {
      let regex = getRegexPattern(part);
      var result;
      while ((result = regex.exec(str)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (result.index === regex.lastIndex) {
          regex.lastIndex++;
        }
        const startIndex = result.index;
        const endIndex = regex.lastIndex;
        highlights.push({ start: startIndex, end: endIndex });
      }
    }
    return highlights;
  };

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
    setIsEmptyInput(event.target.value.length <= 0);
  };

  const onFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    isValidInput && fetchResponse(userInput);
  };

  const fetchResponse = async (prompt: string) => {
    setIsLoading(true);
    const responseText = await getQueryResponse(prompt);
    setIsLoading(false);
    responseText && setResponseText(responseText);
    setIsResponseFaded(false);
    if (!responseText) throw Error("Response Failed!");
  };

  const nextQuestion = () => {
    const isLastRound = currentProgress === CONSTANTS.numberOfQuestionsPerGame;
    setIsSuccess(true);
    toast.success(
      `Congratulations! ${
        isLastRound ? "You have finished the game!" : "Next word is..."
      }`
    );
    setTimeout(() => {
      if (isLastRound) {
        router.push("/result");
      } else {
        generateNewTarget(words);
        setCurrentProgress((progress) => progress + 1);
        setUserInput("");
        setIsSuccess(false);
        setIsResponseFaded(true);
      }
    }, 3000);
  };

  // * At the start of the game
  useEffect(() => {
    clearScores();
    let level = getLevelCache();
    if (level !== null) {
      setWords(level.words);
      generateNewTarget(level.words);
      setCurrentProgress(1);
    } else {
      throw Error("Unable to fetch level!");
    }
  }, []);

  // * Compute higlight match
  useEffect(() => {
    if (target !== null) {
      let highlights = generateHighlights(target, responseText, true);
      setHighlights(highlights);
    }
  }, [responseText]);

  // * Compute user input validation match
  useEffect(() => {
    if (target !== null) {
      let highlights = generateHighlights(target, userInput, false);
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
    <>
      <Loading isLoading={isLoading} message="Talking to AI..." />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <section
        className={`text-center h-screen pt-4 lg:pt-6 transition-colors overflow-hidden ${
          isValidInput ? "" : "bg-red"
        } ${isSuccess && "bg-green"}`}
      >
        <BackButton />
        <h1 className="text-xl lg:text-6xl drop-shadow-lg text-white-faded">
          TABOO: <span className="font-extrabold text-white">{target}</span>
        </h1>
        <Timer time={time} />
        <section className="w-full h-4/5 flex flex-col items-center px-12 pt-6 lg:px-24 lg:pt-12">
          <span className="w-full h-1 bg-white rounded-full"></span>
          <InputDisplay
            target={target}
            message={responseText}
            highlights={highlights}
            author={Author.AI}
            faded={isResponseFaded}
          />
          <span className="w-full h-1 bg-white rounded-full"></span>
          <InputDisplay
            target={target}
            message={userInput}
            highlights={userInputHighlights}
            author={Author.Me}
            faded={false}
          />
        </section>
        <section className="fixed bottom-6 w-screen flex flex-col gap-4 lg:gap-8">
          <ProgressBar
            current={currentProgress}
            total={CONSTANTS.numberOfQuestionsPerGame}
          />
          <form onSubmit={onFormSubmit}>
            <div className="flex items-center justify-center gap-4 px-4">
              <input
                autoFocus
                placeholder="Start your conversation with AI here..."
                className={`text-white bg-black border-2 border-white outline-black focus:outline-white  lg:focus:border-8 h-8 ease-in-out transition-all text-base lg:text-2xl lg:h-16 px-4 lg:px-6 rounded-full flex-grow ${
                  !isValidInput ? "bg-red text-gray" : ""
                }`}
                ref={inputTextField}
                type="text"
                value={userInput}
                onChange={onInputChange}
                maxLength={100}
              />
              <button
                id="submit"
                disabled={isEmptyInput || !isValidInput}
                type="submit"
                className={`text-xl lg:text-3xl transition-opacity ease-in-out ${
                  isEmptyInput || !isValidInput ? "opacity-50" : ""
                }`}
              >
                <AiOutlineSend />
              </button>
            </div>
          </form>
        </section>
      </section>
    </>
  );
}
