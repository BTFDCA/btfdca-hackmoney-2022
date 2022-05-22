import { ethers } from "ethers";

async function getNativeBalance(walletAddress) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const balance = await provider.getBalance(walletAddress);

  return ethers.utils.formatEther(balance);
}

async function getErc20Balance(tokenAddress, walletAddress) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const erc20abi = [
    "function balanceOf(address account) external view returns(uint256 balance)",
  ];
  const erc20 = new ethers.Contract(tokenAddress, erc20abi, provider);
  const balance = await erc20.balanceOf(walletAddress);

  return ethers.utils.formatEther(balance);
}

export { getNativeBalance, getErc20Balance };
