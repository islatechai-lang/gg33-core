import React from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';

export function useLocation(): [string, (to: string) => void] {
  const router = useRouter();
  const setLocation = (to: string) => {
    router.push(to);
  };
  return [router.pathname || '/', setLocation];
}

export function useParams<T extends Record<string, string | string[] | undefined>>(): T {
  const router = useRouter();
  return (router.query || {}) as T;
}

export function Link({ href, children, className, ...props }: any) {
  return (
    <NextLink href={href || '#'} className={className} {...props}>
      {children}
    </NextLink>
  );
}

export function Redirect({ to }: { to: string }) {
  const router = useRouter();
  React.useEffect(() => {
    router.replace(to);
  }, [to, router]);
  return null;
}

export function Switch({ children }: any) {
  return <>{children}</>;
}

export function Route({ children, component: Component }: any) {
  if (Component) return <Component />;
  return <>{children}</>;
}
