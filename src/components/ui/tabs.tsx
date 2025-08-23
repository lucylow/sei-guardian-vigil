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
  variant?: "default" | "security" | "matrix" | "governance"
}

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const baseClasses = "inline-flex h-14 items-center justify-center rounded-xl p-1.5 text-muted-foreground transition-all duration-300 tabs-list-enhanced"
    const variantClasses = {
      default: "bg-muted/50 border border-border/50 backdrop-blur-sm",
      security: "bg-black/40 border-2 border-red-900/60 backdrop-blur-xl shadow-2xl shadow-red-500/20",
      matrix: "bg-gray-900/60 border border-green-500/60 backdrop-blur-xl shadow-2xl shadow-green-500/20",
      governance: "bg-black/40 border-2 border-slate-700/60 backdrop-blur-xl shadow-2xl shadow-slate-500/20"
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
  variant?: "default" | "security" | "matrix" | "governance"
  icon?: React.ReactNode
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, variant = "default", icon, children, ...props }, ref) => {
    const { activeTab, setActiveTab } = useTabsContext()
    const isActive = activeTab === value

    const baseClasses = "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-3 text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group tab-trigger-enhanced"
    
    const variantClasses = {
      default: {
        base: "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm hover:bg-background/50 hover:text-foreground",
        active: "bg-background text-foreground shadow-sm",
        inactive: "hover:bg-background/50 hover:text-foreground"
      },
      security: {
        base: "relative flex-1 flex items-center justify-center space-x-3 py-4 px-6 rounded-lg transition-all duration-300 font-mono tracking-wide font-bold transform hover:scale-105 hover:shadow-lg",
        active: "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-2xl shadow-red-500/50 border-2 border-red-500 transform scale-105",
        inactive: "text-red-400 hover:text-red-300 hover:bg-red-900/30 border-2 border-transparent hover:border-red-600/50 hover:shadow-lg hover:shadow-red-500/20"
      },
      matrix: {
        base: "relative flex-1 flex items-center justify-center space-x-3 py-4 px-6 rounded-lg transition-all duration-300 font-mono tracking-wide font-bold transform hover:scale-105 hover:shadow-lg",
        active: "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-2xl shadow-green-500/50 border-2 border-green-500 transform scale-105",
        inactive: "text-green-400 hover:text-green-300 hover:bg-green-900/30 border-2 border-transparent hover:border-green-600/50 hover:shadow-lg hover:shadow-green-500/20"
      },
      governance: {
        base: "relative flex-1 flex items-center justify-center space-x-3 py-4 px-6 rounded-lg transition-all duration-300 font-mono tracking-wide font-bold transform hover:scale-105 hover:shadow-lg",
        active: "bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-2xl shadow-slate-500/50 border-2 border-slate-500 transform scale-105",
        inactive: "text-slate-400 hover:text-slate-300 hover:bg-slate-900/30 border-2 border-transparent hover:border-slate-600/50 hover:shadow-lg hover:shadow-slate-500/20"
      }
    }

    const classes = cn(
      baseClasses,
      variantClasses[variant].base,
      isActive ? variantClasses[variant].active : variantClasses[variant].inactive,
      isActive && variant !== "default" ? "tab-trigger-active" : "",
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
        {/* Background glow effect for active tabs */}
        {isActive && variant !== "default" && (
          <div className={cn(
            "absolute inset-0 rounded-lg opacity-20 blur-xl transition-all duration-300",
            variant === "security" ? "bg-red-500" : 
            variant === "matrix" ? "bg-green-500" : 
            variant === "governance" ? "bg-slate-500" : "bg-gray-500"
          )}></div>
        )}
        
        {/* Icon with enhanced styling */}
        {icon && (
          <span className={cn(
            "transition-all duration-300 tab-icon-enhanced",
            isActive ? "transform scale-110" : "group-hover:scale-105"
          )}>
            {icon}
          </span>
        )}
        
        {/* Text with enhanced typography */}
        <span className={cn(
          "transition-all duration-300",
          isActive ? "transform scale-105" : "group-hover:scale-102"
        )}>
          {children}
        </span>
        
        {/* Active Tab Indicator with enhanced styling */}
        {variant !== "default" && isActive && (
          <div className={cn(
            "absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rotate-45 border-b-2 border-r-2 shadow-lg tab-indicator-bounce",
            variant === "security" ? "bg-red-600 border-red-500 shadow-red-500/50" : 
            variant === "matrix" ? "bg-green-600 border-green-500 shadow-green-500/50" : 
            variant === "governance" ? "bg-slate-600 border-slate-500 shadow-slate-500/50" : 
            "bg-gray-600 border-gray-500"
          )}></div>
        )}
        
        {/* Hover effect overlay */}
        {!isActive && variant !== "default" && (
          <div className={cn(
            "absolute inset-0 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-300",
            variant === "security" ? "bg-red-500" : 
            variant === "matrix" ? "bg-green-500" : 
            variant === "governance" ? "bg-slate-500" : "bg-gray-500"
          )}></div>
        )}
      </button>
    )
  }
)
TabsTrigger.displayName = "TabsTrigger"

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  variant?: "default" | "security" | "matrix" | "governance"
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, variant = "default", children, ...props }, ref) => {
    const { activeTab } = useTabsContext()
    const isActive = activeTab === value

    if (!isActive) return null

    const variantClasses = {
      default: "mt-4 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      security: "mt-8 animate-in fade-in-0 slide-in-from-top-2 duration-500 tab-content-slide",
      matrix: "mt-8 animate-in fade-in-0 slide-in-from-top-2 duration-500 tab-content-slide",
      governance: "mt-8 animate-in fade-in-0 slide-in-from-top-2 duration-500 tab-content-slide"
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

// Enhanced Tab Description Component
interface TabDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: "security" | "matrix" | "governance"
  descriptions: Record<string, string>
}

const TabDescription = React.forwardRef<HTMLParagraphElement, TabDescriptionProps>(
  ({ className, variant = "security", descriptions, ...props }, ref) => {
    const { activeTab } = useTabsContext()
    const currentDescription = descriptions[activeTab] || ""

    const variantClasses = {
      security: "text-red-400/80 font-medium tracking-wide bg-red-900/20 border border-red-800/30 rounded-lg px-4 py-3 backdrop-blur-sm",
      matrix: "text-green-400/80 font-medium tracking-wide bg-green-900/20 border border-green-800/30 rounded-lg px-4 py-3 backdrop-blur-sm",
      governance: "text-slate-400/80 font-medium tracking-wide bg-slate-900/20 border border-slate-800/30 rounded-lg px-4 py-3 backdrop-blur-sm"
    }

    return (
      <div className="mt-4 text-center animate-in fade-in-0 slide-in-from-top-2 duration-500 tab-description-fade">
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

// Enhanced Tab Connection Line Component
interface TabConnectionLineProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "security" | "matrix" | "governance"
}

const TabConnectionLine = React.forwardRef<HTMLDivElement, TabConnectionLineProps>(
  ({ className, variant = "security", ...props }, ref) => {
    const variantClasses = {
      security: "bg-gradient-to-r from-red-600/60 via-red-500/60 to-red-600/60 shadow-lg shadow-red-500/30",
      matrix: "bg-gradient-to-r from-green-600/60 via-green-500/60 to-green-600/60 shadow-lg shadow-green-500/30",
      governance: "bg-gradient-to-r from-slate-600/60 via-slate-500/60 to-slate-600/60 shadow-lg shadow-slate-500/30"
    }

    return (
      <div
        ref={ref}
        className={cn("mt-6 h-1.5 rounded-full animate-in fade-in-0 slide-in-from-top-2 duration-500 connection-line-animated", variantClasses[variant], className)}
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
