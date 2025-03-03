import { writable } from "svelte/store";
import { browser } from "$app/environment";
import dayjs from "dayjs";

export interface AuthState {
    isAuthenticated: boolean
    expiresAt: number | null
}

function createAuthStore() {
    const initialState: AuthState = {
        isAuthenticated: false,
        expiresAt: null
    }

    const { subscribe, set, update } = writable<AuthState>(initialState)

    if (browser) {
        const stored = localStorage.getItem('auth')

        if (stored) {
            const parsedAuth: AuthState = JSON.parse(stored)

            if (parsedAuth.expiresAt && parsedAuth.expiresAt > dayjs().unix()) {
                set(parsedAuth)
            } else {
                localStorage.removeItem('auth')
            }
        }
    }

    return {
        subscribe, authenticate: () => {
            const expiresAt = dayjs().unix() + 10 * 60 * 1000 // 10 mins from now
            const authState: AuthState = {
                isAuthenticated: true, expiresAt
            }

            if (browser) localStorage.setItem('auth', JSON.stringify(authState))

            set(authState)
        }, logout: () => {
            if (browser) localStorage.removeItem('auth')

            set(initialState)
        }, isSessionValid: () => {
            let isValid = false

            update(state => {
                if (state.isAuthenticated && state.expiresAt) {
                    isValid = state.expiresAt > dayjs().unix()

                    if (!isValid) {
                        if (browser) localStorage.removeItem('auth')

                        return initialState
                    }
                }

                return state
            })

            return isValid
        }
    }
}

export const authStore = createAuthStore()