'use strict';

const { compileStrapi, createStrapi } = require('@strapi/strapi');

const CONTENT_TYPE_UID = 'api::plant-science-department.plant-science-department';
const LOCALE = 'en';

const AWARDS = [
  {
    title: 'Second Best Innovation in Sri Lanka',
    officers: 'Mr. M N. Alwis, Research Officer, Plant Science Department',
    details:
      'Awarded Second Best Innovation in Sri Lanka in 2023 at the National Rubber, Plastic and Fibre-Based Industry Innovation Competition organized by the Ministry of Industries for the newly developed porous root trainer pot.',
    year: 2023,
    sortorder: 1,
  },
  {
    title: 'Best Overall Oral Presentation',
    officers: 'Dr. N.M.C Nayanakantha',
    details:
      'Won the award for the “Best Overall Oral Presentation” for his paper titled “Moringa oleifera leaf extract as a biostimulant on growth and other physio-chemical attributes of rubber (Hevea brasilliensis) under drought and heat stress conditions” presented at the 7th Symposium on Plantation Crop Research, 04-06th November 2019, Marino Beach Hotel, Colombo.',
    year: 2019,
    sortorder: 2,
  },
  {
    title: 'Contribution Made to Rubber Industry during 2016-2018',
    officers: 'Dr. N.M.C. Nayanakantha',
    details:
      'Received an award for the “Contribution Made to Rubber Industry during 2016-2018” at the 7th Symposium on Plantation Crop Research, 04-06th November 2019, Marino Beach Hotel, Colombo.',
    year: 2019,
    sortorder: 3,
  },
  {
    title: 'High Mind Idea Master Award',
    officers: 'Dr. N.M.C. Nayanakantha',
    details:
      'Received “High Mind Idea Master Award” for the Best Rubber Industry Participation in the Leadership and Capacity Building Training Programme for “Young Rubber Industry Professionals” conducted by High Brand Team and organized by the Ministry of Industry and Commerce under the project “Rubber Young Cluster Network (RYCN)” in the Rubber Master Plan.',
    year: 2018,
    sortorder: 4,
  },
  {
    title: 'Best Overall Oral Presentation',
    officers: 'Dr. N.M.C. Nayanakantha',
    details:
      'Received an award for the “Best Overall Oral Presentation” for his paper titled “Exogenous nitric oxide donor sodium nitroprussside improves growth and physiological attributes of rubber (Hevea brasiliensis) under abiotic stress conditions” presented at the 5th International Conference on Agriculture 2018, The International Institute of Knowledge Management, Colombo, 16-17th August, 2018.',
    year: 2018,
    sortorder: 5,
  },
  {
    title: 'Session’s Best Oral Presentation',
    officers: 'Dr. N.M.C. Nayanakantha',
    details:
      'Received an award for the “Session’s Best Oral Presentation” for his paper titled “Exogenous nitric oxide donor sodium nitroprussside improves growth and physiological attributes of rubber (Hevea brasiliensis) under abiotic stress conditions” presented at the 5th International Conference on Agriculture 2018, The International Institute of Knowledge Management, Colombo, 16-17th August, 2018.',
    year: 2018,
    sortorder: 6,
  },
  {
    title: 'Contribution Made to Rubber Industry during 2014-2015',
    officers: 'Dr. N.M.C. Nayanakantha',
    details:
      'Received an award for the “Contribution Made to Rubber Industry during 2014-2015” at the 6th Symposium on Plantation Crop Research, 2nd-4th November, 2016, Colombo.',
    year: 2016,
    sortorder: 7,
  },
  {
    title: 'Best paper and oral presentation from RRISL',
    officers: 'Dr. N.M.C. Nayanakantha',
    details:
      'Received an award for the “Best paper and oral presentation from RRISL” for his paper titled “Treatment with nitric oxide and seed coat removal improve germination dynamics and growth attributes of rubber (Hevea brasiliensis)” presented at the 6th Symposium on Plantation Crop Research, 2nd-4th November, 2016, Colombo.',
    year: 2016,
    sortorder: 8,
  },
  {
    title: 'Best Overall Paper and Presentation',
    officers: 'Dr. N.M.C. Nayanakantha',
    details:
      'Won the award for the “Best Overall Paper and Presentation” for his paper titled “The effect of nitric oxide-donor sodium nitroprusside on root architecture and growth of young budding polybagged plants of rubber (Hevea brasiliensis)” presented at the 5th Symposium on Plantation Crop Research, 15-17 October 2014, Colombo.',
    year: 2014,
    sortorder: 9,
  },
];

