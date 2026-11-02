'use strict';

const { compileStrapi, createStrapi } = require('@strapi/strapi');

const CONTENT_TYPE_UID = 'api::plant-science-department.plant-science-department';
const LOCALE = 'en';

const CONTACT =
  'Head, Plant Science department, Rubber Research Institute, Dartonfield, Agalawatta. +94 34 2247383 (Ext. 216)';

/**
 * Single source of topics for Plant Science services.
 * Data (description / details / nested items) lives on each group.
 * Images: existing CMS relations are preserved. Optional `imageHints` reattach
 * files already in the Media Library by filename when an item has no images yet.
 * Brand-new image files still need a one-time Media Library upload.
 */
const SERVICE_GROUPS = [
  {
    servicekey: 'land-evaluation',
    title: 'Land evaluation',
    sortorder: 1,
    items: [],
  },
  {
    servicekey: 'laboratory-testing',
    title: 'Laboratory testing',
    sortorder: 2,
    items: [],
  },
  {
    servicekey: 'efficacy-testing',
    title: 'Efficacy testing',
    sortorder: 3,
    items: [
      {
        servicekey: 'tapping-knife-technical-specifications',
        title: 'Testing technical specifications for tapping knives',
        sortorder: 1,
        details: [
          { label: 'Test', value: 'Testing technical specifications for tapping knives', sortorder: 1 },
          { label: 'Department', value: 'Plant Science', sortorder: 2 },
          { label: 'Method', value: 'Physical and Hardness test', sortorder: 3 },
          { label: 'Contact details', value: CONTACT, sortorder: 4 },
        ],
      },
      {
        servicekey: 'tapping-panel-marking-stencils',
        title: 'Provide technical specifications for stencils for tapping panel marking',
        sortorder: 2,
        details: [
          { label: 'Test', value: 'Testing technical specifications for marking stencils', sortorder: 1 },
          { label: 'Department', value: 'Plant Science', sortorder: 2 },
          { label: 'Method', value: 'Physical test with checking dimension', sortorder: 3 },
          { label: 'Contact details', value: CONTACT, sortorder: 4 },
        ],
      },
      {
        servicekey: 'rain-guard-material-quality',
        title: 'Testing the quality of rain guard materials',
        sortorder: 3,
        details: [
          { label: 'Test', value: 'Testing the quality of rain guard materials', sortorder: 1 },
          { label: 'Department', value: 'Plant Science', sortorder: 2 },
          { label: 'Method', value: 'Physical test with field application', sortorder: 3 },
          { label: 'Contact details', value: CONTACT, sortorder: 4 },
        ],
      },
    ],
  },
  {
    servicekey: 'e-testing-services',
    title: 'E-testing services',
    sortorder: 4,
    items: [],
  },
  {
    servicekey: 'plant-certification-quality-assurance',
    title: 'Plant Certification and Quality Assurance',
    description:
      'Government, RPC, and private nurseries are continuously inspected, and inspection reports will be issued to maintain the quality of planting material to be released for upcoming planting seasons annually.\n\nAll bud-wood nurseries belonging to the Rubber Development Department, Discarding weak young budded plants and unsuccessful plants in RDD nurseries is done in the presence of officials from both RRISL and RDD to avoid issuing poor-quality plants to the field.',
    sortorder: 5,
    items: [],
  },
  {
    servicekey: 'advisory-training-programs',
    title: 'Advisory and Training programs',
    sortorder: 6,
    items: [
      {
        servicekey: 'disseminating-latex-harvesting-technologies',
        title: 'Disseminating Latex Harvesting Technologies',
        description:
          'Conducting latex harvesting and bark auditing technologies for improve quality of harvesting for sustainable latex production',
        sortorder: 1,
        details: [],
        matchKeys: ['dissaminating-latex-harvesting-technologies'],
        imageHints: ['Trainingimg1'],
      },
      {
        servicekey: 'bud-grafting-training-programmes',
        title: 'Bud Grafting Training Programmes',
        description:
          'Conduct bud grafting training programmes for RDD and RPC nursery workers to improve the efficiency and technical skills of existing bud grafters, while also training new entrants who wish to become qualified bud grafters.',
        sortorder: 2,
        details: [],
        imageHints: ['Trainingimg2'],
      },
      {
        servicekey: 'field-establishment-immature-upkeep',
        title: 'Training on Field Establishment and immature upkeep',
        sortorder: 3,
        details: [],
        imageHints: ['Trainingimg3', 'Trainingimg4'],
      },
    ],
  },
  {
    servicekey: 'academic-support',
    title: 'Academic support',
    description:
      'Provides academic supervision as external supervisors under the main research disciplines of the Department and facilitates the conduct of:',
    sortorder: 7,
    items: [
      {
        servicekey: 'final-year-research',
        title: 'Final year research for undergraduates, MSc and PhD students',
        sortorder: 1,
        details: [],
      },
      {
        servicekey: 'internships',
        title: 'Internships',
        sortorder: 2,
        details: [],
      },
      {
        servicekey: 'industrial-trainings',
        title: 'Industrial trainings',
        sortorder: 3,
        details: [],
      },
      {
        servicekey: 'university-lectures-visiting',
        title: 'University lectures – visiting',
        sortorder: 4,
        details: [],
      },
      {
        servicekey: 'training-the-trainers',
        title: 'Training the Trainers',
        sortorder: 5,
        details: [],
      },
    ],
  },
];

