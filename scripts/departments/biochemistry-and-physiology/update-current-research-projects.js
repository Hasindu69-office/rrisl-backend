'use strict';

const { compileStrapi, createStrapi } = require('@strapi/strapi');

const CONTENT_TYPE_UID =
  'api::biochemistry-and-physiology-department.biochemistry-and-physiology-department';
const LOCALE = 'en';
const DEPARTMENT_LABEL = 'Biochemistry and Physiology';

const PROJECTS = [
  {
    title: 'Optimize the Ethephon Stimulation Protocol of S/2 d3 Harvesting System',
    description:
      'Objective: To identify a user-friendly stimulation protocol for S/2 d3 system while preserving the health of the laticiferous system. Research findings: The ethephon stimulation protocol for the S/2 d3 harvesting system was optimized through small-scale field evaluations.',
    researchteam:
      'CI — NPSN Karunarathne (RO, BC & P Dept); Technical Staff — LTBK Fernando (TO), PDTL Madushani (TO)',
    sortorder: 1,
  },
  {
    title:
      'Identifying the effect of fungicide cocktail on yield determinant factors of CLSD affected fields',
    description:
      'Objectives: Assess temporal changes in latex yield and biochemical parameters (sucrose, Pi, thiols, plugging index, etc.) following fungicide cocktail application; determine the effect on disease severity reduction over time; identify the relationship between canopy recovery, biochemical responses, and yield.',
    researchteam:
      'CI — NPSN Karunarathne (RO, BC & P Dept); Technical Staff — LTBK Fernando (TO), PDTL Madushani (TO)',
    sortorder: 2,
  },
  {
    title:
      'Providing site specific stimulation and LIH strategies to improve the yield of unproductive or low productive rubber lands on request of growers',
    description:
      'Provide site-specific stimulation protocols and low-intensity harvesting (LIH) strategies to improve the productivity and sustainability of unproductive or low-productive rubber lands in Sri Lanka.',
    researchteam:
      'CI — NPSN Karunarathne (RO, BC & P Dept); Technical Staff — LTBK Fernando (TO), PDTL Madushani (TO)',
    sortorder: 3,
  },
  {
    title:
      'Improving the locally developed ethephon formulation by incorporating anti-stress compounds',
    description:
      'Objectives: Develop an enhanced local ethephon formulation incorporating features that regulate stimulation intensity and reduce tapping and stimulation stress; assess physiological impacts on yield, latex flow and latex physiology; compare performance, cost-effectiveness, and stress-mitigation capacity against commercially imported ethephon products. Research findings: A cost-effective, locally formulated ethephon stimulant was developed as an alternative to imported formulations for sustainable rubber production.',
    researchteam:
      'CI — NPSN Karunarathne (RO, BC & P Dept); Technical Staff — LTBK Fernando (TO), PDTL Madushani (TO)',
    sortorder: 4,
  },
  {
    title: 'Classification and modelling of rubber clones through latex diagnostic parameters',
    description:
      'Objectives: Characterize the physiological status of selected Hevea clones based on key latex biochemical parameters; determine clones with stable physiological profiles suitable for future sustainable cultivation; develop a physiological index to assess and predict productivity and sustainability; establish predictive models describing annual and seasonal variations in key latex biochemical parameters. Research findings: Metabolic profiles of locally available rubber clones at present were characterized and categorized to support selection and management strategies.',
    researchteam:
      'PI — NPSN Karunarathne (RO, BC & P Dept); CI — Dr. KVVS Kudaligama (Head, BC & P Dept); Technical Staff — LTBK Fernando (TO), PDTL Madushani (TO)',
    sortorder: 5,
  },
  {
    title:
      'Classifying the physiological and metabolic performance of new rubber progenies through latex diagnosis',
    description:
      'Objectives: Identify plant physiological status and yielding capacity of Hevea genotypes developed by G & PB Department; identify genotypes with long-term sustainability and suitability for future cultivation. Research findings: Newly developed Hevea progenies were screened for their metabolic performance to identify superior genotypes.',
    researchteam:
      'PI — NPSN Karunarathne (RO, BC & P Dept); Technical Staff — LTBK Fernando (TO), PDTL Madushani (TO)',
    sortorder: 6,
  },
  {
    title:
      'Identifying the effect of suboptimal conditions in nontraditional areas on physiological and biochemical features and yield of rubber tree',
    description:
      'Objectives: Evaluate the performance of established rubber clones under suboptimal climatic conditions in non-traditional rubber growing regions; identify sustainable rubber clones for the nontraditional rubber growing areas. Research findings: Growth, yield, and physiological performance of different rubber clones are being evaluated to identify superior genotypes and optimize management practices.',
    researchteam:
      'CI — NPSN Karunarathne (RO, BC & P Dept); Technical Staff — LTBK Fernando (TO), PDTL Madushani (TO)',
    sortorder: 7,
  },
  {
    title:
      'Comprehensive assessment of wood properties and timber quality of different Hevea clones',
    description:
      'Objectives: Evaluate clonal variation in merchantable timber volume, physical, biochemical, and mechanical properties, and anatomical characteristics of rubber wood clones; identify relationships between physical properties, biochemical composition and mechanical properties; develop a classification system for rubber wood clones; identify superior timber clones for commercial use.',
    researchteam:
      'PI — NPSN Karunarathne (RO, BC & P Dept); Technical Staff — LTBK Fernando (TO), PDTL Madushani (TO)',
    sortorder: 8,
  },
  {
    title: 'Identifying the typological variations of wood properties and timber qualities',
    description:
      'Objectives: Investigate the physical, biochemical, mechanical properties, and anatomical characteristics of rubber wood across different ages and stem heights to assess suitability for industrial applications; identify relationships between physical properties, biochemical composition and mechanical properties; develop a typology-based classification framework for rubber wood that integrates age and stem-height–related variations.',
    researchteam:
      'PI — NPSN Karunarathne (RO, BC & P Dept); Technical Staff — LTBK Fernando (TO), PDTL Madushani (TO)',
    sortorder: 9,
  },
  {
    title:
      'Development of safe, non-toxic rubber wood preservation methods for value-added green products',
    description:
      'Objectives: Develop and evaluate eco-friendly botanical and microbial-based rubber wood preservation treatments; identify the most effective natural preservative or treatment combination for rubber wood; assess the financial feasibility of sustainably preserved rubber wood compared to conventionally treated wood.',
    researchteam:
      'PI — NPSN Karunarathne (RO, BC & P Dept); CI — Dr. KVVS Kudaligama (Head, BC & P Dept); Technical Staff — LTBK Fernando (TO), PDTL Madushani (TO)',
    sortorder: 10,
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
