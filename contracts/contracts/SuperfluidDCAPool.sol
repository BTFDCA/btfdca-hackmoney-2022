//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

import {IDAv1Library} from "@superfluid-finance/ethereum-contracts/contracts/apps/IDAv1Library.sol";
import {SuperAppBase} from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperAppBase.sol";
import {IConstantFlowAgreementV1} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/agreements/IConstantFlowAgreementV1.sol";
import {IInstantDistributionAgreementV1} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/agreements/IInstantDistributionAgreementV1.sol";
import {ISuperAgreement, ISuperfluid, ISuperToken} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

abstract contract SfDCAPool is Ownable, ReentrancyGuard, SuperAppBase {
    using IDAv1Library for IDAv1Library.InitData;

    ISuperfluid internal _sfHost;
    IConstantFlowAgreementV1 internal _cfa;
    IDAv1Library.InitData internal _idav1Lib;
    ISuperToken internal _sourceToken; // the token that's streamed in
    ISuperToken internal _targetToken; // the token that's distributed back
    uint32 public _idaIndex; // distribution index

    constructor(
        ISuperfluid host,
        IConstantFlowAgreementV1 cfa,
        IInstantDistributionAgreementV1 ida,
        uint32 idaIndex,
        ISuperToken sourceToken,
        ISuperToken targetToken
    ) {
        // check validity
        assert(address(host) != address(0));
        assert(address(cfa) != address(0));
        assert(address(ida) != address(0));
        assert(address(sourceToken) != address(0));
        assert(address(targetToken) != address(0));

        // store references
        _sfHost = host;
        _cfa = cfa;
        _idaIndex = idaIndex;
        _sourceToken = sourceToken;
        _targetToken = targetToken;

        // initialize IDA
        _idav1Lib = IDAv1Library.InitData(_sfHost, ida);
        _idav1Lib.createIndex(_targetToken, _idaIndex);
    }

    /**************************************************************************
     * MISC
     *************************************************************************/

    modifier onlyHost() {
        require(msg.sender == address(_sfHost), "OH");
        _;
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

    // modifier onlyExpected(ISuperToken superToken, address agreementClass) {
    //     require(_isSameToken(superToken), "RedirectAll: not accepted token");
    //     require(_isCFAv1(agreementClass), "RedirectAll: only CFAv1 supported");
    //     _;
    // }
}
