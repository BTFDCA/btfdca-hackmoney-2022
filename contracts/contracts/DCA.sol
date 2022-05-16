//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import {ISuperAgreement, SuperAppDefinitions, ISuperfluid, ISuperToken} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
import {IConstantFlowAgreementV1} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/agreements/IConstantFlowAgreementV1.sol";
import {IInstantDistributionAgreementV1} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/agreements/IInstantDistributionAgreementV1.sol";
import {SuperAppBase} from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperAppBase.sol";

contract DCA is SuperAppBase {
    /*
        1) Super Apps cannot revert in the termination callback (afterAgreementTerminated())
        - Use the trycatch pattern if performing an action which interacts with other contracts inside of the callback. Doing things like transferring tokens without using the trycatch pattern is dangerous and should be avoided.
        - Double check internal logic to find any revert possibility.

        2) Super Apps can't became insolvent.
        - Check if any interaction can lead to insolvency situation.
        - What is an insolvency situation? This occurs when a Super App tries to continue sending funds that it no longer has. Its super token balance must stay > 0 at minimum. You can learn more about liquidation & solvency in our section on this topic.

        3) Gas limit operations within the termination callback (afterAgreementTerminated())
        - There is a limit of gas limit send in a callback function (3000000 gas units)
        - If the Super App reverts on terminations calls because of an out-of-gas error, it will be jailed.
        - For legitimate cases where the app reverts for out-of-gas (below the gas limit), the Super App is subject to user decision to send a new transaction with more gas. If the app still reverts, it will be jailed.
        - To protect against these cases, don't create Super Apps that require too much gas within the termination callback.

        4) Incorrect ctx (short for context) data within the termination callback
        - Any attempt to tamper with the value of ctx or failing to give the right ctx will result in a Jailed App.
        - Any time a protocol function returns a ctx, that ctx should be passed to the next called function. It will repeat this process even in the return of the callback itself.
        - For more information on ctx and how it works you can check out our tutorial on userData.
    */

    ISuperfluid private _host;
    IConstantFlowAgreementV1 private _cfa;
    IInstantDistributionAgreementV1 private _ida;

    constructor(
        ISuperfluid host,
        IConstantFlowAgreementV1 cfa,
        IInstantDistributionAgreementV1 ida,
        // ISuperToken[] memory acceptedSourceTokens,
        // ISuperToken[] memory acceptedTargetTokens,
        string memory registrationKey
    ) {
        assert(address(host) != address(0));
        assert(address(cfa) != address(0));
        assert(address(ida) != address(0));

        _host = host;
        _cfa = cfa;
        _ida = ida;

        // this reflects the callbacks that are NOT implemented
        uint256 configWord = SuperAppDefinitions.APP_LEVEL_FINAL |
            SuperAppDefinitions.BEFORE_AGREEMENT_CREATED_NOOP |
            SuperAppDefinitions.BEFORE_AGREEMENT_UPDATED_NOOP |
            SuperAppDefinitions.AFTER_AGREEMENT_UPDATED_NOOP |
            SuperAppDefinitions.BEFORE_AGREEMENT_TERMINATED_NOOP;

        // needs a registration key for mainnet
        if (bytes(registrationKey).length > 0) {
            _host.registerAppWithKey(configWord, registrationKey);
        } else {
            _host.registerApp(configWord);
        }

        console.log("HELLO FROM CTOR!");
    }

    /**************************************************************************
     * Misc
     *************************************************************************/

    // solhint-disable-next-line
    receive() external payable {
        // Function to receive Ether. msg.data must be empty
    }

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}

    /**************************************************************************
     * DCA logic
     *************************************************************************/
    struct DcaSetup {
        uint256 lastBuyTimestamp;
        uint256 amount;
        string sourceToken;
        string targetToken;
    }

    mapping(address => DcaSetup) private _addressSetup;
    address[] private _investors;

    // Invoked by Gelato to trigger buy orders
    function buyAndDistribute()
        external
        returns (uint256 inputAmount, uint256 outputAmount)
    {
        console.log("BTFDCA");
        // TODO: how are the tx fees paid? is it paid by the caller of the function, i.e. Gelato?

        // TODO: determine if this array is needed, and find a better pattern
        address[] memory investors;
        uint256 amountToBuy;
        uint256 amountReceived;

        // // find the investors, and how much to buy
        // // TODO: this assumes a single source token to single destination token
        // for (uint256 i = 0; i < arr.length; i++) {
        //     DcaSetup memory s = arr[i];
        //     // TODO: adjust the time calculation, maybe use blocks
        //     // TODO: this assumes that the full amount has been transferred, since the flow should respect the cadence
        //     // timestamps are in seconds + 1 day (24 * 60 * 60)
        //     if (block.timestamp >= s.lastBuyTimestamp + 51000) {
        //         investors[i] = s;
        //         amountToBuy += s.amount;
        //         // TODO: update lastBuyTimestamp
        //     }
        // }
        // console.log("found the buyoooors");

        // // TODO: do we need to assert something?
        // // TODO: take 1 bps out of the amount

        // // TODO: >= MINIMUM_AMOUNT_TO_BUY = 1 matic or something
        // if (amountToBuy > 0) {
        //     console.log("buying a big bag!", amountToBuy);
        //     // TODO: unwrap the tokenx to token
        //     // TODO: ISwapRouter public immutable swapRouter
        //     // TODO: do the swap
        //     // TODO: safe transfer and approve
        //     // TODO: ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams({...})
        //     // TODO: uint256 amountReceived = swapRouter.exactInputSingle(params)
        // }
        inputAmount = 1;
        outputAmount = 2;

        // // TODO: >= MINIMUM_AMOUNT_RECEIVED = something
        // if (amountReceived > 0) {
        //     console.log("LFG!");
        //     // TODO: redistribute to investors
        //     // TODO: calculate the share of each investor
        //     // TODO: _idaDistribute(...)
        // }

        console.log("byeeeeeoooor", inputAmount, outputAmount);
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

        ISuperfluid.Context memory decodedContext = _host.decodeCtx(_ctx);
        console.log("sender:", decodedContext.msgSender);

        if (decodedContext.userData.length == 0) {
            // TODO: error
            console.log("no user data");
        }

        // decode user data (src token, amount, target token)
        (
            string memory srcToken,
            uint256 amount,
            string memory targetToken
        ) = abi.decode(decodedContext.userData, (string, uint256, string));

        // TODO: validations

        // create a setup entry for this address
        console.log("creating the setup");
        DcaSetup memory setup = DcaSetup({
            amount: amount, // TODO: floating points are not accepted in amount
            sourceToken: srcToken, // TODO: require srcToken to be a valid token
            targetToken: targetToken, // TODO: require targetToken to be a valid token
            lastBuyTimestamp: decodedContext.timestamp // TODO: assert this is now()
        });

        console.log("current number of investors", _investors.length);
        _addressSetup[decodedContext.msgSender] = setup;
        _investors.push(decodedContext.msgSender);
        console.log("added new setup", _investors.length);

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
        ISuperfluid.Context memory decodedContext = _host.decodeCtx(_ctx);

        DcaSetup memory dca = _addressSetup[decodedContext.msgSender];
        if (dca.lastBuyTimestamp > 0) {
            delete _addressSetup[decodedContext.msgSender];

            // iterate, find index, and remove from _investors
            for (uint8 i = 0; i < _investors.length; i++) {
                if (_investors[i] == decodedContext.msgSender) {
                    _investors[i] = _investors[_investors.length - 1];
                    _investors.pop();

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
            msg.sender == address(_host),
            "RedirectAll: support only one host"
        );
        _;
    }

    // modifier onlyExpected(ISuperToken superToken, address agreementClass) {
    //     require(_isSameToken(superToken), "RedirectAll: not accepted token");
    //     require(_isCFAv1(agreementClass), "RedirectAll: only CFAv1 supported");
    //     _;
    // }

    /**************************************************************************
     * IDA logic
     *************************************************************************/

    // TODO: send tokens back to buyers by calling the IDA
    // https://docs.superfluid.finance/superfluid/protocol-developers/super-apps/super-app-callbacks/calling-agreements-in-super-apps
    // https://docs.superfluid.finance/superfluid/protocol-developers/solidity-examples/solidity-libraries/idav1-library

    // https://github.com/Ricochet-Exchange/ricochet-protocol/blob/59124ded777eee9cc2d4bff24a11b0f81f80a732/contracts/REXMarket.sol#L507
    // /// @dev Distributes `_distAmount` amount of `_distToken` token among all IDA index subscribers
    // /// @param _index IDA index ID
    // /// @param _distAmount amount to distribute
    // /// @param _distToken distribute token address
    // /// @param _ctx SuperFluid context data
    // /// @return _newCtx updated SuperFluid context data
    // function _idaDistribute(
    //     uint32 _index,
    //     uint128 _distAmount,
    //     ISuperToken _distToken,
    //     bytes memory _ctx
    // ) internal returns (bytes memory _newCtx) {
    //     _newCtx = _ctx;
    //     if (_newCtx.length == 0) {
    //         // No context provided
    //         host.callAgreement(
    //             ida,
    //             abi.encodeWithSelector(
    //                 ida.distribute.selector,
    //                 _distToken,
    //                 _index,
    //                 _distAmount,
    //                 new bytes(0) // placeholder ctx
    //             ),
    //             new bytes(0) // user data
    //         );
    //     } else {
    //         (_newCtx, ) = host.callAgreementWithContext(
    //             ida,
    //             abi.encodeWithSelector(
    //                 ida.distribute.selector,
    //                 _distToken,
    //                 _index,
    //                 _distAmount,
    //                 new bytes(0) // placeholder ctx
    //             ),
    //             new bytes(0), // user data
    //             _newCtx
    //         );
    //     }
    // }

    // /// @dev Get `_streamer` IDA subscription info for token with index `_index`
    // /// @param _index is token index in IDA
    // /// @param _streamer is streamer address
    // /// @return _exist Does the subscription exist?
    // /// @return _approved Is the subscription approved?
    // /// @return _units Units of the suscription.
    // /// @return _pendingDistribution Pending amount of tokens to be distributed for unapproved subscription.
    // function getIDAShares(uint32 _index, address _streamer)
    //     public
    //     view
    //     returns (
    //         bool _exist,
    //         bool _approved,
    //         uint128 _units,
    //         uint256 _pendingDistribution
    //     )
    // {
    //     (_exist, _approved, _units, _pendingDistribution) = ida.getSubscription(
    //         market.outputPools[_index].token,
    //         address(this),
    //         _index,
    //         _streamer
    //     );
    // }

    // function _updateShareholder(
    //     bytes memory _ctx,
    //     ShareholderUpdate memory _shareholderUpdate
    // ) internal virtual returns (bytes memory _newCtx) {
    //     // We need to go through all the output tokens and update their IDA shares
    //     _newCtx = _ctx;

    //     (uint128 userShares, uint128 daoShares, uint128 affiliateShares) = _getShareAllocations(_shareholderUpdate);

    //     // updateOutputPools
    //     for (uint32 _index = 0; _index < market.numOutputPools; _index++) {
    //         _newCtx = _updateSubscriptionWithContext(
    //             _newCtx,
    //             _index,
    //             _shareholderUpdate.shareholder,
    //             // shareholder gets 98% of the units, DAO takes 0.02%
    //             userShares,
    //             market.outputPools[_index].token
    //         );
    //         _newCtx = _updateSubscriptionWithContext(
    //             _newCtx,
    //             _index,
    //             owner(),
    //             // shareholder gets 98% of the units, DAO takes 2%
    //             daoShares,
    //             market.outputPools[_index].token
    //         );
    //         _newCtx = _updateSubscriptionWithContext(
    //             _newCtx,
    //             _index,
    //             referrals.getAffiliateAddress(_shareholderUpdate.shareholder),
    //             // affiliate may get 0.2%
    //             affiliateShares,
    //             market.outputPools[_index].token
    //         );
    //         // TODO: Update the fee taken by the DAO
    //     }
    // }

    //     function _getShareAllocations(ShareholderUpdate memory _shareholderUpdate)
    //  internal returns (uint128 userShares, uint128 daoShares, uint128 affiliateShares)
    // {
    //   (,,daoShares,) = getIDAShares(market.outputPoolIndicies[_shareholderUpdate.token], owner());
    //   daoShares *= market.outputPools[market.outputPoolIndicies[_shareholderUpdate.token]].shareScaler;

    //   address affiliateAddress = referrals.getAffiliateAddress(_shareholderUpdate.shareholder);
    //   if (address(0) != affiliateAddress) {
    //     (,,affiliateShares,) = getIDAShares(market.outputPoolIndicies[_shareholderUpdate.token], affiliateAddress);
    //     affiliateShares *= market.outputPools[market.outputPoolIndicies[_shareholderUpdate.token]].shareScaler;
    //   }

    //   // Compute the change in flow rate, will be negative is slowing the flow rate
    //   int96 changeInFlowRate = _shareholderUpdate.currentFlowRate - _shareholderUpdate.previousFlowRate;
    //   uint128 feeShares;
    //   // if the change is positive value then DAO has some new shares,
    //   // which would be 2% of the increase in shares
    //   if(changeInFlowRate > 0) {
    //     // Add new shares to the DAO
    //     feeShares = uint128(uint256(int256(changeInFlowRate)) * market.feeRate / 1e6);
    //     if (address(0) != affiliateAddress) {
    //       affiliateShares += feeShares * market.affiliateFee / 1e6;
    //       feeShares -= feeShares * market.affiliateFee / 1e6;
    //     }
    //     daoShares += feeShares;
    //   } else {
    //     // Make the rate positive
    //     changeInFlowRate = -1 * changeInFlowRate;
    //     feeShares = uint128(uint256(int256(changeInFlowRate)) * market.feeRate / 1e6);
    //     if (address(0) != affiliateAddress) {
    //       affiliateShares -= (feeShares * market.affiliateFee / 1e6 > affiliateShares) ? affiliateShares : feeShares * market.affiliateFee / 1e6;
    //       feeShares -= feeShares * market.affiliateFee / 1e6;
    //     }
    //     daoShares -= (feeShares > daoShares) ? daoShares : feeShares;
    //   }
    //   userShares = uint128(uint256(int256(_shareholderUpdate.currentFlowRate))) * (1e6 - market.feeRate) / 1e6;

    //   // Scale back shares
    //   affiliateShares /= market.outputPools[market.outputPoolIndicies[_shareholderUpdate.token]].shareScaler;
    //   daoShares /= market.outputPools[market.outputPoolIndicies[_shareholderUpdate.token]].shareScaler;
    //   userShares /= market.outputPools[market.outputPoolIndicies[_shareholderUpdate.token]].shareScaler;

    // }

    // function _getShareholderInfo(bytes calldata _agreementData, ISuperToken _superToken)
    //     internal
    //     view
    //     returns (address _shareholder, int96 _flowRate, uint256 _timestamp)
    // {
    //     (_shareholder, ) = abi.decode(_agreementData, (address, address));
    //     (_timestamp, _flowRate, , ) = cfa.getFlow(
    //         _superToken,
    //         _shareholder,
    //         address(this)
    //     );
    // }

    // function _createIndex(uint256 index, ISuperToken distToken) internal {
    //     host.callAgreement(
    //         ida,
    //         abi.encodeWithSelector(
    //             ida.createIndex.selector,
    //             distToken,
    //             index,
    //             new bytes(0) // placeholder ctx
    //         ),
    //         new bytes(0) // user data
    //     );
    // }

    // /// @dev Set new `shares` share for `subscriber` address in IDA with `index` index
    // /// @param index IDA index ID
    // /// @param subscriber is subscriber address
    // /// @param shares is distribution shares count
    // /// @param distToken is distribution token address
    // function _updateSubscription(
    //     uint256 index,
    //     address subscriber,
    //     uint128 shares,
    //     ISuperToken distToken
    // ) internal {
    //     host.callAgreement(
    //         ida,
    //         abi.encodeWithSelector(
    //             ida.updateSubscription.selector,
    //             distToken,
    //             index,
    //             subscriber,
    //             shares,
    //             new bytes(0) // placeholder ctx
    //         ),
    //         new bytes(0) // user data
    //     );
    // }

    // /// @dev Same as _updateSubscription but uses provided SuperFluid context data
    // /// @param ctx SuperFluid context data
    // /// @param index IDA index ID
    // /// @param subscriber is subscriber address
    // /// @param shares is distribution shares count
    // /// @param distToken is distribution token address
    // /// @return newCtx updated SuperFluid context data
    // function _updateSubscriptionWithContext(
    //     bytes memory ctx,
    //     uint256 index,
    //     address subscriber,
    //     uint128 shares,
    //     ISuperToken distToken
    // ) internal returns (bytes memory newCtx) {
    //     newCtx = ctx;
    //     (newCtx, ) = host.callAgreementWithContext(
    //         ida,
    //         abi.encodeWithSelector(
    //             ida.updateSubscription.selector,
    //             distToken,
    //             index,
    //             subscriber,
    //             shares,
    //             new bytes(0)
    //         ),
    //         new bytes(0), // user data
    //         newCtx
    //     );
    // }
}
