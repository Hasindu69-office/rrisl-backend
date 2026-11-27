'use strict';

const { compileStrapi, createStrapi } = require('@strapi/strapi');

const CONTENT_TYPE_UID =
  'api::plant-pathology-and-microbiology-department.plant-pathology-and-microbiology-department';
const LOCALE = 'en';
const DEPARTMENT_LABEL = 'Plant Pathology and Microbiology';

const GROUPS = [
  {
    title: 'New Recommendations',
    sortorder: 1,
    items: [
      {
        title: 'Revised recommendations for chemical controlling of White Root Disease',
        sortorder: 1,
      },
      {
        title: 'Recommendations for the rehabilitation of White Root Disease patches',
        sortorder: 2,
      },
      {
        title:
          'Recommendations for the management of the new leaf fall disease caused by Colletotrichum and Pestalotiopsis',
        sortorder: 3,
      },
      {
        title: 'Revision of the prophylactic fungicide recommendation against Phytophthora Bark rots',
        sortorder: 4,
      },
      {
        title:
          'Recommendation of substitute insecticide for the chemical controlling of Cockchafer Grub infestations',
        sortorder: 5,
      },
      {
        title: 'Recommendation of chemical controlling systems for Brown Root Disease',
        sortorder: 6,
      },
      {
        title: 'Revision of the chemical controlling for Nursery diseases',
        sortorder: 7,
      },
      {
        title: 'Recommendation for the management of Patch Canker Diseases',
        sortorder: 8,
      },
      {
        title: 'Chemical Controlling of Cockchafer grub attacks',
        sortorder: 9,
      },
      {
        title: 'IDM against Cockchafer grub attacks',
        sortorder: 10,
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
            title: 'New ',
            hightlightedtext: 'Recommendations',
            alignment: 'left',
          },
          recommendationgroups: GROUPS.map((group) => ({
            title: group.title,
            sortorder: group.sortorder,
            items: group.items.map((item) => {
              const payload = {
                title: item.title,
                sortorder: item.sortorder,
              };

              if (item.description) {
                payload.description = item.description;
              }

              return payload;
            }),
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
