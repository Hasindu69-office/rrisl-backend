'use strict';

const { compileStrapi, createStrapi } = require('@strapi/strapi');

const CONTENT_TYPE_UID = 'api::adaptive-research-department.adaptive-research-department';
const LOCALE = 'en';
const DEPARTMENT_LABEL = 'Adaptive Research';

const PROJECTS = [
  {
    title: 'Evaluation of the performance of three rubber clones in the Dry Zone',
    description:
      'With the introduction of rubber to non-traditional areas, testing existing clones under non-traditional conditions has become a necessity. This research evaluates the performance of the existing clones RRISL 2001, RRISL 203 and RRIC 121 under smallholder management conditions in the Dry Zone.',
    researchteam:
      'Dr. E.S. Munasinghe, Dr. B.M.D.C. Balasooriya, Dr. K.K. Liyanage, Mr. P.M.M. Jayathilake, Mr. T.M.S.K. Gunasekara',
    sortorder: 1,
  },
  {
    title: 'Identification of a suitable fertilizer mixture for immature rubber in the Dry Zone',
    description:
      'In the context of rubber cultivation expanding into more suboptimal environments, a recommendation of the optimum fertilizer mixture for immature rubber is of utmost importance. This experiment aims to address this gap by identifying a suitable fertilizer mixture for immature rubber in the Dry Zone.',
    researchteam:
      'Dr. E.S. Munasinghe, Dr. B.M.D.C. Balasooriya, Mr. T.S. Liyanaarachchi, Mr. P.M.M. Jayathilake, Mr. P.D.T.C. Gunathilake',
    sortorder: 2,
  },
  {
    title: 'Situational analysis of immature rubber clearings following the subsidy policy revision',
    description:
      'Since 2023, the cash subsidy for rubber replanting and new planting has been discontinued and replaced with the provision of planting materials. However, there is limited empirical evidence on how this policy shift has affected the growth performance and survival of young rubber plantings, and the adoption of recommended cultivation practices by growers. These outcomes directly influence long-term productivity and farmer livelihoods. This study therefore aims to assess the impact of the subsidy policy change on the establishment, agronomic and overall performance of rubber cultivation.',
    researchteam:
      'Dr. B.M.D.C. Balasooriya, Dr. E.S. Munasinghe, Ms. P.G.N. Ishani, Mr. P.M.M. Jayathilake',
    sortorder: 3,
  },
  {
    title: 'Evaluation of adaptability of new promising clones',
    description:
      'The introduction of new clones for rubber cultivation is a critical component of improving productivity and sustainability in the rubber sector. However, being a perennial crop, the development of new clones is a long-term and resource-intensive process. Even after a promising clone is identified, it must undergo extensive adaptive research to evaluate its performance under smallholder conditions. This adaptive research phase is essential to ensure that the new clone is suitable, stable, and commercially viable before being recommended for large-scale cultivation.',
    researchteam: 'Dr. B.M.D.C. Balasooriya, Dr. E.S. Munasinghe, Mr. P.M.M. Jayathilake',
    sortorder: 4,
  },
  {
    title: 'Efficacy of fungicide cocktail / IDM protocols against CLSD',
    description:
      'This adaptive research evaluates the effectiveness and field adaptability of the recommended fungicide cocktail and Integrated Disease Management (IDM) protocol against Circular Leaf Spot Disease (CLSD), validating the findings of earlier research under real field conditions.',
    researchteam: 'Dr. B.M.D.C. Balasooriya, Dr. E.S. Munasinghe, Mr. P.M.M. Jayathilake',
    sortorder: 5,
  },
  {
    title:
      'Development of Sustainability Certification System for Natural Rubber (SCSNR) in Sri Lanka',
    description:
      'This project aims to establish a national Sustainability Certification System for Natural Rubber (SCSNR) to increase the productivity of rubber lands and access niche export markets. The system will consider the social, environmental, economic and production aspects of natural rubber. It responds to growing exporter demand for certification under the UN 2030 Agenda and the EU Deforestation Regulation (EUDR). Since existing international schemes are costly for smallholders, who contribute about 70% of national production, a locally developed system will offer an affordable alternative and a competitive advantage for the Sri Lankan rubber industry.',
    researchteam:
      'RRISL: Dr. (Mrs.) E.S. Munasinghe, Mrs. P.G.N. Ishani, Mr. S.D. Ratnayake, Dr. P.K.K.S. Gunaratne, Dr. (Mrs.) B.M.D.C. Balasooriya; Rubber Development Department (RDD): Mrs. K.K.C. Kaneru',
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
