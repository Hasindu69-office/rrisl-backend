'use strict';

const { compileStrapi, createStrapi } = require('@strapi/strapi');

const CONTENT_TYPE_UID =
  'api::biochemistry-and-physiology-department.biochemistry-and-physiology-department';
const LOCALE = 'en';
const DEPARTMENT_LABEL = 'Biochemistry and Physiology';

const CONTACT =
  'Dr. (Mrs.) K V V S Kudaligama, kudaligama.rrisl@gmail.com, +94 34 224 7383 (Ext. 244), +94 77 264 0413; Ms. Surani N. Karunarathne, nimashasnk@gmail.com, +94 34 224 7383 (Ext. 245), +94 77 937 2031';

const SERVICE_GROUPS = [
  {
    servicekey: 'laboratory-testing',
    title: 'Laboratory testing',
    description:
      'Biochemical tests and latex diagnosis services supporting quality assessment and physiological interpretation for the rubber industry.',
    sortorder: 1,
    items: [
      {
        servicekey: 'latex-diagnosis-ld',
        title: 'Latex diagnosis (LD)',
        description:
          'Colorimetric latex diagnosis with analytical reporting and interpretation. Sample collection and follow-up assessments are carried out by departmental personnel.',
        sortorder: 1,
        details: [
          { label: 'Test', value: 'Latex diagnosis (LD)', sortorder: 1 },
          { label: 'Department', value: 'Biochemistry & Physiology', sortorder: 2 },
          { label: 'Method', value: 'Colorimetric analysis (10 replicates)', sortorder: 3 },
          { label: 'Cost (Rs.)', value: 'Rs. 8000', sortorder: 4 },
          {
            label: 'Remarks',
            value:
              'Sample Procedure - Sample collection and all follow-up assessments are carried out by departmental personnel. Issue Certifications — An analytical report with the test results and interpretation is provided upon completion.',
            sortorder: 5,
          },
          { label: 'Contact details', value: CONTACT, sortorder: 6 },
        ],
      },
    ],
  },
  {
    servicekey: 'efficacy-testing',
    title: 'Efficacy testing',
    description: 'Ethephon concentration determination for industry quality assurance.',
    sortorder: 2,
    items: [
      {
        servicekey: 'determination-of-ethephon-concentration',
        title: 'Determination of ethephon concentration',
        description:
          'Titrimetric analysis of ethephon samples with a laboratory analytical report on completion.',
        sortorder: 1,
        details: [
          { label: 'Test', value: 'Determination of ethephon concentration', sortorder: 1 },
          { label: 'Department', value: 'Biochemistry & Physiology', sortorder: 2 },
          { label: 'Method', value: 'Titrimetric Analysis', sortorder: 3 },
          { label: 'Cost (Rs.)', value: 'Rs. 1800 per sample', sortorder: 4 },
          {
            label: 'Remarks',
            value:
              'Sample Procedure - Submit the ethephon sample in a clean, airtight container. Collect the sample directly from the original can or bottle after shaking the container thoroughly to ensure homogeneity. Issue Certifications — A laboratory analytical report indicating the determined ethephon concentration is provided upon completion of the analysis.',
            sortorder: 5,
          },
          { label: 'Contact details', value: CONTACT, sortorder: 6 },
        ],
      },
    ],
  },
  {
    servicekey: 'advisory-training-programs',
    title: 'Advisory and Training programs',
    description:
      'Technical advisory and customized training on low-intensity harvesting systems and biochemical/physiological aspects of rubber.',
    sortorder: 3,
    items: [
      {
        servicekey: 'technical-advisory-lih',
        title: 'Technical Advisory on Low-Intensity Harvesting (LIH)',
        description:
          'Expert guidance on the implementation and management of low-intensity harvesting systems to improve productivity and sustainability.',
        sortorder: 1,
        details: [
          {
            label: 'Service',
            value: 'Technical Advisory on Low-Intensity Harvesting (LIH)',
            sortorder: 1,
          },
          { label: 'Department', value: 'Biochemistry & Physiology', sortorder: 2 },
          { label: 'Contact details', value: CONTACT, sortorder: 3 },
        ],
      },
      {
        servicekey: 'field-based-advisory-services',
        title: 'Field-Based Advisory Services',
        description:
          'On-site troubleshooting and technical consultation for growers and plantation managers on low-intensity harvesting systems, as well as the biochemical and physiological aspects of rubber tree growth, latex production, and rubber wood.',
        sortorder: 2,
        details: [
          { label: 'Service', value: 'Field-Based Advisory Services', sortorder: 1 },
          { label: 'Department', value: 'Biochemistry & Physiology', sortorder: 2 },
          { label: 'Contact details', value: CONTACT, sortorder: 3 },
        ],
      },
      {
        servicekey: 'training-programmes',
        title: 'Training Programmes',
        description:
          'Customized training programmes for plantation staff, extension officers, undergraduate and postgraduate students covering: Low-intensity harvesting systems, Plant biochemistry and physiology, Latex biochemistry and physiology, Rubber wood chemistry.',
        sortorder: 3,
        details: [
          { label: 'Service', value: 'Training Programmes', sortorder: 1 },
          { label: 'Department', value: 'Biochemistry & Physiology', sortorder: 2 },
          { label: 'Contact details', value: CONTACT, sortorder: 3 },
        ],
      },
    ],
  },
  {
    servicekey: 'academic-support',
    title: 'Academic Support',
    description:
      'The Department of Biochemistry and Physiology actively supports higher education and capacity building by providing research opportunities, training, and academic expertise to students, researchers, and professionals.',
    sortorder: 4,
    items: [
      {
        servicekey: 'research-supervision',
        title: 'Research Supervision',
        description:
          'Provides supervision, technical support, and research facilities for undergraduate and postgraduate studies in biochemistry and physiology of rubber.',
        sortorder: 1,
        details: [
          { label: 'Support', value: 'Research Supervision', sortorder: 1 },
          { label: 'Department', value: 'Biochemistry & Physiology', sortorder: 2 },
          { label: 'Contact details', value: CONTACT, sortorder: 3 },
        ],
      },
      {
        servicekey: 'internships',
        title: 'Internships',
        description:
          'Offers internship opportunities for diploma, undergraduate and postgraduate students to gain practical experience in laboratory research, field experimentation, and analytical techniques on biochemistry and physiology of rubber.',
        sortorder: 2,
        details: [
          { label: 'Support', value: 'Internships', sortorder: 1 },
          { label: 'Department', value: 'Biochemistry & Physiology', sortorder: 2 },
          { label: 'Contact details', value: CONTACT, sortorder: 3 },
        ],
      },
      {
        servicekey: 'industrial-trainings',
        title: 'Industrial trainings',
        description:
          'Conducts industrial training programmes for diploma/university students and technical personnel, providing hands-on experience in field experiments, laboratory analyses, and research methodologies in biochemistry and physiology of rubber.',
        sortorder: 3,
        details: [
          { label: 'Support', value: 'Industrial trainings', sortorder: 1 },
          { label: 'Department', value: 'Biochemistry & Physiology', sortorder: 2 },
          { label: 'Contact details', value: CONTACT, sortorder: 3 },
        ],
      },
      {
        servicekey: 'lectures',
        title: 'Lectures',
        description:
          'Contributes as visiting lecturers/resource persons to undergraduate programmes at universities, delivering lectures in plant biochemistry, plant physiology, low intensity harvesting systems, latex physiology, and related disciplines.',
        sortorder: 4,
        details: [
          { label: 'Support', value: 'Lectures', sortorder: 1 },
          { label: 'Department', value: 'Biochemistry & Physiology', sortorder: 2 },
          { label: 'Contact details', value: CONTACT, sortorder: 3 },
        ],
      },
      {
        servicekey: 'train-the-trainers',
        title: 'Train the Trainers',
        description:
          'Organizes specialized training programmes for extension officers, plantation managers, trainers, and technical staff to strengthen knowledge dissemination and promote the adoption of research-based technologies (Low intensity harvesting systems, latex physiology and related disciplines) in the rubber industry.',
        sortorder: 5,
        details: [
          { label: 'Support', value: 'Train the Trainers', sortorder: 1 },
          { label: 'Department', value: 'Biochemistry & Physiology', sortorder: 2 },
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
