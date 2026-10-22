'use strict';

const { compileStrapi, createStrapi } = require('@strapi/strapi');

const CONTENT_TYPE_UID = 'api::plant-science-department.plant-science-department';
const LOCALE = 'en';

const PROJECTS = [
  {
    title: 'Nursery experiments on plant quality improvement',
    description:
      'Experiments on investigating the effect of Red and Blue LED Lighting on the Growth of Stock Plants and Budded Plants',
    sortorder: 1,
  },
  {
    title: 'Improved Irrigation systems for rubber nurseries',
    description:
      'Experiments are on-going on designing micro-irrigation systems for increasing plant growth, productivity and irrigation water use efficiencies',
    sortorder: 2,
  },
  {
    title:
      'Different planting strategies and improvements in immature rubber plantings for maintaining the correct tree stand.',
    sortorder: 3,
  },
  {
    title: 'Tissue culture and micro propagation for rubber and intercrops',
    sortorder: 4,
  },
  {
    title: 'Testing of different types of rainguards and tapping utensils to increase productivity',
    sortorder: 5,
  },
  {
    title: 'Evaluation of intercrops in traditional and non-traditional areas.',
    sortorder: 6,
  },
  {
    title: 'Different rubber agroforestry models for sustainable ecosystems',
    sortorder: 7,
  },
  {
    title: 'Effect of different latex harvesting systems on growth, yield and bark consumption',
    sortorder: 8,
  },
  {
    title: 'Testing remedies to address tapping panel dryness in tapping fields',
    description:
      'Investigating the effectiveness of priming of newly opened tapping trees with botanicals and chemical compounds to alleviate abiotic stresses under sub-optimal climate conditions in the Intermediate zone of Sri Lanka.',
    sortorder: 9,
  },
];

function getPopulate() {
  return {
    currentresearchprojectsection: {
      populate: {
        sectionheader: true,
        researchprojects: {
          populate: {
            image: true,
            galleryimages: true,
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

function buildSectionHeader(existingHeader) {
  return {
    eyebrow: existingHeader?.eyebrow?.trim() || 'Current Research Projects',
    title: existingHeader?.title?.trim() || 'Current Research ',
    hightlightedtext: existingHeader?.hightlightedtext?.trim() || 'Projects',
    alignment: existingHeader?.alignment || 'left',
  };
}

function assertPublishedResult(department) {
  if (department?.currentprojectpresent !== true) {
    throw new Error('Current research projects verification failed: the visibility flag is not enabled.');
  }

  const projects = department?.currentresearchprojectsection?.researchprojects || [];

  if (projects.length !== PROJECTS.length) {
    throw new Error(
      `Current research projects verification failed: expected ${PROJECTS.length} projects, found ${projects.length}.`
    );
  }

  for (const expected of PROJECTS) {
    const actual = projects.find((project) => project?.sortorder === expected.sortorder);

    if (!actual) {
      throw new Error(
        `Current research projects verification failed: missing project with sortorder ${expected.sortorder}.`
      );
    }

    if (actual.title?.trim() !== expected.title) {
      throw new Error(
        `Current research projects verification failed: unexpected title for sortorder ${expected.sortorder}.`
      );
    }

    const expectedDescription = expected.description?.trim() || null;
    const actualDescription = actual.description?.trim() || null;

    if (expectedDescription !== actualDescription) {
      throw new Error(
        `Current research projects verification failed: unexpected description for sortorder ${expected.sortorder}.`
      );
    }

    if (actual.includeinhomepage !== false) {
      throw new Error(
        `Current research projects verification failed: includeinhomepage should be false for sortorder ${expected.sortorder}.`
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

    await repository.update({
      documentId: department.documentId,
      locale: LOCALE,
      data: {
        currentprojectpresent: true,
        currentresearchprojectsection: {
          sectionheader: buildSectionHeader(department.currentresearchprojectsection?.sectionheader),
          researchprojects: PROJECTS.map((project) => ({
            title: project.title,
            description: project.description || null,
            sortorder: project.sortorder,
            includeinhomepage: false,
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
      `Updated and published the ${LOCALE} Plant Science current research projects section with ${PROJECTS.length} projects (images left for CMS).`
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
    console.error('Failed to update the Plant Science current research projects section.');
    console.error(error);
    process.exit(1);
  });
