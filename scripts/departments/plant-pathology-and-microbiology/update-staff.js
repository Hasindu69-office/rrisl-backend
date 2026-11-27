'use strict';

const { compileStrapi, createStrapi } = require('@strapi/strapi');

const CONTENT_TYPE_UID =
  'api::plant-pathology-and-microbiology-department.plant-pathology-and-microbiology-department';
const LOCALE = 'en';
const DEPARTMENT_LABEL = 'Plant Pathology and Microbiology';

const RESEARCH_STAFF = [
  {
    match: (normalizedName) =>
      normalizedName.includes('fernando') || normalizedName.includes('thps'),
    name: 'Dr. T H P S Fernando',
    role: 'Head of the Department',
    education: 'BSc (SL), MPhil (SL), PhD (SL)',
    emails: ['sarojinifernando787@gmail.com'],
    biography:
      "Internationally recognised expert in Plant Pathology and Microbiology, with over 35 years of progressive research, managerial and administrative experience in the plantation sector. Recognised by the FAO as an International Consultant for rubber disease management in the Philippines, with extensive contributions to national policy, research committees, biosecurity and plant protection. Over 200 scholarly publications, a Google Scholar H-index of 20, supervision of undergraduate and postgraduate research, and successful leadership of competitive national and international research grants from NRC, NSF, FAO & IFS, Stockholm. Experienced in leading multidisciplinary teams and translating scientific innovations into practical solutions for the rubber industry. Obtained the BSc Degree (Biological Science) in 1996 and in the year 2000 obtained the MPhil degree in Plant Pathology from the University of Colombo, Sri Lanka. Has completed the PhD from the same University on the Corynespora leaf fall disease of rubber. Was honored by the GRC Post Graduate Award 2013 by the SLASS, Award for Excellence in Scientific Research 2011 by the YSF NASTEC, Ministry of Technology & Research and seven President's Research Awards for the effective contribution made to the reputation of the country. A member of several national level committees: National Plant Protection Committee - CARP, Pesticide Technical & Advisory Committee (PeTAC), Pesticide sub-committee and Biopesticide sub-committee.",
  },
  {
    match: (normalizedName) =>
      normalizedName.includes('silva') || normalizedName.includes('mkrs'),
    name: 'Dr. M K R Silva',
    role: 'Senior Research Officer',
    education: 'BSc Agric (SL), MSc (SL), PhD (SL)',
    emails: ['mkeshanisilva@gmail.com'],
    biography:
      'Obtained a B.Sc. (Special) Degree in Agriculture with First Class Honours from the University of Ruhuna in 2005 and an M.Sc. in Molecular and Applied Microbiology from the University of Peradeniya in 2008. Subsequently completed a Ph.D. at the University of Colombo, specialising in Brown Root Disease of Rubber. Joined the Rubber Research Institute of Sri Lanka (RRISL) in 2011 and has nearly 12 years of professional experience in Plant Pathology and Microbiology. Currently responsible for initiating, designing and conducting research projects focusing on the management of pests and diseases affecting rubber plantations, with particular emphasis on developing effective, sustainable and scientifically validated solutions for the rubber industry.',
  },
  {
    match: (normalizedName) =>
      normalizedName.includes('koshila') ||
      normalizedName.includes('shehani') ||
      normalizedName.includes('hvas'),
    name: 'Mrs. H V A Shehani Koshila',
    role: 'Research Officer',
    education: 'BSc (SL), MPhil (SL)',
    emails: ['hvaskoshila@gmail.com'],
    biography:
      "Obtained her B.Sc. (Honours) degree from the University of Ruhuna in 2017 and an M.Phil. in Biological Sciences, specialising in Plant Pathology, from the University of Kelaniya in 2022. She was honoured with the Postgraduate Research Merit Award in 2023 by the Sri Lanka Association for the Advancement of Science (SLASS) in recognition of her outstanding contributions to postgraduate research in Agricultural Science. She is a member of SLASS and the Young Scientists Forum (YSF). Her current research focuses on diseases affecting rubber plantations and the application of microbiological approaches to improve rubber cultivation, enhance plant health and promote the sustainable development of Sri Lanka's rubber industry.",
  },
];

const TECHNICAL_STAFF_GROUPS = [
  {
    title: 'Experimental Officers',
    members: [
      { name: 'Ms. E.A.D.D. Siriwardena', qualifications: 'BSc (SL)' },
      { name: 'Mr. S.C.P. Wijayaratne', qualifications: 'NDT Agric (Hardy)' },
      {
        name: 'Mr. E.A.D.N. Nishantha',
        qualifications: 'Dip. Agric. (Ratnapura), BIS (Agric) (SL), M.AETM (SL)',
      },
    ],
  },
  {
    title: 'Technical Officers',
    members: [
      { name: 'Ms. A.H.M.N.R. Aberathne', qualifications: 'BSc. (SL), M.Sc. (SL)' },
      { name: 'Mr. D.A.N. Mallikaarachchi', qualifications: 'BSc. (SL)' },
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

  if (groups.length !== 2 || groupCounts[0] !== 3 || groupCounts[1] !== 2) {
    throw new Error(
      `Staff verification failed: expected 2 technical groups (3 + 2 members), found ${groups.length} groups (${groupCounts.join(', ')} members).`
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
      `Updated and published the ${LOCALE} ${DEPARTMENT_LABEL} staff section with ${RESEARCH_STAFF.length} research profiles and 2 technical staff groups (preserved portraits on ${preservedPortraits}; upload remaining portraits in CMS).`
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
