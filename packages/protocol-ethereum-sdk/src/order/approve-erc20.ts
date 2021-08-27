import { Address, BigNumber } from "@rarible/protocol-api-client"
import { Ethereum, EthereumTransaction } from "@rarible/ethereum-provider"
import { BigNumberValue, toBn } from "@rarible/utils/build/bn"
import { createErc20Contract } from "./contracts/erc20"

const infiniteBn = toBn(2).pow(256).minus(1)

export async function approveErc20(
	ethereum: Ethereum,
	contract: Address,
	owner: Address,
	operator: Address,
	value: BigNumber | BigNumberValue,
	infinite: boolean = true
): Promise<EthereumTransaction | undefined> {
	const erc20 = createErc20Contract(ethereum, contract)
	const allowance = toBn(await erc20.functionCall("allowance", owner, operator).call())
	const bnValue = toBn(value)
	if (allowance.lt(bnValue)) {
		if (!infinite) {
			return erc20.functionCall("approve", operator, bnValue.toFixed()).send()
		} else {
			return erc20.functionCall("approve", operator, infiniteBn.toFixed()).send()
		}
	} else {
		return undefined
	}
}
