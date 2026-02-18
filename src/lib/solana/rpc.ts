/**
 * Solana RPC Singletons
 *
 * Pre-configured RPC clients for Devnet and MagicBlock PER.
 *
 * Usage:
 *   import { rpc, perRpc } from "@/lib/solana/rpc";
 *   const slot = await rpc.getSlot().send();
 */

import { createSolanaRpc, devnet, type Rpc, type SolanaRpcApi } from "@solana/kit";

const RPC_URL = "https://api.devnet.solana.com";
const PER_URL = "https://devnet-as.magicblock.app";

/** Standard Solana Devnet RPC */
export const rpc: Rpc<SolanaRpcApi> = createSolanaRpc(devnet(RPC_URL));

/** MagicBlock PER (Programmable Ephemeral Rollup) RPC */
export const perRpc: Rpc<SolanaRpcApi> = createSolanaRpc(devnet(PER_URL));
