'use strict';

const { compileStrapi, createStrapi } = require('@strapi/strapi');

const CONTENT_TYPE_UID =
  'api::raw-rubber-and-chemical-analysis-department.raw-rubber-and-chemical-analysis-department';
const LOCALE = 'en';
const DEPARTMENT_LABEL = 'Raw Rubber and Chemical Analysis';

const CONTACT =
  'Head, Raw Rubber and Chemical Analysis Department, Rubber Research Institute. anushaattanayake04@gmail.com / deputydirector-technology@rrisl.gov.lk / 0772930553';

const PAYMENT_MODE =
  'Bank Deposit / Cash. A request letter should be submitted with your testing requirement and the payment slip.';

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function testItem({ title, standard, price, sample, sortorder }) {
  const details = [
    { label: 'Test', value: title, sortorder: 1 },
    { label: 'Standards', value: standard, sortorder: 2 },
    { label: 'Department', value: 'Raw Rubber and Chemical Analysis', sortorder: 3 },
  ];

  let next = 4;

  if (price) {
    details.push({ label: 'Price (without VAT) (Rs.)', value: price, sortorder: next });
    next += 1;
  }

  if (sample) {
    details.push({ label: 'Sample amount', value: sample, sortorder: next });
    next += 1;
  }

  details.push({ label: 'Payment mode', value: PAYMENT_MODE, sortorder: next });
  next += 1;
  details.push({ label: 'Contact details', value: CONTACT, sortorder: next });

  return {
    servicekey: slugify(title),
    title,
    sortorder,
    details,
  };
}

const LATEX_TESTS = [
  testItem({
    title: 'Dry Rubber Content in Field Latex',
    standard: 'ISO 7681: 2024',
    price: '847.46',
    sample: '150 ml',
    sortorder: 1,
  }),
  testItem({
    title: 'Dry Rubber Content in Centrifuged Latex',
    standard: 'ISO 126: 2005',
    price: '1600.00',
    sample: '150 ml',
    sortorder: 2,
  }),
  testItem({ title: 'Total Solid Content', standard: 'ISO 124: 2014', sortorder: 3 }),
  testItem({ title: 'Mechanical Stability Time', standard: 'ISO 35:2004', sortorder: 4 }),
  testItem({ title: 'Volatile Fatty Acid (VFA) Content', standard: 'ISO 506:2020', sortorder: 5 }),
  testItem({ title: 'Alkalinity', standard: 'ISO 125:2020', sortorder: 6 }),
  testItem({ title: 'KOH No.', standard: 'ISO 127:2018', sortorder: 7 }),
  testItem({
    title: 'Viscosity',
    standard: 'ISO 1652:2011',
    price: '1400.00',
    sample: '1500 ml',
    sortorder: 8,
  }),
  testItem({
    title: 'Mg Content',
    standard: 'ISO 17403:2014',
    price: '2500.00',
    sample: '100 ml',
    sortorder: 9,
  }),
  testItem({
    title: 'pH',
    standard: 'ISO 976:2013',
    price: '900.00',
    sample: '100 ml',
    sortorder: 10,
  }),
  testItem({
    title: 'Coagulum Content',
    standard: 'ISO 706: 2004',
    price: '2600.00',
    sample: '1000 ml',
    sortorder: 11,
  }),
  testItem({
    title: 'Density',
    standard: 'ISO 705',
    price: '500.00',
    sample: '150 ml',
    sortorder: 12,
  }),
  testItem({
    title: 'Chemical Stability Time',
    standard: 'ISO 16947:2026',
    price: '2500.00',
    sample: '500 ml',
    sortorder: 13,
  }),
  testItem({ title: 'Phosphate Content', standard: 'ISO 19043: 2015', sortorder: 14 }),
];

