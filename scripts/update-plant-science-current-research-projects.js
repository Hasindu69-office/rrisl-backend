'use strict';

const { compileStrapi, createStrapi } = require('@strapi/strapi');

const CONTENT_TYPE_UID = 'api::plant-science-department.plant-science-department';
const LOCALE = 'en';

const LATEX_HARVESTING_TEAM =
  'T U K Silva, P.K.W Karunathilaka, K.S.H.M. Subasingha and R.P.D. Priyadarshana';

const PROJECTS = [
  {
    title: 'Nursery experiments on plant quality improvement',
    description:
      'Experiments investigating the effect of Red and Blue LED lighting on stock plant growth are carried out throughout the nursery period to reduce the nursery period for rubber seedlings, enabling faster bud grafting and field establishment.',
    researchteam: 'M. N. Alwis, D.L.N. de Zoysa and H.L.T.Tharaka',
    sortorder: 1,
  },
  {
    title: 'Improved Irrigation systems for rubber nurseries',
    description:
      'Experiments are currently being conducted to develop and evaluate efficient micro-irrigation systems for rubber nurseries, to improve water-use efficiency, promoting uniform plant growth and enhance the quality of planting materials.',
    researchteam: 'S A Nakandala, T U K Silva and U N Udayakumari',
    sortorder: 2,
  },
  {
    title:
      'Different planting strategies and improvements in immature rubber plantings for maintaining the correct tree stand.',
    description:
      'The research focuses on evaluating different planting strategies and branch induction techniques to improve initial plant establishment and vigorous growth. Identifying the suitability of root-balled plants for gap filling and replacing dead or poorly established plants to improve tree stand uniformity during the immature growth phase.',
    researchteam: 'S A Nakandala, M. N. Alwis, D.L.N. de Zoysa, and U N Udayakumari',
    sortorder: 3,
  },
  {
    title: 'Effect of different latex harvesting systems on growth, yield and bark consumption',
    description:
      'The Plant Science Department is conducting research to evaluate the effects of different latex harvesting systems on tree growth, latex yield, and bark consumption in rubber (Hevea brasiliensis), aiming to identify efficient, sustainable harvesting practices that enhance productivity and the economic lifespan of rubber plantations.',
    researchteam: LATEX_HARVESTING_TEAM,
    sortorder: 4,
  },
  {
    title:
      'Evaluation of Rubber Tapping Performance: Motorized Tapping Machines Vs Traditional Tapping Knives',
    description:
      'Research is being conducted to evaluate the performance and suitability of motorized rubber tapping machines in comparison with conventional manual tapping using traditional tapping knives. The study focuses on comparing the operational performance of motorized tapping machines and traditional tapping knives in terms of tapping time, labour productivity, tapping quality, latex yield and bark consumption in order to address labour shortages, improve tapping efficiency and promote sustainable latex harvesting.',
    researchteam: LATEX_HARVESTING_TEAM,
    sortorder: 5,
  },
  {
    title: 'Evaluation of Different Types of Rain Guards for Enhancing Rubber Productivity',
    description:
      'Research activities are being conducted to evaluate the effectiveness of different types of rain guards in protecting tapping panels from rainwater and minimizing tapping-day losses during wet weather conditions. The study focuses on evaluating different rain guard designs, including apron, Kissan, gutter-types and other locally available or innovative designs, under different field conditions.',
    researchteam: LATEX_HARVESTING_TEAM,
    matchTitles: [
      'Testing of different types of rainguards and tapping utensils to increase productivity',
    ],
    sortorder: 6,
  },
  {
    title: 'Evaluation of intercrops in traditional and non-traditional areas.',
    description:
      'Research on intercrops evaluates the suitability and performance of different intercrops under traditional rubber-growing areas and non-traditional rubber-growing areas (Intermediate and Dry Zones) of Sri Lanka. The study focuses on identifying suitable intercrop species and cropping systems that can be integrated with rubber cultivation without adversely affecting the growth, development and productivity of rubber trees.',
    researchteam: 'T U K Silva, P. D. Pathirana and R.P.D. Priyadarshana',
    sortorder: 7,
  },
  {
    title:
      'Evaluation of Botanicals and Chemical Compounds for Managing Tapping Panel Dryness in Rubber Plantations',
    description:
      'This research investigates the effectiveness of selected botanical extracts and chemical compounds as priming agents to alleviate tapping-induced physiological stress and manage tapping panel dryness (TPD) in Hevea brasiliensis. The study focuses on rubber plantations under sub-optimal climatic conditions in the Intermediate Zone of Sri Lanka, where environmental stresses can adversely affect latex production and tree health. The findings are expected to contribute to the development of practical management strategies for reducing tapping panel dryness and improving the long-term sustainability of rubber production.',
    researchteam:
      'S. A. Nakandala, T U K Silva, P.K.W Karunathilaka, K.S.H.M. Subasingha and R.P.D. Priyadarshana in collaboration of Biochemistry and Physiology Department',
    matchTitles: [
      'Testing remedies to address tapping panel dryness in tapping fields',
    ],
    sortorder: 8,
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

function normalizeTitle(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function mediaId(media) {
  return Number.isInteger(media?.id) ? media.id : null;
}

function mediaIds(media) {
  return (media || []).map((asset) => asset?.id).filter(Number.isInteger);
}

function projectTitleKeys(project) {
  return [project.title, ...(project.matchTitles || [])].map(normalizeTitle).filter(Boolean);
}

function findExistingProject(existingProjects, project, usedIds) {
  const titleKeys = new Set(projectTitleKeys(project));

  const byTitle = existingProjects.find((candidate) => {
    if (usedIds.has(candidate?.id)) return false;
    return titleKeys.has(normalizeTitle(candidate?.title));
  });

  if (byTitle) return byTitle;

  return existingProjects.find(
    (candidate) => !usedIds.has(candidate?.id) && candidate?.sortorder === project.sortorder
  );
}

function mediaSnapshot(projects) {
  return Object.fromEntries(
    (projects || []).map((project) => [
      String(project.sortorder),
      {
        image: mediaId(project.image),
        galleryimages: mediaIds(project.galleryimages),
      },
    ])
  );
}

function buildResearchProjects(existingProjects) {
  const usedIds = new Set();

  return PROJECTS.map((project) => {
    const existing = findExistingProject(existingProjects, project, usedIds);

    if (existing?.id) {
      usedIds.add(existing.id);
    }

    const image = mediaId(existing?.image);
    const galleryimages = mediaIds(existing?.galleryimages);

    return {
      title: project.title,
      description: project.description || null,
      researchteam: project.researchteam || null,
      sortorder: project.sortorder,
      includeinhomepage: existing?.includeinhomepage === true,
      ...(image ? { image } : {}),
      ...(galleryimages.length > 0 ? { galleryimages } : {}),
    };
  });
}

function assertPublishedResult(department, expectedMedia) {
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

    const expectedTeam = expected.researchteam?.trim() || null;
    const actualTeam = actual.researchteam?.trim() || null;

    if (expectedTeam !== actualTeam) {
      throw new Error(
        `Current research projects verification failed: unexpected researchteam for sortorder ${expected.sortorder}.`
      );
    }
  }

  if (JSON.stringify(mediaSnapshot(projects)) !== JSON.stringify(expectedMedia)) {
    throw new Error(
      'Current research projects verification failed: one or more image/gallery relationships changed.'
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

    const existingProjects = department.currentresearchprojectsection?.researchprojects || [];
    const researchprojects = buildResearchProjects(existingProjects);
    const expectedMedia = mediaSnapshot(
      researchprojects.map((project) => ({
        sortorder: project.sortorder,
        image: project.image ? { id: project.image } : null,
        galleryimages: (project.galleryimages || []).map((id) => ({ id })),
      }))
    );

    const preservedCount = researchprojects.filter(
      (project) => project.image || (project.galleryimages && project.galleryimages.length > 0)
    ).length;

    await repository.update({
      documentId: department.documentId,
      locale: LOCALE,
      data: {
        currentprojectpresent: true,
        currentresearchprojectsection: {
          sectionheader: buildSectionHeader(department.currentresearchprojectsection?.sectionheader),
          researchprojects,
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

    assertPublishedResult(updatedDepartment, expectedMedia);

    console.log(
      `Updated and published the ${LOCALE} Plant Science current research projects section with ${PROJECTS.length} projects including research teams (preserved media on ${preservedCount} projects).`
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
