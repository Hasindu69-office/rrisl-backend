'use strict';

const { compileStrapi, createStrapi } = require('@strapi/strapi');

const CONTENT_TYPE_UID =
  'api::agricultural-economics-department.agricultural-economics-department';
const LOCALE = 'en';
const DEPARTMENT_LABEL = 'Agricultural Economics';

const CONTACT =
  'J.K.S. Sankalpa, ssankalpa2@gmail.com; P.G.N. Ishani, pgn.ishani@gmail.com, +94 34 224 7383 (Ext. 296), +94 76 3080 248';

const SERVICE_GROUPS = [
  {
    servicekey: 'economic-advisory-services',
    title: 'Economic Advisory Services',
    description:
      'Economic assessments, market analysis and policy support for rubber planting, processing and stakeholder decision-making.',
    sortorder: 1,
    items: [
      {
        servicekey: 'economic-feasibility-assessments',
        title: 'Economic feasibility assessments',
        description:
          'Economic feasibility assessments for new rubber planting and replanting projects.',
        sortorder: 1,
        details: [
          { label: 'Service', value: 'Economic feasibility assessments', sortorder: 1 },
          { label: 'Department', value: 'Agricultural Economics', sortorder: 2 },
          { label: 'Contact details', value: CONTACT, sortorder: 3 },
        ],
      },
      {
        servicekey: 'market-price-information',
        title: 'Market, price and marketing information',
        description:
          'Information and analysis on domestic and international rubber markets, prices and marketing opportunities.',
        sortorder: 2,
        details: [
          { label: 'Service', value: 'Market, price and marketing information', sortorder: 1 },
          { label: 'Department', value: 'Agricultural Economics', sortorder: 2 },
          { label: 'Contact details', value: CONTACT, sortorder: 3 },
        ],
      },
      {
        servicekey: 'cost-benefit-analysis',
        title: 'Cost–benefit analysis and economic evaluation',
        description:
          'Cost–benefit analysis and economic evaluation of rubber cultivation, processing and value-added enterprises.',
        sortorder: 3,
        details: [
          { label: 'Service', value: 'Cost–benefit analysis and economic evaluation', sortorder: 1 },
          { label: 'Department', value: 'Agricultural Economics', sortorder: 2 },
          { label: 'Contact details', value: CONTACT, sortorder: 3 },
        ],
      },
      {
        servicekey: 'compensation-assessments',
        title: 'Compensation assessment assistance',
        description:
          'Technical assistance for compensation assessments arising from damage to or loss of rubber plantations.',
        sortorder: 4,
        details: [
          { label: 'Service', value: 'Compensation assessment assistance', sortorder: 1 },
          { label: 'Department', value: 'Agricultural Economics', sortorder: 2 },
          { label: 'Contact details', value: CONTACT, sortorder: 3 },
        ],
      },
      {
        servicekey: 'economic-policy-analysis',
        title: 'Economic and policy analysis',
        description: 'Economic and policy analysis to inform decisions affecting the rubber sector.',
        sortorder: 5,
        details: [
          { label: 'Service', value: 'Economic and policy analysis', sortorder: 1 },
          { label: 'Department', value: 'Agricultural Economics', sortorder: 2 },
          { label: 'Contact details', value: CONTACT, sortorder: 3 },
        ],
      },
      {
        servicekey: 'socio-economic-data-analysis',
        title: 'Socio-economic data analysis and research support',
        description:
          'Socio-economic data analysis, interpretation and research support for RRISL researchers and stakeholders.',
        sortorder: 6,
        details: [
          {
            label: 'Service',
            value: 'Socio-economic data analysis and research support',
            sortorder: 1,
          },
          { label: 'Department', value: 'Agricultural Economics', sortorder: 2 },
          { label: 'Contact details', value: CONTACT, sortorder: 3 },
        ],
      },
    ],
  },
  {
    servicekey: 'academic-support',
    title: 'Academic Support',
    description:
      'The Unit supports higher education and professional capacity building through research guidance, practical training and specialist expertise.',
    sortorder: 2,
    items: [
      {
        servicekey: 'research-supervision',
        title: 'Research supervision',
        description:
          'Supervision and technical guidance for undergraduate and postgraduate research in agricultural economics and related disciplines.',
        sortorder: 1,
        details: [
          { label: 'Support', value: 'Research supervision', sortorder: 1 },
          { label: 'Department', value: 'Agricultural Economics', sortorder: 2 },
          { label: 'Contact details', value: CONTACT, sortorder: 3 },
        ],
      },
      {
        servicekey: 'internships',
        title: 'Internships',
        description:
          'Practical research and data-analysis opportunities for diploma, undergraduate and postgraduate students.',
        sortorder: 2,
        details: [
          { label: 'Support', value: 'Internships', sortorder: 1 },
          { label: 'Department', value: 'Agricultural Economics', sortorder: 2 },
          { label: 'Contact details', value: CONTACT, sortorder: 3 },
        ],
      },
      {
        servicekey: 'lectures',
        title: 'Lectures',
        description:
          'Visiting lectures and resource-person contributions to university programmes in agricultural economics, environmental economics and related fields.',
        sortorder: 3,
        details: [
          { label: 'Support', value: 'Lectures', sortorder: 1 },
          { label: 'Department', value: 'Agricultural Economics', sortorder: 2 },
          { label: 'Contact details', value: CONTACT, sortorder: 3 },
        ],
      },
      {
        servicekey: 'training-of-trainers',
        title: 'Training of trainers',
        description:
          'Training for extension officers, plantation managers and technical personnel on the application of agricultural economic research.',
        sortorder: 4,
        details: [
          { label: 'Support', value: 'Training of trainers', sortorder: 1 },
          { label: 'Department', value: 'Agricultural Economics', sortorder: 2 },
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
