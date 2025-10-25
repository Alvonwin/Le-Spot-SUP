import * as React from "react"

const AlertDialog = ({ children, open }: any) => {
  return open ? <div>{children}</div> : null
}

const AlertDialogTrigger = ({ children, ...props }: any) => {
  return <div {...props}>{children}</div>
}

const AlertDialogContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', children, ...props }, ref) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        ref={ref}
        className={`relative bg-background p-6 rounded-lg shadow-lg max-w-lg w-full ${className}`}
        {...props}
      >
        {children}
      </div>
    </div>
  )
)
AlertDialogContent.displayName = "AlertDialogContent"

const AlertDialogHeader = ({ children, className = '' }: any) => {
  return <div className={`flex flex-col space-y-2 text-center sm:text-left ${className}`}>{children}</div>
}

const AlertDialogTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className = '', ...props }, ref) => (
    <h2 ref={ref} className={`text-lg font-semibold ${className}`} {...props} />
  )
)
AlertDialogTitle.displayName = "AlertDialogTitle"

const AlertDialogDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className = '', ...props }, ref) => (
    <p ref={ref} className={`text-sm text-muted-foreground ${className}`} {...props} />
  )
)
AlertDialogDescription.displayName = "AlertDialogDescription"

const AlertDialogFooter = ({ children, className = '' }: any) => {
  return <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className}`}>{children}</div>
}

const AlertDialogAction = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className = '', ...props }, ref) => (
    <button ref={ref} className={`inline-flex items-center justify-center rounded-md px-4 py-2 ${className}`} {...props} />
  )
)
AlertDialogAction.displayName = "AlertDialogAction"

const AlertDialogCancel = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className = '', ...props }, ref) => (
    <button ref={ref} className={`inline-flex items-center justify-center rounded-md px-4 py-2 ${className}`} {...props} />
  )
)
AlertDialogCancel.displayName = "AlertDialogCancel"

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
}