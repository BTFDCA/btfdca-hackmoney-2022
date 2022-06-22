import Hero from "../components/main/Hero";
import Contact from "../components/main/Contact";
import Analytics from "../components/main/Analytics";
import Info from "../components/main/Info";
import KeepInTouch from "../components/main/KeepInTouch";

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
