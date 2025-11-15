import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CategoryButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  className?: string;
}

export const CategoryButton = ({ icon: Icon, label, onClick, className }: CategoryButtonProps) => {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      className={cn(
        "h-28 flex-col gap-3 text-lg font-semibold bg-category-button hover:bg-category-button-hover text-category-button-foreground border-2 border-border transition-all hover:scale-105 hover:border-primary",
        className
      )}
    >
      <Icon className="h-10 w-10" />
      <span>{label}</span>
    </Button>
  );
};
