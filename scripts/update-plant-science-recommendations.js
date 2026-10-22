'use strict';

const { compileStrapi, createStrapi } = require('@strapi/strapi');

const CONTENT_TYPE_UID = 'api::plant-science-department.plant-science-department';
const LOCALE = 'en';

const GROUPS = [
  {
    title: 'Interim Recommendations',
    sortorder: 1,
    items: [
      {
        title: 'Establishment of seed garden with clones RRISL 201, RRIC 100 and RRIC 102',
        sortorder: 1,
      },
      {
        title: 'Base budding technique to propagate bud-wood nursery rapidly',
        sortorder: 2,
      },
      {
        title: 'Planting guava as an intercrop with rubber',
        description:
          'Guava can be grown from the start of rubber planting with the spacing of 2.5 m x 7.75 m as a single row in 4m distance. Harvest can be obtained after the 2nd year of planting',
        sortorder: 3,
      },
      {
        title: 'Planting cardamom as an intercrop with rubber',
        description:
          'Cardamom can be grown with rubber planting rows in the mature stage of 6-8 years. Spacing of rubber should be 2.5m x 7.75 m and 3.5 m x 5.5 m and cardamom spacing would be 2 m can be grown as single row.',
        sortorder: 4,
      },
    ],
  },
];

function getPopulate() {
  return {
    recommendationsection: {
      populate: {
        sectionheader: true,
        recommendationgroups: {
          populate: {
            items: true,
          },
        },
      },
    },
  };
}

async function findDepartment(repository) {
  return (
    (await repository.findFirst({ locale: LOCALE, status: 'published', populate: getPopulate() })) ||
    repository.findFirst({ locale: LOCALE, status: 'draft', populate: getPopulate() })
  );
}

function assertPublishedResult(department) {
  if (department?.recommendationsectionpresent !== true) {
    throw new Error('Recommendations verification failed: visibility flag is not enabled.');
  }

  const section = department?.recommendationsection;

  if (section?.includegroups !== true) {
    throw new Error('Recommendations verification failed: includegroups is not enabled.');
  }

  const groups = section?.recommendationgroups || [];

  if (groups.length !== GROUPS.length) {
    throw new Error(
      `Recommendations verification failed: expected ${GROUPS.length} groups, found ${groups.length}.`
    );
  }

  const interim = groups.find((group) => group?.sortorder === 1);

  if (interim?.title?.trim() !== 'Interim Recommendations') {
    throw new Error('Recommendations verification failed: Interim Recommendations group missing.');
  }

  if ((interim?.items || []).length !== GROUPS[0].items.length) {
    throw new Error(
      `Recommendations verification failed: expected ${GROUPS[0].items.length} items, found ${interim?.items?.length || 0}.`
    );
  }
}

async function main() {
  const appContext = await compileStrapi({ appDir: process.cwd() });
  const app = createStrapi(appContext);

  try {
    await app.load();

    const repository = app.documents(CONTENT_TYPE_UID);
    const department = await findDepartment(repository);

    if (!department?.documentId) {
      throw new Error(`English Plant Science Department document was not found (${CONTENT_TYPE_UID}).`);
    }

    await repository.update({
      documentId: department.documentId,
      locale: LOCALE,
      data: {
        recommendationsectionpresent: true,
        recommendationsection: {
          sectionheader: {
            eyebrow: 'New Recommendations',
            title: 'New ',
            hightlightedtext: 'Recommendations',
            alignment: 'left',
          },
          includegroups: true,
          recommendationgroups: GROUPS.map((group) => ({
            title: group.title,
            sortorder: group.sortorder,
            items: group.items.map((item) => ({
              title: item.title,
              description: item.description || null,
              sortorder: item.sortorder,
            })),
          })),
          applyimagecard: false,
          imagecard: [],
          includepoints: false,
          points: [],
          includetable: false,
          tablecards: [],
        },
      },
    });

    await repository.publish({
      documentId: department.documentId,
      locale: LOCALE,
    });

    const updatedDepartment = await repository.findOne({
      documentId: department.documentId,
      locale: LOCALE,
      status: 'published',
      populate: getPopulate(),
    });

    assertPublishedResult(updatedDepartment);

    console.log(
      `Updated and published the ${LOCALE} Plant Science new recommendations section with ${GROUPS[0].items.length} interim recommendations.`
    );
  } finally {
    if (app.isLoaded) {
      await app.destroy();
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Failed to update the Plant Science recommendations section.');
    console.error(error);
    process.exit(1);
  });
