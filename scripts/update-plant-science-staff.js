'use strict';

const { compileStrapi, createStrapi } = require('@strapi/strapi');

const CONTENT_TYPE_UID = 'api::plant-science-department.plant-science-department';
const LOCALE = 'en';

const RESEARCH_STAFF = [
  {
    match: (normalizedName) => normalizedName.includes('tuksilva'),
    name: 'Dr. T U K Silva',
    role: 'Acting Head / Principal Research Officer',
    education: 'PhD (SL), MPhil (SL), BSc. (Agric.)',
    biography:
      'Dr. Kalum Silva is currently working as the Acting Head of Plant Science Department. He obtained his PhD in Crop Science from the Post Graduate Institute of Agriculture, University of Peradeniya in 2022, MPhil in Forestry from University of Sri Jayewardenepura in 2007 and BSc Agriculture from the University of Ruhuna in 1998. Presently he is carrying out research on latex harvesting systems, intercropping, agroforestry, planting techniques and crop physiology of rubber and intercrops. He has contributed more than 45 scientific publications. He is serving as a competency based assessor (CBA/3683/2023) appointed by the Director General, Tertiary and Vocational Education Commission.',
  },
  {
    match: (normalizedName) => normalizedName.includes('nakandala'),
    name: 'Dr. (Mrs.) D S A Nakandala',
    role: 'Senior Research Officer – Plant Science Department',
    education: 'PhD (SL), BSc. (Agric.)(Hons.)',
    biography:
      'Dr. (Mrs.) Sashika Nakandala is a Senior Research Officer in the Plant Science Department of the Rubber Research Institute of Sri Lanka (RRISL), with over 20 years of research experience, focusing on irrigation technologies, climate resilience planting systems, latex harvesting, and plant physiological stress management. She obtained her B.Sc. in Agriculture (Second Class Upper Division) and PhD in Irrigation and Water Management from the University of Ruhuna. Dr. Nakandala has authored and co-authored more than 50 scientific publications, including refereed journal articles, conference papers, technical bulletins, handbooks, and symposium proceedings published nationally and internationally.',
  },
  {
    match: (normalizedName) => normalizedName.includes('mndealwis'),
    name: 'Mr. W.D.M.N. de Alwis',
    role: 'Research Officer – Plant Science Department',
    education: 'BSc. (SL), MSc. (SL)',
    biography:
      'Mr. Manjula Nishan de Alwis is a Research Officer in the Plant Science Department of the Rubber Research Institute of Sri Lanka (RRISL), with over 35 years of experience in rubber research, nursery management, and plantation development. He holds a B.Sc. in Natural Sciences from the Open University of Sri Lanka and a Master of Agri-Enterprise and Technology Management (M.Sc.) with Distinction from Wayamba University of Sri Lanka. His postgraduate research received both the Best Research Presentation and People’s Choice Awards. Mr Alwis has authored and co-authored more than 20 scientific publications, including refereed journal articles, conference papers, technical bulletins, and symposium proceedings published nationally and internationally.',
  },
];

const TECHNICAL_STAFF_GROUPS = [
  {
    title: 'Experimental Officers',
    members: [
      { name: 'Mr.D.L.N.de Zoysa' },
      { name: 'Mr.P.D.Pathirana', qualifications: 'BSc.(SL)' },
      { name: 'Mr.P.K.W Karunathilaka', qualifications: 'Dip. Agric.' },
    ],
  },
  {
    title: 'Technical Officers',
    members: [
      { name: 'Ms. K.S.H.M. Subasingha', qualifications: 'BSc.(SL)' },
      { name: 'Mr.R.P.D. Priyadarshana', qualifications: 'BSc.(SL)' },
      { name: 'Mrs. U.N . Udayakumari', qualifications: 'BSc.(SL), MSc.(SL)' },
      { name: 'Mrs. H.L.T.Tharaka', qualifications: 'BSc.(SL)' },
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

function buildResearchStaff(existingStaff) {
  return RESEARCH_STAFF.map((profile) => {
    const existing = existingStaff.find((member) => profile.match(normalizeName(member?.name)));

    if (!existing?.portrait?.id) {
      throw new Error(`A reusable portrait was not found for ${profile.name}.`);
    }

    return {
      name: profile.name,
      departmenttitle: profile.role,
      education: profile.education,
      email: (existing.email || [])
        .map((item) => item?.email)
        .filter(Boolean)
        .map((email) => ({ email })),
      paragraph: [{ paragraph: profile.biography }],
      portrait: existing.portrait.id,
    };
  });
}

function assertPublishedResult(department, expectedPortraitIds, expectedEmails) {
  const section = department?.researchstaffsection;
  const staff = section?.staff || [];
  const groups = section?.technicalstaffgroups || [];

  if (staff.length !== RESEARCH_STAFF.length) {
    throw new Error(`Staff verification failed: expected 3 research profiles, found ${staff.length}.`);
  }

  const groupCounts = groups.map((group) => group?.members?.length || 0);

  if (groups.length !== 2 || groupCounts[0] !== 3 || groupCounts[1] !== 4) {
    throw new Error(
      `Staff verification failed: expected technical group counts 3 and 4, found ${groupCounts.join(' and ')}.`
    );
  }

  const actualPortraitIds = staff.map((member) => member?.portrait?.id);
  const actualEmails = staff.map((member) =>
    (member?.email || []).map((item) => item?.email).filter(Boolean)
  );

  if (JSON.stringify(actualPortraitIds) !== JSON.stringify(expectedPortraitIds)) {
    throw new Error('Staff verification failed: one or more portrait relationships changed.');
  }

  if (JSON.stringify(actualEmails) !== JSON.stringify(expectedEmails)) {
    throw new Error('Staff verification failed: one or more email values changed.');
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

    const existingStaff = department.researchstaffsection?.staff || [];
    const researchStaff = buildResearchStaff(existingStaff);
    const expectedPortraitIds = researchStaff.map((member) => member.portrait);
    const expectedEmails = researchStaff.map((member) => member.email.map((item) => item.email));

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

    assertPublishedResult(updatedDepartment, expectedPortraitIds, expectedEmails);

    console.log(
      'Updated and published the en Plant Science staff section with 3 research profiles and 7 technical staff members.'
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
    console.error('Failed to update the Plant Science staff section.');
    console.error(error);
    process.exit(1);
  });
