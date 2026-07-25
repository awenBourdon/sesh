// server/src/index.ts
import Fastify from 'fastify';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import { appRouter } from './routers';
const server = Fastify({ logger: true });
server.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: { router: appRouter },
});
server.listen({ port: 3000 }, (err) => {
    if (err) {
        server.log.error(err);
        process.exit(1);
    }
});
