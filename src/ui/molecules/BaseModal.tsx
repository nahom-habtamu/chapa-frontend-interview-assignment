import React from "react";
import { Icon, type IconName } from "../atoms/Icons";
import { Text } from "../atoms/Text";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  headerIcon?: IconName;
  children: React.ReactNode;
  actions?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  title,
  headerIcon,
  children,
  actions,
  size = "md",
  className = "",
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleBackdropClick}
      />
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div className={`relative bg-white rounded-xl shadow-xl w-full mx-4 ${sizeClasses[size]} ${className}`}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              {headerIcon && (
                <div className="rounded-lg bg-gray-100/80 p-2">
                  <Icon 
                    name={headerIcon} 
                    size="sm" 
                    className="text-gray-600"
                  />
                </div>
              )}
              <Text variant="h6" className="font-semibold text-gray-900">
                {title}
              </Text>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Icon name="x" size="sm" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {children}
          </div>

          {/* Actions */}
          {actions && (
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};