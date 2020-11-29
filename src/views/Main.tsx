import { Reducer, useReducer } from "react";
import { ArrowRight, MinusCircle, Plus } from "react-feather";
import { useHistory } from "react-router-dom";
import { Page } from "../Page";

import { gql, useMutation } from "@apollo/client";
import { ButtonSpinner } from "../ButtonSpinner";
import { Input } from "../Input";
import { notification } from "antd";

type Action =
  | { type: "addSearch" }
  | { type: "removeSearch"; payload: { id: number } }
  | { type: "setSearch"; payload: { id: number; value: string } };

type State = { searches: { id: number; value: string }[] };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "addSearch":
      return {
        ...state,
        searches: state.searches.concat({
          id: Date.now(),
          value: "",
        }),
      };

    case "setSearch":
      return {
        ...state,
        searches: state.searches.map((s) =>
          s.id === action.payload.id ? { ...s, value: action.payload.value } : s
        ),
      };

    case "removeSearch":
      return {
        ...state,
        searches: state.searches.filter((s) => s.id !== action.payload.id),
      };

    default:
      return state;
  }
}

const initialState: State = {
  searches: [{ id: 0, value: "" }],
};
type R = Reducer<State, Action>;

const GET_JOB = gql`
  mutation StartCrawling(
    $phrases: [String!]!
    $operator: String!
    $iterations: Int!
    $emailEntityEnabled: Boolean!
    $phoneNumberEntityEnabled: Boolean!
    $bitcoinAddressEnabled: Boolean!
    $ssnNumberEnabled: Boolean!
    $creditCardEnabled: Boolean!
    $selectedDomains: [String!]!
  ) {
    startCrawling(
      phrases: $phrases
      operator: $operator
      iterations: $iterations
      emailEntityEnabled: $emailEntityEnabled
      phoneNumberEntityEnabled: $phoneNumberEntityEnabled
      bitcoinAddressEnabled: $bitcoinAddressEnabled
      ssnNumberEnabled: $ssnNumberEnabled
      creditCardEnabled: $creditCardEnabled
      selectedDomains: $selectedDomains
    )
  }
`;

export const useSearch = () => useReducer<R>(reducer, initialState);

export function Main() {
  const [state, dispatch] = useSearch();
  const history = useHistory();
  const [addJob, { loading }] = useMutation(GET_JOB);
  const [domains, dispatch1] = useSearch();

  return (
    <Page title="Wyszukaj">
      <div className="w-full">
        <h2 className="text-xl">Słowa kluczowe</h2>
        <div className="w-full">
          <div className="flex flex-row w-full">
            <div className="flex  flex-col w-2/3">
              {state.searches.map((s) => (
                <div key={s.id} className="mb-4 flex items-center">
                  <Input
                    value={s.value}
                    onChange={(value) => {
                      dispatch({
                        type: "setSearch",
                        payload: { id: s.id, value },
                      });
                    }}
                    onEnter={() => dispatch({ type: "addSearch" })}
                  />
                  <div className="ml-2 w-6 h-6 flex items-center justify-center">
                    {s.id !== 0 && (
                      <MinusCircle
                        className="cursor-pointer"
                        color="red"
                        onClick={() =>
                          dispatch({
                            type: "removeSearch",
                            payload: { id: s.id },
                          })
                        }
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-1 items-center justify-center">
              <button
                onClick={() => dispatch({ type: "addSearch" })}
                className="px-6 py-2 rounded-full shadow-lg text-blue-400 font-extrabold flex items-center justify-center bg-blue-100 focus:ring-2 focus:ring-blue-600 my-2 hover:bg-blue-400 hover:text-white transition-colors "
              >
                <Plus size={24} />

                <span className="pl-4">Dodaj</span>
              </button>
            </div>
          </div>
        </div>
        <div className="h-12" />
        <h2 className="text-xl">Domeny</h2>
        <div className="w-full">
          <div className="flex flex-row w-full">
            <div className="flex  flex-col w-2/3">
              {domains.searches.map((s) => (
                <div key={s.id} className="mb-4 flex items-center">
                  <Input
                    value={s.value}
                    placeholder="Wprowadź domenę"
                    onChange={(value) => {
                      dispatch1({
                        type: "setSearch",
                        payload: { id: s.id, value },
                      });
                    }}
                    onEnter={() => dispatch1({ type: "addSearch" })}
                  />
                  <div className="ml-2 w-6 h-6 flex items-center justify-center">
                    {s.id !== 0 && (
                      <MinusCircle
                        className="cursor-pointer"
                        color="red"
                        onClick={() =>
                          dispatch1({
                            type: "removeSearch",
                            payload: { id: s.id },
                          })
                        }
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-1 items-center justify-center">
              <button
                onClick={() => dispatch1({ type: "addSearch" })}
                className="px-6 py-2 rounded-full shadow-lg text-blue-400 font-extrabold flex items-center justify-center bg-blue-100 focus:ring-2 focus:ring-blue-600 my-2 hover:bg-blue-400 hover:text-white transition-colors "
              >
                <Plus size={24} />

                <span className="pl-4">Dodaj</span>
              </button>
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <button
              className="relative bg-blue-300 rounded-full px-6 py-2 text-white text-lg flex items-center font-medium shadow-md hover:bg-blue-400 transition-colors   focus:ring-2 focus:ring-blue-600"
              onClick={() => {
                addJob({
                  variables: {
                    phrases: state.searches
                      .filter((s) => s.value !== "")
                      .map((s) => s.value),
                    operator: "AND",
                    iterations: 1,
                    emailEntityEnabled: true,
                    phoneNumberEntityEnabled: true,
                    bitcoinAddressEnabled: true,
                    ssnNumberEnabled: true,
                    creditCardEnabled: true,
                    selectedDomains: domains.searches
                      .filter((s) => s.value !== "")
                      .map((s) => s.value),
                  },
                })
                  .then((res) => {
                    history.push(`/results/${res?.data?.startCrawling}`);
                  })
                  .catch(() =>
                    notification.error({
                      message: "Wystąpił błąd",
                      description:
                        "Wystąpił nieoczekiwany błąd podczas próby komunikacji z serwerem",
                    })
                  );
              }}
            >
              <span className="pr-4">Wyszukaj</span>
              <ArrowRight />
              <ButtonSpinner loading={loading} />
            </button>
          </div>
        </div>
      </div>
    </Page>
  );
}
