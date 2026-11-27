'use strict';

const { compileStrapi, createStrapi } = require('@strapi/strapi');

const CONTENT_TYPE_UID =
  'api::rubber-technology-and-development-department.rubber-technology-and-development-department';
const LOCALE = 'en';
const DEPARTMENT_LABEL = 'Rubber Technology and Development';

const CONTACT =
  'Dr. W.D.M. Sampath, Senior Research Officer / Head, Rubber Technology & Development Department, Rubber Research Institute of Sri Lanka, Thelawala Rd, Rathmalana. Tel: +94 11 2635851/52 | Mobile: +94 77 2548221 | Email: wikcramage@yahoo.com';
const DEPARTMENT_NAME = 'Rubber Technology and Development';

function labDetails(testName, standard, cost, remarks) {
  const details = [
    { label: 'Test', value: testName, sortorder: 1 },
    { label: 'Department', value: DEPARTMENT_NAME, sortorder: 2 },
  ];

  let sortorder = 3;

  if (standard) {
    details.push({ label: 'Standards', value: standard, sortorder: sortorder++ });
  }

  details.push({ label: 'Cost per test (Rs.)', value: cost, sortorder: sortorder++ });
  details.push({ label: 'Contact details', value: CONTACT, sortorder: sortorder++ });

  if (remarks) {
    details.push({ label: 'Remarks', value: remarks, sortorder: sortorder++ });
  }

  return details;
}

function labItem(servicekey, title, sortorder, standard, cost, remarks) {
  const payload = {
    servicekey,
    title,
    sortorder,
    details: labDetails(title, standard, cost, remarks),
  };

  return payload;
}

