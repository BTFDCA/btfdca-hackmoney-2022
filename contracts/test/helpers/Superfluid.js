const { mineBlocks } = require("./Utils");

module.exports = {
  startFlow: async function (sf, from, to, srcTokenxAddr, flowrateStr) {
    const createFlowOperation = await sf.cfaV1.createFlow({
      receiver: to.address,
      superToken: srcTokenxAddr,
      flowRate: flowrateStr,
    });
    const txn = await createFlowOperation.exec(from);
    await mineBlocks(1);
    return await txn.wait();
  },
};
