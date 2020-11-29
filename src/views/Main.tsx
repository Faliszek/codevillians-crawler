import { Reducer, useEffect, useReducer, useRef } from "react";
import { ArrowRight, MinusCircle, Plus } from "react-feather";
import { useHistory } from "react-router-dom";

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

const Input = (props: { onChange: (v: string) => void; value: string }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref && ref.current) {
      //@ts-ignore
      ref.current.focus();
    }
  }, []);

  return (
    <input
      ref={ref}
      value={props.value}
      className="rounded-md border px-4 py-2 flex-1 items-center"
      placeholder="Wprowadź frazę do wyszukiwania"
      onChange={(e) => props.onChange(e.target.value)}
    />
  );
};

type R = Reducer<State, Action>;

export function Main() {
  const [state, dispatch] = useReducer<R>(reducer, initialState);
  const history = useHistory();

  return (
    <div className="rounded-lg bg-white p-8 shadow-md border border-gray-100">
      <h1 className="text-2xl">Wyszukaj</h1>

      <div className="flex pb-4">
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
              />
              <div className="ml-2 w-6 h-6 flex items-center justify-center">
                {s.id !== 0 && (
                  <MinusCircle
                    className="cursor-pointer"
                    color="red"
                    onClick={() =>
                      dispatch({ type: "removeSearch", payload: { id: s.id } })
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
            className="px-6 py-2 rounded-full shadow-lg text-blue-400 font-extrabold flex items-center justify-center bg-blue-100 outline-none my-2 hover:bg-blue-400 hover:text-white transition-colors"
          >
            <Plus size={24} />

            <span className="pl-4">Dodaj</span>
          </button>
        </div>
      </div>

      {/* <Select
        mode="tags"
        style={{ width: "100%" }}
        placeholder="Tags Mode"
        onChange={handleChange}
        className="rounded-lg"
        open={false}
      /> */}
      <button
        className="bg-blue-300 rounded-full px-6 py-2 text-white text-lg flex items-center font-medium shadow-md hover:bg-blue-400 transition-colors "
        onClick={() => history.push("/results")}
      >
        <span className="pr-4">Wyszukaj</span>
        <ArrowRight />
      </button>
    </div>
  );
}
