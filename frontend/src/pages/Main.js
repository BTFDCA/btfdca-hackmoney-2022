import Hero from "./main/Hero";
import Team from "./main/Team";
import Analytics from "./main/Analytics";
import Info from "./main/Info";

function Main({ chainId, account, connectWallet }) {
  return (
    <div>
      <Hero chainId={chainId} account={account} connectWallet={connectWallet} />
      <Info />
      <Analytics />
      <Team />
    </div>
  );
}

export default Main;