const ACHIEVEMENTS = [
  {
    category: 'Patents and Industrial Designs',
    achievement:
      'R P Karunasena – Improvement to the existing rubber tapping knife which is being currently used.',
    sortorder: 1,
  },
];

function getPopulate() {
  return {
    awardssection: {
      populate: {
        sectionheader: true,
        cards: {
          populate: {
            image: true,
          },
        },
      },
    },
    achievementssection: {
      populate: {
        sectionheader: true,
        sectionicon: true,
        achievements: true,
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
  if (department?.awardtimelinepresent !== true) {
    throw new Error('Awards verification failed: awardtimelinepresent is not enabled.');
  }

  if (department?.achievementspresent !== true) {
    throw new Error('Achievements verification failed: achievementspresent is not enabled.');
  }

  const awards = department?.awardssection?.cards || [];
  if (awards.length !== AWARDS.length) {
    throw new Error(
      `Awards verification failed: expected ${AWARDS.length} awards, found ${awards.length}.`
    );
  }

  for (const expected of AWARDS) {
    const actual = awards.find((award) => award?.sortorder === expected.sortorder);
    if (!actual) {
      throw new Error(`Awards verification failed: missing award sortorder ${expected.sortorder}.`);
    }
    if (actual.title?.trim() !== expected.title) {
      throw new Error(`Awards verification failed: unexpected title for sortorder ${expected.sortorder}.`);
    }
    if (actual.year !== expected.year) {
      throw new Error(`Awards verification failed: unexpected year for sortorder ${expected.sortorder}.`);
    }
  }

  const achievements = department?.achievementssection?.achievements || [];
  if (achievements.length !== ACHIEVEMENTS.length) {
    throw new Error(
      `Achievements verification failed: expected ${ACHIEVEMENTS.length} items, found ${achievements.length}.`
    );
  }

  const firstAchievement = achievements.find((item) => item?.sortorder === 1);
  if (firstAchievement?.category?.trim() !== ACHIEVEMENTS[0].category) {
    throw new Error('Achievements verification failed: unexpected category on the patent entry.');
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
        awardtimelinepresent: true,
        achievementspresent: true,
        awardssection: {
          sectionheader: {
            eyebrow: 'Awards',
            title: 'Department ',
            hightlightedtext: 'Awards',
            alignment: 'center',
          },
          cards: AWARDS.map((award) => ({
            title: award.title,
            officers: award.officers,
            details: award.details,
            year: award.year,
            sortorder: award.sortorder,
          })),
        },
        achievementssection: {
          sectionheader: {
            eyebrow: 'Achievements',
            title: 'Our ',
            hightlightedtext: 'Achievements',
            alignment: 'center',
          },
          outlinetext: 'Achievements',
          achievements: ACHIEVEMENTS.map((item) => ({
            category: item.category,
            achievement: item.achievement,
            sortorder: item.sortorder,
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
      `Updated and published the ${LOCALE} Plant Science awards (${AWARDS.length}) and achievements (${ACHIEVEMENTS.length}) sections (images/icons left for CMS).`
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
    console.error('Failed to update the Plant Science awards and achievements sections.');
    console.error(error);
    process.exit(1);
  });
