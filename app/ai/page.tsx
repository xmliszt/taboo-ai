"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { getCreativeLevel } from "../(services)/aiService";
import { CONSTANTS } from "../constants";
import { useRouter } from "next/navigation";
import { cacheLevel } from "../(caching)/cache";
import BackButton from "../(components)/BackButton";
import Loading from "../(components)/Loading";

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
      <Loading isLoading={isLoading} message="Asking AI for taboo words..." />
      <section
        className={`w-full h-screen flex justify-center items-center transition-colors ease-in-out ${
          isValid || somethingWrong ? "" : "bg-red"
        }`}
      >
        <BackButton href="/" />
        <form onSubmit={submitForm}>
          <div className="flex flex-col gap-6 justify-center items-center">
            <label
              className="text-3xl lg:text-5xl transition-all ease-in-out"
              htmlFor="topicInput"
            >
              {somethingWrong
                ? "Taboo.AI went for a toilet break. Please try again!"
                : isValid
                ? "Enter A Topic"
                : "Topic cannot be blank!"}
            </label>
            <div className="flex flex-row gap-4">
              <input
                autoFocus
                id="topicInput"
                type="text"
                value={topic}
                onChange={onInputChange}
                placeholder="Enter A Topic"
                maxLength={50}
                className="text-gray h-8 text-1xl lg:text-3xl lg:h-16 px-4 rounded-full flex-grow"
              />
              <select
                name="diffculty"
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(Number(e.target.value))}
                className="form-select appearance-none
              h-8
              px-4
              lg:h-16
              text-center
              text-1xl
              lg:text-3xl
              bg-white text-black bg-clip-padding bg-no-repeat
              border-4 border-white
              rounded-full
              transition
              ease-in-out
              hover:bg-black
              hover:text-white
              hover:border-gray
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
