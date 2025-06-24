import { publicProcedure, router } from './trpc';

const appRouter = router({
  test: publicProcedure.query(() => {
    return 'hello';
  }),
});

// Export the router instance
export { appRouter };

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
