'use strict';

const { compileStrapi, createStrapi } = require('@strapi/strapi');

const CONTENT_TYPE_UID = 'api::plant-science-department.plant-science-department';
const LOCALE = 'en';
const SERVICES_URL = '/services';

const CATEGORY_LINKS = [
  { servicekey: 'land-evaluation', title: 'Land evaluation', url: SERVICES_URL, sortorder: 1 },
  { servicekey: 'laboratory-testing', title: 'Laboratory testing', url: SERVICES_URL, sortorder: 2 },
  { servicekey: 'efficacy-testing', title: 'Efficacy testing', url: SERVICES_URL, sortorder: 3 },
  { servicekey: 'e-testing-services', title: 'E-testing services', url: SERVICES_URL, sortorder: 4 },
  {
    servicekey: 'plant-certification-quality-assurance',
    title: 'Plant Certification and Quality Assurance',
    url: SERVICES_URL,
    sortorder: 5,
  },
  {
    servicekey: 'advisory-training-programs',
    title: 'Advisory and Training programs',
    url: SERVICES_URL,
    sortorder: 6,
  },
];

const SERVICE_GROUPS = [
  {
    servicekey: 'laboratory-testing',
    title: 'Laboratory testing',
    sortorder: 1,
    items: [
      {
        servicekey: 'tapping-knife-technical-specifications',
        title: 'Testing technical specifications for tapping knives',
        url: SERVICES_URL,
        sortorder: 1,
        details: [
          {
            label: 'Method',
            value:
              'The testing will assess parameters such as blade dimensions, cutting angle, blade thickness, handle design, weight, cutting depth control, material quality, and service life.\n\nLaboratory/bench testing for hardness of the material and Field testing',
            sortorder: 1,
          },
          {
            label: 'Department contact details:',
            value:
              'Head, Plant Science Department, Rubber Research Institute, Dartonfield, Agalawatta. +94 34 2247383 (Ext. 216)',
            sortorder: 2,
          },
          {
            label: 'Issue Certifications',
            value: 'Report will be issued',
            sortorder: 3,
          },
        ],
      },
      {
        servicekey: 'tapping-panel-marking-stencils',
        title: 'Provide technical specifications for stencils for tapping panel marking',
        url: SERVICES_URL,
        sortorder: 2,
        details: [
          {
            label: 'Standards',
            value: 'S/2 d2 Stencil : 20 cm (8”)\nS/2 d3 Stencie : 15 cm (6”)',
            sortorder: 1,
          },
          {
            label: 'Price, payment mode',
            value: 'to be decided',
            sortorder: 2,
          },
          {
            label: 'Department, contact details',
            value:
              'Head, Plant Science Department, Rubber Research Institute, Dartonfield, Agalawatta. +94 34 2247383 (Ext. 216)',
            sortorder: 3,
          },
        ],
      },
      {
        servicekey: 'rain-guard-material-quality',
        title: 'Testing the quality of rain guard materials',
        url: SERVICES_URL,
        sortorder: 3,
        details: [],
      },
    ],
  },
  {
    servicekey: 'plant-certification-quality-assurance',
    title: 'Plant Certification and Quality Assurance',
    description:
      'Government, RPC, and private nurseries are continuously inspected, and inspection reports will be issued to maintain the quality of planting material to be released for upcoming planting seasons annually.\n\nAll bud-wood nurseries belonging to the Rubber Development Department,\n\nDiscarding weak young budded plants and unsuccessful plants in RDD nurseries is done in the presence of officials from both RRISL and RDD to avoid issuing poor-quality plants to the field.',
    sortorder: 2,
    items: [],
  },
  {
    servicekey: 'advisory-training-programs',
    title: 'Advisory and Training programs',
    sortorder: 3,
    items: [
      {
        servicekey: 'dissaminating-latex-harvesting-technologies',
        title: 'Dissaminating Latex Harvesting Technologies',
        description:
          'Conducting latex harvesting and bark auditing technologies for improve quality of harvesting for sustainable latex production',
        sortorder: 1,
        details: [],
      },
      {
        servicekey: 'bud-grafting-training-programmes',
        title: 'Bud Grafting Training Programmes',
        description:
          'Conduct bud grafting training programmes for RDD and RPC nursery workers to improve the efficiency and technical skills of existing bud grafters, while also training new entrants who wish to become qualified bud grafters.',
        sortorder: 2,
        details: [],
      },
      {
        servicekey: 'field-establishment-immature-upkeep',
        title: 'Training on Field Establishment and immature upkeep',
        sortorder: 3,
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
        categorylinks: true,
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

function mediaIds(media) {
  return (media || []).map((asset) => asset?.id).filter(Number.isInteger);
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

function buildServiceGroups(existingGroups) {
  return SERVICE_GROUPS.map((group) => {
    const existingGroup = (existingGroups || []).find(
      (candidate) => candidate?.servicekey === group.servicekey
    );

    return {
      ...group,
      images: mediaIds(existingGroup?.images),
      items: group.items.map((item) => {
        const existingItem = (existingGroup?.items || []).find(
          (candidate) => candidate?.servicekey === item.servicekey
        );

        return {
          ...item,
          images: mediaIds(existingItem?.images),
        };
      }),
    };
  });
}

function assertPublishedResult(department, expectedImages) {
  const section = department?.servicesection;
  const categories = section?.categorylinks || [];
  const groups = section?.servicegroups || [];
  const laboratory = groups.find((group) => group?.servicekey === 'laboratory-testing');
  const training = groups.find((group) => group?.servicekey === 'advisory-training-programs');

  if (department?.servicesectionpresent !== true) {
    throw new Error('Services verification failed: the visibility flag is not enabled.');
  }
  if (categories.length !== 6 || categories.some((category) => category?.url !== SERVICES_URL)) {
    throw new Error('Services verification failed: expected six category links to /services.');
  }
  if (groups.length !== 3 || laboratory?.items?.length !== 3 || training?.items?.length !== 3) {
    throw new Error('Services verification failed: expected three groups with three laboratory tests and three training items.');
  }

  const emptyDetail = groups
    .flatMap((group) => group?.items || [])
    .flatMap((item) => item?.details || [])
    .find((detail) => !detail?.label?.trim() || !detail?.value?.trim());
  if (emptyDetail) {
    throw new Error('Services verification failed: an empty service detail was written.');
  }

  if (JSON.stringify(imageSnapshot(groups)) !== JSON.stringify(expectedImages)) {
    throw new Error('Services verification failed: one or more image relationships changed.');
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

    const serviceGroups = buildServiceGroups(department.servicesection?.servicegroups || []);
    const expectedImages = imageSnapshot(serviceGroups);

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
          categorylinks: CATEGORY_LINKS,
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
    console.log('Updated and published the en Plant Science services section with 6 categories, 3 laboratory tests, and 3 training services.');
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
