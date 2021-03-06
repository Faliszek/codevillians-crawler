import React, { useState } from "react";
import { Page } from "../Page";
import { List, Loader, Share2, ArrowRight } from "react-feather";
import { gql, useQuery, useMutation } from "@apollo/client";
import { ButtonSpinner } from "../ButtonSpinner";
import { Switch, notification } from "antd";

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

const CRAWLING = gql`
  mutation Crawl(
    $parentJobId: String!
    $entityValues: [String!]!
    $iterations: Int!
    $emailEntityEnabled: Boolean!
    $phoneNumberEntityEnabled: Boolean!
    $bitcoinAddressEnabled: Boolean!
    $ssnNumberEnabled: Boolean!
    $creditCardEnabled: Boolean!
  ) {
    crawlChoosenEntities(
      parentJobId: $parentJobId
      entityValues: $entityValues
      iterations: $iterations
      emailEntityEnabled: $emailEntityEnabled
      phoneNumberEntityEnabled: $phoneNumberEntityEnabled
      bitcoinAddressEnabled: $bitcoinAddressEnabled
      ssnNumberEnabled: $ssnNumberEnabled
      creditCardEnabled: $creditCardEnabled
    )
  }
`;

type Entity = {
  startJobId: string;
  startEntityValue: string;
  foundEntityId: string;
  foundEntityValue: string;
  counter: number;
};

// entityTable(entityId: String, jobDepth: Int, offset: Int!, limit: Int!): [TableRow!]!

export function Results() {
  const [tab, setTab] = useState("list");
  const [checked, setChecked] = useState<string[]>([]);

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

  const batches = checked.reduce((acc, curr) => {
    const [value, parentJobId] = curr.split(":");

    //@ts-ignore
    if (acc[parentJobId]) {
      //@ts-ignore
      return { ...acc, [parentJobId]: [...acc[parentJobId], value] };
    } else {
      return { ...acc, [parentJobId]: [value] };
    }
  }, {});

  const [crawl] = useMutation(CRAWLING);

  React.useEffect(() => {
    startPolling(5000);
    return () => stopPolling();
    //eslint-disable-next-line
  }, []);

  const [email, setEmail] = useState(true);
  const [phone, setPhone] = useState(true);
  const [bitcoin, setBitcoin] = useState(true);
  const [ssn, setSsn] = useState(true);
  const [credit, setCredit] = useState(true);

  return (
    <Page title="Wyniki wyszukiwania" loading={true} className="flex-col">
      <div className="flex flex-1 justify-between pb-12">
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
      </div>

      <div>
        <div className="flex justify-between pb-4 h-12">
          <div className="flex items-center">
            <div
              className={`cursor-pointer text-xl px-4 w-48 flex items-center justify-center ${
                tab === "list" ? "text-blue-400" : "text-gray-600"
              }`}
              onClick={() => setTab("list")}
            >
              <List />

              <span className="ml-8">Tabela</span>
            </div>
            <div
              className={` border-l cursor-pointer px-4 text-xl w-48 flex items-center justify-center ${
                tab === "graph" ? "text-blue-400" : "text-gray-600"
              }`}
              onClick={() => setTab("graph")}
            >
              <Share2 />
              <span className="ml-8">Graf</span>
            </div>
          </div>
          <div>
            {checked.length !== 0 ? (
              <button
                className="relative bg-blue-300 rounded-full px-6 py-2 text-white text-lg flex items-center font-medium shadow-md hover:bg-blue-400 transition-colors focus:ring-2 focus:ring-blue-600"
                onClick={() => {
                  for (const [key, value] of Object.entries(batches)) {
                    crawl({
                      variables: {
                        //@ts-ignore
                        parentJobId: key,
                        entityValues: value,
                        iterations: 2,
                        emailEntityEnabled: email,
                        phoneNumberEntityEnabled: phone,
                        bitcoinAddressEnabled: bitcoin,

                        ssnNumberEnabled: ssn,
                        creditCardEnabled: credit,
                      },
                    }).catch(() =>
                      notification.error({
                        message: "Wystąpił nieoczekiwany błąd",
                      })
                    );
                  }
                }}
              >
                <span className="pr-4">({checked.length}) Wyszukaj</span>
                <ArrowRight />
                <ButtonSpinner loading={loading} />
              </button>
            ) : null}
          </div>
        </div>
        {loading && (
          <div>
            <Loader size={36} className="animate-spin text-blue-400" />
          </div>
        )}
        <div className="py-4">
          {tab === "list" && (
            <div>
              <table className="w-full  table-fixed border">
                <thead>
                  <tr className="text-lg">
                    <th className="w-6 border-b text-gray-700"></th>
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
                          className={` ${bg} text-center py-4 px-2 border-b text-gray-700`}
                        >
                          <div className="flex items-center justify-center border-bottom">
                            <input
                              type="checkbox"
                              className="w-8 h-8"
                              checked={checked.includes(id)}
                              onChange={() =>
                                setChecked((checked: string[]) =>
                                  checked.includes(id)
                                    ? checked.filter((c: string) => c !== id)
                                    : checked.concat(id)
                                )
                              }
                            />
                          </div>
                        </td>
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
          )}

          {tab === "graph" && <div>Graf</div>}
        </div>
        {/* <div className="flex justify-center">
          <Pagination size="small" />
        </div> */}
      </div>
    </Page>
  );
}
