'use strict';

const { compileStrapi, createStrapi } = require('@strapi/strapi');

const CONTENT_TYPE_UID =
  'api::raw-rubber-and-chemical-analysis-department.raw-rubber-and-chemical-analysis-department';
const LOCALE = 'en';
const DEPARTMENT_LABEL = 'Raw Rubber and Chemical Analysis';

const PROJECTS = [
  {
    title:
      'Investigation of the effect of skim rubber adulteration for the Physicomechanical Properties of Technically Specified Rubber (2025/2026)',
    description:
      'This ongoing research investigates the effects of skim rubber incorporation on the physicomechanical properties and quality characteristics of technically specified rubber (TSR), assessing its potential to alleviate raw material shortages in Sri Lanka\'s TSR industry.',
    researchteam:
      'Dr. Anusha Attanayake (RRISL), Anuradhi Ranawaka (RRISL), W.U.L.Perera (UWU), Supun Chandra (University of Kelaniya), Viraj Supun (University of Kelaniya)',
    sortorder: 1,
  },
  {
    title:
      'Effect of latex blending from different origins on colloidal stability and for mechanical properties (2026)',
    description:
      'Investigated the effects of blending concentrated natural rubber latices from different origins on colloidal stability and film properties. The findings demonstrated that blending imported and local latices improved mechanical and chemical stability, tensile strength, modulus, and crosslink density, highlighting its potential to support consistent latex quality amid domestic raw material shortages.',
    researchteam:
      'Dr. Anusha Attanayake (RRISL), Anuradhi Ranawaka (RRISL), Madhavee Kaushalya (University of Sri Jayawardenepura)',
    sortorder: 2,
  },
  {
    title: 'Development of a Field Method for Assessing TMTD/ZnO Levels in Natural Rubber Latex (2026)',
    description:
      'This ongoing research aims to develop and evaluate a simple colorimetric method using chemical X to detect and estimate TMTD/ZnO levels in natural rubber latex. The study assesses colour responses and their reliability, with the goal of enabling practical field screening and supporting latex preservation and quality control.',
    researchteam:
      'Dr. Anusha Attanayake (RRISL), Anuradhi Ranawaka (RRISL), Madhavee Kaushalya (University of Sri Jayawardenepura), M.D.J.V.Mahawatta (UoJ)',
    sortorder: 3,
  },
  {
    title:
      'Development of a new ISO test method for the determination of Volatile Fatty Acid (VFA) content in natural rubber field latex',
    description:
      'This ongoing research aims to enhance quality assessment and standardization of latex quality evaluation.',
    researchteam:
      'Dr. Anusha Attanayake (RRISL), Anuradhi Ranawaka (RRISL), M.U.D.S. Weerasinghe (RRISL), Madhavee Kaushalya (RRISL)',
    sortorder: 4,
  },
  {
    title: 'Investigation of the effect of fumigation gases on natural rubber quality',
    description:
      'This research aims to assess potential impacts of quarantine treatments on rubber properties.',
    researchteam:
      'Dr. Anusha Attanayake (RRISL), Anuradhi Ranawaka (RRISL), M.U.D.S. Weerasinghe (RRISL), Madhavee Kaushalya (RRISL), Isuri Hettigoda (University of Kelaniya)',
    sortorder: 5,
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
