const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// Types
export type DeviceType = "ios" | "android" | "web"

export interface User {
	user_id: string
	device_id: string
	device_type: DeviceType
	name?: string
	created_at: Date
	updated_at?: Date
}

export interface League {
	league_id: string
	owner_id: string
	title: string
	created_at?: Date
}

export interface LeagueWithMembers extends League {
	league_members: {
		league_id: string
		user_id: string
		created_at: Date
	}
}

export interface Score {
	score_id: string
	user_id: string
	league_id: string
	score: number
	created_at: Date
}

// API Client
export class ApiClient {
	private async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
		const response = await fetch(`${API_BASE_URL || ""}/api${endpoint}`, {
			...options,
			headers: {
				"Content-Type": "application/json",
				...options.headers,
			},
		})

		if (!response.ok) {
			throw new Error(`API request failed: ${response.statusText}`)
		}

		return response.json()
	}

	// User endpoints
	async createUser(deviceType: DeviceType): Promise<User> {
		return await this.fetch("/users", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ device_type: deviceType }),
		})
	}

	async healthCheck(): Promise<{ status: string }> {
		return this.fetch("/health", {
			method: "GET",
		})
	}

	async updateUserName(userId: string, name: string): Promise<User> {
		return this.fetch<User>(`/users/${userId}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ name }),
		})
	}

	// League endpoints
	async createLeague(ownerId: string, title: string): Promise<League> {
		return this.fetch<League>("/leagues", {
			method: "POST",
			body: JSON.stringify({ owner_id: ownerId, title }),
		})
	}

	async getUserLeagues(userId: string): Promise<LeagueWithMembers[]> {
		return this.fetch<LeagueWithMembers[]>(`/leagues/${userId}`)
	}

	// Score endpoints
	async submitScore(userId: string, score: number, leagueId?: string): Promise<{ success: boolean }> {
		return this.fetch<{ success: boolean }>("/scores", {
			method: "POST",
			body: JSON.stringify({ user_id: userId, score, league_id: leagueId }),
		})
	}

	async getLeagueScores(leagueId: string): Promise<Score[]> {
		return this.fetch<Score[]>(`/scores/${leagueId}`)
	}
	async getLeagues(userId: string): Promise<League[]> {
		return this.fetch<League[]>(`/leagues/${userId}`)
	}

	async joinLeague(userId: string, leagueId: string): Promise<{ success: boolean }> {
		return this.fetch<{ success: boolean }>(`/leagues/join`, {
			method: "POST",
			body: JSON.stringify({ userId, leagueId }),
		})
	}

	async getUserScores(userId: string): Promise<{ latestScores: Score[], topScores: Score[] }> {
		return this.fetch<{ latestScores: Score[], topScores: Score[] }>(`/users/${userId}/scores`)
	}

	async getUserLoginToken(userId: string): Promise<{ login_token: string }> {
		return this.fetch<{ login_token: string }>(`/users/${userId}/login-token`)
	}

	async getUserByLoginToken(loginToken: string): Promise<User> {
		return this.fetch<User>(`/users/login/${loginToken}`)
	}

	async checkUserExists(userId: string): Promise<{ exists: boolean }> {
		return this.fetch<{ exists: boolean }>(`/users/${userId}/exists`)
	}
}

// Export a singleton instance
export const apiClient = new ApiClient()
