import { cva, type VariantProps } from "class-variance-authority";
import React from "react";
import { cn } from "../utils/cn";
import { Icon, type IconName } from "./Icons";

const badgeVariants = cva(
  "inline-flex items-center rounded-full text-xs font-semibold border ring-1 transition-colors",
  {
    variants: {
      variant: {
        success: "text-green-700 bg-green-50 border-green-200 ring-green-600/20",
        pending: "text-amber-700 bg-amber-50 border-amber-200 ring-amber-600/20",
        failed: "text-red-700 bg-red-50 border-red-200 ring-red-600/20",
        cancelled: "text-gray-700 bg-gray-50 border-gray-200 ring-gray-600/20",
        default: "text-gray-700 bg-gray-50 border-gray-200 ring-gray-600/20",
        primary: "text-primary bg-primary-light/20 border-primary-light ring-primary/20",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        default: "px-3 py-1.5 text-xs",
        lg: "px-4 py-2 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const statusIcons: Record<string, IconName> = {
  success: "check",
  pending: "clock",
  failed: "x",
  cancelled: "x",
};

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
  icon?: IconName | boolean;
  showIcon?: boolean;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, children, icon, showIcon, ...props }, ref) => {
    let iconToShow: IconName | undefined;
    
    if (icon === true) {
      iconToShow = variant && statusIcons[variant] ? statusIcons[variant] : undefined;
    } else if (typeof icon === "string") {
      iconToShow = icon;
    } else if (showIcon && variant && statusIcons[variant]) {
      iconToShow = statusIcons[variant];
    }

    return (
      <span
        className={cn(badgeVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {iconToShow && (
          <Icon 
            name={iconToShow} 
            size="sm" 
            className="mr-1.5 -ml-0.5" 
          />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";

export { Badge, badgeVariants };
