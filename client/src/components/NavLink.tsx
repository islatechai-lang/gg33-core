import { Link, useLocation } from "wouter";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { useWhopContext } from "@/context/WhopContext";

interface NavLinkProps {
  to: string;
  className?: string;
  activeClassName?: string;
  children: React.ReactNode;
  onClick?: () => void;
  "data-testid"?: string;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ className, activeClassName, to, children, onClick, ...props }, ref) => {
    const [location] = useLocation();
    const { basePath } = useWhopContext();
    
    const fullPath = to === '/' ? (basePath || '/') : (basePath + to);
    
    const isActive = location === fullPath || 
      (to !== "/" && location.startsWith(fullPath)) ||
      (to === "/" && location === basePath);

    return (
      <Link
        ref={ref}
        href={fullPath}
        className={cn(className, isActive && activeClassName)}
        onClick={onClick}
        {...props}
      >
        {children}
      </Link>
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };
