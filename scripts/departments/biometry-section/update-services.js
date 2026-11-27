'use strict';

const { compileStrapi, createStrapi } = require('@strapi/strapi');

const CONTENT_TYPE_UID = 'api::biometry-section-department.biometry-section-department';
const LOCALE = 'en';
const DEPARTMENT_LABEL = 'Biometry Section';

const CONTACT =
  'Mr. A.M.R.W.S.D. Rathnayaka, shanakadrathnayaka@gmail.com, dilhanr@rrisl.gov.lk, +94 772019620';
const DEPARTMENT_NAME = 'Biometry Section';

const SERVICE_GROUPS = [
  {
    servicekey: 'statistical-support',
    title: 'Statistical Support',
    description:
      'Experimental design, survey methodology, statistical data analysis, and interpretation support for rubber sector research.',
    sortorder: 1,
    items: [
      {
        servicekey: 'experimental-design-and-statistical-analysis',
        title: 'Experimental design, statistical analysis and interpretation',
        description:
          'Assisting researchers in designing of experiments, statistical analysis and interpretation.',
        sortorder: 1,
        details: [
          {
            label: 'Service',
            value: 'Assisting researchers in designing of experiments, statistical analysis and interpretation',
            sortorder: 1,
          },
          { label: 'Department', value: DEPARTMENT_NAME, sortorder: 2 },
          { label: 'Contact details', value: CONTACT, sortorder: 3 },
        ],
      },
      {
        servicekey: 'survey-design-and-analysis',
        title: 'Survey designing and analysis',
        description: 'Designing sample surveys and conducting statistical analysis of survey data.',
        sortorder: 2,
        details: [
          { label: 'Service', value: 'Survey designing and analysis', sortorder: 1 },
          { label: 'Department', value: DEPARTMENT_NAME, sortorder: 2 },
          { label: 'Contact details', value: CONTACT, sortorder: 3 },
        ],
      },
    ],
  },
  {
    servicekey: 'meteorological-data',
    title: 'Meteorological Data',
    description:
      'Collection, maintenance, and supply of agro-meteorological records across RRISL stations in rubber growing regions.',
    sortorder: 2,
    items: [
      {
        servicekey: 'dartonfield-agromet-data-supply',
        title: 'Supplying Dartonfield AGROMET meteorological data',
        description:
          'Supplying meteorological data collected at the Dartonfield AGROMET station to the Department of Meteorology.',
        sortorder: 1,
        details: [
          {
            label: 'Service',
            value:
              'Supplying meteorological data collected at the Dartonfield AGROMET station to the Department of Meteorology',
            sortorder: 1,
          },
          { label: 'Department', value: DEPARTMENT_NAME, sortorder: 2 },
          { label: 'Contact details', value: CONTACT, sortorder: 3 },
        ],
      },
      {
        servicekey: 'substation-meteorological-stations',
        title: 'Maintaining sub-station meteorological stations (Moneragala & Kuruwita)',
        description:
          'Maintaining the meteorological stations at RRISL sub-stations in Moneragala and Kuruwita.',
        sortorder: 2,
        details: [
          {
            label: 'Service',
            value: 'Maintaining the meteorological stations at sub-stations (Moneragala & Kuruwita)',
            sortorder: 1,
          },
          { label: 'Department', value: DEPARTMENT_NAME, sortorder: 2 },
          { label: 'Contact details', value: CONTACT, sortorder: 3 },
        ],
      },
    ],
  },
  {
    servicekey: 'academic-and-training',
    title: 'Academic & Training',
    description:
      'Research supervision for university students and practical training programmes for technical colleges and partner institutions.',
    sortorder: 3,
    items: [
      {
        servicekey: 'student-research-supervision',
        title: 'Supervising postgraduate and undergraduate students',
        description:
          'Supervising and guiding postgraduate and undergraduate research students in applied statistics and biometry.',
        sortorder: 1,
        details: [
          {
            label: 'Support',
            value: 'Supervising postgraduate and undergraduate students',
            sortorder: 1,
          },
          { label: 'Department', value: DEPARTMENT_NAME, sortorder: 2 },
          { label: 'Contact details', value: CONTACT, sortorder: 3 },
        ],
      },
      {
        servicekey: 'technical-and-institutional-training',
        title: 'Training of students from technical colleges and various training institutions',
        description:
          'Practical training programmes for students from technical colleges and various training institutions.',
        sortorder: 2,
        details: [
          {
            label: 'Support',
            value: 'Training of students from technical colleges and various training institutions',
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
        `English ${DEPARTMENT_LABEL} document was not found (${CONTENT_TYPE_UID}). Create the EN single type in Strapi Admin first.`
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
