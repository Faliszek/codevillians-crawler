import { Loader } from "react-feather";

export function ButtonSpinner(props: { loading: boolean }) {
  return props.loading ? (
    <div className="left-0 top-0 absolute w-full h-full flex items-center justify-center bg-white opacity-75">
      <Loader size={24} className="text-blue-400 animate-spin" />
    </div>
  ) : null;
}
