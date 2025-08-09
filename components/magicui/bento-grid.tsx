import { ArrowRightIcon } from "@radix-ui/react-icons";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  className?: string;
}

interface BentoCardProps extends ComponentPropsWithoutRef<"div"> {
  name: string;
  background: ReactNode;
  Icon: React.ElementType;
  description: string;
  href: string;
  cta: string;
  className?: string;
}

const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[22rem] gap-4",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const BentoCard = ({
  name,
  background,
  Icon,
  description,
  href,
  cta,
  className,
  ...props
}: BentoCardProps) => (
  <div
    className={cn(
      "group relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-sm",
      "hover:border-white/20 transition-all duration-500 ease-out",
      "hover:shadow-2xl hover:shadow-white/5",
      className,
    )}
    {...props}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-50" />
    
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
      {background}
    </div>

    <div className="relative z-20 h-full p-8 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <Icon className="h-8 w-8 text-white/80 transition-all duration-300 group-hover:text-white group-hover:scale-110" />
        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white/60 hover:text-white hover:bg-white/10 border border-white/20 px-4 py-2"
            asChild
          >
            <a href={href} aria-label={name}>
              {cta}
              <ArrowRightIcon className="ml-2 h-3 w-3" />
            </a>
          </Button>
        </div>
      </div>

      <div className="transform transition-all duration-500 group-hover:-translate-y-2">
        <h3 className="text-2xl font-bold text-white mb-3 leading-tight">{name}</h3>
        <p className="text-white/70 text-sm leading-relaxed line-clamp-3">{description}</p>
      </div>
    </div>

    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
  </div>
);

export { BentoCard, BentoGrid };
