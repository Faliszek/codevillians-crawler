import { useState } from "react";
import { List, Share2 } from "react-feather";

export function Results() {
  const [tab, setTab] = useState("list");

  return (
    <div className="rounded-lg bg-white p-8 shadow-md border border-gray-100">
      <h1 className="text-2xl">Wyniki wyszukiwania</h1>
      <div className="flex py-4">
        <div
          className={`cursor-pointer text-xl px-4 mb-4 w-48 flex items-center justify-center ${
            tab === "list" ? "text-blue-400" : "text-gray-600"
          }`}
          onClick={() => setTab("list")}
        >
          <List />

          <span className="ml-8">Tabela</span>
        </div>
        <div
          className={` border-l cursor-pointer px-4 mb-4 text-xl w-48 flex items-center justify-center ${
            tab === "graph" ? "text-blue-400" : "text-gray-600"
          }`}
          onClick={() => setTab("graph")}
        >
          <Share2 />
          <span className="ml-8">Graf</span>
        </div>
      </div>

      <div className="">
        {tab === "list" && <div>Tabela nested</div>}

        {tab === "graph" && <div>Graf</div>}
      </div>
    </div>
  );
}
