'use strict';

const { compileStrapi, createStrapi } = require('@strapi/strapi');

const CONTENT_TYPE_UID =
  'api::plant-pathology-and-microbiology-department.plant-pathology-and-microbiology-department';
const LOCALE = 'en';
const DEPARTMENT_LABEL = 'Plant Pathology and Microbiology';

const LAB_CONTACT =
  'Department of Plant Pathology and Microbiology, TP: 034-2247426, Email: plantpathology2013@gmail.com';
const DEPARTMENT_NAME = 'Plant Pathology and Microbiology';

function labDetails(testName, method, cost, remarks) {
  return [
    { label: 'Test', value: testName, sortorder: 1 },
    { label: 'Department', value: DEPARTMENT_NAME, sortorder: 2 },
    { label: 'Method', value: method, sortorder: 3 },
    { label: 'Cost (Rs.)', value: cost, sortorder: 4 },
    { label: 'Contact details', value: LAB_CONTACT, sortorder: 5 },
    { label: 'Remarks', value: remarks, sortorder: 6 },
  ];
}

const SERVICE_GROUPS = [
  {
    servicekey: 'laboratory-testing',
    title: 'Laboratory Testing',
    description:
      'Diagnostic and microbiological laboratory services for diseased samples, soil and product testing, quarantine screening and bio-efficacy evaluation.',
    sortorder: 1,
    items: [
      {
        servicekey: 'identification-diseased-sample',
        title: 'Identification of a diseased sample',
        description:
          'Pathogen isolation and morphological characterization of diseased rubber samples for accurate diagnosis.',
        sortorder: 1,
        details: labDetails(
          'Identification of a diseased sample',
          'Pathogen isolation and morphological characterization',
          'Rs. 5100.00',
          'Samples should be collected randomly to ensure adequate representation of all parameters evaluated during testing. It should be ensured that all samples are properly labeled.'
        ),
      },
      {
        servicekey: 'soil-microbiological-test',
        title: 'Soil microbiological test',
        description:
          'Serial dilution and morphological characterization services for soil microbiological assessments.',
        sortorder: 2,
        details: labDetails(
          'Soil microbiological test',
          'Serial dilution technique followed by morphological characterization',
          'Rs. 5100.00',
          'Samples should be collected randomly to ensure adequate representation of all parameters evaluated during testing. It should be ensured that all samples are properly labeled before submission for analysis.'
        ),
      },
      {
        servicekey: 'product-microbiological-test',
        title: 'Product microbiological test',
        description:
          'The Department provides microbiological testing and analytical services for rubber-related products to assess their microbiological quality and suitability for intended applications. Laboratory investigations include the detection, isolation, and identification of relevant microorganisms using appropriate microbiological techniques. Comprehensive microbiological reports are issued to support quality assurance, product evaluation, and compliance with relevant standards and requirements.',
        sortorder: 3,
        details: labDetails(
          'Product microbiological test',
          'Pathogen isolation and morphological characterization',
          'Rs. 5100.00',
          'Samples should be sent to ensure adequate representation of all parameters evaluated during testing. It should be ensured that all samples are properly labeled before submission for analysis.'
        ),
      },
      {
        servicekey: 'quarantine-test',
        title: 'Quarantine test',
        description:
          'The Department provides laboratory-based testing services for the detection and identification of pathogens of quarantine importance associated with rubber plants and related materials. Samples are examined using appropriate morphological, microbiological, and molecular diagnostic techniques to ensure accurate pathogen identification. These services support plant health surveillance, quarantine compliance, and the prevention of the introduction and spread of potentially harmful plant pathogens.',
        sortorder: 4,
        details: labDetails(
          'Quarantine test',
          'Surface-sterilized and non-sterilized samples are used for pathogen isolation on Potato Dextrose Agar (PDA) medium. The inoculated plates are incubated under appropriate conditions, and the emerging microbial colonies are periodically examined. The isolates are subsequently observed and identified to determine the presence of pathogenic microorganisms.',
          'Rs. 5100.00',
          'Samples should be collected randomly to ensure adequate representation of all parameters evaluated during testing. Ensure that all samples are properly labeled before submission for analysis.'
        ),
      },
      {
        servicekey: 'bio-efficacy-test',
        title: 'Bio efficacy test',
        description:
          'In vitro bio-efficacy evaluation of sample products using the Poisoned Food Technique.',
        sortorder: 5,
        details: labDetails(
          'Bio efficacy test',
          'In vitro (Poisoned Food Technique)',
          'Rs. 5100.00',
          'Properly labeled sample products should be submitted.'
        ),
      },
    ],
  },
  {
    servicekey: 'field-and-training-services',
    title: 'Field & Training Services',
    description:
      'Field surveys, disease advisory support, stakeholder training programmes and maintenance of a national microbial culture collection.',
    sortorder: 2,
    items: [
      {
        servicekey: 'wrd-surveying-management',
        title: 'White root disease surveying / management programme',
        description:
          'The Department conducts systematic field surveys to assess the incidence, distribution, and severity of White Root Disease in rubber plantations. These surveys facilitate the early detection of disease outbreaks, identification of affected areas, and assessment of disease risk to support timely implementation of appropriate management interventions. The findings contribute to the development and promotion of effective disease management strategies aimed at reducing tree mortality and minimizing economic losses in the rubber industry.',
        sortorder: 1,
        details: [
          { label: 'Service', value: 'White root disease surveying / management programme', sortorder: 1 },
          { label: 'Department', value: DEPARTMENT_NAME, sortorder: 2 },
          { label: 'Contact details', value: LAB_CONTACT, sortorder: 3 },
        ],
      },
      {
        servicekey: 'training-disease-identification',
        title:
          'Training programmes on identification of economically important diseases of rubber',
        description:
          'The Department conducts training programmes to enhance the knowledge and technical competencies of stakeholders in the identification and diagnosis of economically important diseases affecting rubber cultivation. These programmes cover major leaf diseases, stem and branch diseases, panel diseases, and root diseases, with emphasis on their characteristic symptoms and diagnostic features. The training aims to strengthen disease recognition, facilitate early detection, and promote the timely implementation of appropriate disease management practices in rubber plantations.',
        sortorder: 2,
        details: [
          {
            label: 'Service',
            value:
              'Training programmes on identification of economically important diseases of rubber (Leaf / Stem, branch and panel / Root diseases)',
            sortorder: 1,
          },
          { label: 'Department', value: DEPARTMENT_NAME, sortorder: 2 },
          { label: 'Contact details', value: LAB_CONTACT, sortorder: 3 },
        ],
      },
      {
        servicekey: 'training-disease-management',
        title: 'Training programmes on the management of economically important diseases',
        description:
          'The Department conducts training programmes to enhance the knowledge and practical skills of rubber growers and other stakeholders in managing economically important diseases of rubber. These programmes focus on recommended disease management practices, including cultural, biological, chemical, and integrated approaches for the control of major leaf, stem, branch, panel, and root diseases. The training aims to promote the adoption of effective and sustainable disease management practices, minimize crop losses, and improve the productivity and health of rubber plantations.',
        sortorder: 3,
        details: [
          {
            label: 'Service',
            value: 'Training programmes on the management of economically important diseases',
            sortorder: 1,
          },
          { label: 'Department', value: DEPARTMENT_NAME, sortorder: 2 },
          { label: 'Contact details', value: LAB_CONTACT, sortorder: 3 },
        ],
      },
      {
        servicekey: 'training-nursery-diseases',
        title: 'Training programmes on the identification and the management of nursery diseases',
        description:
          'The Department conducts training programmes to strengthen the knowledge and practical skills of rubber growers, nursery operators, and other stakeholders in identifying and managing diseases affecting rubber nurseries. These programmes focus on the recognition of disease symptoms, accurate diagnosis, and the application of appropriate cultural, biological, and chemical management practices. The training aims to minimize disease incidence in nurseries, improve the health and quality of planting materials, and promote the establishment of healthy and productive rubber plantations.',
        sortorder: 4,
        details: [
          {
            label: 'Service',
            value: 'Training programmes on the identification and the management of nursery diseases',
            sortorder: 1,
          },
          { label: 'Department', value: DEPARTMENT_NAME, sortorder: 2 },
          { label: 'Contact details', value: LAB_CONTACT, sortorder: 3 },
        ],
      },
      {
        servicekey: 'advisory-disease-management',
        title: 'Advising the stakeholders to identify and manage diseases of rubber',
        description:
          'The Department provides technical advice and expert guidance to rubber growers and other stakeholders on the identification, diagnosis, and management of diseases affecting rubber cultivation. Recommendations are provided on appropriate disease management practices based on field observations, disease assessments, and scientific research findings. These advisory services aim to facilitate timely disease management interventions, minimize crop losses, and improve the health and productivity of rubber plantations.',
        sortorder: 5,
        details: [
          {
            label: 'Service',
            value: 'Advising the stakeholders to identify and manage diseases of rubber',
            sortorder: 1,
          },
          { label: 'Department', value: DEPARTMENT_NAME, sortorder: 2 },
          { label: 'Contact details', value: LAB_CONTACT, sortorder: 3 },
        ],
      },
      {
        servicekey: 'wfcc-culture-collection',
        title: 'Maintenance of a national level culture collection registered at the WFCC',
        description:
          'The Department maintains a national-level microbial culture collection registered with the World Federation for Culture Collections (WFCC), preserving microorganisms of scientific, agricultural, and industrial importance. The collection facilitates the systematic isolation, identification, characterization, preservation, and documentation of microbial cultures using appropriate standard procedures. It serves as a valuable resource for research, education, biodiversity conservation, and the development of microbiology-based applications for sustainable rubber production.',
        sortorder: 6,
        details: [
          {
            label: 'Service',
            value: 'Maintenance of a national level culture collection registered at the WFCC',
            sortorder: 1,
          },
          { label: 'Department', value: DEPARTMENT_NAME, sortorder: 2 },
          { label: 'Contact details', value: LAB_CONTACT, sortorder: 3 },
        ],
      },
    ],
  },
  {
    servicekey: 'academic-support',
    title: 'Academic Support',
    description:
      'Provides academic supervision as external supervisors under the main research disciplines of the Department and facilitates undergraduate, postgraduate and professional capacity-building activities.',
    sortorder: 3,
    items: [
      {
        servicekey: 'final-year-research',
        title: 'Final year research for undergraduates, MSc and PhD students',
        description:
          'External research supervision for undergraduate final-year projects and postgraduate (MSc and PhD) studies under the Department’s main research disciplines.',
        sortorder: 1,
        details: [
          {
            label: 'Support',
            value: 'Final year research for undergraduates, MSc and PhD students',
            sortorder: 1,
          },
          { label: 'Department', value: DEPARTMENT_NAME, sortorder: 2 },
          { label: 'Contact details', value: LAB_CONTACT, sortorder: 3 },
        ],
      },
      {
        servicekey: 'internships',
        title: 'Internships',
        description:
          'Internship placements for students seeking practical exposure in plant pathology and microbiology research and services.',
        sortorder: 2,
        details: [
          { label: 'Support', value: 'Internships', sortorder: 1 },
          { label: 'Department', value: DEPARTMENT_NAME, sortorder: 2 },
          { label: 'Contact details', value: LAB_CONTACT, sortorder: 3 },
        ],
      },
      {
        servicekey: 'industrial-trainings',
        title: 'Industrial trainings',
        description:
          'Industrial training opportunities aligned with the Department’s diagnostic, research and extension activities.',
        sortorder: 3,
        details: [
          { label: 'Support', value: 'Industrial trainings', sortorder: 1 },
          { label: 'Department', value: DEPARTMENT_NAME, sortorder: 2 },
          { label: 'Contact details', value: LAB_CONTACT, sortorder: 3 },
        ],
      },
      {
        servicekey: 'university-lectures-visiting',
        title: 'University lectures – visiting',
        description:
          'Visiting lectures and resource-person contributions to university programmes in plant pathology, microbiology and related fields.',
        sortorder: 4,
        details: [
          { label: 'Support', value: 'University lectures – visiting', sortorder: 1 },
          { label: 'Department', value: DEPARTMENT_NAME, sortorder: 2 },
          { label: 'Contact details', value: LAB_CONTACT, sortorder: 3 },
        ],
      },
      {
        servicekey: 'training-the-trainers',
        title: 'Training the Trainers',
        description:
          'Train-the-trainers programmes for extension officers, plantation managers and technical personnel on rubber disease identification and management.',
        sortorder: 5,
        details: [
          { label: 'Support', value: 'Training the Trainers', sortorder: 1 },
          { label: 'Department', value: DEPARTMENT_NAME, sortorder: 2 },
          { label: 'Contact details', value: LAB_CONTACT, sortorder: 3 },
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
