import { AccountAllocated, ProviderAllocated, BandwidthController } from './types/BandwidthController/BandwidthController'
import { Account, Provider, UserBandwidth, ProviderBandwidth } from './types/schema'

export function handleAccountAllocated(event: AccountAllocated): void {
	const provider = event.params.provider
	const account = event.params.account
	const accountEntity = Account.load(account.toHex())!
	const userBandwidthEntityId = `${provider.toHex()} - ${account.toHex()}`
	let userBandwidthEntity = UserBandwidth.load(userBandwidthEntityId)
	if (!userBandwidthEntity) {
		userBandwidthEntity = new UserBandwidth(userBandwidthEntityId)
	}
	userBandwidthEntity.provider = provider.toHex()
	userBandwidthEntity.account = account.toHex()
	userBandwidthEntity.amount = BandwidthController.bind(event.address).balanceOf(provider, account)
	userBandwidthEntity.save()

	accountEntity.bandwidth = userBandwidthEntityId
	accountEntity.save()

}

export function handleProviderAllocated(event: ProviderAllocated): void {
	const provider = event.params.provider
	const providerEntity = Provider.load(provider.toHex())!
	const providerBandwidthEntityId = `${provider.toHex()}`

	let providerBandwidthEntity = ProviderBandwidth.load(providerBandwidthEntityId)
	if (!providerBandwidthEntity) {
		providerBandwidthEntity = new ProviderBandwidth(providerBandwidthEntityId)
	}
	providerBandwidthEntity.provider = provider.toHex()
	providerBandwidthEntity.amount = BandwidthController.bind(event.address).providerBalanceOf(provider)
	providerBandwidthEntity.save()

	providerEntity.bandwidth = providerBandwidthEntityId
	providerEntity.save()

}
