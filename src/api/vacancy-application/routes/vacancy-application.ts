/**
 * vacancy-application router
 */

export default {
  routes: [
    {
      method: 'POST',
      path: '/vacancies/:slug/apply',
      handler: 'vacancy-application.submit',
      config: {
        auth: false,
        middlewares: ['api::vacancy-application.rate-limit'],
      },
    },
  ],
};
