import * as React from "react"

const Dialog = ({ children, open, onOpenChange }: any) => {
  return open ? <div>{children}</div> : null
}

const DialogTrigger = ({ children, ...props }: any) => {
  return <div {...props}>{children}</div>
}

const DialogContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
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
DialogContent.displayName = "DialogContent"

const DialogHeader = ({ children, className = '' }: any) => {
  return <div className={`flex flex-col space-y-1.5 text-center sm:text-left ${className}`}>{children}</div>
}

const DialogTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className = '', ...props }, ref) => (
    <h2 ref={ref} className={`text-lg font-semibold ${className}`} {...props} />
  )
)
DialogTitle.displayName = "DialogTitle"

const DialogDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className = '', ...props }, ref) => (
    <p ref={ref} className={`text-sm text-muted-foreground ${className}`} {...props} />
  )
)
DialogDescription.displayName = "DialogDescription"

const DialogFooter = ({ children, className = '' }: any) => {
  return <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className}`}>{children}</div>
}

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter }