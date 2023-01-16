"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { getCreativeLevel } from "../(services)/aiService";
import { CONSTANTS } from "../constants";
import { useRouter } from "next/navigation";
import { cacheLevel } from "../(caching)/cache";
import BackButton from "../(components)/BackButton";
import LoadingMask from "../(components)/Loading";

export default function AiPage() {
  const [topic, setTopic] = useState<string>("");
  const [difficulty, setDifficulty] = useState<number>(1);
  const [isValid, setIsValid] = useState<boolean>(true);
  const [somethingWrong, setSomethingWrong] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const submitForm = async (event: FormEvent) => {
    event.preventDefault();
    setIsValid(topic.length > 0);
    if (topic.length > 0) {
      setIsLoading(true);
      const level = await getCreativeLevel(topic, difficulty);
      setIsLoading(false);
      if (level.words.length < CONSTANTS.numberOfQuestionsPerGame) {
        return setSomethingWrong(true);
      }
      cacheLevel(level);
      router.push("/level/" + level.id);
    }
  };

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTopic(event.target.value);
    setIsValid(event.target.value.length > 0);
  };

  return (
    <>
      <LoadingMask
        isLoading={isLoading}
        message="Asking AI for taboo words..."
      />
      <section
        className={`w-full h-screen flex justify-center items-center transition-colors ease-in-out ${
          isValid || somethingWrong ? "" : "bg-red dark:bg-neon-red-light"
        }`}
      >
        <BackButton href="/" />
        <form onSubmit={submitForm}>
          <div className="flex flex-col gap-6 justify-center items-center">
            <label
              className="text-2xl lg:text-5xl text-center transition-all ease-in-out"
              htmlFor="topicInput"
            >
              {somethingWrong
                ? "Taboo.AI went for a toilet break. Please try again!"
                : isValid
                ? "Enter A Topic"
                : "Topic cannot be blank!"}
            </label>
            <div className="flex flex-col xs:flex-row md:flex-row lg:flex-row gap-4">
              <input
                autoFocus
                id="topicInput"
                type="text"
                value={topic}
                onChange={onInputChange}
                placeholder="Enter A Topic"
                maxLength={50}
                className="text-gray dark:text-neon-white dark:bg-neon-gray focus:dark:outline-neon-green transition-colors ease-in-out h-12 text-1xl lg:text-3xl lg:h-16 px-4 rounded-full flex-grow"
              />
              <select
                name="difficulty"
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(Number(e.target.value))}
                className="form-select appearance-none
              h-12
              px-4
              lg:h-16
              text-center
              text-1xl
              lg:text-3xl
              bg-white text-black bg-clip-padding bg-no-repeat
              dark:bg-neon-black dark:text-neon-white
              border-4 border-white
              rounded-full
              transition
              ease-in-out
              hover:bg-black
              hover:text-white
              hover:border-gray
              hover:dark:bg-neon-gray
              hover:dark:text-neon-white
              hover:dark:border-neon-red
              hover:cursor-pointer
              focus:outline-none"
              >
                <option value={1}>Easy</option>
                <option value={2}>Medium</option>
                <option value={3}>Hard</option>
              </select>
            </div>
          </div>
        </form>
      </section>
    </>
  );
}
