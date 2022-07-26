import { AccountAllocated, ProviderAllocated, BuildingTimeController } from './types/BuildingTimeController/BuildingTimeController'
import { Account, Provider, UserBuildingTime, ProviderBuildingTime } from './types/schema'

export function handleAccountAllocated(event: AccountAllocated): void {
	const provider = event.params.provider
	const account = event.params.account
	const accountEntity = Account.load(account.toHex())!
	const userBuildingTimeEntityId = `${provider.toHex()} - ${account.toHex()}`
	let userBuildingTimeEntity = UserBuildingTime.load(userBuildingTimeEntityId)
	if (!userBuildingTimeEntity) {
		userBuildingTimeEntity = new UserBuildingTime(userBuildingTimeEntityId)
	}
	userBuildingTimeEntity.provider = provider.toHex()
	userBuildingTimeEntity.account = account.toHex()
	userBuildingTimeEntity.amount = BuildingTimeController.bind(event.address).balanceOf(provider, account)
	userBuildingTimeEntity.save()

	accountEntity.buildingTime = userBuildingTimeEntityId
	accountEntity.save()

}

export function handleProviderAllocated(event: ProviderAllocated): void {
	const provider = event.params.provider
	const providerEntity = Provider.load(provider.toHex())!
	const providerBuildingTimeEntityId = `${provider.toHex()}`

	let providerBuildingTimeEntity = ProviderBuildingTime.load(providerBuildingTimeEntityId)
	if (!providerBuildingTimeEntity) {
		providerBuildingTimeEntity = new ProviderBuildingTime(providerBuildingTimeEntityId)
	}
	providerBuildingTimeEntity.provider = provider.toHex()
	providerBuildingTimeEntity.amount = BuildingTimeController.bind(event.address).providerBalanceOf(provider)
	providerBuildingTimeEntity.save()

	providerEntity.buildingTime = providerBuildingTimeEntityId
	providerEntity.save()

}
