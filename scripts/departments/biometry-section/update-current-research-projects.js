'use strict';

const { compileStrapi, createStrapi } = require('@strapi/strapi');

const CONTENT_TYPE_UID = 'api::biometry-section-department.biometry-section-department';
const LOCALE = 'en';
const DEPARTMENT_LABEL = 'Biometry Section';

const PROJECTS = [
  {
    title:
      'Improving the reliability of interpretations of research projects through appropriate statistical methods',
    description:
      'The research initiative focuses on enhancing the credibility and robustness of research conclusions. By employing well-suited statistical methodologies, the study aims to fortify the accuracy and consistency of interpretations derived from data analysis.',
    researchteam:
      'Mr. A.M.R.W.S. Dilhan Rathnayaka (PI – Research Officer, Biometry Section), Mr. Vidura Abayawardana (Experimental Officer, Biometry Section)',
    sortorder: 1,
  },
  {
    title:
      'Developing Statistically Robust and Machine-Learning Enhanced Indices for Measuring Performance of Smallholder Rubber Units',
    description:
      'Developing statistically robust and machine-learning enhanced composite indices for measuring and evaluating the performance of smallholder rubber units.',
    researchteam:
      'Mr. A.M.R.W.S. Dilhan Rathnayaka (PI – Research Officer, Biometry Section), Mrs. P.G.N. Ishani (Co-Investigator – Research Officer, Agricultural Economics Unit), Mr. J.K.S. Sankalpa (Co-Investigator – Research Officer, Agricultural Economics Unit), Mr. Vidura Abayawardana (Experimental Officer, Biometry Section)',
    sortorder: 2,
  },
  {
    title:
      'Improving the knowledge base on climate, climate change & variability for better decision making in rubber growing areas',
    description:
      'Maintenance of databases on meteorological data in rubber growing areas and analysis of climate change and variability to support better decision making.',
    researchteam:
      'Mr. A.M.R.W.S. Dilhan Rathnayaka (PI – Research Officer, Biometry Section), Mr. Vidura Abayawardana (Experimental Officer, Biometry Section)',
    sortorder: 3,
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
        `English ${DEPARTMENT_LABEL} document was not found (${CONTENT_TYPE_UID}). Create the EN single type in Strapi Admin first.`
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
