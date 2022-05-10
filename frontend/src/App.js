import "./App.css";

function App() {
  return (
    <div className="App">
      <div className="dcaWrapper">
        <span>I want to buy</span>
        <span>
          <input type="number" step="100" placeholder="100" />
        </span>
        <span>
          <select>
            <option value="dai">DAI</option>
            <option value="usdc">USDC</option>
          </select>
        </span>
        <span>worth of</span>
        <span>
          <select>
            <option value="wbtc">wBTC</option>
            <option value="weth">wETH</option>
          </select>
        </span>
        <span>every</span>
        <span>
          <select>
            <option value="month">month</option>
            <option value="week">week</option>
            <option value="day">day</option>
          </select>
        </span>
        <span>.</span>
      </div>
      <div className="lfgWrapper">
        <button id="lfgButton">LFG!</button>
      </div>
    </div>
  );
}

export default App;
