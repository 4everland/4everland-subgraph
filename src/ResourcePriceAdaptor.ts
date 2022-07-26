import { PriceAdaptorsUpdated } from './types/ResourcePriceAdaptor/ResourcePriceAdaptor'
import { Resource, ResourcePrice } from './types/schema'
import { formatResourceType } from './utils'

export function handlePriceAdaptorsUpdated(event: PriceAdaptorsUpdated): void {
	const provider = event.params.provider
	const adaptors = event.params.adaptors
	for (let i = 0; i < adaptors.length; i++) {
		const adaptor = adaptors[i]
		const type = adaptor.resourceType
		const price = adaptor.price
		const resourceId = `${provider.toHex()} - ${type}`
		const resourcePriceId = `${provider.toHex()} - ${type} - ${event.block.number}`

		let resourcePriceEntity = ResourcePrice.load(resourcePriceId)
		if (!resourcePriceEntity) {
			resourcePriceEntity = new ResourcePrice(resourcePriceId)
		}
		resourcePriceEntity.resource = resourceId
		resourcePriceEntity.price = price
		resourcePriceEntity.indexBlock = event.block.number
		resourcePriceEntity.save()

		let resourceEntity = Resource.load(resourceId)
		if (!resourceEntity) {
			resourceEntity = new Resource(resourceId)
			resourceEntity.type = formatResourceType(type)
		}
		resourceEntity.provider = `${event.params.provider.toHex()}`
		resourceEntity.price = resourcePriceId
		resourceEntity.save()
	}
}

