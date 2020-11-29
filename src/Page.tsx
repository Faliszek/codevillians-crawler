export function Page(props: any) {
  return (
    <div className="rounded-lg bg-white p-8 shadow-md border border-gray-100">
      <h1 className="text-2xl mb-8">{props.title}</h1>

      <div className="flex pb-4">{props.children}</div>
    </div>
  );
}
