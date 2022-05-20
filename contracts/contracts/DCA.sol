//SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0;

import {IDAv1Library} from "@superfluid-finance/ethereum-contracts/contracts/apps/IDAv1Library.sol";
import {SuperAppBase} from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperAppBase.sol";
import {IConstantFlowAgreementV1} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/agreements/IConstantFlowAgreementV1.sol";
import {IInstantDistributionAgreementV1} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/agreements/IInstantDistributionAgreementV1.sol";
import {ISuperAgreement, SuperAppDefinitions, ISuperfluid, ISuperToken} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "hardhat/console.sol";

contract DCA is SuperAppBase {
    using IDAv1Library for IDAv1Library.InitData;
    IDAv1Library.InitData internal idav1Lib;

    uint32 public constant IDA_INDEX_ID = 1;

    ISuperfluid private sfHost;
    IConstantFlowAgreementV1 private cfa;
    IInstantDistributionAgreementV1 private ida;

    ISuperToken private acceptedSourceToken;
    ISuperToken private acceptedTargetToken;

    ISwapRouter public swapRouter;
    uint256 public minAmountToSpend = 0.1 ether;
    uint256 public minAmountToDistribute = 0;
    uint24 public uniswapPoolFee;

    constructor(
        ISuperfluid _host,
        IConstantFlowAgreementV1 _cfa,
        IInstantDistributionAgreementV1 _ida,
        ISuperToken _acceptedSourceToken,
        ISuperToken _acceptedTargetToken,
        string memory _registrationKey,
        ISwapRouter _swapRouter,
        uint24 _uniswapPoolFee
    ) {
        assert(address(_host) != address(0));
        assert(address(_cfa) != address(0));
        assert(address(_ida) != address(0));
        assert(address(_acceptedSourceToken) != address(0));
        assert(address(_acceptedTargetToken) != address(0));
        assert(address(_swapRouter) != address(0));

        sfHost = _host;
        cfa = _cfa;
        ida = _ida;
        acceptedSourceToken = _acceptedSourceToken;
        acceptedTargetToken = _acceptedTargetToken;
        swapRouter = _swapRouter;
        uniswapPoolFee = _uniswapPoolFee;

        idav1Lib = IDAv1Library.InitData(sfHost, ida);
        // TODO: use block.timestamp or something?
        idav1Lib.createIndex(acceptedTargetToken, IDA_INDEX_ID);

        // this reflects the callbacks that are NOT implemented
        uint256 configWord = SuperAppDefinitions.APP_LEVEL_FINAL |
            SuperAppDefinitions.BEFORE_AGREEMENT_CREATED_NOOP |
            SuperAppDefinitions.BEFORE_AGREEMENT_UPDATED_NOOP |
            SuperAppDefinitions.AFTER_AGREEMENT_UPDATED_NOOP |
            SuperAppDefinitions.BEFORE_AGREEMENT_TERMINATED_NOOP;

        // needs a registration key for mainnet
        if (bytes(_registrationKey).length > 0) {
            sfHost.registerAppWithKey(configWord, _registrationKey);
        } else {
            sfHost.registerApp(configWord);
        }

        console.log("HELLO FROM CTOR!");
    }

    /**************************************************************************
     * Misc
     *************************************************************************/

    // TODO: onlyAdmin
    function setMinAmountToSpend(uint256 _newMinAmountToSpend) public {
        minAmountToSpend = _newMinAmountToSpend;
    }

    // TODO: onlyAdmin
    function setMinAmountToDistribute(uint256 _newMinAmountToDistribute)
        public
    {
        minAmountToDistribute = _newMinAmountToDistribute;
    }

    // TODO: set pool fee

    // TODO: set swap router

    // solhint-disable-next-line
    receive() external payable {
        // Function to receive Ether. msg.data must be empty
    }

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}

    // TODO: withdraw native

    // TODO: withdraw erc20

    /**************************************************************************
     * DCA logic
     *************************************************************************/
    struct DcaSetup {
        uint256 lastBuyTimestamp;
        uint128 amount;
        string sourceToken;
        string targetToken;
    }

    mapping(address => DcaSetup) public addressSetup;
    address[] public investors;

    // TODO: onlyOwner and allowed addresses, etc
    // TODO: invoked by a keeper (e.g. Gelato) to trigger buy orders
    // TODO: delay = 1 days + 1 minutes
    function buyAndDistribute(uint256 delay)
        external
        returns (uint256 _amountSpent, uint256 _amountReceived)
    {
        // TODO: tx fees are paid by the caller of the function, e.g. Gelato
        console.log("BTFDCA");

        // find the investors, and the total amount to buy
        address[] memory currentInvestors = new address[](investors.length);
        uint256 j = 0;
        console.log("search through the potential buyooors", investors.length);
        for (uint256 i = 0; i < investors.length; i++) {
            address investor = investors[i];
            DcaSetup memory s = addressSetup[investor];

            // TODO: adjust the time calculation, maybe use blocks
            if (block.timestamp >= s.lastBuyTimestamp + delay) {
                // TODO: check that the full amount has been transferred
                // i.e. that the investor has actually streamed s.amount
                // how? can realTimeBalanceOf help?
                // is the assert implicit with the time check, since the flow should respect the cadence?
                // and when the stream is terminated, we remove them from the list of investors, so this
                // becomes a non issue?

                // we're keeping track of the total amount we're going to spend
                _amountSpent += s.amount;

                // update lastBuyTimestamp for this investor
                s.lastBuyTimestamp = block.timestamp;

                // keep track of the investors for the distribution
                currentInvestors[j] = investor;
                j++;
            }
        }

        // TODO: assert that balanceOf(contract) >= _amountSpent
        // TODO: take 1 bps out of the amount - check for overflows...

        // perform the swap
        console.log("buying a big bag!", _amountSpent);
        if (_amountSpent > minAmountToSpend) {
            // unwrap the tokenxs (in to uniswap, out from uniswap)
            address inTokenAddress = acceptedSourceToken.getUnderlyingToken();
            address outTokenAddress = acceptedTargetToken.getUnderlyingToken();

            // downgrading supertoken to erc20 calls transfer to send the tokens back to the contract
            // only do this if source token is not a pure supertoken
            if (inTokenAddress != address(0)) {
                acceptedSourceToken.downgrade(_amountSpent);
            }

            // tradooooor
            // if tokens are pure supertokens, then use their address, otherwise use the erc20 address
            _amountReceived = swapTokens(
                inTokenAddress == address(0)
                    ? address(acceptedSourceToken)
                    : inTokenAddress,
                outTokenAddress == address(0)
                    ? address(acceptedTargetToken)
                    : outTokenAddress,
                _amountSpent
            );

            // wrap the output to a supertoken
            // only do this if target token is not a pure supertoken
            if (outTokenAddress != address(0)) {
                // TODO: rex is doing it this way - is it actually needed?
                // upgrade(_amountReceived * (10 ** (18 - ERC20(outputToken).decimals())));
                acceptedTargetToken.upgrade(_amountReceived);
            }
        }

        // distribute the swapped tokens to the investors; 2nd check is kinda redundant
        // TODO: what happens if we've swapped, but the amountReceived is NOT greater than minAMountToDistribute?
        console.log("giving back");
        if (
            _amountReceived > minAmountToDistribute &&
            currentInvestors.length > 0
        ) {
            // update the shares of this investor
            // we want to do this after we've made sure that the swap has gone through
            console.log("update shares");
            for (uint256 i = 0; i < currentInvestors.length; i++) {
                address ci = currentInvestors[i];
                if (ci == address(0)) break; // no more investors

                // TODO: does this ADD to the units, or replaces it? we want to add
                idav1Lib.updateSubscriptionUnits(
                    acceptedTargetToken,
                    IDA_INDEX_ID,
                    ci,
                    addressSetup[ci].amount
                );
            }

            // redistribute to investors
            console.log("LFG!");
            idav1Lib.distribute(
                acceptedTargetToken,
                IDA_INDEX_ID,
                _amountReceived
            );
        }

        /*
            TODO: check
            Super Apps can't became insolvent.
            - Check if any interaction can lead to insolvency situation.
            - What is an insolvency situation? This occurs when a Super App
            tries to continue sending funds that it no longer has. Its super
            token balance must stay > 0 at minimum. You can learn more about
            liquidation & solvency in our section on this topic.
        */

        console.log("byeeeeeoooor", _amountSpent, _amountReceived);
    }

    // TODO: visibility, only admin, etc
    function swapTokens(
        address inTokenAddress,
        address outTokenAddress,
        uint256 amountSpent
    ) internal returns (uint256 amountReceived) {
        // TODO: doing trade on  uniswap, but ideally call a proxy
        console.log("swap it!");
        console.log("from", inTokenAddress);
        console.log("to", outTokenAddress);
        console.log("much", amountSpent);

        // TODO: if(!allowance <= amountSpent) then do this
        // approve the spend on uniswap
        console.log("approving the spend");
        TransferHelper.safeApprove(
            inTokenAddress,
            address(swapRouter),
            amountSpent
        );

        // do the swap - ATTN: assumes it's a direct swap, otherwise needs a path
        console.log("prep the args");
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: inTokenAddress,
                tokenOut: outTokenAddress,
                fee: uniswapPoolFee,
                recipient: address(this),
                deadline: block.timestamp,
                amountIn: amountSpent,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        // execute the swap
        console.log("swapping");
        amountReceived = swapRouter.exactInputSingle(params);
        console.log("done!", amountReceived);
    }

    /**************************************************************************
     * SuperApp callbacks
     *************************************************************************/

    /*
        When a stream is created into a Super App (this will make the Super App the receiver ), the
        beforeAgreementCreated and the afterAgreementCreated callback may be run. These callbacks can
        execute any arbitrary logic, as long as this logic fits within the rules of standard smart
        contract development and the rules of Super Apps (which are explained further later on in this
        section).

        One additional thing to note about the beforeAgreement callbacks is that they are view functions.
        So, if you want to, for example, save a variable to state in response to something that happens in
        the beforeAgreement callback, you should do the following:
        - Return the data that you want to save inside the beforeAgreement callback (this returned value will
        be passed to the afterAgreement callback as cbdata, which we explain below)
        - Save the variable to state inside of the afterAgreement callback
        - Make sure that you have an implementation for both the beforeAgreement and afterAgreement callbacks
    */

    function afterAgreementCreated(
        ISuperToken, // _superToken,
        address, // _agreementClass,
        bytes32, // _agreementId,
        bytes calldata, /*_agreementData*/
        bytes calldata, // _cbdata,
        bytes calldata _ctx
    ) external override onlyHost returns (bytes memory) {
        // TODO: this logic is for a CFA only - assert agreementClass is CFA
        console.log("HELLO FROM AFTER AGREEMENT CREATED!");

        ISuperfluid.Context memory decodedContext = sfHost.decodeCtx(_ctx);
        console.log("sender:", decodedContext.msgSender);

        if (decodedContext.userData.length == 0) {
            // TODO: error
            console.log("no user data");
        }

        // decode user data (src token, amount, target token)
        (
            string memory srcToken,
            uint128 amount,
            string memory targetToken
        ) = abi.decode(decodedContext.userData, (string, uint128, string));

        // TODO: validations

        // create a setup entry for this address
        console.log("creating the setup with");
        console.log(amount);
        console.log(srcToken);
        console.log(targetToken);
        console.log(decodedContext.timestamp);
        DcaSetup memory setup = DcaSetup({
            amount: amount, // TODO: floating points are not accepted in amount
            sourceToken: srcToken, // TODO: require srcToken to be a valid token
            targetToken: targetToken, // TODO: require targetToken to be a valid token
            lastBuyTimestamp: decodedContext.timestamp // TODO: assert this is now()
        });

        console.log("current number of investors", investors.length);
        addressSetup[decodedContext.msgSender] = setup;
        investors.push(decodedContext.msgSender);
        console.log("added new setup", investors.length);

        console.log("returning!");
        return _ctx;
    }

    function afterAgreementTerminated(
        ISuperToken, // _superToken,
        address, // _agreementClass,
        bytes32, //_agreementId,
        bytes calldata, // _agreementData,
        bytes calldata, //_cbdata,
        bytes calldata _ctx
    ) external override onlyHost returns (bytes memory) {
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
        ISuperfluid.Context memory decodedContext = sfHost.decodeCtx(_ctx);

        DcaSetup memory dca = addressSetup[decodedContext.msgSender];
        if (dca.lastBuyTimestamp > 0) {
            delete addressSetup[decodedContext.msgSender];

            // iterate, find index, and remove from investors
            for (uint8 i = 0; i < investors.length; i++) {
                if (investors[i] == decodedContext.msgSender) {
                    investors[i] = investors[investors.length - 1];
                    investors.pop();

                    break;
                }
            }

            // TODO: return any funds they have
        }

        return _ctx;
    }

    // function _isSameToken(ISuperToken superToken) private view returns (bool) {
    //     return address(superToken) == address(_acceptedToken);
    // }

    // function _isCFAv1(address agreementClass) private view returns (bool) {
    //     return
    //         ISuperAgreement(agreementClass).agreementType() ==
    //         keccak256(
    //             "org.superfluid-finance.agreements.ConstantFlowAgreement.v1"
    //         );
    // }

    modifier onlyHost() {
        require(
            msg.sender == address(sfHost),
            "RedirectAll: support only one host"
        );
        _;
    }

    // modifier onlyExpected(ISuperToken superToken, address agreementClass) {
    //     require(_isSameToken(superToken), "RedirectAll: not accepted token");
    //     require(_isCFAv1(agreementClass), "RedirectAll: only CFAv1 supported");
    //     _;
    // }
}
