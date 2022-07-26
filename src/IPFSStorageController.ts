import { AccountAllocated, ProviderAllocated, IPFSStorageController } from './types/IPFSStorageController/IPFSStorageController'
import { Account, Provider, UserIPFSStorage, ProviderIPFSStorage } from './types/schema'

export function handleAccountAllocated(event: AccountAllocated): void {
	const provider = event.params.provider
	const account = event.params.account
	const accountEntity = Account.load(account.toHex())!
	const userIPFSStorageEntityId = `${provider.toHex()} - ${account.toHex()}`
	let userIPFSStorageEntity = UserIPFSStorage.load(userIPFSStorageEntityId)
	if (!userIPFSStorageEntity) {
		userIPFSStorageEntity = new UserIPFSStorage(userIPFSStorageEntityId)
	}
	userIPFSStorageEntity.provider = provider.toHex()
	userIPFSStorageEntity.account = account.toHex()
	userIPFSStorageEntity.amount = IPFSStorageController.bind(event.address).balanceOf(provider, account)
	userIPFSStorageEntity.startTime = IPFSStorageController.bind(event.address).startTime(provider, account)
	userIPFSStorageEntity.expiration = IPFSStorageController.bind(event.address).expiration(provider, account)
	userIPFSStorageEntity.save()

	accountEntity.ipfsStorage = userIPFSStorageEntityId
	accountEntity.save()

}

export function handleProviderAllocated(event: ProviderAllocated): void {
	const provider = event.params.provider
	const providerEntity = Provider.load(provider.toHex())!
	const providerIPFSStorageEntityId = `${provider.toHex()}`

	let providerIPFSStorageEntity = ProviderIPFSStorage.load(providerIPFSStorageEntityId)
	if (!providerIPFSStorageEntity) {
		providerIPFSStorageEntity = new ProviderIPFSStorage(providerIPFSStorageEntityId)
	}
	providerIPFSStorageEntity.provider = provider.toHex()
	providerIPFSStorageEntity.amount = IPFSStorageController.bind(event.address).providerBalanceOf(provider)
	providerIPFSStorageEntity.startTime = IPFSStorageController.bind(event.address).providerStartTime(provider)
	providerIPFSStorageEntity.expiration = IPFSStorageController.bind(event.address).providerExpiration(provider)
	providerIPFSStorageEntity.save()

	providerEntity.ipfsStorage = providerIPFSStorageEntityId
	providerEntity.save()

}
