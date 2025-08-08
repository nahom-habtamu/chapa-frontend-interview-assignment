import {
  AlertCircle,
  ArrowDownLeft,
  ArrowUpRight,
  Bell,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  Edit,
  Eye,
  EyeOff,
  FileText,
  Filter,
  Home,
  Key,
  LogOut,
  Menu,
  Minus,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Shield,
  Trash2,
  TrendingUp,
  Upload,
  User,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react";

export type IconName = 
  | "user"
  | "wallet"
  | "creditCard"
  | "arrowUpRight"
  | "arrowDownLeft"
  | "check"
  | "x"
  | "alertCircle"
  | "chevronDown"
  | "chevronUp"
  | "chevronLeft"
  | "chevronRight"
  | "settings"
  | "bell"
  | "key"
  | "logOut"
  | "menu"
  | "home"
  | "fileText"
  | "dollarSign"
  | "trendingUp"
  | "clock"
  | "shield"
  | "eye"
  | "eyeOff"
  | "search"
  | "filter"
  | "download"
  | "upload"
  | "refresh"
  | "plus"
  | "minus"
  | "edit"
  | "trash2";

const iconMap: Record<IconName, LucideIcon> = {
  user: User,
  wallet: Wallet,
  creditCard: CreditCard,
  arrowUpRight: ArrowUpRight,
  arrowDownLeft: ArrowDownLeft,
  check: Check,
  x: X,
  alertCircle: AlertCircle,
  chevronDown: ChevronDown,
  chevronUp: ChevronUp,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  settings: Settings,
  logOut: LogOut,
  menu: Menu,
  bell: Bell,
  key: Key,
  home: Home,
  fileText: FileText,
  dollarSign: DollarSign,
  trendingUp: TrendingUp,
  clock: Clock,
  shield: Shield,
  eye: Eye,
  eyeOff: EyeOff,
  search: Search,
  filter: Filter,
  download: Download,
  upload: Upload,
  refresh: RefreshCw,
  plus: Plus,
  minus: Minus,
  edit: Edit,
  trash2: Trash2,
};

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeMap = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

export const Icon: React.FC<IconProps> = ({ 
  name, 
  size = "md", 
  className = "", 
  ...props 
}) => {
  const IconComponent = iconMap[name];
  const iconSize = typeof size === "string" ? sizeMap[size] : size;

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return (
    <IconComponent
      size={iconSize}
      className={className}
      {...props}
    />
  );
};

export { iconMap };
