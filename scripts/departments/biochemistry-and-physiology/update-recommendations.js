'use strict';

const { compileStrapi, createStrapi } = require('@strapi/strapi');

const CONTENT_TYPE_UID =
  'api::biochemistry-and-physiology-department.biochemistry-and-physiology-department';
const LOCALE = 'en';
const DEPARTMENT_LABEL = 'Biochemistry and Physiology';

const GROUPS = [
  {
    title: 'New Recommendations',
    sortorder: 1,
    items: [
      {
        title: 'Use of coir fiber as a biomass retainer in wastewater treatment.',
        sortorder: 1,
      },
      {
        title: 'Low cost activated ditch system for rubber wastewater treatment',
        sortorder: 2,
      },
      {
        title:
          'Coir based biological odour filter for controlling the odour from wastewater treatment facilities and polluted natural environments.',
        sortorder: 3,
      },
      {
        title: 'Introduction of the S/2 d4 harvesting system to the rubber industry in Sri Lanka.',
        sortorder: 4,
      },
      {
        title: 'Introduction of S/4 d3 harvesting system to the rubber industry in Sri Lanka.',
        sortorder: 5,
      },
      {
        title: 'Ethephon usage protocol for circular leaf spot disease affected fields.',
        sortorder: 6,
      },
      {
        title: 'Latex physiology-based screening protocol for identifying appropriate Hevea genotypes.',
        sortorder: 7,
      },
    ],
  },
  {
    title: 'Revised Recommendations',
    sortorder: 2,
    items: [
      {
        title:
          'Temperature corrected Ready Reckoner chart for estimation of dry rubber content in latex.',
        sortorder: 1,
      },
      {
        title: 'Suitable protocol for gaseous stimulation under Sri Lankan condition',
        sortorder: 2,
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
  const groups = section?.recommendationgroups || [];

  if (groups.length !== GROUPS.length) {
    throw new Error(
      `Recommendations verification failed: expected ${GROUPS.length} groups, found ${groups.length}.`
    );
  }

  for (const expected of GROUPS) {
    const actual = groups.find((group) => group?.sortorder === expected.sortorder);

    if (!actual) {
      throw new Error(
        `Recommendations verification failed: missing group sortorder ${expected.sortorder}.`
      );
    }

    if (actual.title?.trim() !== expected.title) {
      throw new Error(
        `Recommendations verification failed: unexpected title for sortorder ${expected.sortorder}.`
      );
    }

    const items = actual.items || [];

    if (items.length !== expected.items.length) {
      throw new Error(
        `Recommendations verification failed: expected ${expected.items.length} items in "${expected.title}", found ${items.length}.`
      );
    }

    for (const expectedItem of expected.items) {
      const actualItem = items.find((item) => item?.sortorder === expectedItem.sortorder);

      if (!actualItem) {
        throw new Error(
          `Recommendations verification failed: missing item sortorder ${expectedItem.sortorder} in "${expected.title}".`
        );
      }

      if (actualItem.title?.trim() !== expectedItem.title) {
        throw new Error(
          `Recommendations verification failed: unexpected item title for sortorder ${expectedItem.sortorder} in "${expected.title}".`
        );
      }
    }
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
      throw new Error(
        `English ${DEPARTMENT_LABEL} Department document was not found (${CONTENT_TYPE_UID}). Create the EN single type in Strapi Admin first.`
      );
    }

    await repository.update({
      documentId: department.documentId,
      locale: LOCALE,
      data: {
        recommendationsectionpresent: true,
        recommendationsection: {
          sectionheader: {
            eyebrow: 'Recommendations',
            title: 'New & Revised ',
            hightlightedtext: 'Recommendations',
            alignment: 'left',
          },
          recommendationgroups: GROUPS.map((group) => ({
            title: group.title,
            sortorder: group.sortorder,
            items: group.items.map((item) => ({
              title: item.title,
              description: item.description || null,
              sortorder: item.sortorder,
            })),
          })),
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

    const itemCount = GROUPS.reduce((sum, group) => sum + group.items.length, 0);

    console.log(
      `Updated and published the ${LOCALE} ${DEPARTMENT_LABEL} recommendations section with ${GROUPS.length} groups and ${itemCount} items.`
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
    console.error(`Failed to update the ${DEPARTMENT_LABEL} recommendations section.`);
    console.error(error);
    process.exit(1);
  });
