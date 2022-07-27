import { BigInt } from '@graphprotocol/graph-ts'
import { AccountAllocated, ProviderAllocated, ARStorageController } from './types/ARStorageController/ARStorageController'
import { Account, Provider, UserARStorage, ProviderARStorage } from './types/schema'
import { analytics } from './utils'

export function handleAccountAllocated(event: AccountAllocated): void {
	const provider = event.params.provider
	const account = event.params.account
	const accountEntity = Account.load(account.toHex())!
	const userARStorageEntityId = `${provider.toHex()} - ${account.toHex()}`
	let userARStorageEntity = UserARStorage.load(userARStorageEntityId)
	if (userARStorageEntity == null) {
		userARStorageEntity = new UserARStorage(userARStorageEntityId)
	}
	userARStorageEntity.provider = provider.toHex()
	userARStorageEntity.account = account.toHex()
	userARStorageEntity.amount = ARStorageController.bind(event.address).balanceOf(provider, account)
	userARStorageEntity.save()

	accountEntity.arStorage = userARStorageEntityId
	accountEntity.save()

	const analyticEntity = analytics()
	if (!analyticEntity.arStorageUsage) {
		analyticEntity.arStorageUsage = BigInt.fromU64(0)
	}
	analyticEntity.arStorageUsage = analyticEntity.arStorageUsage!.plus(event.params.amount)
	analyticEntity.save()

}

export function handleProviderAllocated(event: ProviderAllocated): void {
	const provider = event.params.provider
	const providerEntity = Provider.load(provider.toHex())!
	const providerARStorageEntityId = `${provider.toHex()}`

	let providerARStorageEntity = ProviderARStorage.load(providerARStorageEntityId)
	if (!providerARStorageEntity) {
		providerARStorageEntity = new ProviderARStorage(providerARStorageEntityId)
	}
	providerARStorageEntity.provider = provider.toHex()
	providerARStorageEntity.amount = ARStorageController.bind(event.address).providerBalanceOf(provider)
	providerARStorageEntity.save()


	providerEntity.arStorage = providerARStorageEntityId
	providerEntity.save()

}
