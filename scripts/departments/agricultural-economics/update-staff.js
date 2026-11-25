'use strict';

const { compileStrapi, createStrapi } = require('@strapi/strapi');

const CONTENT_TYPE_UID =
  'api::agricultural-economics-department.agricultural-economics-department';
const LOCALE = 'en';
const DEPARTMENT_LABEL = 'Agricultural Economics';

const RESEARCH_STAFF = [
  {
    match: (normalizedName) => normalizedName.includes('sankalpa'),
    name: 'J.K.S. Sankalpa',
    role: 'Senior Research Officer / Agricultural Economist',
    education:
      'B.Sc. Agricultural Technology and Management (University of Peradeniya, 2009); Master’s in Agricultural and Bio-Systems Engineering (University of Peradeniya, 2011); Master of Economics (University of Colombo, 2017); Following PhD studies, University of Glasgow, Scotland.',
    emails: ['ssankalpa2@gmail.com'],
    biography:
      'Mr. J.K.S. Sankalpa is the Senior Research Officer (Agricultural Economist) of the Agricultural Economics Unit. His research interests span agroforestry, agricultural production economics, farming systems, socio-economic research in the rubber sector, natural resource management and geographic information systems (GIS) applications in agriculture.',
  },
  {
    match: (normalizedName) => normalizedName.includes('ishani'),
    name: 'P.G.N. Ishani',
    role: 'Research Officer / Agricultural Economist',
    education:
      'B.Sc. Agricultural Technology and Management (Hons.), University of Peradeniya (2014), Second Class Upper Division, specialising in Applied Economics and Business Management; M.Sc. Agricultural Economics, Postgraduate Institute of Agriculture, University of Peradeniya.',
    emails: ['pgn.ishani@gmail.com'],
    biography:
      'Mrs. P.G.N. Ishani serves as a Research Officer (Agricultural Economist) in the Unit. Her research interests include agricultural trade and policy analysis, sustainability assessment, value-chain analysis, production economics and socio-economic studies related to the rubber industry.',
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

  if (groups.length !== 0) {
    throw new Error(
      `Staff verification failed: expected 0 technical staff groups, found ${groups.length}.`
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
          technicalstaffgroups: [],
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
      `Updated and published the ${LOCALE} ${DEPARTMENT_LABEL} staff section with ${RESEARCH_STAFF.length} research profiles and 0 technical staff groups (preserved portraits on ${preservedPortraits}; upload remaining portraits in CMS).`
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
