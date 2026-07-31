import { createTRPCClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from '../../server/src/routers'

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/trpc',
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: 'include',
        })
      },
    }),
  ],
})
