import Hero from "./main/Hero";
import Contact from "./main/Contact";
import Analytics from "./main/Analytics";
import Info from "./main/Info";
import KeepInTouch from "./main/KeepInTouch";

function Main({ chainId, account, connectWallet }) {
  return (
    <div>
      <Hero chainId={chainId} account={account} connectWallet={connectWallet} />
      <Info />
      <KeepInTouch />
      <Analytics chainId={chainId} />
      <Contact />
    </div>
  );
}

export default Main;
