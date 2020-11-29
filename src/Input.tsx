import { useEffect, useRef } from "react";

export const Input = (props: {
  onChange: (v: string) => void;
  value: string;
  placeholder?: string;
  onEnter: () => void;
}) => {
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
      onKeyDown={(e) =>
        //@ts-ignore
        e.code === "Enter" ? props.onEnter() : null
      }
      value={props.value}
      className="rounded-md border px-4 py-2 flex-1 items-center"
      placeholder={props.placeholder || "Wprowadź frazę do wyszukiwania"}
      onChange={(e) => {
        props.onChange(e.target.value);
      }}
    />
  );
};
