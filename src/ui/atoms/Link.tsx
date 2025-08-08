import { cva, type VariantProps } from "class-variance-authority";
import NextLink from "next/link";
import React from "react";
import { cn } from "../utils/cn";

const linkVariants = cva(
  "font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
  {
    variants: {
      variant: {
        default: "text-primary hover:text-primary-dark underline-offset-4 hover:underline",
        muted: "text-gray-500 hover:text-gray-700 underline-offset-4 hover:underline",
        destructive: "text-red-600 hover:text-red-800 underline-offset-4 hover:underline",
        ghost: "text-gray-900 hover:text-gray-600",
      },
      size: {
        default: "text-base",
        sm: "text-sm",
        lg: "text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkVariants> {
  href: string;
  external?: boolean;
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, variant, size, href, external = false, children, ...props }, ref) => {
    if (external) {
      return (
        <a
          className={cn(linkVariants({ variant, size, className }))}
          href={href}
          ref={ref}
          target="_blank"
          rel="noopener noreferrer"
          {...props}
        >
          {children}
        </a>
      );
    }

    return (
      <NextLink
        className={cn(linkVariants({ variant, size, className }))}
        href={href}
        ref={ref}
        {...props}
      >
        {children}
      </NextLink>
    );
  }
);

Link.displayName = "Link";

export { Link, linkVariants };
