import { cva, type VariantProps } from "class-variance-authority";
import React from "react";
import { cn } from "../utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-white hover:bg-primary-dark focus:ring-primary",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
        outline:
          "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 focus:ring-primary",
        secondary:
          "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500",
        ghost: "text-gray-900 hover:bg-gray-100 focus:ring-gray-500",
        link: "text-primary underline-offset-4 hover:underline focus:ring-primary",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
