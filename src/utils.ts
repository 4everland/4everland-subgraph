import { Analytic } from './types/schema'

export function analytics(): Analytic {
	const analyticId = 'Analytic'
	let analyticEntity = Analytic.load(analyticId)
	if (!analyticEntity) {
		analyticEntity = new Analytic(analyticId)
	}
	return analyticEntity
}

export function formatResourceType(type: i32): string {
	switch (type) {
		case 1:
			return 'BuildingTime'
		case 2:
			return 'Bandwidth'
		case 3:
			return 'ARStorage'
		case 4:
			return 'IPFSStorage'
		default:
			return 'Unknown'
	}
}