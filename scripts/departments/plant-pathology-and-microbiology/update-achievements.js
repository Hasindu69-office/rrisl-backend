'use strict';

const { compileStrapi, createStrapi } = require('@strapi/strapi');

const CONTENT_TYPE_UID =
  'api::plant-pathology-and-microbiology-department.plant-pathology-and-microbiology-department';
const LOCALE = 'en';
const DEPARTMENT_LABEL = 'Plant Pathology and Microbiology';

const ACHIEVEMENT_CATEGORIES = [
  {
    title: 'Patents and Industrial Designs',
    sortorder: 1,
    points: [
      'Patent application for oleic acid based ethephon formulation to enhance yield of rubber trees — Applicant: K.V.V.S. Kudaligama; Co-investigator: T.H.P.S. Fernando.',
      'Patent application for a low-cost hand-made compost enriched rubberized-coir pith media to produce bio-fungicide — Applicant: K.V.V.S. Kudaligama; Co-investigator: T.H.P.S. Fernando.',
    ],
  },
  {
    title: 'Awards',
    sortorder: 2,
    points: [
      "Best Researcher Award — Dr. (Ms) T.H.P.S. Fernando, for the contribution made to the Rubber Industry during 2014–2015 at the Plantation Crop Symposium.",
      'GRC Post Graduate Award — Dr. (Ms) T.H.P.S. Fernando, by the Sri Lanka Association for the Advancement of Science (SLASS), 2013.',
      'Award for Excellence in Scientific Research — Dr. (Ms) T.H.P.S. Fernando, by the Young Scientists Forum – National Science and Technology Commission, Ministry of Technology & Research, 2011.',
      "President's Awards – 1 — Dr. (Ms) T.H.P.S. Fernando, for the world's first record of the cell wall degrading enzymes produced by Thanatephorus cucumeris, Year 2004 (Published in Mycopathologia).",
      "President's Awards – 2 — Dr. (Ms) T.H.P.S. Fernando, for the first record of Flacourtia inermis as an alternative host for Colletotrichum acutatum, Year 2004 (Published in Mycopathologia).",
      "President's Awards – 3 — Dr. (Ms) T.H.P.S. Fernando, for the world's first record of the toxic metabolite produced by Colletotrichum acutatum, Year 2001 (Published in Mycopathologia).",
      "President's Awards – 4 — Dr. (Ms) T.H.P.S. Fernando, for the world's first record of the cell wall degrading enzymes produced by Colletotrichum acutatum, Year 2001 (Published in Mycological Research).",
      "President's Awards – 5 — Dr. (Ms) T.H.P.S. Fernando, for finding out the factors affecting spore production, germination and viability of Colletotrichum acutatum from Hevea brasiliensis, Year 2000 (Published in Mycological Research).",
      "President's Awards – 6 — Dr. (Ms) T.H.P.S. Fernando, for innovation of an internationally accepted simple and reliable technique for the identification of two Colletotrichum species causing Colletotrichum leaf disease of rubber, Year 1999 (Published in Mycopathologia).",
      "President's Awards – 7 — Champaka Wijerathna, for the world's first record of the cell wall degrading enzymes produced by Thanatephorus cucumeris, Year 2004 (Published in Mycopathologia).",
      'Meritorious Award — Dr. (Ms) M.K.R. Silva, D.H.E. Mahotti Memorial Gold Medal for the Best Performance in Farm Practice Course, Faculty of Agriculture, University of Ruhuna, 2004.',
      'Second Runner-up — Dr. (Ms) M.K.R. Silva, Outstanding Research Project in the 7th Annual Graduate Research Seminar, Faculty of Agriculture, University of Ruhuna, 2006.',
      'Most Popular Presenter Award — H.V.A. Shehani Koshila, received from Youth Action in Forest Health: Asia-Pacific Competition, FAO, 2025.',
      'Post Graduate Research Merit Award — H.V.A. Shehani Koshila, Merit Award in recognition of contribution towards postgraduate research, SLASS, 2023.',
    ],
  },
  {
    title: 'Grants (Internation / Local)',
    sortorder: 3,
    points: [
      'Ministry of Plantation Industries Grant (Pesta Project): "Studies on the biology and epidemiology of the Pestalotiopsis Leaf fall disease and to develop effective management strategies", Year 2021–2025 (Rs. 49.46 Mn.).',
      'Treasury Grant – Development Project 23/1/17: "Improvement of strategies to combat White Root Disease in rubber plantations", Year 2016–2021 (Rs. 20 Mn.).',
      'Treasury Grant – Development Project 23/1/15: "Identification of the Potential Pest & Disease Problems of Rubber in non-Traditional Areas to Develop Improved Management Strategies", Year 2016–2021 (Rs. 20 Mn.).',
      'National Science Foundation (03.30X): "Investigations on biological control measure for white root diseases of rubber to improve integrated disease management strategies", Year 2016–2019 (Rs. 4.2 Mn.).',
      'National Research Council Sri Lanka (Grant No. 11-039): "Studies on White root disease of rubber to develop improved management strategies", Year 2012 (LKR 4,300,000).',
      'International Foundation for Science, Stockholm, Sweden (Grant No. D/5127-1): "Development of Integrated Management Strategies for White Root Disease of Rubber (Hevea brasiliensis)", Year 2012 (USD 12,000).',
      'IRRDB and Common Fund for Commodities, The Netherlands: Co-investigator on "Improvement of management strategy in combating Corynespora rubber leaf fall disease", Year 2009 (USD 12,500).',
      'Junior Scientists Research Grant – Climate Change Enabling Activity (Phase II), Ministry of Environment and Natural Resources: "Possibility of the popularization of Oidium susceptible high yielding clones with the predicted climate change" (LKR 50,000).',
      'National Science Foundation Equipment Grants (2): -20°C freezer for cultures and DNA sample storage, and PCR machine to undertake molecular plant pathological research.',
      'National Science Foundation Travel Grants (2): Travel grants to attend official meetings in China and Malaysia.',
    ],
  },
];

