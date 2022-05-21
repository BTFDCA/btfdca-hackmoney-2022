function Header({ account }) {
  return (
    <header>
      <nav className="navbar navbar-expand-lg bg-light">
        <div class="container-fluid">
          <div className="navbar-brand">
            <img src="./logo192.png" width="80" height="80" alt="logo" />
          </div>

          <div className="collapse navbar-collapse">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="/">
                  Main
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="/wallet">
                  Wallet
                </a>
              </li>
              <li class="nav-item">
                {account ? (
                  <span class="nav-link active">Connected as {account}</span>
                ) : (
                  <span class="nav-link active">Not connected</span>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
