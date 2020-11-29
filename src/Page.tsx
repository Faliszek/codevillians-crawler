import { Loader } from "react-feather";
export function Page(props: any) {
  return (
    <div className="rounded-lg bg-white p-8 shadow-md border border-gray-100">
      <h1 className="text-2xl mb-8 flex items-center">
        {props.title}{" "}
        {props.loading ? (
          <Loader className="animate-spin text-blue-400 ml-4" />
        ) : null}
      </h1>

      <div className={`flex pb-4 ${props.className}`}>{props.children}</div>
    </div>
  );
}
