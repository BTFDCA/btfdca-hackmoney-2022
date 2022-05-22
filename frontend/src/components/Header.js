import { useEffect, useState } from "react";
import { ADDRESSES } from "../config/constants";
import { getErc20Balance } from "../helpers/balances";

function Header({ chainId, account }) {
  const [fDaixBalance, setfDaixBalance] = useState("");

  useEffect(() => {
    if (account) {
      getErc20Balance(ADDRESSES[chainId].ADDRESS_FDAIX, account).then((v) => {
        setfDaixBalance(v);
      });
    }
  }, [chainId, account]);

  return (
    <header>
      <nav className="navbar navbar-expand-lg bg-light">
        <div className="container-fluid">
          <div className="navbar-brand">
            <img
              className="d-inline-block"
              src="./logo192.png"
              width="30"
              height="30"
              alt="logo"
            />
            &nbsp;#BTFDCA
          </div>

          <div className="collapse navbar-collapse">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item"></li>
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="/">
                  🏠&nbsp;Main
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link active"
                  aria-current="page"
                  href="/wallet"
                >
                  👛&nbsp;Wallet
                </a>
              </li>
            </ul>
          </div>

          <div className="d-flex">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {account ? (
                <>
                  <li className="nav-item">
                    <span className="nav-link active">
                      {"Connected as " +
                        account.substring(0, 5) +
                        "..." +
                        account.substring(account.length - 5, account.length)}
                    </span>
                  </li>
                  <li className="nav-item">
                    <span className="nav-link active">·</span>
                  </li>

                  <li className="nav-item">
                    <span className="nav-link active">
                      fDAIx Balance: {fDaixBalance}
                    </span>
                  </li>
                </>
              ) : (
                <li className="nav-item account">
                  <span className="nav-link active">Not connected</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
