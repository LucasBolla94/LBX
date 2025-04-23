import { AnchorProvider, Program, web3 } from "@coral-xyz/anchor";
import { WalletContextState } from "@solana/wallet-adapter-react";
import idl from "@/app/lib/miner_game.json";

// ✅ Substitua com seu programID real do contrato
const programID = new web3.PublicKey("GKkSnJqa84taHMC7CA1h4ZeZYaeaGkMydczVHcpqjpqi");

// ✅ Altere se quiser rodar na devnet
const network = "http://127.0.0.1:8899"; // ou "https://api.devnet.solana.com"

export function getAnchorProgram(walletContext: WalletContextState) {
  const connection = new web3.Connection(network, "processed");

  const wallet = {
    publicKey: walletContext.publicKey!,
    signTransaction: walletContext.signTransaction!,
    signAllTransactions: walletContext.signAllTransactions!,
  } as any; // <- Ignorando a falta de `payer` no frontend

  const provider = new AnchorProvider(connection, wallet, {
    commitment: "processed",
  });

  // ✅ Forçando o cast para que o compilador aceite os parâmetros corretamente
  return new Program(idl as any, programID as any, provider);
}