function getPopulate() {
  return {
    servicesection: {
      populate: {
        sectionheader: true,
        servicegroups: {
          populate: {
            images: true,
            items: {
              populate: {
                images: true,
                details: true,
              },
            },
          },
        },
      },
    },
  };
}

async function findDepartment(repository) {
  const populate = getPopulate();
  return (
    (await repository.findFirst({ locale: LOCALE, status: 'published', populate })) ||
    repository.findFirst({ locale: LOCALE, status: 'draft', populate })
  );
}

function toMediaId(asset) {
  if (Number.isInteger(asset)) {
    return asset;
  }

  if (typeof asset === 'string' && /^\d+$/.test(asset)) {
    return Number(asset);
  }

  const id = asset?.id;

  if (Number.isInteger(id)) {
    return id;
  }

  if (typeof id === 'string' && /^\d+$/.test(id)) {
    return Number(id);
  }

  return null;
}

function mediaIds(media) {
  return (media || [])
    .map(toMediaId)
    .filter((id) => id != null)
    .sort((left, right) => left - right);
}

function imageSnapshot(groups) {
  return Object.fromEntries(
    (groups || []).map((group) => [
      group.servicekey,
      {
        images: mediaIds(group.images),
        items: Object.fromEntries(
          (group.items || []).map((item) => [item.servicekey, mediaIds(item.images)])
        ),
      },
    ])
  );
}

function findExistingGroup(existingGroups, servicekey) {
  return (existingGroups || []).find((candidate) => candidate?.servicekey === servicekey) || null;
}

function findExistingItem(existingGroups, item) {
  const keys = new Set([item.servicekey, ...(item.matchKeys || [])]);

  for (const group of existingGroups || []) {
    const match = (group.items || []).find((candidate) => keys.has(candidate?.servicekey));
    if (match) return match;
  }

  return null;
}

async function findMediaIdsByHints(strapi, hints) {
  if (!hints?.length) {
    return [];
  }

  const ids = new Set();

  for (const hint of hints) {
    const files = await strapi.db.query('plugin::upload.file').findMany({
      where: {
        $or: [
          { name: { $containsi: hint } },
          { hash: { $containsi: hint } },
        ],
      },
    });

    for (const file of files || []) {
      const name = `${file?.name || ''} ${file?.hash || ''}`.toLowerCase();
      if (
        name.includes('thumbnail_') ||
        name.includes('small_') ||
        name.includes('medium_') ||
        name.includes('large_')
      ) {
        continue;
      }

      const id = toMediaId(file);
      if (id != null) {
        ids.add(id);
      }
    }
  }

  return [...ids].sort((left, right) => left - right);
}

