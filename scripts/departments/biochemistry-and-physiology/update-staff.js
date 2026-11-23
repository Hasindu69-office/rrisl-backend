'use strict';

const { compileStrapi, createStrapi } = require('@strapi/strapi');

const CONTENT_TYPE_UID =
  'api::biochemistry-and-physiology-department.biochemistry-and-physiology-department';
const LOCALE = 'en';
const DEPARTMENT_LABEL = 'Biochemistry and Physiology';

const RESEARCH_STAFF = [
  {
    match: (normalizedName) =>
      normalizedName.includes('kudaligama') || normalizedName.includes('sagari'),
    name: 'Dr. (Mrs.) K V V S Kudaligama',
    role: 'Head of the Department',
    education: 'BSc (SL), MPhil (SL), PhD (SL)',
    emails: ['sagarik@rrisl.gov.lk', 'kudaligama.rrisl@gmail.com'],
    biography:
      'Dr. (Mrs.) Sagari Kudaligama serves as the Head of the Department of Biochemistry and Physiology at RRISL. She obtained her BSc degree from the University of Colombo, Sri Lanka in 1996. She has made a significant contribution on developing low cost treatment facilities for rubber factory wastewater and obtained her MPhil degree in this discipline from the University of Sri Jayawardenepura. Outputs of the research carried out on developing low intensity harvesting systems leading to her PhD has been awarded the National awards for excellence in agricultural research in Sri Lanka, 2014. Her current research interests focus on improving the productivity of rubber plantations through biochemical and physiological approaches, with particular emphasis on the effects of climate change, expansion into marginal lands, and abiotic stresses on rubber plants. In addition, she also engages in research work on rubber wood. She has published more than 50 research articles and obtained three patents for scientific innovations.',
  },
  {
    match: (normalizedName) =>
      normalizedName.includes('karunarathne') ||
      normalizedName.includes('karunarathna') ||
      normalizedName.includes('surani'),
    name: 'Ms. Surani N. Karunarathne',
    role: 'Research Officer',
    education: 'BSc (SL), PhD (reading)',
    emails: ['suranik@rrisl.gov.lk', 'nimashasnk@gmail.com'],
    biography:
      'Ms. Surani Karunarathne is a Research Officer in the Department of Biochemistry and Physiology at the Rubber Research Institute of Sri Lanka (RRISL). She holds a BSc. (Honours) degree in Plant Biotechnology from the University of Colombo, Sri Lanka. Her research focuses on the biochemistry and physiology of Hevea brasiliensis, with particular interests in latex physiology, plant biochemistry, wood biochemistry, and plant stress physiology. Her current work contributes to improving the productivity, sustainability, and value addition of Sri Lanka\'s rubber industry through research on rubber plants, latex, and wood. She has contributed to national and international scientific publications and collaborates across multidisciplinary research programmes within RRISL.',
  },
];

const TECHNICAL_STAFF_GROUPS = [
  {
    title: 'Experimental Officers',
    members: [{ name: 'M.K.P. Perera', qualifications: 'BSc (SL)' }],
  },
  {
    title: 'Technical Officers',
    members: [
      { name: 'Ms P D T L Madushani', qualifications: 'Diploma in Agric.' },
      { name: 'Ms N.N. Abewardena', qualifications: 'BSc (SL)' },
      { name: 'L T B K Fernando', qualifications: 'BSc (SL), MPhil (SL)' },
    ],
  },
];

function normalizeName(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

function getPopulate() {
  return {
    researchstaffsection: {
      populate: {
        sectionheader: true,
        staff: {
          populate: {
            email: true,
            paragraph: true,
            portrait: true,
          },
        },
        technicalstaffgroups: {
          populate: {
            members: true,
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

function resolveEmails(profile, existing) {
  const existingEmails = (existing?.email || [])
    .map((item) => item?.email)
    .filter(Boolean);

  if (existingEmails.length > 0) {
    return existingEmails.map((email) => ({ email }));
  }

  return (profile.emails || []).map((email) => ({ email }));
}

function buildResearchStaff(existingStaff) {
  return RESEARCH_STAFF.map((profile) => {
    const existing = existingStaff.find((member) => profile.match(normalizeName(member?.name)));
    const portraitId = existing?.portrait?.id;
    const payload = {
      name: profile.name,
      departmenttitle: profile.role,
      education: profile.education,
      email: resolveEmails(profile, existing),
      paragraph: [{ paragraph: profile.biography }],
    };

    if (portraitId) {
      payload.portrait = portraitId;
    }

    return payload;
  });
}

function assertPublishedResult(department) {
  const section = department?.researchstaffsection;
  const staff = section?.staff || [];
  const groups = section?.technicalstaffgroups || [];

  if (department?.researchstaffpresent !== true) {
    throw new Error('Staff verification failed: researchstaffpresent is not enabled.');
  }

  if (staff.length !== RESEARCH_STAFF.length) {
    throw new Error(
      `Staff verification failed: expected ${RESEARCH_STAFF.length} research profiles, found ${staff.length}.`
    );
  }

  const groupCounts = groups.map((group) => group?.members?.length || 0);

  if (groups.length !== 2 || groupCounts[0] !== 1 || groupCounts[1] !== 3) {
    throw new Error(
      `Staff verification failed: expected technical group counts 1 and 3, found ${groupCounts.join(' and ')}.`
    );
  }

  for (const expected of RESEARCH_STAFF) {
    const actual = staff.find((member) => expected.match(normalizeName(member?.name)));

    if (!actual) {
      throw new Error(`Staff verification failed: missing profile for ${expected.name}.`);
    }

    if (actual.departmenttitle?.trim() !== expected.role) {
      throw new Error(`Staff verification failed: unexpected role for ${expected.name}.`);
    }
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

    const existingStaff = department.researchstaffsection?.staff || [];
    const researchStaff = buildResearchStaff(existingStaff);
    const preservedPortraits = researchStaff.filter((member) => member.portrait).length;

    await repository.update({
      documentId: department.documentId,
      locale: LOCALE,
      data: {
        researchstaffpresent: true,
        researchstaffsection: {
          sectionheader: {
            eyebrow: 'Staff',
            title: 'Research & ',
            hightlightedtext: 'Technical Staff',
            alignment: 'center',
          },
          staff: researchStaff,
          technicalstaffgroups: TECHNICAL_STAFF_GROUPS,
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

    assertPublishedResult(updatedDepartment);

    console.log(
      `Updated and published the ${LOCALE} ${DEPARTMENT_LABEL} staff section with ${RESEARCH_STAFF.length} research profiles and 4 technical staff (preserved portraits on ${preservedPortraits}; upload remaining portraits in CMS).`
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
    console.error(`Failed to update the ${DEPARTMENT_LABEL} staff section.`);
    console.error(error);
    process.exit(1);
  });