function toPoints(entries) {
  return entries.map((paragraph) => ({ paragraph }));
}

function mediaId(media) {
  return Number.isInteger(media?.id) ? media.id : null;
}

function getPopulate() {
  return {
    achievementssection: {
      populate: {
        rightimage: true,
        categories: {
          populate: {
            points: true,
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
  if (department?.achievementspresent !== true) {
    throw new Error('Achievements verification failed: achievementspresent is not enabled.');
  }

  const section = department?.achievementssection;

  if (section?.sectiontitle?.trim() !== 'Our Achievements') {
    throw new Error('Achievements verification failed: section title is not Our Achievements.');
  }

  const categories = section?.categories || [];

  if (categories.length !== ACHIEVEMENT_CATEGORIES.length) {
    throw new Error(
      `Achievements verification failed: expected ${ACHIEVEMENT_CATEGORIES.length} categories, found ${categories.length}.`
    );
  }

  for (const expected of ACHIEVEMENT_CATEGORIES) {
    const actual = categories.find((category) => category?.sortorder === expected.sortorder);

    if (!actual) {
      throw new Error(
        `Achievements verification failed: missing category sortorder ${expected.sortorder}.`
      );
    }

    if (actual.title?.trim() !== expected.title) {
      throw new Error(
        `Achievements verification failed: unexpected title for sortorder ${expected.sortorder}.`
      );
    }

    const pointCount = actual.points?.length || 0;

    if (pointCount !== expected.points.length) {
      throw new Error(
        `Achievements verification failed: expected ${expected.points.length} entries for "${expected.title}", found ${pointCount}.`
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
      throw new Error(
        `English ${DEPARTMENT_LABEL} Department document was not found (${CONTENT_TYPE_UID}). Create the EN single type in Strapi Admin first.`
      );
    }

    const rightimage = mediaId(department.achievementssection?.rightimage);
    const achievementsPayload = {
      sectiontitle: 'Our Achievements',
      categories: ACHIEVEMENT_CATEGORIES.map((category) => ({
        title: category.title,
        sortorder: category.sortorder,
        points: toPoints(category.points),
      })),
    };

    if (rightimage) {
      achievementsPayload.rightimage = rightimage;
    }

    await repository.update({
      documentId: department.documentId,
      locale: LOCALE,
      data: {
        achievementspresent: true,
        achievementssection: achievementsPayload,
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

    const totalEntries = ACHIEVEMENT_CATEGORIES.reduce(
      (sum, category) => sum + category.points.length,
      0
    );

    console.log(
      `Updated and published the ${LOCALE} ${DEPARTMENT_LABEL} achievements section with ${ACHIEVEMENT_CATEGORIES.length} categories and ${totalEntries} entries (right image left for CMS).`
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
    console.error(`Failed to update the ${DEPARTMENT_LABEL} achievements section.`);
    console.error(error);
    process.exit(1);
  });