const RAW_RUBBER_TESTS = [
  testItem({ title: 'Dirt Content', standard: 'ISO 249:2016', sortorder: 1 }),
  testItem({ title: 'Ash Content', standard: 'ISO 247-1:2018', sortorder: 2 }),
  testItem({ title: 'Volatile Matter Content', standard: 'ISO 248-1:2021', sortorder: 3 }),
  testItem({ title: 'Nitrogen Content', standard: 'ISO 1656:2019', sortorder: 4 }),
  testItem({ title: 'Plasticity No.', standard: 'ISO 2007:2018', sortorder: 5 }),
  testItem({ title: 'Plasticity Retention Index', standard: 'ISO 2930: 2017', sortorder: 6 }),
  testItem({ title: 'Mooney Viscosity', standard: 'ISO 289-1: 2015', sortorder: 7 }),
  testItem({ title: 'Lovibond Color Index', standard: 'ISO 4660: 2020', sortorder: 8 }),
  testItem({ title: 'Gel Content', standard: 'ISO 17278', sortorder: 9 }),
  testItem({ title: 'Acetone Extraction', standard: 'ISO 1407: 2023', sortorder: 10 }),
  testItem({
    title: 'Accelerated Storage Hardening test (Δ P)',
    standard: 'RRIM',
    sortorder: 11,
  }),
];

const SERVICE_GROUPS = [
  {
    servicekey: 'laboratory-testing',
    title: 'Laboratory testing',
    sortorder: 1,
    items: [
      {
        servicekey: 'latex-testing',
        title: 'Latex Testing',
        description:
          'ISO-standard latex testing services for field and centrifuged latex. Certificates can be issued via Mail / WhatsApp / E-testing service.',
        sortorder: 1,
        details: [
          { label: 'Category', value: 'Latex Testing', sortorder: 1 },
          { label: 'Department', value: 'Raw Rubber and Chemical Analysis', sortorder: 2 },
          {
            label: 'Available tests',
            value: LATEX_TESTS.map((item) => item.title).join('; '),
            sortorder: 3,
          },
          { label: 'Contact details', value: CONTACT, sortorder: 4 },
        ],
      },
      ...LATEX_TESTS.map((item, index) => ({
        ...item,
        sortorder: index + 2,
      })),
      {
        servicekey: 'raw-rubber-testing',
        title: 'Raw Rubber Testing',
        description:
          'ISO-standard raw rubber / dry rubber testing services. Certificates can be issued via Mail / WhatsApp / E-testing service.',
        sortorder: LATEX_TESTS.length + 2,
        details: [
          { label: 'Category', value: 'Raw Rubber Testing', sortorder: 1 },
          { label: 'Department', value: 'Raw Rubber and Chemical Analysis', sortorder: 2 },
          {
            label: 'Available tests',
            value: RAW_RUBBER_TESTS.map((item) => item.title).join('; '),
            sortorder: 3,
          },
          { label: 'Contact details', value: CONTACT, sortorder: 4 },
        ],
      },
      ...RAW_RUBBER_TESTS.map((item, index) => ({
        ...item,
        sortorder: LATEX_TESTS.length + 3 + index,
      })),
    ],
  },
  {
    servicekey: 'e-testing-services',
    title: 'E-testing services',
    description:
      'Streamline your testing experience with E Testing Service. Unlock an online ordering experience for all your testing needs. With RRISL laboratories, you can easily place orders for certificates and access your results in just a few clicks: https://www.projects.rrisl.gov.lk/',
    sortorder: 2,
    items: [],
  },
  {
    servicekey: 'advisory-training-programs',
    title: 'Advisory and Training programs',
    description:
      'Conducting on-request trainings and industrial / laboratory training for Latex and Raw Rubber Testing. Conducted training workshops on testing methodologies for latex and dry rubber, targeting university students and laboratory technicians in rubber factories.',
    sortorder: 3,
    items: [
      {
        servicekey: 'latex-raw-rubber-testing-training',
        title: 'Latex and Raw Rubber Testing Training',
        description:
          'On-request industrial and laboratory training covering latex and raw rubber testing methodologies.',
        sortorder: 1,
        details: [
          { label: 'Service', value: 'Latex and Raw Rubber Testing Training', sortorder: 1 },
          { label: 'Department', value: 'Raw Rubber and Chemical Analysis', sortorder: 2 },
          { label: 'Contact details', value: CONTACT, sortorder: 3 },
        ],
      },
    ],
  },
  {
    servicekey: 'academic-support',
    title: 'Academic support',
    description:
      'Every year we collaborate with universities and industry partners for research, internships and industrial trainings based on their requirements.',
    sortorder: 4,
    items: [
      {
        servicekey: 'undergraduate-msc-phd-research',
        title: 'Research for undergraduates, MScs and PhDs',
        sortorder: 1,
        details: [
          {
            label: 'Support',
            value: 'Research conducts for undergraduates, MScs and PhDs',
            sortorder: 1,
          },
          { label: 'Department', value: 'Raw Rubber and Chemical Analysis', sortorder: 2 },
          { label: 'Contact details', value: CONTACT, sortorder: 3 },
        ],
      },
      {
        servicekey: 'internships',
        title: 'Internships',
        sortorder: 2,
        details: [
          { label: 'Support', value: 'Internships', sortorder: 1 },
          { label: 'Department', value: 'Raw Rubber and Chemical Analysis', sortorder: 2 },
          { label: 'Contact details', value: CONTACT, sortorder: 3 },
        ],
      },
      {
        servicekey: 'industrial-trainings',
        title: 'Industrial trainings',
        sortorder: 3,
        details: [
          { label: 'Support', value: 'Industrial trainings', sortorder: 1 },
          { label: 'Department', value: 'Raw Rubber and Chemical Analysis', sortorder: 2 },
          { label: 'Contact details', value: CONTACT, sortorder: 3 },
        ],
      },
      {
        servicekey: 'university-lectures-visiting',
        title: 'University lectures – visiting',
        sortorder: 4,
        details: [
          { label: 'Support', value: 'University lectures – visiting', sortorder: 1 },
          { label: 'Department', value: 'Raw Rubber and Chemical Analysis', sortorder: 2 },
          { label: 'Contact details', value: CONTACT, sortorder: 3 },
        ],
      },
      {
        servicekey: 'train-the-trainers',
        title: 'Train the Trainers',
        sortorder: 5,
        details: [
          { label: 'Support', value: 'Train the Trainers', sortorder: 1 },
          { label: 'Department', value: 'Raw Rubber and Chemical Analysis', sortorder: 2 },
          { label: 'Contact details', value: CONTACT, sortorder: 3 },
        ],
      },
    ],
  },
];

