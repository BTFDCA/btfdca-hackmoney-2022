// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0;

import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";

contract MockSwapRouter is ISwapRouter {
    // address public WETH9;
    // address public factory;

    constructor() {}

    function exactInputSingle(
        ISwapRouter.ExactInputSingleParams calldata params
    ) external payable override returns (uint256 amountOut) {
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
