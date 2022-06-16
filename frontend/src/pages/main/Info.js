function Info() {
  // TODO: rewrite
  return (
    <>
      <div className="info">
        <div>
          <h5>How does all this work?</h5>
          <p>
            <span>Built using</span>
            <a
              href="https://superfluid.finance/"
              target="_blank"
              rel="noreferrer"
              style={{ marginLeft: "0.25rem" }}
            >
              Superfluid
            </a>
            <span>
              , which streams your source token to our smart contract.
            </span>
            &nbsp;
            <span>
              Every day, the funds from all investors are pooled together,
              swapped through
            </span>
            <a
              style={{ marginLeft: "0.25rem" }}
              href="https://uniswap.org/"
              target="_blank"
              rel="noreferrer"
            >
              Uniswap
            </a>
            <span>
              , and returned back to the investors through Superfluid again.
            </span>
          </p>
        </div>

        <div>
          <h5>What's source token?</h5>
          <p>
            <span>
              source token is a Superfluid SuperToken (similar to wrapped ERC20
              tokens). It's what Superfluid uses to receive/send the tokens and
              perform its operations.
            </span>
            <a
              style={{ marginLeft: "0.25rem", marginRight: "0.25rem" }}
              href="/wallet"
            >
              You can upgrade/downgrade (wrap/unwrap) your ERC20 tokens here.
            </a>
          </p>
        </div>
      </div>{" "}
    </>
  );
}

export default Info;
