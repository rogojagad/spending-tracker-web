import { writable } from "svelte/store";
import { browser } from "$app/environment";
import dayjs from "dayjs";

export interface AuthState {
    isAuthenticated: boolean
    expiresAt: number | null
    token: string
}

function createAuthStore() {
    const initialState: AuthState = {
        isAuthenticated: false,
        expiresAt: null,
        token: ""
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
        subscribe,
        authenticate: (token: string) => {
            const expiresAt = dayjs().add(10, 'minute').unix()
            const authState: AuthState = {
                isAuthenticated: true, expiresAt, token
            }

            if (browser) localStorage.setItem('auth', JSON.stringify(authState))

            set(authState)
        },
        getToken: () => {
            const auth = localStorage.getItem('auth')
            if (auth) return JSON.parse(auth)
        },
        logout: () => {
            if (browser) localStorage.removeItem('auth')

            set(initialState)
        },
        isSessionValid: () => {
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