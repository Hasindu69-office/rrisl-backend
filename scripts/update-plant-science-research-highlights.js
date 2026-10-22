'use strict';

const { compileStrapi, createStrapi } = require('@strapi/strapi');

const CONTENT_TYPE_UID = 'api::plant-science-department.plant-science-department';
const LOCALE = 'en';

const HIGHLIGHTS = [
  {
    title: 'Developed Root Trainer Technology for rubber nurseries',
    description:
      'Developed Root Trainer Technology for rubber nurseries, significantly improving nursery productivity, root architecture, plant quality, and environmental sustainability. The innovation on root trainer technique awarded the National Innovation Award from the Ministry of Industries, 2023.',
    researchteam: 'Manjula Alwis, Laknath de Zoysa',
    sortorder: 1,
  },
  {
    title: 'Rapid Budgrafting Technique',
    description:
      'New method of budgrafting developed to reduce time of planting material production while improving grafting success and field establishment.',
    researchteam: 'M. N. Alwis and D.L.N. de Zoysa',
    sortorder: 2,
  },
  {
    title: 'Introducing sprinkler irrigation systems for rubber nurseries',
    description:
      'Design and installation of large-scaled sprinkler irrigation systems in rubber nurseries to enhance the nursery plant production efficiencies while effectively increasing irrigation water use efficiencies. Research is ongoing for further developments.',
    researchteam: 'S.A.Nakandala, T.U.K Silva, P.D. Pathirana and U.N.Udayakumari',
    sortorder: 3,
  },
  {
    title: 'Based Budgrafting Technique',
    description:
      'Budgrafting existing Budwood nurseries with based budding techniques for use young budwood plants for future demanding clones',
    researchteam: 'M. N. Alwis and D.L.N. de Zoysa',
    sortorder: 4,
  },
  {
    title: 'Awarding NVQ Level 3 for Rubber Harvesting Assistants for the first time in Sri Lanka',
    description:
      'A Master Plan project funded by Plantation Secretariat, Ministry of Plantation Industries, titled “Introduction of NVQ-qualified socially recognized Harvesting Assistants in the Rubber Sector” had been executed for a one-year period in 2023-2024 in order to evaluate competencies in latex harvesting and award professional qualification for skilled tappers who are working for rubber sector with utmost dedication.',
    sortorder: 5,
  },
  {
    title: 'Hat-type rainguard providing the highest rain protection',
    description:
      'Development of hat-type rainguard providing the highest rain protection without annual replacement',
    sortorder: 6,
  },
];

function getPopulate() {
  return {
    researchhighlightssection: {
      populate: {
        researchhighlightcards: {
          populate: {
            image: true,
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
  if (department?.researchhighlightspresent !== true) {
    throw new Error('Research highlights verification failed: the visibility flag is not enabled.');
  }

  const cards = department?.researchhighlightssection?.researchhighlightcards || [];

  if (cards.length !== HIGHLIGHTS.length) {
    throw new Error(
      `Research highlights verification failed: expected ${HIGHLIGHTS.length} cards, found ${cards.length}.`
    );
  }

  for (let index = 0; index < HIGHLIGHTS.length; index += 1) {
    const expected = HIGHLIGHTS[index];
    const actual = cards.find((card) => card?.sortorder === expected.sortorder);

    if (!actual) {
      throw new Error(
        `Research highlights verification failed: missing card with sortorder ${expected.sortorder}.`
      );
    }

    if (actual.title?.trim() !== expected.title) {
      throw new Error(
        `Research highlights verification failed: unexpected title for sortorder ${expected.sortorder}.`
      );
    }

    if (!actual.description?.trim() || actual.description.trim().length < 10) {
      throw new Error(
        `Research highlights verification failed: description missing for sortorder ${expected.sortorder}.`
      );
    }

    const expectedTeam = expected.researchteam || null;
    const actualTeam = actual.researchteam?.trim() || null;

    if (expectedTeam !== actualTeam) {
      throw new Error(
        `Research highlights verification failed: unexpected research team for sortorder ${expected.sortorder}.`
      );
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
      throw new Error(`English Plant Science Department document was not found (${CONTENT_TYPE_UID}).`);
    }

    const verticalText =
      department.researchhighlightssection?.verticaltext?.trim() || 'Research Highlights';

    await repository.update({
      documentId: department.documentId,
      locale: LOCALE,
      data: {
        researchhighlightspresent: true,
        researchhighlightssection: {
          verticaltext: verticalText,
          researchhighlightcards: HIGHLIGHTS.map((highlight) => ({
            title: highlight.title,
            description: highlight.description,
            researchteam: highlight.researchteam || null,
            sortorder: highlight.sortorder,
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

    console.log(
      `Updated and published the ${LOCALE} Plant Science research highlights section with ${HIGHLIGHTS.length} flip tiles (images left for CMS).`
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
    console.error('Failed to update the Plant Science research highlights section.');
    console.error(error);
    process.exit(1);
  });
