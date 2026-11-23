'use strict';

const { compileStrapi, createStrapi } = require('@strapi/strapi');

const CONTENT_TYPE_UID =
  'api::raw-rubber-and-chemical-analysis-department.raw-rubber-and-chemical-analysis-department';
const LOCALE = 'en';
const DEPARTMENT_LABEL = 'Raw Rubber and Chemical Analysis';

const ACHIEVEMENT_CATEGORIES = [
  {
    title: 'Awards',
    sortorder: 1,
    points: [
      'Ms. Anuradhi Ranawaka, Research Officer at our department was awarded Merit Award for Outstanding Presenter at the Technical Session of Agricultural Engineering and Processing Technology of the Academic Session for the presentation titled "Effect of ammonia preservative systems on phosphate levels in centrifuged latex and its impact on latex film properties", 2022.',
      'Ensure Supreme Quality Rubber to the world - Every year, our department ensures to provide support for the rubber industry through quality certifications for over 50+ companies in latex and dry rubber sectors.',
      'Knowledge Dissemination - Every Year our action plan has dedicated to provide on request training facilities on testing methodologies for latex and dry rubber, targeting university students and laboratory technicians in rubber factories.',
      'Conducted Factory audit programmes in collaboration with the Export Development Board (EDB), Central Environmental Authority (CEA), Department of Labour, and the Ministry of Plantation and Community Infrastructure to strengthen compliance with environmental, occupational safety, and quality standards. Then Issued No-Objection Certificates/letters for rubber importers after technical evaluation and verification in accordance with national requirements and industry needs.',
      'Collaborated with MOPI to address the shortage of raw materials, a significant bottleneck in the TSR industry. Cabinet approval has been granted to import raw materials (50% of production capacity), helping to alleviate the supply-demand imbalance that previously hindered production.',
      'Led the development and approval of five new Harmonized System (HS) codes for Sri Lankan Technically Specified Rubber (TSR) products in collaboration with Sri Lanka Customs and the Ministry of Plantation and Community Infrastructure, facilitating improved international trade classification.',
      'Initiated a chemical waste management programme in collaboration with INSEE Ecocycle to establish environmentally responsible laboratory waste disposal practices.',
      'Successfully obtained a Precursor Chemicals Licence (2025) for RRISL, ensuring regulatory compliance for the procurement, storage, and use of controlled laboratory chemicals.',
      'Installed a latex testing laboratory at the Monaragala sub-station to address the problems faced by farmers in the Monaragala and Ampara districts of the Uva province, ensuring a fixed price for latex. (2024)',
      'Launched an e-testing service to enhance the efficiency of services provided to the rubber industry.',
      'International Proficiency Testing Excellence - Participated in the proficiency testing programme conducted by the Malaysian Rubber Board and showed outstanding performance among 15 international latex testing laboratories. (2023)',
    ],
  },
  {
    title: 'Grants (Internation / Local)',
    sortorder: 2,
    points: [
      'Development of In-country Ethephon Formulations to Promote Low-cost Harvesting Systems for Rubber Plantations in Sri Lanka (RG/2017/AG/01, 2017–2020)',
      'Establishment of an Accredited Laboratory and Enhancement of Testing Facilities for the Rubber Industry in Sri Lanka (2021–2022) Development project funded by the Ministry of Plantation Industries',
      'Renovation and Modernization of the RRISL Library by Leveraging Technology to Enhance Public Service Efficiency (2024–2025) Development project funded by the Ministry of Plantation Industries',
      'Comprehensive Renovation and Structural Enhancement of the Library Roof at the Rubber Research Institute, Ratmalana (2024–2025) Development project funded by the Ministry of Plantation Industries',
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
