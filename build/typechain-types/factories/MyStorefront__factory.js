"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyStorefront__factory = void 0;
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
const ethers_1 = require("ethers");
const _abi = [
    {
        inputs: [
            {
                internalType: "string",
                name: "_metadata",
                type: "string",
            },
        ],
        name: "createStorefront",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        name: "storefronts",
        outputs: [
            {
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                internalType: "string",
                name: "metadata",
                type: "string",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
];
const _bytecode = "0x608060405234801561001057600080fd5b50610a1c806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80636c551b8a1461003b578063d0c8d6e71461006c575b600080fd5b610055600480360381019061005091906103ac565b610088565b604051610063929190610478565b60405180910390f35b610086600480360381019061008191906105dd565b610154565b005b60006020528060005260406000206000915090508060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060010180546100d190610655565b80601f01602080910402602001604051908101604052809291908181526020018280546100fd90610655565b801561014a5780601f1061011f5761010080835404028352916020019161014a565b820191906000526020600020905b81548152906001019060200180831161012d57829003601f168201915b5050505050905082565b6000815111610198576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161018f906106d2565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff166000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614610268576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161025f9061073e565b60405180910390fd5b600060405180604001604052803373ffffffffffffffffffffffffffffffffffffffff168152602001838152509050806000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060208201518160010190816103329190610914565b509050505050565b6000604051905090565b600080fd5b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006103798261034e565b9050919050565b6103898161036e565b811461039457600080fd5b50565b6000813590506103a681610380565b92915050565b6000602082840312156103c2576103c1610344565b5b60006103d084828501610397565b91505092915050565b6103e28161036e565b82525050565b600081519050919050565b600082825260208201905092915050565b60005b83811015610422578082015181840152602081019050610407565b60008484015250505050565b6000601f19601f8301169050919050565b600061044a826103e8565b61045481856103f3565b9350610464818560208601610404565b61046d8161042e565b840191505092915050565b600060408201905061048d60008301856103d9565b818103602083015261049f818461043f565b90509392505050565b600080fd5b600080fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6104ea8261042e565b810181811067ffffffffffffffff82111715610509576105086104b2565b5b80604052505050565b600061051c61033a565b905061052882826104e1565b919050565b600067ffffffffffffffff821115610548576105476104b2565b5b6105518261042e565b9050602081019050919050565b82818337600083830152505050565b600061058061057b8461052d565b610512565b90508281526020810184848401111561059c5761059b6104ad565b5b6105a784828561055e565b509392505050565b600082601f8301126105c4576105c36104a8565b5b81356105d484826020860161056d565b91505092915050565b6000602082840312156105f3576105f2610344565b5b600082013567ffffffffffffffff81111561061157610610610349565b5b61061d848285016105af565b91505092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168061066d57607f821691505b6020821081036106805761067f610626565b5b50919050565b7f4d657461646174612073686f756c64206e6f7420626520656d70747900000000600082015250565b60006106bc601c836103f3565b91506106c782610686565b602082019050919050565b600060208201905081810360008301526106eb816106af565b9050919050565b7f53746f726566726f6e7420616c72656164792065786973747300000000000000600082015250565b60006107286019836103f3565b9150610733826106f2565b602082019050919050565b600060208201905081810360008301526107578161071b565b9050919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b6000600883026107c07fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82610783565b6107ca8683610783565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b600061081161080c610807846107e2565b6107ec565b6107e2565b9050919050565b6000819050919050565b61082b836107f6565b61083f61083782610818565b848454610790565b825550505050565b600090565b610854610847565b61085f818484610822565b505050565b5b818110156108835761087860008261084c565b600181019050610865565b5050565b601f8211156108c8576108998161075e565b6108a284610773565b810160208510156108b1578190505b6108c56108bd85610773565b830182610864565b50505b505050565b600082821c905092915050565b60006108eb600019846008026108cd565b1980831691505092915050565b600061090483836108da565b9150826002028217905092915050565b61091d826103e8565b67ffffffffffffffff811115610936576109356104b2565b5b6109408254610655565b61094b828285610887565b600060209050601f83116001811461097e576000841561096c578287015190505b61097685826108f8565b8655506109de565b601f19841661098c8661075e565b60005b828110156109b45784890151825560018201915060208501945060208101905061098f565b868310156109d157848901516109cd601f8916826108da565b8355505b6001600288020188555050505b50505050505056fea2646970667358221220238d1488acbaf87477b3bd3cb33519f23743ed9f6a28df7f61bcaf11d82d278264736f6c63430008180033";
const isSuperArgs = (xs) => xs.length > 1;
class MyStorefront__factory extends ethers_1.ContractFactory {
    constructor(...args) {
        if (isSuperArgs(args)) {
            super(...args);
        }
        else {
            super(_abi, _bytecode, args[0]);
        }
    }
    getDeployTransaction(overrides) {
        return super.getDeployTransaction(overrides || {});
    }
    deploy(overrides) {
        return super.deploy(overrides || {});
    }
    connect(runner) {
        return super.connect(runner);
    }
    static createInterface() {
        return new ethers_1.Interface(_abi);
    }
    static connect(address, runner) {
        return new ethers_1.Contract(address, _abi, runner);
    }
}
exports.MyStorefront__factory = MyStorefront__factory;
MyStorefront__factory.bytecode = _bytecode;
MyStorefront__factory.abi = _abi;
