import { RateLimit } from 'koa2-ratelimit';
import type { Context, Next } from 'koa';

const limiter = RateLimit.middleware({
  interval: { min: 15 },
  max: 3,
  message: 'Too many vacancy applications. Please try again later.',
  headers: true,
});

export default () => {
  return async (ctx: Context, next: Next) => {
    await limiter(ctx, next);
  };
};
