'use strict';

const { compileStrapi, createStrapi } = require('@strapi/strapi');

const CONTENT_TYPE_UID =
  'api::raw-rubber-and-chemical-analysis-department.raw-rubber-and-chemical-analysis-department';
const LOCALE = 'en';
const DEPARTMENT_LABEL = 'Raw Rubber and Chemical Analysis';

const RESEARCH_STAFF = [
  {
    match: (normalizedName) =>
      normalizedName.includes('attanayake') || normalizedName.includes('anusha'),
    name: 'Dr. (Mrs.) A. P. Attanayake',
    role: 'Head of the Department / Principal Research Officer',
    education: 'BSc (SL), PhD (SL)',
    emails: ['anushaattanayake04@gmail.com', 'deputydirector-technology@rrisl.gov.lk'],
    biography:
      'Dr. Attanayake holds a Ph.D. in Rubber Technology from the University of Sri Jayewardenepura and brings over 21 years of experience leading quality analysis of natural rubber latex, raw rubber, and rubber processing chemicals. Her research portfolio spans latex preservation systems, ethephon stimulation effects, raw rubber characterization across Sri Lanka\'s growing regions, and residual chemical content in centrifuged latex, resulting in a substantial body of work published in peer-reviewed journals and presented at international forums including IRRDB, SJUP, and RISTCON conferences. She has led and collaborated on multiple funded research grants addressing rubber quality and industry innovation and has guided many undergraduate and postgraduate students through their research projects over the course of her career. Dr. Attanayake serves as a technical expert for ISO TC/45, the Sri Lanka Standards Institute, the Sri Lanka Accreditation Board, and the National Cleaner Production Centre, and represent national committees including the TSR Steering Committee.',
  },
  {
    match: (normalizedName) =>
      normalizedName.includes('ranawaka') || normalizedName.includes('anuradhi'),
    name: 'Mrs. Anuradhi Poornima Ranawaka',
    role: 'Research Officer',
    education: 'BSc Hons Sp. (SL)',
    emails: ['anuradhiranawaka@gmail.com', 'anuradhir@rrisl.gov.lk'],
    biography:
      'Anuradhi holds a First-Class Honours BSc in Latex Technology from Uva Wellassa University (2023) and joined RRISL as a Research Officer in January 2024. She was awarded the Asha Weerasooriya Memorial Gold Medal and Vice Chancellor\'s Award for best performance in her degree programme at Uva Wellassa University. Her work focuses on latex stability, preservation systems, and raw rubber quality, including ongoing studies on latex blending and Optimization of Technically Specified Rubber (TSR) Manufacturing Process, with contributions published in the RRISL Journal, National Symposium of Agriculture and Life Sciences (NSALS\') and presented at International Research Symposium of Uva Wellassa University (IRCUWU).',
  },
];

const TECHNICAL_STAFF_GROUPS = [
  {
    title: 'Technical Officers',
    members: [{ name: 'Ms. Madushi Weerasinghe', qualifications: 'BSc' }],
  },
  {
    title: 'Project Officers (Assignment basis)',
    members: [
      { name: 'Ms. Madhavee Kaushalya', qualifications: 'BSc' },
      { name: 'Mr. Viraj Supun', qualifications: 'BSc' },
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

  if (groups.length !== 2 || groupCounts[0] !== 1 || groupCounts[1] !== 2) {
    throw new Error(
      `Staff verification failed: expected technical group counts 1 and 2, found ${groupCounts.join(' and ')}.`
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
      `Updated and published the ${LOCALE} ${DEPARTMENT_LABEL} staff section with ${RESEARCH_STAFF.length} research profiles and 3 technical/project staff (preserved portraits on ${preservedPortraits}; upload remaining portraits in CMS).`
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
