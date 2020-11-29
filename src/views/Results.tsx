import { useState } from "react";
import { Page } from "../Page";
import { List, Loader, Share2 } from "react-feather";
import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";

const GET_TABLE = gql`
  query EntityTable(
    $entityId: String!
    $jobDepth: Int
    $offset: Int!
    $limit: Int!
  ) {
    entityTable(
      entityId: $entityId
      jobDepth: $jobDepth
      offset: $offset
      limit: $limit
    ) {
      startJobId
      startEntityValue # slowo klucz
      foundEntityId # rodzaj
      foundEntityValue # id
      counter # wystąpieni
    }
  }
`;

type Entity = {
  startJobId: string;
  startEntityValue: string;
  foundEntityId: string;
  foundEntityValue: string;
  counter: number;
};

type P = {
  jobId: string;
};
// entityTable(entityId: String, jobDepth: Int, offset: Int!, limit: Int!): [TableRow!]!

export function Results() {
  const [tab, setTab] = useState("list");
  const { jobId } = useParams<P>();

  const { loading, data } = useQuery(GET_TABLE, {
    variables: { entityId: null, jobDepth: null, offset: 0, limit: 1050 },
  });

  if (loading)
    return (
      <div>
        <Loader size={36} className="animate-spin text-blue-400" />
      </div>
    );

  return (
    <Page title="Wyniki wyszukiwania">
      <div>
        <div className="flex flex-col">
          <div className="flex">
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
        </div>
        <div className="py-4">
          {tab === "list" && (
            <div>
              <table className="w-full table-fixed  border">
                <tr className="text-lg">
                  <th className="w-1/4 text-center p-2">Słowo kluczowe</th>
                  <th className="w-1/4 text-center  p-2">Rodzaj</th>
                  <th className="w-1/4 text-center  p-2">Identyifkator</th>
                  <th className="w-1/4 text-center  p-2">Wystąpienia</th>
                </tr>
                <tbody>
                  {data?.entityTable?.map((e: Entity) => (
                    <tr>
                      <td>{e?.startEntityValue}</td>
                      <td>{e?.foundEntityValue}</td>
                      <td>{e?.foundEntityId}</td>
                      <td>{e?.counter}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "graph" && <div>Graf</div>}
        </div>
      </div>
    </Page>
  );
}
