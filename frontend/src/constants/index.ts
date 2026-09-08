export const APP_NAME = 'Eelish'
export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'https://eelish-prj.onrender.com'
export const ROUTES = {
	home: '#/',
	decks: '#/decks',
	practice: '#/practice',
	progress: '#/progress',
	settings: '#/settings',
} as const
