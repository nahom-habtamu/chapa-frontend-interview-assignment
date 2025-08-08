import Image from "next/image";
import React from "react";
import { Icon, type IconName } from "../atoms/Icons";
import { Link } from "../atoms/Link";
import { Text } from "../atoms/Text";
import { cn } from "../utils/cn";

export interface NavItem {
  label: string;
  href: string;
  icon?: IconName;
  isActive?: boolean;
}

export interface UserInfo {
  name: string;
  email: string;
  role: string;
}

export interface NavbarProps {
  className?: string;
  navItems?: NavItem[];
  user?: UserInfo;
  onLogout?: () => void;
  showUserMenu?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({
  className,
  navItems = [],
  user,
  onLogout,
  showUserMenu = true,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <nav className={cn(
      "border-b border-gray-200/70 bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50 py-2",
      className
    )}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
                <Image 
                  src="https://ethiopianlogos.com/logos/chapa/chapa.png" 
                  alt="Chapa" 
                  width={40}
                  height={40}
                  className="h-10 w-10 object-contain"
                />
            </div>
            
            {navItems.length > 0 && (
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    variant={item.isActive ? "default" : "ghost"}
                    className={cn(
                      "inline-flex items-center px-1 pt-1 text-sm font-medium",
                      item.isActive 
                        ? "border-b-2 border-primary text-primary" 
                        : "text-gray-500 hover:text-gray-700"
                    )}
                  >
                    {item.icon && (
                      <Icon name={item.icon} size="sm" className="mr-2" />
                    )}
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {navItems.length > 0 && (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                  className="md:hidden rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <Icon name="x" size="sm" />
                ) : (
                  <Icon name="menu" size="sm" />
                )}
              </button>
            )}

            {showUserMenu && user && (
              <div className="relative">
                <button
                  style={{
                    maxHeight: "64px",
                  }}
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center rounded-xl bg-gray-50/80 hover:bg-gray-100/80 transition-all duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 border border-gray-200/50 shadow-sm"
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="flex items-center space-x-3 px-4 py-3">
                    <div className="flex-shrink-0">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-r from-primary to-primary-dark flex items-center justify-center ring-2 ring-white shadow-sm">
                        <Text variant="body" className="text-white font-semibold text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </Text>
                      </div>
                    </div>
                    <div className="hidden md:block text-left">
                      <Text variant="body" className="text-sm font-semibold text-gray-800">
                        {user.name}
                      </Text>
                      <Text variant="caption" className="text-xs text-gray-500 font-medium">
                        {user.role}
                      </Text>
                    </div>
                    <Icon 
                      name="chevronDown" 
                      size="sm" 
                      className={cn(
                        "text-gray-400 transition-transform duration-200",
                        isUserMenuOpen && "rotate-180"
                      )} 
                    />
                  </div>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 z-10 mt-3 w-56 origin-top-right rounded-2xl bg-white py-2 shadow-xl ring-1 ring-gray-200/80 border border-gray-100 focus:outline-none backdrop-blur-sm">
                    <div className="px-4 py-3 text-sm text-gray-700 border-b border-gray-100/80">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-primary-dark flex items-center justify-center">
                          <Text variant="body" className="text-white font-semibold">
                            {user.name.charAt(0).toUpperCase()}
                          </Text>
                        </div>
                        <div>
                          <Text variant="body" className="font-semibold text-gray-900">
                            {user.name}
                          </Text>
                          <Text variant="caption" className="text-gray-500">
                            {user.email}
                          </Text>
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-1">
                      
                      
                      <div className="border-t border-gray-100 my-1"></div>
                      
                      <button
                        onClick={onLogout}
                        className="flex w-full items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                      >
                        <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center mr-3">
                          <Icon name="logOut" size="sm" className="text-red-600" />
                        </div>
                        <div>
                          <div className="font-medium">Sign out</div>
                          <div className="text-xs text-red-500">End your session</div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {isMobileMenuOpen && navItems.length > 0 && (
          <div className="md:hidden border-t border-gray-200">
            <div className="space-y-1 px-4 pb-3 pt-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-lg text-base font-medium transition-colors",
                    item.isActive 
                      ? "bg-primary-light/20 text-primary border-l-4 border-primary" 
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  {item.icon && (
                    <Icon name={item.icon} size="sm" className="mr-3" />
                  )}
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export { Navbar };
