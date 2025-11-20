export default ({ env }) => ({
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST', 'mail.graphics.lk'),
        port: env.int('SMTP_PORT', 587),
        secure: env.bool('SMTP_SECURE', false), // true for 465, false for other ports
        requireTLS: env.bool('SMTP_REQUIRE_TLS', true), // Require TLS for STARTTLS (port 587)
        auth: {
          user: env('SMTP_USERNAME'),
          pass: env('SMTP_PASSWORD'),
        },
        tls: {
          // Do not fail on invalid certs (useful for self-signed certificates)
          rejectUnauthorized: env.bool('SMTP_REJECT_UNAUTHORIZED', false),
        },
        // Connection timeout settings
        connectionTimeout: 10000, // 10 seconds (reduced for faster failure detection)
        greetingTimeout: 10000, // 10 seconds (reduced for faster failure detection)
        socketTimeout: 10000, // 10 seconds
        // Pool connections (can help with connection issues)
        pool: false,
        // Debug mode (set to true to see detailed logs)
        debug: env.bool('SMTP_DEBUG', false),
        logger: env.bool('SMTP_DEBUG', false),
      },
      settings: {
        defaultFrom: env('SMTP_DEFAULT_FROM', 'noreply@example.com'),
        defaultReplyTo: env('SMTP_DEFAULT_REPLY_TO', 'noreply@example.com'),
      },
    },
  },
});
