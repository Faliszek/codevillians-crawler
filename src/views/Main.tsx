import { Select } from "antd";

function handleChange(value: string) {
  console.log(`selected ${value}`);
}

export function Main() {
  return (
    <div className="rounded-lg bg-white p-8">
      <h1 className="text-2xl">Wyszukaj</h1>

      <div>
        <div className="flex">
          <div>1</div>
          <div>2</div>
        </div>
      </div>

      <Select
        mode="tags"
        style={{ width: "100%" }}
        placeholder="Tags Mode"
        onChange={handleChange}
      />
    </div>
  );
}
