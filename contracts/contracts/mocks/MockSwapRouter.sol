// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0;

import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";

// TODO: can I use https://ethereum-waffle.readthedocs.io/en/latest/mock-contract.html instead of creating this mock?
contract MockSwapRouter is ISwapRouter {
    // address public WETH9;
    // address public factory;

    constructor() {}

    function exactInputSingle(
        ISwapRouter.ExactInputSingleParams calldata params
    ) external payable override returns (uint256 amountOut) {
        // TODO: inspiration https://github.com/LooksRare/contracts-token-staking/blob/d754b6e0f41f70532fa5a4fc9196ce67575325b7/contracts/test/utils/MockUniswapV3Router.sol
        // TODO: transfer amount of tokenOut to recipient
        // params.tokenIn
        // params.tokenOut
        // fee
        // recipient
        // amountIn
    }

    function exactInput(ISwapRouter.ExactInputParams calldata params)
        external
        payable
        returns (uint256 amountOut)
    {}

    function exactOutputSingle(
        ISwapRouter.ExactOutputSingleParams calldata params
    ) external payable returns (uint256 amountIn) {}

    function exactOutput(ISwapRouter.ExactOutputParams calldata params)
        external
        payable
        returns (uint256 amountIn)
    {}

    function uniswapV3SwapCallback(
        int256 amount0Delta,
        int256 amount1Delta,
        bytes calldata data
    ) external {}
}
