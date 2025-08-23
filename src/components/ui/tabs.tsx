import * as React from "react"
import { cn } from "@/lib/utils"

const TabsContext = React.createContext<{
  activeTab: string
  setActiveTab: (tab: string) => void
} | null>(null)

const useTabsContext = () => {
  const context = React.useContext(TabsContext)
  if (!context) {
    throw new Error("Tabs components must be used within a Tabs component")
  }
  return context
}

interface TabsProps {
  defaultValue: string
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  className?: string
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ defaultValue, value, onValueChange, children, className, ...props }, ref) => {
    const [activeTab, setActiveTab] = React.useState(defaultValue)
    
    const currentValue = value ?? activeTab
    const handleValueChange = onValueChange ?? setActiveTab

    return (
      <TabsContext.Provider value={{ activeTab: currentValue, setActiveTab: handleValueChange }}>
        <div ref={ref} className={cn("w-full", className)} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    )
  }
)
Tabs.displayName = "Tabs"

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "security" | "matrix"
}

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const baseClasses = "inline-flex h-12 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground"
    const variantClasses = {
      default: "bg-muted text-muted-foreground",
      security: "bg-black/30 border-2 border-red-900/50 backdrop-blur-sm",
      matrix: "bg-gray-900/50 border border-green-500/50"
    }

    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          className
        )}
        {...props}
      />
    )
  }
)
TabsList.displayName = "TabsList"

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
  variant?: "default" | "security" | "matrix"
  icon?: React.ReactNode
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, variant = "default", icon, children, ...props }, ref) => {
    const { activeTab, setActiveTab } = useTabsContext()
    const isActive = activeTab === value

    const baseClasses = "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
    
    const variantClasses = {
      default: {
        base: "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        active: "bg-background text-foreground shadow-sm",
        inactive: "hover:bg-background/50 hover:text-foreground"
      },
      security: {
        base: "relative flex-1 flex items-center justify-center space-x-2 py-4 px-6 rounded-md transition-all duration-300 font-mono tracking-wide font-bold transform hover:scale-105",
        active: "bg-red-600 text-white shadow-lg shadow-red-500/50 border-2 border-red-500",
        inactive: "text-red-600/70 hover:text-red-400 hover:bg-red-900/20 border-2 border-transparent hover:border-red-700/50"
      },
      matrix: {
        base: "relative flex-1 flex items-center justify-center space-x-2 py-4 px-6 rounded-md transition-all duration-300 font-mono tracking-wide font-bold transform hover:scale-105",
        active: "bg-green-600 text-white shadow-lg shadow-green-500/50 border-2 border-green-500",
        inactive: "text-green-600/70 hover:text-green-400 hover:bg-green-900/20 border-2 border-transparent hover:border-green-700/50"
      }
    }

    const classes = cn(
      baseClasses,
      variantClasses[variant].base,
      isActive ? variantClasses[variant].active : variantClasses[variant].inactive,
      className
    )

    return (
      <button
        ref={ref}
        className={classes}
        data-state={isActive ? "active" : "inactive"}
        onClick={() => setActiveTab(value)}
        {...props}
      >
        {icon && <span className="mr-2">{icon}</span>}
        {children}
        
        {/* Active Tab Indicator for Security/Matrix variants */}
        {variant !== "default" && isActive && (
          <div className={cn(
            "absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 rotate-45 border-b-2 border-r-2",
            variant === "security" ? "bg-red-600 border-red-500" : "bg-green-600 border-green-500"
          )}></div>
        )}
      </button>
    )
  }
)
TabsTrigger.displayName = "TabsTrigger"

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  variant?: "default" | "security" | "matrix"
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, variant = "default", children, ...props }, ref) => {
    const { activeTab } = useTabsContext()
    const isActive = activeTab === value

    if (!isActive) return null

    const variantClasses = {
      default: "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      security: "mt-6",
      matrix: "mt-6"
    }

    return (
      <div
        ref={ref}
        className={cn(variantClasses[variant], className)}
        data-state={isActive ? "active" : "inactive"}
        {...props}
      >
        {children}
      </div>
    )
  }
)
TabsContent.displayName = "TabsContent"

// Tab Description Component for Security/Matrix variants
interface TabDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: "security" | "matrix"
  descriptions: Record<string, string>
}

const TabDescription = React.forwardRef<HTMLParagraphElement, TabDescriptionProps>(
  ({ className, variant = "security", descriptions, ...props }, ref) => {
    const { activeTab } = useTabsContext()
    const currentDescription = descriptions[activeTab] || ""

    const variantClasses = {
      security: "text-red-600/70 font-medium tracking-wide",
      matrix: "text-green-600/70 font-medium tracking-wide"
    }

    return (
      <div className="mt-3 text-center">
        <p
          ref={ref}
          className={cn(variantClasses[variant], className)}
          {...props}
        >
          {currentDescription}
        </p>
      </div>
    )
  }
)
TabDescription.displayName = "TabDescription"

// Tab Connection Line Component for Security/Matrix variants
interface TabConnectionLineProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "security" | "matrix"
}

const TabConnectionLine = React.forwardRef<HTMLDivElement, TabConnectionLineProps>(
  ({ className, variant = "security", ...props }, ref) => {
    const variantClasses = {
      security: "bg-gradient-to-r from-red-600/50 via-red-500/50 to-red-600/50",
      matrix: "bg-gradient-to-r from-green-600/50 via-green-500/50 to-green-600/50"
    }

    return (
      <div
        ref={ref}
        className={cn("mt-4 h-1 rounded-full", variantClasses[variant], className)}
        {...props}
      />
    )
  }
)
TabConnectionLine.displayName = "TabConnectionLine"

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  TabDescription,
  TabConnectionLine,
}
