import { AddProvider } from './types/ProviderRegistry/ProviderRegistry'
import { Provider } from './types/schema'

export function handleAddProvider(event: AddProvider): void {
	const provider = event.params.provider
	let entity = Provider.load(provider.toHex())
	if (!entity) {
		entity = new Provider(provider.toHex())
		entity.address = provider
		entity.txHash = event.transaction.hash
		entity.timestamp = event.block.timestamp
		entity.save()
	}
}