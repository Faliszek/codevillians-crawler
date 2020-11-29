import React, { useState } from "react";
import { Page } from "../Page";
import { Loader } from "react-feather";
import { gql, useQuery } from "@apollo/client";
import { Switch } from "antd";

const GET_TABLE = gql`
  query EntityTable(
    $anyJobId: [String!]
    $entityId: String
    $jobDepth: Int
    $offset: Int!
    $limit: Int!
  ) {
    entityTable(
      anyJobId: $anyJobId
      entityId: $entityId
      jobDepth: $jobDepth
      offset: $offset
      limit: $limit
    ) {
      rows {
        startJobId
        startEntityValue # slowo klucz
        foundEntityId # rodzaj
        foundEntityValue # id
        counter # wystąpieni
      }
      count
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

export function History() {
  const { loading, data, startPolling, stopPolling } = useQuery(GET_TABLE, {
    pollInterval: 5000,
    variables: {
      anyJobId: null,
      entityId: null,
      jobDepth: null,
      offset: 0,
      limit: 50,
    },
  });

  React.useEffect(() => {
    startPolling(5000);
    return () => stopPolling();
    //eslint-disable-next-line
  }, []);

  //   const [email, setEmail] = useState(true);
  //   const [phone, setPhone] = useState(true);
  //   const [bitcoin, setBitcoin] = useState(true);
  //   const [ssn, setSsn] = useState(true);
  //   const [credit, setCredit] = useState(true);

  return (
    <Page title="Rezultaty" className="flex-col">
      {/* <div className="flex flex-1 justify-between pb-12">
        <div>
          <span className="mr-2">Email </span>
          <Switch checked={email} onChange={() => setEmail((v) => !v)} />
        </div>
        <div>
          <span className="mr-2"> Numer telefonu </span>{" "}
          <Switch checked={phone} onChange={() => setPhone((v) => !v)} />
        </div>
        <div>
          <span className="mr-2">Bitcoin </span>
          <Switch checked={bitcoin} onChange={() => setBitcoin((v) => !v)} />
        </div>
        <div>
          <span className="mr-2">SSN</span>{" "}
          <Switch checked={ssn} onChange={() => setSsn((v) => !v)} />
        </div>

        <div>
          <span className="mr-2">Karta kredytowa</span>
          <Switch checked={credit} onChange={() => setCredit((v) => !v)} />
        </div>
      </div> */}

      <div>
        {loading && (
          <div>
            <Loader size={36} className="animate-spin text-blue-400" />
          </div>
        )}
        <div className="py-4">
          <div>
            <table className="w-full  table-fixed border">
              <thead>
                <tr className="text-lg">
                  <th className="w-1/4 text-center py-4 px-2 border-b text-gray-700">
                    Słowo kluczowe
                  </th>

                  <th className="w-1/5 text-center  py-4 px-2 border-b text-gray-700">
                    Identyifkator
                  </th>
                  <th className="w-1/5 text-center  py-4 px-2 border-b text-gray-700">
                    Rodzaj
                  </th>
                  <th className="w-1/6 text-center  py-4 px-2 border-b text-gray-700">
                    Wystąpienia
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.entityTable?.rows?.length === 0 && !loading && (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center text-lg text-gray-500 py-4 px-2"
                    >
                      Brak danych
                    </td>
                  </tr>
                )}
                {data?.entityTable?.rows?.map((e: Entity, index: number) => {
                  const id = e.foundEntityValue + ":" + e.startJobId;
                  const bg = index % 2 === 0 ? "bg-gray-100" : "bg-white";
                  return (
                    <tr key={id}>
                      <td
                        className={` ${bg} text-center py-4 px-2  border-b text-gray-700`}
                      >
                        {e?.startEntityValue}
                      </td>
                      <td
                        className={` ${bg} text-center py-4 px-2 border-b text-gray-700`}
                      >
                        {e?.foundEntityValue}
                      </td>
                      <td
                        className={` ${bg} text-center py-4 px-2  border-b text-gray-700`}
                      >
                        {e?.foundEntityId}
                      </td>
                      <td
                        className={` ${bg} text-center py-4 px-2  border-b text-gray-700`}
                      >
                        {e?.counter}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Page>
  );
}