function getPopulate() {
  return {
    servicesection: {
      populate: {
        sectionheader: true,
        servicecards: {
          populate: {
            icon: true,
            image: true,
          },
        },
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
  return (
    (await repository.findFirst({ locale: LOCALE, status: 'published', populate: getPopulate() })) ||
    repository.findFirst({ locale: LOCALE, status: 'draft', populate: getPopulate() })
  );
}

function toMediaId(value) {
  const id = value?.id ?? value;

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
  for (const group of existingGroups || []) {
    const match = (group.items || []).find((candidate) => candidate?.servicekey === item.servicekey);
    if (match) return match;
  }

  return null;
}

function buildServiceGroups(existingGroups) {
  const groups = [];

  for (const group of SERVICE_GROUPS) {
    const existingGroup = findExistingGroup(existingGroups, group.servicekey);
    const groupImages = mediaIds(existingGroup?.images);
    const items = [];

    for (const item of group.items || []) {
      const existingItem = findExistingItem(existingGroups, item);
      const itemImages = mediaIds(existingItem?.images);

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
      throw new Error(`Services verification failed: missing group "${expected.servicekey}".`);
    }

    if (actual.title?.trim() !== expected.title) {
      throw new Error(`Services verification failed: unexpected title for "${expected.servicekey}".`);
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
      throw new Error(
        `English ${DEPARTMENT_LABEL} Department document was not found (${CONTENT_TYPE_UID}). Create the EN single type in Strapi Admin first.`
      );
    }

    const serviceGroups = buildServiceGroups(department.servicesection?.servicegroups || []);
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

    const itemCount = SERVICE_GROUPS.reduce((sum, group) => sum + (group.items || []).length, 0);

    console.log(
      `Updated and published the ${LOCALE} ${DEPARTMENT_LABEL} services section with ${SERVICE_GROUPS.length} groups and ${itemCount} items (media linked on ${preservedCount} topics/items; upload remaining in CMS).`
    );
  } finally {
    if (app.isLoaded) await app.destroy();
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(`Failed to update the ${DEPARTMENT_LABEL} services section.`);
    console.error(error);
    process.exit(1);
  });
