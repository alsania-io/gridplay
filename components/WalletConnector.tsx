/**
 * WalletConnector Component
 *
 * Backwards-compatible surface. The single owner of wallet context is
 * `components/WalletProvider.tsx`; this module re-exports its hook and
 * components so existing imports keep working without a second context.
 */

"use client";

export {
  WalletProvider,
  useWallet,
  WalletStatus,
  TokenApproval,
} from './WalletProvider';
