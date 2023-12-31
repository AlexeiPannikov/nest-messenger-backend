import {fetchBaseQuery} from '@reduxjs/toolkit/query'
import type {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
} from '@reduxjs/toolkit/query'
import {Mutex} from 'async-mutex'
import {RefreshResponse} from "../features";
import {ACCESS_TOKEN, logOut, refreshAccessToken, setUser} from "../entities";

// create a new mutex
const mutex = new Mutex()
const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_APP_BASE_URL,
    prepareHeaders: (headers) => {
        const token = localStorage.getItem(ACCESS_TOKEN)
        if (token) {
            headers.set("authorization", `Bearer ${token}`)
        }
        headers.set('Access-Control-Allow-Credentials', window.location.origin)
    },
    credentials: "include",
})
export const baseQueryWithReAuth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    // wait until the mutex is available without locking it
    await mutex.waitForUnlock()
    let result = await baseQuery(args, api, extraOptions)
    if (result.error && result.error.status === 401) {
        // checking whether the mutex is locked
        if (!mutex.isLocked()) {
            const release = await mutex.acquire()
            try {
                const refreshResult = await baseQuery(
                    'auth/refresh',
                    api,
                    extraOptions
                )
                const data = refreshResult.data as { data: RefreshResponse }
                if (data?.data) {
                    api.dispatch(refreshAccessToken(data.data.tokens.accessToken))
                    api.dispatch(setUser(data.data.user))
                    // retry the initial query
                    result = await baseQuery(args, api, extraOptions)
                } else {
                    api.dispatch(logOut())
                }
            } finally {
                // release must be called once the mutex should be released again.
                release()
            }
        } else {
            // wait until the mutex is available without locking it
            await mutex.waitForUnlock()
            result = await baseQuery(args, api, extraOptions)
        }
    }
    return result
}