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