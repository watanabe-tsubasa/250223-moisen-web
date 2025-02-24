/* eslint-disable react/prop-types */
import { Input } from "~/components/ui/input";

export function Toolbar({ table }) {
  return (
    <div className="flex items-center py-4">
      <Input
        placeholder="Filter ..."
        value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
        onChange={(event) => table.getColumn("email")?.setFilterValue(event.target.value)}
        className="max-w-sm"
      />
    </div>
  );
}
