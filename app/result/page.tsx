"use client";

import { useState, useEffect, useRef } from "react";
import ILevel from "../levels/(models)/level.interface";
import IScore from "../level/[id]/(models)/Score.interface";
import { getScoresCache, getLevelCache } from "../(caching)/cache";
import { MdShare } from "react-icons/md";
import html2canvas from "html2canvas";
import BackButton from "../(components)/BackButton";

export default function ResultPage() {
  const [scores, setScores] = useState<IScore[]>([]);
  const [level, setLevel] = useState<ILevel>();
  const [total, setTotal] = useState<number>(0);
  const screenshotRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const scores = getScoresCache();
    const level = getLevelCache();
    scores && setScores(scores);
    level && setLevel(level);
    var total = 0;
    for (let score of scores ?? []) {
      total += score.completion;
    }
    setTotal(total);
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

  const headers = ["Index", "Your Question", "AI's Response", "Time Taken"];
  return (
    <>
      <BackButton href="/levels" />
      <section ref={screenshotRef} className="text-center p-10">
        <h1 className="text-5xl text-white-faded">
          Topic: <span className="text-white">{level?.name}</span>
        </h1>
        <section className="relative mt-8">
          <table className=" w-full bg-white text-black rounded-lg table-fixed">
            <thead className="font-semibold uppercase">
              <tr>
                {headers.map((header, idx) => (
                  <th
                    className={`px-4 pb-2 pt-4 font-semibold text-left text-2xl ${
                      idx == 0 && "w-24"
                    } ${idx == 3 && "w-44"}`}
                    key={header}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y text-left text-xl text-gray">
              {scores.map((score) => (
                <tr key={score.id}>
                  <td className="p-3 font-medium w-24">{score.id}</td>
                  <td className="p-3 font-medium">{score.question}</td>
                  <td className="p-3 font-medium">{score.response}</td>
                  <td className="p-3 font-medium">
                    {score.completion} seconds
                  </td>
                </tr>
              ))}
              <tr>
                <td
                  colSpan={3}
                  className="px-3 pt-4 pb-8 border-collapse font-extrabold"
                >
                  Total Time Taken
                </td>
                <td className="px-3 pt-4 pb-8 font-extrabold">
                  {total} seconds
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </section>
      <button
        id="share"
        className="text-2xl fixed top-10 right-10 hover:opacity-50 transition-all ease-in-out"
        onClick={share}
      >
        <MdShare />
      </button>
    </>
  );
}
