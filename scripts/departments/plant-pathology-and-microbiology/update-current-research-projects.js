'use strict';

const { compileStrapi, createStrapi } = require('@strapi/strapi');

const CONTENT_TYPE_UID =
  'api::plant-pathology-and-microbiology-department.plant-pathology-and-microbiology-department';
const LOCALE = 'en';
const DEPARTMENT_LABEL = 'Plant Pathology and Microbiology';

const PROJECTS = [
  {
    title: 'Development of chemical management strategies against rubber diseases & pests',
    description:
      'The Department conducts research to develop, optimize, and evaluate chemical management strategies for major diseases and pests affecting rubber cultivation. Key activities include optimizing fungicide formulations for Circular Leaf Spot Disease (CLSD), calibrating drone-based fungicide application, suppressing pathogen inoculum through leaf-litter management, screening fungicides against root diseases, and developing effective repellent chemicals against mammalian pests of rubber. These research activities aim to enhance disease and pest control efficiency, minimize crop losses, and promote sustainable rubber production.',
    researchteam:
      'T.H.P.S. Fernando, M.K.R. Silva, E.A.D.D. Siriwardena, S.C.P. Wijayaratne, D.A.N. Mallikaarachchi',
    sortorder: 1,
  },
  {
    title:
      'Formulation of integrated disease management protocols against economically important rubber diseases',
    description:
      'The Department develops and validates integrated disease management (IDM) protocols for major diseases affecting rubber cultivation, with particular emphasis on Circular Leaf Spot Disease (CLSD) and root diseases. These protocols incorporate complementary cultural, biological, chemical, and other appropriate management approaches to enhance disease suppression and minimize crop losses. The overall objective is to improve plantation health, maintain rubber productivity, and ensure the long-term sustainability of the rubber industry.',
    researchteam:
      'T.H.P.S. Fernando, E.A.D.D. Siriwardena, S.C.P. Wijayaratne, A.H.M.N.R. Aberathne',
    sortorder: 2,
  },
  {
    title: 'Screening of Hevea clones against the economically important rubber diseases',
    description:
      'The Department evaluates Hevea clones for their resistance or tolerance to economically important rubber diseases under field and controlled conditions. This work identifies disease-resistant planting materials to support breeding programmes, improve plantation resilience, and promote sustainable rubber production.',
    researchteam:
      'T.H.P.S. Fernando, M.K.R. Silva, E.A.D.D. Siriwardena, S.C.P. Wijayaratne, E.A.D.N. Nishantha, D.A.N. Mallikaarachchi',
    sortorder: 3,
  },
  {
    title: 'Studies of Biology & Molecular-biology of pathogens',
    description:
      'The Department conducts research on the biology, epidemiology, and molecular characterization of pathogens associated with Circular Leaf Spot Disease (CLSD) and other economically important diseases of rubber. Research activities focus on pathogen identification, genetic diversity, host–pathogen interactions, and the characterization of host resistance traits using morphological, pathological, and molecular approaches. These investigations aim to elucidate disease development mechanisms and provide a scientific basis for developing effective and sustainable disease management strategies.',
    researchteam: 'T.H.P.S. Fernando, H.V.A.S. Koshila, E.A.D.N. Nishantha, A.H.M.N.R. Aberathne',
    sortorder: 4,
  },
  {
    title: 'Soil Microbiology and microbiological applications',
    description:
      'The Department investigates the diversity, ecology, and functional roles of soil microorganisms associated with rubber-growing ecosystems, with emphasis on their contributions to soil health and plant productivity. Research focuses on the isolation, identification, characterization, and evaluation of beneficial microorganisms, particularly biological control agents such as Trichoderma spp., for the suppression of soil-borne pathogens. These studies aim to develop microbiology-based applications for sustainable disease management, improved soil health, and environmentally friendly rubber cultivation.',
    researchteam: 'T.H.P.S. Fernando, E.A.D.N. Nishantha, A.H.M.N.R. Aberathne',
    sortorder: 5,
  },
  {
    title: 'Surveillance of potential pests and disease outbreaks and provision of services',
    description:
      'The Department conducts regular surveillance to detect emerging pests and disease outbreaks in rubber plantations. Timely diagnosis, field inspections, laboratory analyses, and technical advisory services are provided to growers, enabling early intervention, effective management, and minimizing economic losses while supporting sustainable rubber production.',
    researchteam:
      'T.H.P.S. Fernando, M.K.R. Silva, E.A.D.D. Siriwardena, S.C.P. Wijayaratne, D.A.N. Mallikaarachchi',
    sortorder: 6,
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

function findExistingProject(existingProjects, project, usedIds) {
  const expectedTitle = normalizeTitle(project.title);

  const byTitle = existingProjects.find((candidate) => {
    if (usedIds.has(candidate?.id)) return false;
    return normalizeTitle(candidate?.title) === expectedTitle;
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
    const payload = {
      title: project.title,
      sortorder: project.sortorder,
      includeinhomepage: existing?.includeinhomepage === true,
    };

    if (project.description) {
      payload.description = project.description;
    }

    if (project.researchteam) {
      payload.researchteam = project.researchteam;
    }

    if (image) {
      payload.image = image;
    }

    if (galleryimages.length > 0) {
      payload.galleryimages = galleryimages;
    }

    return payload;
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
      throw new Error(
        `English ${DEPARTMENT_LABEL} Department document was not found (${CONTENT_TYPE_UID}). Create the EN single type in Strapi Admin first.`
      );
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
      `Updated and published the ${LOCALE} ${DEPARTMENT_LABEL} current research projects section with ${PROJECTS.length} projects (preserved media on ${preservedCount}; upload remaining in CMS).`
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
    console.error(`Failed to update the ${DEPARTMENT_LABEL} current research projects section.`);
    console.error(error);
    process.exit(1);
  });
