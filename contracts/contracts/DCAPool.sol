//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

import {IDAv1Library} from "@superfluid-finance/ethereum-contracts/contracts/apps/IDAv1Library.sol";
import {SuperAppBase} from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperAppBase.sol";
import {IConstantFlowAgreementV1} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/agreements/IConstantFlowAgreementV1.sol";
import {IInstantDistributionAgreementV1} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/agreements/IInstantDistributionAgreementV1.sol";
import {ISuperAgreement, SuperAppDefinitions, ISuperfluid, ISuperToken} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "hardhat/console.sol";

import {SfDCAPool} from "./SuperfluidDCAPool.sol";

contract DCAPool is SfDCAPool {
    using IDAv1Library for IDAv1Library.InitData;

    struct DCAPoolConfig {
        uint256 buyCadence; // the regular cadence to buy
        uint256 lastBuyTimestamp; // timestamp for last buy and distribute
        uint256 minInvestableAmount; // min amount an investor must stream
        uint256 minAmountToSpend; // minimum balance the pool must have to swap
        uint256 minAmountToDistribute; // minimum balance the pool must have to distribute
    }

    DCAPoolConfig public _poolConfig;
    ISwapRouter public _swapRouter;
    uint24 public _uniswapPoolFee;

    constructor(
        ISuperfluid host,
        IConstantFlowAgreementV1 cfa,
        IInstantDistributionAgreementV1 ida,
        uint32 idaIndex,
        ISuperToken sourceToken,
        ISuperToken targetToken,
        string memory registrationKey,
        ISwapRouter swapRouter,
        uint24 uniswapPoolFee
    ) SfDCAPool(host, cfa, ida, idaIndex, sourceToken, targetToken) {
        console.log("HELLO FROM CTOR!");

        assert(address(swapRouter) != address(0));

        _swapRouter = swapRouter;
        _uniswapPoolFee = uniswapPoolFee;

        // register with superfluid host
        // this reflects the callbacks that are NOT implemented
        uint256 configWord = SuperAppDefinitions.APP_LEVEL_FINAL |
            SuperAppDefinitions.BEFORE_AGREEMENT_CREATED_NOOP |
            SuperAppDefinitions.BEFORE_AGREEMENT_UPDATED_NOOP |
            SuperAppDefinitions.AFTER_AGREEMENT_UPDATED_NOOP |
            SuperAppDefinitions.BEFORE_AGREEMENT_TERMINATED_NOOP;
        // needs a registration key for mainnet
        if (bytes(registrationKey).length > 0) {
            _sfHost.registerAppWithKey(configWord, registrationKey);
        } else {
            _sfHost.registerApp(configWord);
        }

        console.log("BYE FROM CTOR!");
    }

    // TODO: onlyRole
    function setPoolConfig(
        uint256 poolBuyCadence,
        uint256 minInvestableAmount,
        uint256 minAmountToSpend,
        uint256 minAmountToDistribute
    ) external {
        _poolConfig = DCAPoolConfig({
            buyCadence: poolBuyCadence,
            lastBuyTimestamp: block.timestamp,
            minInvestableAmount: minInvestableAmount,
            minAmountToSpend: minAmountToSpend,
            minAmountToDistribute: minAmountToDistribute
        });
    }

    /**************************************************************************
     * SETTERS
     *************************************************************************/

    // TODO: onlyRole
    function setIdaIndex(uint32 newIdaIndex) external {
        _idaIndex = newIdaIndex;
    }

    // TODO: onlyRole
    function setBuyCadence(uint32 newBuyCadence) external {
        require(newBuyCadence > 0, "BC-GT0");
        _poolConfig.buyCadence = newBuyCadence;
    }

    // TODO: onlyRole
    function setMinInvestableAmount(uint32 newMinInvestableAmount) external {
        _poolConfig.minInvestableAmount = newMinInvestableAmount;
    }

    // TODO: onlyRole
    function setMinAmountToSpend(uint256 newMinAmountToSpend) public {
        _poolConfig.minAmountToSpend = newMinAmountToSpend;
    }

    // TODO: onlyRole
    function setMinAmountToDistribute(uint256 newMinAmountToDistribute) public {
        _poolConfig.minAmountToDistribute = newMinAmountToDistribute;
    }

    // TODO: setters for swap router
    // TODO: setters for unitswap pool fee

    /**************************************************************************
     * DEFAULTS
     *************************************************************************/

    // function to receive native token; msg.data must be empty
    receive() external payable {}

    // fallback function is called when msg.data is not empty
    fallback() external payable {}

    // withdraw native token - TODO: onlyRole?
    function withdraw() external {
        (bool success, ) = msg.sender.call{value: address(this).balance}(""); // solhint-disable-line
        require(success, "WNAT");
    }

    // withdraw erc20 tokens - TODO: onlyRole?
    function withdrawTokens(address tokenAddr) external {
        IERC20 token = IERC20(tokenAddr);
        uint256 tokenBalance = token.balanceOf(address(this));

        bool success = token.transfer(msg.sender, tokenBalance);
        require(success, "WERC20");
    }

    /**************************************************************************
     * QUERIES
     *************************************************************************/

    // TODO: getBalances() _sourceToken.balanceOf(address(this)), _targetToken.balanceOf(address(this))

    /**************************************************************************
     * SUPERFLUID CFA CALLBACKS
     *************************************************************************/

    /*
        When a stream is created into a Super App (this will make the Super App the receiver ), the
        beforeAgreementCreated and the afterAgreementCreated callback may be run. These callbacks can
        execute any arbitrary logic, as long as this logic fits within the rules of standard smart
        contract development and the rules of Super Apps (which are explained further later on in this
        section).
    */

    function afterAgreementCreated(
        ISuperToken, // _superToken,
        address, // _agreementClass,
        bytes32, // _agreementId,
        bytes calldata, /*_agreementData*/
        bytes calldata, // _cbdata,
        bytes calldata ctx
    ) external override onlyHost returns (bytes memory) {
        // TODO: onlyExpected(token, agreementClass)
        console.log("HELLO FROM AFTER AGREEMENT CREATED!");

        ISuperfluid.Context memory decodedContext = _sfHost.decodeCtx(ctx);
        require(decodedContext.userData.length > 0, "AAC-UD");

        // decode user data
        (address sourceToken, address targetToken, uint256 amount) = abi.decode(
            decodedContext.userData,
            (address, address, uint256)
        );
        // validate the user data
        require(amount >= _poolConfig.minInvestableAmount, "AAC-IA");
        require(sourceToken == address(_sourceToken), "AAC-IST");
        require(targetToken == address(_targetToken), "AAC-ITT");

        // calling buyAndDistribute will distribute any existing tokens, effectively "resetting" the investments
        // we need this to correctly keep track of the balances for new investors
        // NOTE: if dust balances exist (and don't get distributed) then new investors will get a share of the dust
        try this.buyAndDistribute() {} catch {}

        // register new investor
        // TODO: fix the shares (amount might have too many zeroes - uints is uint128)
        uint128 shares = uint128(amount / 1000);
        _idav1Lib.updateSubscriptionUnits(
            _targetToken,
            _idaIndex,
            decodedContext.msgSender,
            shares
        );

        console.log("BYE FROM AFTER AGREEMENT CREATED!");
        return ctx;
    }

    function afterAgreementTerminated(
        ISuperToken, // _superToken,
        address, // _agreementClass,
        bytes32, //_agreementId,
        bytes calldata, // _agreementData,
        bytes calldata, //_cbdata,
        bytes calldata ctx
    ) external override onlyHost returns (bytes memory) {
        // TODO: onlyExpected(token, agreementClass)
        console.log("HELLO FROM AFTER AGREEMENT TERMINATED!");

        /*
        TODO: check
        1) Super Apps cannot revert in the termination callback (afterAgreementTerminated())
        - Use the trycatch pattern if performing an action which interacts with other
        contracts inside of the callback. Doing things like transferring tokens without
        using the trycatch pattern is dangerous and should be avoided.
        - Double check internal logic to find any revert possibility.

        3) Gas limit operations within the termination callback (afterAgreementTerminated())
        - There is a limit of gas limit send in a callback function (3000000 gas units)
        - If the Super App reverts on terminations calls because of an out-of-gas error,
        it will be jailed.
        - For legitimate cases where the app reverts for out-of-gas (below the gas limit),
        the Super App is subject to user decision to send a new transaction with more gas.
        If the app still reverts, it will be jailed.
        - To protect against these cases, don't create Super Apps that require too much gas
        within the termination callback.

        4) Incorrect ctx (short for context) data within the termination callback
        - Any attempt to tamper with the value of ctx or failing to give the right ctx
        will result in a Jailed App.
        - Any time a protocol function returns a ctx, that ctx should be passed to the
        next called function. It will repeat this process even in the return of the callback itself.
        - For more information on ctx and how it works you can check out our tutorial on userData.
        */
        ISuperfluid.Context memory decodedContext = _sfHost.decodeCtx(ctx);

        // unregister investor - remove from ida
        _idav1Lib.updateSubscriptionUnits(
            _targetToken,
            _idaIndex,
            decodedContext.msgSender,
            0
        );

        // calculate leftover funds and return them to the investor
        (uint256 lastUpdatedTimestamp, int96 flowrate, , ) = _cfa.getFlow(
            _sourceToken,
            decodedContext.msgSender,
            address(this)
        );
        uint256 ts = lastUpdatedTimestamp > _poolConfig.lastBuyTimestamp
            ? lastUpdatedTimestamp
            : _poolConfig.lastBuyTimestamp;

        uint256 amount = uint256(uint96(flowrate)) * (block.timestamp - ts);
        if (amount >= _poolConfig.minInvestableAmount) {
            bool transferred = _sourceToken.transferFrom(
                address(this),
                decodedContext.msgSender,
                amount
            );
            // TODO: log `transferred` or something
        }

        console.log("BYE FROM AFTER AGREEMENT TERMINATED!");
        return ctx;
    }

    /**************************************************************************
     * BUY/SWAP AND DISTRIBUTE
     *************************************************************************/

    // TODO: onlyOwner and allowed addresses, etc
    // TODO: invoked by a keeper (e.g. Gelato) to trigger buy orders
    function buyAndDistribute()
        external
        returns (uint256 amountOut, uint256 amountIn)
    {
        /*
            TODO: check
            Super Apps can't became insolvent.
            - Check if any interaction can lead to insolvency situation.
            - What is an insolvency situation? This occurs when a Super App
            tries to continue sending funds that it no longer has. Its super
            token balance must stay > 0 at minimum. You can learn more about
            liquidation & solvency in our section on this topic.
        */
        console.log("LFG, BTFDCA!");
        // // TODO: hmmm
        // require(_lastBuyTimestamp + _buyCadence >= block.timestamp, "BAD-TS");

        // get the amount to spend (everything), and check that's above the spending threshold
        amountOut = _sourceToken.balanceOf(address(this)); // TODO: keep e.g. 1 gwei to keep the app solvent? ricochet doesn't do that
        require(amountOut >= _poolConfig.minAmountToSpend, "BAD-MAS");
        // TODO: take btfdca's fee (e.g. 1 bps) out of the amount (and transfer it to a fee contract)
        // TODO: check for overflows and underflows...

        // unwrap the tokenxs
        address outTokenAddr = _sourceToken.getUnderlyingToken();
        address inTokenAddr = _targetToken.getUnderlyingToken();

        // ATTN: expects investors to stream wrapper-supertokens, also distributes back wrapper-supertokens
        // fail if there's no underlying token - not strictly needed (downgrade/upgrade will fail)
        require(
            outTokenAddr != address(0) && inTokenAddr != address(0),
            "BAD-TOK"
        );

        // get the underlying erc20 amount - downgrading calls transfer
        _sourceToken.downgrade(amountOut);

        // tradooooor - perform the swap
        amountIn = _swapTokens(outTokenAddr, inTokenAddr, amountOut);

        // check if there was any pending amount that was "leftover" from previous buys
        uint256 amountPiled = ERC20(inTokenAddr).balanceOf(address(this));
        if (amountPiled > amountIn) amountIn = amountPiled;

        // distribute the swapped tokens to the investors, if it's above the distribution threshold
        console.log("give back ser!");
        if (amountIn >= _poolConfig.minAmountToDistribute) {
            // gotta convert into a supertoken
            // TODO: REX is doing: amountIn * (10 ** (18 - ERC20(inTokenAddr).decimals()));
            _targetToken.upgrade(amountIn);

            // ATTN: this is assuming that there are subscribers to the IDA...
            _idav1Lib.distribute(_targetToken, _idaIndex, amountIn);
        }

        // keep track of the last buy and distribute
        _poolConfig.lastBuyTimestamp = block.timestamp;

        console.log("BYETFDCA!", amountOut, amountIn);
    }

    // TODO: visibility, onlyRole, etc
    function _swapTokens(
        address inTokenAddress, // ATTN: token that goes in to uniswap (== out from contract)
        address outTokenAddress, // ATTN: token that goes out from uniswap (== in to contract)
        uint256 amountIn
    ) internal returns (uint256 amountReceived) {
        // TODO: this belongs in another contract and invoked w/ delegate call
        // in order to support different "swappers" (uniswap, paraswap, 1inch, etc)
        // e.g. UniswapSwapper, 1InchSwapper, etc
        console.log("from", inTokenAddress);
        console.log("to", outTokenAddress);
        console.log("much", amountIn);

        address swapRouterAddress = address(_swapRouter);

        // TODO: maybe just approve max_uint in ctor?
        // approve the spend on uniswap
        if (
            ERC20(inTokenAddress).allowance(address(this), swapRouterAddress) <
            amountIn
        ) {
            console.log("approving the spend");
            TransferHelper.safeApprove(
                inTokenAddress,
                swapRouterAddress,
                amountIn
            );
        }

        // do the swap - ATTN: assumes it's a direct swap, otherwise needs a path
        console.log("prep the args");
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: inTokenAddress,
                tokenOut: outTokenAddress,
                fee: _uniswapPoolFee,
                recipient: address(this),
                deadline: block.timestamp,
                amountIn: amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        // execute the swap
        console.log("swapping");
        amountReceived = _swapRouter.exactInputSingle(params);
        console.log("done!", amountReceived);
    }
}
