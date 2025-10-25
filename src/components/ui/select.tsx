import * as React from "react"

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  onValueChange?: (value: string) => void
  defaultValue?: string
  value?: string
}

const Select = ({ children, onValueChange, value, defaultValue, onChange, ...props }: SelectProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onValueChange) {
      onValueChange(e.target.value)
    }
    if (onChange) {
      onChange(e)
    }
  }

  return (
    <select 
      {...props} 
      value={value} 
      defaultValue={defaultValue}
      onChange={handleChange}
    >
      {children}
    </select>
  )
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
      >
        {children}
      </button>
    )
  }
)
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = ({ placeholder }: { placeholder?: string }) => {
  return <span className="text-muted-foreground">{placeholder}</span>
}

const SelectContent = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

const SelectItem = ({ children, value, ...props }: { children: React.ReactNode; value: string } & React.OptionHTMLAttributes<HTMLOptionElement>) => {
  return <option value={value} {...props}>{children}</option>
}

const SelectGroup = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

const SelectLabel = ({ children }: { children: React.ReactNode }) => {
  return <optgroup label={typeof children === 'string' ? children : ''}>{children}</optgroup>
}

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup, SelectLabel }