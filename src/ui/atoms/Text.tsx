import { cva, type VariantProps } from "class-variance-authority";
import React from "react";
import { cn } from "../utils/cn";

const textVariants = cva("", {
  variants: {
    variant: {
      h1: "text-4xl font-bold tracking-tight lg:text-5xl",
      h2: "text-3xl font-semibold tracking-tight",
      h3: "text-2xl font-semibold tracking-tight",
      h4: "text-xl font-semibold tracking-tight",
      h5: "text-lg font-semibold",
      h6: "text-base font-semibold",
      body: "text-base leading-7",
      caption: "text-sm text-gray-600",
    },
    color: {
      default: "text-gray-900",
      muted: "text-gray-500",
      destructive: "text-red-600",
      success: "text-green-600",
      warning: "text-yellow-600",
      info: "text-blue-600",
    },
  },
  defaultVariants: {
    variant: "body",
    color: "default",
  },
});

export interface TextProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "color">,
    VariantProps<typeof textVariants> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
}

const Text = React.forwardRef<HTMLElement, TextProps>(
  ({ className, variant, color, as, ...props }, ref) => {
    const Component = as || getDefaultComponent(variant);
    
    return React.createElement(Component, {
      className: cn(textVariants({ variant, color, className })),
      ref,
      ...props,
    });
  }
);

function getDefaultComponent(variant: TextProps["variant"]) {
  switch (variant) {
    case "h1":
      return "h1";
    case "h2":
      return "h2";
    case "h3":
      return "h3";
    case "h4":
      return "h4";
    case "h5":
      return "h5";
    case "h6":
      return "h6";
    case "caption":
      return "span";
    default:
      return "p";
  }
}

Text.displayName = "Text";

export { Text, textVariants };
