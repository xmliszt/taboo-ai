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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LevelPage() {
  const [userInput, setUserInput] = useState<string>("");
  const [responseText, setResponseText] = useState<string>("");
  const [words, setWords] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<number>(0);
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
  const [isInputConfirmed, setIsInputConfirmed] = useState<boolean>(false);
  const [inputShouldFadeOut, setInputShouldFadeOut] = useState<boolean>(false);
  const [responseShouldFadeOut, setResponseShouldFadeOut] =
    useState<boolean>(false);
  const { time, start, pause, reset, status } = useTimer({
    initialTime: 0,
    timerType: "INCREMENTAL",
  });
  const inputTextField = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const generateNewTarget = (words: string[]) => {
    reset();
    start();
    var _target = words[Math.floor(Math.random() * words.length)];
    setTarget(_target);
    let picked = [...pickedWords];
    picked.push(_target);
    setPickedWords(picked);
    let unused = [...words];
    _.remove(unused, (s) => s === _target);
    setWords(unused);
    inputTextField.current?.focus();
  };

  const getRegexPattern = (target: string): RegExp => {
    const magicSeparator = "\\W*";
    const groupRegexString = `(${target.split("").join(magicSeparator)})`;
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
    inputTextField.current?.blur();
    setIsInputConfirmed(true); // Input ping animation
    isValidInput && userInput.length > 0 && fetchResponse(userInput);
  };

  const fetchResponse = async (prompt: string) => {
    setIsLoading(true);
    pause();
    // ! Make sure response fade out completely!
    setTimeout(async () => {
      const responseText = await getQueryResponse(prompt);
      if (!responseText) throw Error("Response Failed!");
      start();
      setIsLoading(false);
      setInputShouldFadeOut(true); // Input start fading out
      setIsInputConfirmed(false); // Reset input ping animation
      setResponseShouldFadeOut(true); // Fade out current response if any
      // Wait for input fade out completely, then show response
      setTimeout(() => {
        responseText && setResponseText(responseText);
        setResponseShouldFadeOut(false); // Let new response fade in
        setIsResponseFaded(false);
        setInputShouldFadeOut(false); // Reset input fade animation
        setUserInput(""); // Clear user input
        inputTextField.current?.focus();
      }, 1000);
    }, 1000);
  };

  const nextQuestion = () => {
    const isLastRound = currentProgress === CONSTANTS.numberOfQuestionsPerGame;
    setIsSuccess(true);
    toast.success(
      `Congratulations! ${
        isLastRound
          ? "You have finished the game!"
          : "Here comes the next word!"
      }`
    );
    cacheScore({
      id: currentProgress,
      target: target ?? "",
      question: userInput,
      response: responseText,
      difficulty: difficulty,
      completion: time,
    });
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
      setDifficulty(level.difficulty);
      setWords(level.words);
      generateNewTarget(level.words);
      setCurrentProgress(1);
    } else {
      throw Error("Unable to fetch level!");
    }
  }, []);

  // * Compute highlight match
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
      {/* <Loading isLoading={isLoading} message="Talking to AI..." /> */}
      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <BackButton />
      <section className="fixed w-full h-16 lg:h-32 z-10 top-0 drop-shadow-lg">
        <div className="z-10 absolute left-0 w-16 h-full gradient-right"></div>
        <h1 className="absolute left-10 right-10 h-full px-5 flex-grow text-center bg-black lg:py-8 py-4 text-xl lg:text-6xl text-white-faded whitespace-nowrap overflow-x-scroll scrollbar-hide">
          TABOO:{" "}
          <span className="font-extrabold text-white whitespace-nowrap">
            {target}
          </span>
        </h1>
        <div className="z-10 absolute right-0 h-full w-16 gradient-left"></div>
      </section>
      <Timer time={time} />
      <section
        className={`flex flex-col gap-4 text-center h-full w-full transition-colors ${
          isValidInput ? "" : "bg-red"
        } ${isSuccess && "bg-green"}`}
      >
        <section className="h-16 lg:h-32 w-full relative"></section>
        <section className="relative flex-grow w-full flex flex-col gap-4 justify-center items-center px-12 lg:px-24">
          {responseText.length > 0 && (
            <InputDisplay
              target={target}
              message={responseText}
              highlights={highlights}
              author={Author.AI}
              faded={isResponseFaded}
              inputConfirmed={false}
              shouldFadeOut={responseShouldFadeOut}
              shouldFadeIn={!responseShouldFadeOut}
            />
          )}
          <InputDisplay
            target={target}
            message={userInput}
            highlights={userInputHighlights}
            author={Author.Me}
            faded={false}
            inputConfirmed={isInputConfirmed}
            shouldFadeOut={inputShouldFadeOut}
            shouldFadeIn={!inputShouldFadeOut}
          />
        </section>
        <section className="relative w-full h-24 lg:h-48 flex flex-col gap-4 lg:gap-8">
          <ProgressBar
            current={currentProgress}
            total={CONSTANTS.numberOfQuestionsPerGame}
          />
          <form onSubmit={onFormSubmit}>
            <div className="flex items-center justify-center gap-4 px-4">
              <input
                disabled={isLoading}
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
                disabled={isEmptyInput || !isValidInput || isLoading}
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
