import { cva, type VariantProps } from "class-variance-authority";
import React, { useEffect, useRef, useState } from "react";
import { cn } from "../utils/cn";
import { Icon } from "./Icons";

const dropdownVariants = cva(
  "flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "",
        error: "border-red-500 focus-visible:ring-red-500",
        success: "border-primary focus-visible:ring-primary",
      },
      size: {
        default: "h-10",
        sm: "h-9",
        lg: "h-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface DropdownProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange">,
    VariantProps<typeof dropdownVariants> {
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  helperText?: string;
}

const Dropdown = React.forwardRef<HTMLButtonElement, DropdownProps>(
  ({ 
    className, 
    variant, 
    size, 
    options, 
    value, 
    onChange, 
    placeholder = "Select an option",
    label,
    error,
    helperText,
    disabled,
    ...props 
  }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const dropdownVariant = error ? "error" : variant;

    const selectedOption = options.find(option => option.value === value);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    const handleOptionClick = (optionValue: string) => {
      onChange?.(optionValue);
      setIsOpen(false);
    };

    return (
      <div className="w-full" ref={dropdownRef}>
        {label && (
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            {label}
          </label>
        )}
        <div className="relative">
          <button
            ref={ref}
            type="button"
            className={cn(dropdownVariants({ variant: dropdownVariant, size, className }))}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            {...props}
          >
            <span className={cn(
              selectedOption ? "text-gray-900" : "text-gray-500"
            )}>
              {selectedOption?.label || placeholder}
            </span>
            <Icon 
              name={isOpen ? "chevronUp" : "chevronDown"} 
              size="sm" 
              className="text-gray-400"
            />
          </button>
          
          {isOpen && (
            <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg">
              <div className="max-h-60 overflow-auto py-1">
                {options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={cn(
                      "w-full px-3 py-2 text-left text-sm text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none",
                      option.disabled && "opacity-50 cursor-not-allowed",
                      value === option.value && "bg-primary-light/20 text-primary"
                    )}
                    onClick={() => !option.disabled && handleOptionClick(option.value)}
                    disabled={option.disabled}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        {(error || helperText) && (
          <p className={cn(
            "text-sm mt-2",
            error ? "text-red-600" : "text-gray-500"
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Dropdown.displayName = "Dropdown";

export { Dropdown, dropdownVariants };