async function buildServiceGroups(strapi, existingGroups) {
  const groups = [];

  for (const group of SERVICE_GROUPS) {
    const existingGroup = findExistingGroup(existingGroups, group.servicekey);
    const groupImages = mediaIds(existingGroup?.images);
    const items = [];

    for (const item of group.items || []) {
      const existingItem = findExistingItem(existingGroups, item);
      let itemImages = mediaIds(existingItem?.images);

      if (itemImages.length === 0) {
        itemImages = await findMediaIdsByHints(strapi, item.imageHints);
      }

      items.push({
        servicekey: item.servicekey,
        title: item.title,
        description: item.description || null,
        sortorder: item.sortorder,
        details: item.details || [],
        ...(itemImages.length > 0 ? { images: itemImages } : {}),
      });
    }

    groups.push({
      servicekey: group.servicekey,
      title: group.title,
      description: group.description || null,
      sortorder: group.sortorder,
      ...(groupImages.length > 0 ? { images: groupImages } : {}),
      items,
    });
  }

  return groups;
}

function assertPublishedResult(department, expectedImages) {
  const section = department?.servicesection;
  const groups = section?.servicegroups || [];

  if (department?.servicesectionpresent !== true) {
    throw new Error('Services verification failed: the visibility flag is not enabled.');
  }

  if (groups.length !== SERVICE_GROUPS.length) {
    throw new Error(
      `Services verification failed: expected ${SERVICE_GROUPS.length} groups, found ${groups.length}.`
    );
  }

  for (const expected of SERVICE_GROUPS) {
    const actual = groups.find((group) => group?.servicekey === expected.servicekey);

    if (!actual) {
      throw new Error(
        `Services verification failed: missing group "${expected.servicekey}".`
      );
    }

    if (actual.title?.trim() !== expected.title) {
      throw new Error(
        `Services verification failed: unexpected title for "${expected.servicekey}".`
      );
    }

    if ((actual.items || []).length !== (expected.items || []).length) {
      throw new Error(
        `Services verification failed: unexpected item count for "${expected.servicekey}".`
      );
    }
  }

  const emptyDetail = groups
    .flatMap((group) => group?.items || [])
    .flatMap((item) => item?.details || [])
    .find((detail) => !detail?.label?.trim() || !detail?.value?.trim());

  if (emptyDetail) {
    throw new Error('Services verification failed: an empty service detail was written.');
  }

  const actualImages = imageSnapshot(groups);

  if (JSON.stringify(actualImages) !== JSON.stringify(expectedImages)) {
    throw new Error(
      `Services verification failed: one or more image relationships changed.\nExpected: ${JSON.stringify(expectedImages)}\nActual: ${JSON.stringify(actualImages)}`
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

    const serviceGroups = await buildServiceGroups(
      app,
      department.servicesection?.servicegroups || []
    );
    const expectedImages = imageSnapshot(serviceGroups);
    const preservedCount = serviceGroups.filter(
      (group) =>
        (group.images && group.images.length > 0) ||
        group.items.some((item) => item.images && item.images.length > 0)
    ).length;

    await repository.update({
      documentId: department.documentId,
      locale: LOCALE,
      data: {
        servicesectionpresent: true,
        servicesection: {
          sectionheader: {
            eyebrow: 'Services',
            title: 'Main Categories of ',
            hightlightedtext: 'Services',
            alignment: 'center',
          },
          servicecards: [],
          servicegroups: serviceGroups,
        },
      },
    });

    await repository.publish({ documentId: department.documentId, locale: LOCALE });

    const updatedDepartment = await repository.findOne({
      documentId: department.documentId,
      locale: LOCALE,
      status: 'published',
      populate: getPopulate(),
    });

    assertPublishedResult(updatedDepartment, expectedImages);
    console.log(
      `Updated and published the ${LOCALE} Plant Science services section with ${SERVICE_GROUPS.length} topics only (media linked on ${preservedCount} topics/items). Images already in Media Library are preserved or reattached by filename hint; new image files still need a one-time CMS upload.`
    );
  } finally {
    if (app.isLoaded) await app.destroy();
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Failed to update the Plant Science services section.');
    console.error(error);
    process.exit(1);
  });
