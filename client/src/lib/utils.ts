import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { 
  Calculator, 
  Heart, 
  TrendingUp, 
  FileText, 
  Bot, 
  Palette, 
  Clock, 
  Coins, 
  QrCode, 
  Droplets, 
  Languages, 
  CheckSquare,
  LucideIcon
} from "lucide-react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const iconMap: Record<string, LucideIcon> = {
  calculator: Calculator,
  heartbeat: Heart,
  "chart-line": TrendingUp,
  "file-alt": FileText,
  robot: Bot,
  palette: Palette,
  clock: Clock,
  coins: Coins,
  qrcode: QrCode,
  tint: Droplets,
  language: Languages,
  tasks: CheckSquare,
};

export function getIconComponent(iconName: string): LucideIcon {
  return iconMap[iconName] || Calculator;
}
