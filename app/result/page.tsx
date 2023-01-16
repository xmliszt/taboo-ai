"use client";

import { useState, useEffect, useRef } from "react";
import ILevel from "../levels/(models)/level.interface";
import IScore from "../level/[id]/(models)/Score.interface";
import { getScoresCache, getLevelCache } from "../(caching)/cache";
import { MdShare } from "react-icons/md";
import html2canvas from "html2canvas";
import BackButton from "../(components)/BackButton";
import _ from "lodash";

export default function ResultPage() {
  const [scores, setScores] = useState<IScore[]>([]);
  const [level, setLevel] = useState<ILevel>();
  const [total, setTotal] = useState<number>(0);
  const [totalScore, setTotalScore] = useState<number>(0);
  const screenshotRef = useRef<HTMLTableElement>(null);

  useEffect(() => {
    const scores = getScoresCache();
    const level = getLevelCache();
    scores && setScores(scores);
    level && setLevel(level);
    var total = 0;
    var totalScore = 0;
    for (let score of scores ?? []) {
      total += score.completion;
      totalScore += _.round(
        score.difficulty * (1 / score.completion) * 1000,
        2
      );
    }
    setTotal(total);
    setTotalScore(totalScore);
  }, []);

  const share = () => {
    if (screenshotRef.current && level) {
      html2canvas(screenshotRef.current, {
        allowTaint: true,
        backgroundColor: "#4c453e",
      }).then((canvas) => {
        var link = document.createElement("a");
        link.href = canvas
          .toDataURL("image/jpeg")
          .replace("image/jpeg", "image/octet-stream");
        link.download = `taboo-ai_[${level.name}]_scores_${Date.now()}.jpg`;
        link.click();
      });
    }
  };

  const headers = [
    "Index",
    "Taboo Word",
    "Your Question",
    "AI's Response",
    "Difficulty",
    "Time Taken",
    "Score (Difficulty x (1/Time Taken) x 1000)",
  ];
  return (
    <>
      <BackButton href="/levels" />
      <h1 className="fixed top-4 w-full text-lg lg:text-3xl text-center">
        Scoreboard
      </h1>
      <section className="w-full max-h-[70%] h-[70%] text-center">
        <section className="font-mono relative my-16 lg:my-20 mx-4 rounded-xl lg:rounded-3xl h-full bg-white dark:bg-neon-black overflow-scroll scrollbar-hide border-4 border-white dark:border-neon-green">
          <table
            className="relative table-fixed min-w-[1024px]"
            ref={screenshotRef}
          >
            <thead className="sticky top-0 font-semibold uppercase bg-black text-white dark:bg-neon-gray dark:text-neon-white h-24 rounded-t-xl lg:rounded-t-3xl">
              <tr>
                {headers.map((header, idx) => (
                  <th
                    className={`px-4 pb-2 pt-4 font-semibold text-left text-xs lg:text-xl ${
                      idx == 2
                        ? "w-3/12"
                        : idx == 3
                        ? "w-3/12"
                        : idx == 6
                        ? "w-3/12"
                        : "w-1/12"
                    }`}
                    key={header}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y text-left text-xs lg:text-xl text-gray bg-white dark:text-neon-white dark:bg-neon-black">
              <tr className="sticky top-24 left-0 ">
                <td
                  colSpan={7}
                  className="w-full h-12 text-xl lg:text-3xl text-white-faded bg-white dark:text-neon-red dark:bg-neon-black"
                >
                  {" "}
                  Topic:{" "}
                  <span className="text-black dark:text-neon-white">
                    {level?.name}
                  </span>
                </td>
              </tr>
              {scores.map((score) => (
                <tr key={score.id}>
                  <td className="p-3 font-medium">{score.id}</td>
                  <td className="p-3 font-medium">{score.target}</td>
                  <td className="p-3 font-medium">{score.question}</td>
                  <td className="p-3 font-medium">{score.response}</td>
                  <td className="p-3 font-medium">{score.difficulty}</td>
                  <td className="p-3 font-medium">
                    {score.completion} seconds
                  </td>
                  <td className="p-3 font-medium">
                    {score.difficulty} x 1/{score.completion} (seconds) x 1000 ={" "}
                    {_.round(
                      score.difficulty * (1 / score.completion) * 1000,
                      2
                    )}
                  </td>
                </tr>
              ))}
              <tr>
                <td
                  colSpan={5}
                  className="px-3 pt-4 pb-8 border-collapse font-extrabold"
                >
                  Total Time Taken
                </td>
                <td colSpan={2} className="px-3 pt-4 pb-8 font-extrabold">
                  {total} seconds
                </td>
              </tr>
              <tr>
                <td
                  colSpan={6}
                  className="px-3 pt-4 pb-8 border-collapse font-extrabold"
                >
                  Total Score
                </td>
                <td className="px-3 pt-4 pb-8 font-extrabold">{totalScore}</td>
              </tr>
            </tbody>
          </table>
        </section>
      </section>
      <button
        id="share"
        className="text-xl lg:text-3xl fixed top-5 right-4 lg:right-10 hover:opacity-50 transition-all ease-in-out"
        onClick={share}
      >
        <MdShare />
      </button>
    </>
  );
}
