import Balances from "../components/Balances";
import TokenDowngrader from "../components/TokenDowngrader";
import TokenUpgrader from "../components/TokenUpgrader";
import SubscriptionApprover from "../components/SubscriptionApprover";

import "../styles/Wallet.css";

function Wallet({ chainId, account, connectWallet }) {
  return (
    <div className="wallet">
      <Balances chainId={chainId} account={account} />

      {/* TODO: only show if not approved */}
      <div className="approval">
        <p>
          In order to get your moneyz, you have to approve the distribution 👇🏻.
        </p>
        <SubscriptionApprover chainId={chainId} />
      </div>

      <hr />

      <div className="supertokenOperations hstack gap-3">
        <TokenUpgrader chainId={chainId} />
        <div className="vr"></div>
        <TokenDowngrader chainId={chainId} />
      </div>
      <hr />
      {/* link to superfluid's dashboard and console */}
      <div className="superfluid vstack gap-3">
        {/* TODO: get network name from somewhere */}
        <h4>🖥️ Do more things in Superfluid</h4>

        <div className="sfDash">
          <a
            href="https://app.superfluid.finance/dashboard"
            target="_blank"
            rel="noreferrer"
          >
            Do Advanced DeFi magic inside your Superfluid Dashboard.
          </a>
          <p>
            Full management of your BTFDCA operations. Your can approve
            distributions, cancel the streams, check your activity, wrap/unwrap
            tokens, transfer and receive tokens, and much more.
          </p>
        </div>

        <div className="sfConsole">
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
            Go to your Superfluid console
          </a>
          <p>
            Kinda like etherscan for Superfluid - get the full data on what's
            happening under the hood.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Wallet;
