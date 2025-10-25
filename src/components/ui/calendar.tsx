import * as React from "react"

const Calendar = ({ mode, selected, onSelect, ...props }: any) => {
  return (
    <div className="p-3">
      <input
        type="date"
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        value={selected ? selected.toISOString().split('T')[0] : ''}
        onChange={(e) => onSelect && onSelect(new Date(e.target.value))}
      />
    </div>
  )
}

export { Calendar }