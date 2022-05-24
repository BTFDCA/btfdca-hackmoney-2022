import {
  ADDRESSES,
  SF_DISTRIBUTION_SUBSCRIPTION_IDX,
} from "../config/constants";
import { getSignerAndFramework } from "../helpers/sf";

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
        type="button"
        className="btn btn-outline-primary  ms-auto"
        aria-current="page"
        onClick={async () =>
          // TODO: go to wallet
          approveSubscription(ADDRESSES[chainId].ADDRESS_ETHGX)
        }
      >
        🤑 I want to get paid! 💰
      </button>
    </div>
  );
}

export default SubscriptionApprover;
