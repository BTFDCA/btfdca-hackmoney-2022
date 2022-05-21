import {
  ADDRESSES,
  SF_DISTRIBUTION_SUBSCRIPTION_IDX,
} from "../config/constants";
import { getSignerAndFramework } from "../helpers/sf";

async function getClaimDetails(sender, targetToken) {
  console.log(
    "retrieving details of the IDA subscription",
    sender,
    targetToken
  );
  const [chainId, signer, sf] = await getSignerAndFramework();

  try {
    console.log("getting the subscription");
    const subscription = await sf.idaV1.getSubscription({
      publisher: ADDRESSES[chainId].ADDRESS_DCA_SUPERAPP,
      indexId: SF_DISTRIBUTION_SUBSCRIPTION_IDX,
      superToken: targetToken,
      subscriber: sender,
      providerOrSigner: signer,
    });

    console.log("fetched the subscription!", subscription);
  } catch (error) {
    console.error(error);
  }
}

async function approveSubscription(targetToken) {
  console.log("approving subscription to", targetToken);
  const [chainId, signer, sf] = await getSignerAndFramework();

  try {
    const subscriptionApprovalOp = await sf.idaV1.approveSubscription({
      indexId: SF_DISTRIBUTION_SUBSCRIPTION_IDX,
      superToken: targetToken,
      publisher: ADDRESSES[chainId].ADDRESS_DCA_SUPERAPP,
    });
    console.log("approval operation", subscriptionApprovalOp);

    const result = await subscriptionApprovalOp.exec(signer);
    console.log("subscription approved", result);
  } catch (error) {
    console.error(error);
  }
}

function SubscriptionApprover({ chainId }) {
  return (
    <div>
      <button
        style={{ marginLeft: "1rem" }}
        onClick={async () => {
          approveSubscription(ADDRESSES[chainId].ADDRESS_ETHGX);
        }}
      >
        approve subscription to weth!
      </button>
    </div>
  );
}

export default SubscriptionApprover;
