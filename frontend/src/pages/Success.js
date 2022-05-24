import { useEffect, useState } from "react";
import {
  ADDRESSES,
  SF_DISTRIBUTION_SUBSCRIPTION_IDX,
} from "../config/constants";
import { getSignerAndFramework } from "../helpers/sf";

import "../styles/Success.css";

async function getClaimDetails(account, targetToken) {
  console.log(
    "retrieving details of the IDA subscription",
    account,
    targetToken
  );
  const [chainId, signer, sf] = await getSignerAndFramework();

  try {
    console.log("getting the subscription", ADDRESSES[chainId]);
    const subscription = await sf.idaV1.getSubscription({
      publisher: ADDRESSES[chainId].ADDRESS_DCA_SUPERAPP,
      indexId: SF_DISTRIBUTION_SUBSCRIPTION_IDX,
      superToken: targetToken,
      subscriber: account,
      providerOrSigner: signer,
    });

    console.log("fetched the subscription!", subscription);
    return subscription;
  } catch (error) {
    console.error(error);
  }
}

function Success({ chainId, account, connectWallet }) {
  const [claimStatus, setClaimStatus] = useState(false);

  useEffect(() => {
    console.log("[success] account", account);
    if (account) {
      getClaimDetails(account, ADDRESSES[chainId].ADDRESS_ETHGX).then(
        (subscription) => {
          console.log("[success] subscription in use effect", subscription);
          setClaimStatus(true);
        }
      );
    }
  }, [account, chainId]);

  return (
    <div className="success">
      <div className="distributionInfo">
        {claimStatus == null ? (
          <>...</>
        ) : claimStatus === true ? (
          <>
            <h4>Congrats fren 🫂, you've BTFDCA! 🎆🥳</h4>
            <p>
              Every <code>gm!</code> you will receive your cryptoassets.
            </p>
            <p>That's all!</p>
          </>
        ) : (
          <>
            <h4>Are you sure you're in the right place?</h4>
            <p>We can't seem to find any stream created.</p>
            <p>
              <a href="/">Are you sure you've BTFDCA?</a>
            </p>
            <p className="mt-5">
              If you think something's wrong here, please reach out to us (and
              check the Superfluid dashboard 👇🏻 for more details).
            </p>
          </>
        )}
      </div>

      <hr />
      {/* link to superfluid's dashboard and console */}
      <div className="superfluid vstack gap-3">
        {/* TODO: get network name from somewhere */}
        <h4>🖥️ Wanna verify that things are working? Check Superfluid</h4>

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

export default Success;
