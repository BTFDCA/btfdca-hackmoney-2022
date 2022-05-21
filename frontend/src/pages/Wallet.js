import { ADDRESSES } from "../config/constants";
import BalancesList from "../components/BalancesList";
import SubscriptionApprover from "../components/SubscriptionApprover";
import TokenDowngrader from "../components/TokenDowngrader";
import TokenUpgrader from "../components/TokenUpgrader";

import "../styles/Wallet.css";

function Wallet({ chainId, account, connectWallet }) {
  return (
    <div>
      <BalancesList chainId={chainId} account={account} />

      <TokenUpgrader chainId={chainId} />
      <TokenDowngrader chainId={chainId} />

      <SubscriptionApprover chainId={chainId} />

      {/* link to superfluid's console */}
      <div style={{ margin: "5rem 0" }}>
        {/* TODO: get network name from somewhere */}
        <a
          href={
            "https://console.superfluid.finance/" +
            "mumbai" +
            "/accounts/" +
            account
          }
          target="_blank"
          rel="noreferrer"
        >
          Go to your superfluid console
        </a>
      </div>

      {/* contract's superfluid dashboard */}
      <div style={{ margin: "5rem 0" }}>
        {/* TODO: get network name from somewhere */}
        <a
          href={
            "https://console.superfluid.finance/" +
            "mumbai" +
            "/accounts/" +
            ADDRESSES[chainId].ADDRESS_DCA_SUPERAPP
          }
          target="_blank"
          rel="noreferrer"
        >
          Go to the contract's superfluid console
        </a>
      </div>
    </div>
  );
}

export default Wallet;