const SERVICE_GROUPS = [
  {
    servicekey: 'industry-support',
    title: 'Industry Support',
    description:
      'Compound and product development support and technical troubleshooting for the rubber product manufacturing industry.',
    sortorder: 1,
    items: [
      {
        servicekey: 'compound-product-development',
        title: 'Development of latex and dry rubber-based compounds / products',
        description:
          'Development of latex and dry rubber-based compounds and products at the request of the rubber product manufacturing industry.',
        sortorder: 1,
        details: [
          {
            label: 'Service',
            value: 'Development of latex and dry rubber-based compounds / products',
            sortorder: 1,
          },
          { label: 'Department', value: DEPARTMENT_NAME, sortorder: 2 },
          { label: 'Contact details', value: CONTACT, sortorder: 3 },
        ],
      },
      {
        servicekey: 'industry-problem-solving',
        title: 'Industry problem-solving and troubleshooting',
        description:
          'Attending to technical and manufacturing problems encountered by the rubber product manufacturing industry.',
        sortorder: 2,
        details: [
          {
            label: 'Service',
            value: 'Industry problem-solving and troubleshooting',
            sortorder: 1,
          },
          { label: 'Department', value: DEPARTMENT_NAME, sortorder: 2 },
          { label: 'Contact details', value: CONTACT, sortorder: 3 },
        ],
      },
    ],
  },
  {
    servicekey: 'laboratory-testing',
    title: 'Laboratory Testing',
    description:
      'Testing crepe rubber (for hardness), rubber compounds and rubber products according to international standards at the request of the rubber industry.',
    sortorder: 2,
    items: [
      labItem(
        'abrasion-with-prep',
        'Abrasion Volume loss (With preparation of test pieces)',
        1,
        'DIN 53516',
        'Rs. 1,600.00'
      ),
      labItem(
        'abrasion-without-prep',
        'Abrasion Volume loss (Without preparation of test pieces)',
        2,
        'DIN 53516',
        'Rs. 1,600.00'
      ),
      labItem(
        'tensile-no-prep-no-ageing',
        'Tensile properties (without preparation of test pieces & without ageing)',
        3,
        'ISO 37:2024 / ASTM D 412',
        'Rs. 1,000.00'
      ),
      labItem(
        'tensile-no-prep-ageing',
        'Tensile properties (without preparation of test pieces & with ageing)',
        4,
        'ISO 37:2024 / ASTM D 412',
        'Rs. 3,500.00'
      ),
      labItem(
        'tensile-prep-no-ageing',
        'Tensile properties (with preparation of test pieces & without ageing)',
        5,
        'ISO 37:2024 / ASTM D 412',
        'Rs. 1,600.00'
      ),
      labItem(
        'tensile-prep-ageing',
        'Tensile properties (with preparation of test pieces & with ageing)',
        6,
        'ISO 37:2024 / ASTM D 412',
        'Rs. 4,100.00'
      ),
      labItem(
        'tear-no-prep-no-ageing',
        'Tear strength (without preparation of test pieces & without ageing)',
        7,
        'ISO 34:2024',
        'Rs. 1,000.00'
      ),
      labItem(
        'tear-no-prep-ageing',
        'Tear strength (without preparation of test pieces & with ageing)',
        8,
        'ISO 34:2024',
        'Rs. 3,500.00'
      ),
      labItem(
        'tear-prep-no-ageing',
        'Tear strength (with preparation of test pieces & without ageing)',
        9,
        'ISO 34:2024',
        'Rs. 1,600.00'
      ),
      labItem(
        'tear-prep-ageing',
        'Tear strength (with preparation of test pieces & with ageing)',
        10,
        'ISO 34:2024',
        'Rs. 4,100.00'
      ),
      labItem(
        'hardness-no-prep-no-ageing',
        'Hardness (without preparation of test pieces & without ageing)',
        11,
        'ISO 48-2:2015',
        'Rs. 700.00'
      ),
      labItem(
        'hardness-no-prep-ageing',
        'Hardness (without preparation of test pieces & with ageing)',
        12,
        'ISO 48-2:2015',
        'Rs. 3,200.00'
      ),
      labItem(
        'hardness-prep-no-ageing',
        'Hardness (with preparation of test pieces & without ageing)',
        13,
        'ISO 48-2:2015',
        'Rs. 1,300.00'
      ),
      labItem(
        'hardness-prep-ageing-air-water',
        'Hardness (with preparation of test pieces & with ageing in air/water)',
        14,
        'ISO 48-2:2015',
        'Rs. 3,800.00'
      ),
      labItem(
        'hardness-prep-ageing-astm-oil',
        'Hardness (with preparation of test pieces & with ageing in ASTM oil)',
        15,
        'ISO 48-2:2015',
        'Rs. 3,800.00',
        'ASTM oil has to be provided'
      ),
      labItem(
        'compression-set-no-prep-no-ageing',
        'Compression set (without preparation of test pieces & without ageing)',
        16,
        'ISO 815-1:2019',
        'Rs. 500.00'
      ),
      labItem(
        'compression-set-no-prep-ageing',
        'Compression set (without preparation of test pieces & with ageing)',
        17,
        'ISO 815-1:2019',
        'Rs. 2,200.00'
      ),
      labItem(
        'compression-set-prep-no-ageing',
        'Compression set (with preparation of test pieces & without ageing)',
        18,
        'ISO 815-1:2019',
        'Rs. 1,100.00'
      ),
      labItem(
        'compression-set-prep-ageing',
        'Compression set (with preparation of test pieces & with ageing)',
        19,
        'ISO 815-1:2019',
        'Rs. 2,800.00'
      ),
      labItem('specific-gravity', 'Specific gravity', 20, null, 'Rs. 500.00'),
      labItem(
        'resilience-no-prep',
        'Resilience (without preparation of test pieces)',
        21,
        null,
        'Rs. 500.00'
      ),
      labItem(
        'resilience-prep',
        'Resilience (with preparation of test pieces)',
        22,
        null,
        'Rs. 1,100.00'
      ),
      labItem(
        'rpa-rheograph-cure',
        'RPA Test – Rheograph / Cure characteristics',
        23,
        'ISO 13145:2023',
        'Rs. 4,100.00'
      ),
      labItem(
        'rpa-strain-freq-temp',
        'RPA Test – Strain / Frequency / Temperature sweep',
        24,
        'ASTM D 6601:2019',
        'Rs. 4,100.00'
      ),
      labItem('peel-strength', 'Peel strength', 25, 'ISO 11339:2022', 'Rs. 1,000.00'),
      labItem(
        'swelling-no-prep-no-ageing',
        'Swelling test (without preparation of test pieces & without ageing)',
        26,
        null,
        'Rs. 1,000.00',
        'Without the charge for solvent'
      ),
      labItem(
        'swelling-no-prep-ageing',
        'Swelling test (without preparation of test pieces & with ageing)',
        27,
        null,
        'Rs. 3,500.00',
        'Without the charge for solvent'
      ),
      labItem(
        'swelling-prep-no-ageing',
        'Swelling test (with preparation of test pieces & without ageing)',
        28,
        null,
        'Rs. 1,600.00',
        'Without the charge for solvent'
      ),
      labItem(
        'swelling-prep-ageing',
        'Swelling test (with preparation of test pieces & with ageing)',
        29,
        null,
        'Rs. 4,100.00',
        'Without the charge for solvent'
      ),
      labItem(
        'compounding-two-roll-mill',
        'Compounding (Two-roll mill – without material charges) – 500 g',
        30,
        null,
        'Rs. 600.00'
      ),
      labItem(
        'compounding-internal-mixer',
        'Compounding (Internal mixer – without material charges) – 200 g',
        31,
        null,
        'Rs. 1,500.00'
      ),
      labItem(
        'vulcanization-hydraulic-press',
        'Vulcanization of a rubber compound using the Hydraulic Press (Cure time – approx. 15 min)',
        32,
        null,
        'Rs. 600.00'
      ),
    ],
  },
  {
    servicekey: 'training-and-workshops',
    title: 'Training & Workshops',
    description:
      'Training programmes and promotional workshops for entrepreneurs, rubber smallholders, university students and school teachers on rubber product manufacture.',
    sortorder: 3,
    items: [
      {
        servicekey: 'rubber-product-manufacture-training',
        title: 'Training on rubber product manufacture',
        description:
          'Training of small and medium scale entrepreneurs, rubber smallholders, university students and school teachers on “Rubber product manufacture”.',
        sortorder: 1,
        details: [
          { label: 'Service', value: 'Training on rubber product manufacture', sortorder: 1 },
          { label: 'Department', value: DEPARTMENT_NAME, sortorder: 2 },
          { label: 'Contact details', value: CONTACT, sortorder: 3 },
        ],
      },
      {
        servicekey: 'sme-workshop-2026',
        title:
          'Rubber Product Manufacturing Workshop – Awareness Program for Small and Medium Entrepreneurs 2026',
        description:
          'Awareness programme for small and medium entrepreneurs on rubber product manufacturing (26 May 2026).',
        sortorder: 2,
        details: [
          {
            label: 'Programme',
            value:
              'Rubber Product Manufacturing Workshop – Awareness Program for Small and Medium Entrepreneurs 2026',
            sortorder: 1,
          },
          { label: 'Department', value: DEPARTMENT_NAME, sortorder: 2 },
          { label: 'Contact details', value: CONTACT, sortorder: 3 },
        ],
      },
      {
        servicekey: 'sme-workshop-2024',
        title:
          'Rubber Product Manufacturing Workshop – Awareness Program for Small and Medium Entrepreneurs 2024',
        description:
          'Awareness programme for small and medium entrepreneurs on rubber product manufacturing held in 2024.',
        sortorder: 3,
        details: [
          {
            label: 'Programme',
            value:
              'Rubber Product Manufacturing Workshop – Awareness Program for Small and Medium Entrepreneurs 2024',
            sortorder: 1,
          },
          { label: 'Department', value: DEPARTMENT_NAME, sortorder: 2 },
          { label: 'Contact details', value: CONTACT, sortorder: 3 },
        ],
      },
      {
        servicekey: 'exhibition-monaragala-2024',
        title: 'Exhibition Monaragala – 2024',
        description:
          'Department participation in the Monaragala exhibition and promotional programme in 2024.',
        sortorder: 4,
        details: [
          { label: 'Programme', value: 'Exhibition Monaragala – 2024', sortorder: 1 },
          { label: 'Department', value: DEPARTMENT_NAME, sortorder: 2 },
          { label: 'Contact details', value: CONTACT, sortorder: 3 },
        ],
      },
    ],
  },
  {
    servicekey: 'academic-support',
    title: 'Academic Support',
    description:
      'Supervision of undergraduate and postgraduate research projects on request from state universities.',
    sortorder: 4,
    items: [
      {
        servicekey: 'research-supervision',
        title: 'Undergraduate and postgraduate research supervision',
        description:
          'Supervision of research projects of undergraduate and postgraduate students on request from state universities.',
        sortorder: 1,
        details: [
          {
            label: 'Support',
            value: 'Undergraduate and postgraduate research supervision',
            sortorder: 1,
          },
          { label: 'Department', value: DEPARTMENT_NAME, sortorder: 2 },
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
      const payload = {
        servicekey: item.servicekey,
        title: item.title,
        sortorder: item.sortorder,
        details: item.details || [],
      };

      if (item.description) {
        payload.description = item.description;
      }

      if (itemImages.length > 0) {
        payload.images = itemImages;
      }

      items.push(payload);
    }

    const groupPayload = {
      servicekey: group.servicekey,
      title: group.title,
      sortorder: group.sortorder,
      items,
    };

    if (group.description) {
      groupPayload.description = group.description;
    }

    if (groupImages.length > 0) {
      groupPayload.images = groupImages;
    }

    groups.push(groupPayload);
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
