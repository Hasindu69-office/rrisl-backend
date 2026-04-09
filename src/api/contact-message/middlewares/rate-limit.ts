import { RateLimit } from 'koa2-ratelimit';
import type { Context, Next } from 'koa';

const limiter = RateLimit.middleware({
  interval: { min: 15 }, // 15 minutes
  max: 5, // 5 requests per IP per interval
  message: 'Too many contact form submissions. Please try again later.',
  headers: true,
});

export default () => {
  return async (ctx: Context, next: Next) => {
    await limiter(ctx, next);
  };
};