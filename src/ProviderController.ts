import { BigInt } from '@graphprotocol/graph-ts'
import { AccountRegistered } from './types/ProviderController/ProviderController'
import { Account } from './types/schema'
import { analytics } from './utils'

export function handleAccountRegistered(event: AccountRegistered): void {
	const provider = event.params.provider
	const account = event.params.account
	let entity = Account.load(account.toHex())
	if (!entity) {
		entity = new Account(account.toHex())
		entity.provider = provider.toHex()
		entity.uid = account
		entity.txHash = event.transaction.hash
		entity.timestamp = event.block.timestamp
		entity.save()

		const analyticEntity = analytics()
		if (!analyticEntity.accountCount) {
			analyticEntity.accountCount = BigInt.fromU64(0)
		}
		analyticEntity.accountCount = analyticEntity.accountCount!.plus(BigInt.fromU64(1))
		analyticEntity.save()
	}
}