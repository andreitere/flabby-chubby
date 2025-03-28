export const getDeviceType = (): "ios" | "android" | "web" => {
	const userAgent = navigator.userAgent.toLowerCase()

	if (/iphone|ipad|ipod/.test(userAgent)) {
		return "ios"
	} else if (/android/.test(userAgent)) {
		return "android"
	} else {
		return "web"
	}
}
