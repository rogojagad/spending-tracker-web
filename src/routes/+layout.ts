import { browser } from "$app/environment";
import { authStore } from "$lib/stores/auth";
import { redirect } from "@sveltejs/kit";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = () => {
    if (browser) {
        if (window.location.pathname === '/login') return {}

        if (!authStore.isSessionValid()) {
            throw redirect(302, '/login')
        }
    }

    return {}
}