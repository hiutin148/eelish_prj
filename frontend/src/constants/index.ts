export const APP_NAME = 'Eelish'
export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api'
export const ROUTES = {
	home: '#/',
	decks: '#/decks',
	practice: '#/practice',
	tasks: '#/tasks',
	progress: '#/progress',
	settings: '#/settings',
} as const
