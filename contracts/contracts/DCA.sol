//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import {ISuperAgreement, SuperAppDefinitions, ISuperfluid, ISuperToken} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
import {IConstantFlowAgreementV1} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/agreements/IConstantFlowAgreementV1.sol";
import {IInstantDistributionAgreementV1} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/agreements/IInstantDistributionAgreementV1.sol";
import {SuperAppBase} from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperAppBase.sol";
import {IDAv1Library} from "@superfluid-finance/ethereum-contracts/contracts/apps/IDAv1Library.sol";

contract DCA is SuperAppBase {
    using IDAv1Library for IDAv1Library.InitData;
    IDAv1Library.InitData internal _idav1Lib;
    uint32 internal constant _INDEX_ID = 0;

    ISuperfluid private _host;
    IConstantFlowAgreementV1 private _cfa;
    IInstantDistributionAgreementV1 private _ida;

    ISuperToken private _acceptedSourceToken;
    ISuperToken private _acceptedTargetToken;

    constructor(
        ISuperfluid host,
        IConstantFlowAgreementV1 cfa,
        IInstantDistributionAgreementV1 ida,
        ISuperToken acceptedSourceToken,
        ISuperToken acceptedTargetToken,
        string memory registrationKey
    ) {
        assert(address(host) != address(0));
        assert(address(cfa) != address(0));
        assert(address(ida) != address(0));

        _host = host;
        _cfa = cfa;
        _ida = ida;
        _acceptedSourceToken = acceptedSourceToken;
        _acceptedTargetToken = acceptedTargetToken;

        _idav1Lib = IDAv1Library.InitData(_host, _ida);
        _idav1Lib.createIndex(_acceptedTargetToken, _INDEX_ID);

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
        uint128 amount;
        string sourceToken;
        string targetToken;
    }

    mapping(address => DcaSetup) private _addressSetup;
    address[] private _investors;

    uint256 public dummyVal;

    // TODO: Invoked by Gelato to trigger buy orders
    function buyAndDistribute()
        external
        returns (uint256 amountSpent, uint256 amountReceived)
    {
        console.log("BTFDCA");
        // TODO: how are the tx fees paid? is it paid by the caller of the function, i.e. Gelato?

        // TODO: determine if this array is needed, and find a better pattern
        DcaSetup[] memory setups = new DcaSetup[](_investors.length);

        // find the setups, and how much to buy
        // TODO: this assumes a single source token to single destination token
        console.log(
            "going to search through the potential buyooors",
            _investors.length
        );
        for (uint256 i = 0; i < _investors.length; i++) {
            console.log("-- looping the investors");
            address investor = _investors[i];
            console.log("got the investor", investor);

            DcaSetup memory s = _addressSetup[investor];
            console.log("got the setup", s.amount);

            // TODO: temp, testing
            if (dummyVal == 0) {
                // TODO: adjust the time calculation, maybe use blocks
                // TODO: this assumes that the full amount has been transferred, since the flow should respect the cadence
                // TODO: replace 51000 by constant
                // timestamps are in seconds + 1 days (24 * 60 * 60)
                // if (block.timestamp >= s.lastBuyTimestamp + 1 days) {
                console.log("time to buy for the investor");
                setups[i] = s;
                amountSpent += s.amount;
                // TODO: update lastBuyTimestamp
                s.lastBuyTimestamp = block.timestamp;

                _idav1Lib.updateSubscriptionUnits(
                    _acceptedTargetToken,
                    _INDEX_ID,
                    investor,
                    s.amount
                );
            }
        }
        console.log("found the buyoooors", setups.length);

        // // TODO: do we need to assert something?
        // // TODO: take 1 bps out of the amount

        // // TODO: >= MINIMUM_AMOUNT_TO_BUY = 1 matic or something
        if (amountSpent > 0) {
            console.log("buying a big bag!", amountSpent);
            //     // TODO: unwrap the tokenx to token
            //     // TODO: ISwapRouter public immutable swapRouter
            //     // TODO: do the swap
            //     // TODO: safe transfer and approve
            //     // TODO: ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams({...})
            //     // TODO: uint256 amountReceived = swapRouter.exactInputSingle(params)
            amountReceived = 1000000000000000000;
        }

        // // TODO: >= MINIMUM_AMOUNT_RECEIVED = something
        if (amountReceived > 0) {
            console.log("LFG!");
            //     // TODO: redistribute to investors
            //     // TODO: calculate the share of each investor
            //     // TODO: _idaDistribute(...)
            _idav1Lib.distribute(
                _acceptedTargetToken,
                _INDEX_ID,
                amountReceived
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

        console.log("byeeeeeoooor", amountSpent, amountReceived);
        dummyVal = 1; // TODO: temp, testing
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
}
