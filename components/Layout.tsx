/**
 * GridPlay Layout Component
 *
 * Main layout wrapper with responsive navigation, header, and footer.
 */

"use client";

import React, { useEffect, useMemo } from 'react';
import { useAuth } from '@/lib/auth/AuthProvider';
import { WalletProvider } from '@/components/WalletProvider';
import Header, { NavItem } from './Header';
import Footer from './Footer';

export interface LayoutProps {
  /** Page content */
  children: React.ReactNode;
  /** Page title (used for document title) */
  title?: string;
  /** Navigation items for header */
  navItems?: NavItem[];
  /** Whether to show wallet status */
  showWallet?: boolean;
  /** Additional CSS classes for main content */
  className?: string;
}

// Internal component with access to auth context
const LayoutInternal: React.FC<LayoutProps & { children: React.ReactNode }> = ({
  children,
  title,
  navItems,
  showWallet,
  className = '',
}) => {
  // Set document title if provided
  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);

  const { isAuthenticated, user } = useAuth();

  // Memoize derived values to avoid unnecessary re-renders of Header
  const headerProps = useMemo(
    () => ({
      navItems,
      isAuthenticated: !!isAuthenticated,
      userName: user?.email?.split('@')[0] || user?.email,
      showWallet,
    }),
    [isAuthenticated, user?.email, navItems, showWallet]
  );

  return (
    <>
      <Header {...headerProps} />
      <main className={`flex-1 ${className}`}>{children}</main>
      <Footer />
    </>
  );
};

export const Layout: React.FC<LayoutProps> = ({
  children,
  title,
  navItems,
  showWallet = true,
  className = '',
}) => {
  return (
    <WalletProvider>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <LayoutInternal
          title={title}
          navItems={navItems}
          showWallet={showWallet}
          className={className}
        >
          {children}
        </LayoutInternal>
      </div>
    </WalletProvider>
  );
};

export default Layout;
