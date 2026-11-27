'use strict';

const { compileStrapi, createStrapi } = require('@strapi/strapi');

const CONTENT_TYPE_UID = 'api::adaptive-research-department.adaptive-research-department';
const LOCALE = 'en';
const DEPARTMENT_LABEL = 'Adaptive Research';

const RESEARCH_STAFF = [
  {
    match: (normalizedName) =>
      normalizedName.includes('munasinghe') || normalizedName.includes('enoka'),
    name: 'Dr. (Mrs.) E.S. Munasinghe',
    role: 'Principal Research Officer',
    education: 'BSc (Agric), MBA, PhD',
    emails: ['enokamunasinghe@yahoo.com'],
    biography:
      "Dr. Enoka Munasinghe has over 25 years of distinguished experience in research and development in the natural rubber sector. She holds a BSc in Agriculture, an MBA in Human Resources Management, and a PhD in Environmental Economics. Her multidisciplinary expertise spans agronomic, socioeconomic, and environmental dimensions of the rubber industry. Throughout her career, she has made significant contributions to establishing rubber in non-traditional regions of Sri Lanka and assessing its socioeconomic and environmental impacts, quantifying timber, biomass, and carbon stocks in rubber plantations, promoting rubber-based carbon trading, calculating organizational carbon footprint, and initiating a sustainability certification system for natural rubber in Sri Lanka. She has authored more than 120 scientific publications in reputed national and international journals, reflecting her substantial contribution to advancing knowledge and innovation in the rubber sector. Her research excellence has been recognized through prestigious national and international awards and fellowships. Her international standing is demonstrated through serving as the Liaison Officer for the Task Force on Climate Change and the Sustainability Specialist Group, Country Representative for the Non-Traditional Rubber Growing Regions and the Socioeconomic Specialist Group of the IRRDB and Sri Lanka's representative to the ANRPC Working Group on Sustainable Natural Rubber.",
  },
  {
    match: (normalizedName) =>
      normalizedName.includes('balasooriya') || normalizedName.includes('bmdc'),
    name: 'Dr. B.M.D.C. Balasooriya',
    role: 'Senior Research Officer',
    education: 'BSc Agric (SL), PhD (SL)',
    emails: ['dcbalasooriya@yahoo.com', 'balasooriyadc@gmail.com'],
    biography:
      'Dr. B. M. D. C. Balasooriya is a Senior Research Officer at the Rubber Research Institute of Sri Lanka (RRISL). She holds a BSc in Agriculture from the Faculty of Agriculture, University of Peradeniya, and a PhD from the Faculty of Agriculture and Plantation Management, Wayamba University of Sri Lanka. She joined RRISL as a Research Officer in 2005 and has over 20 years of experience in the natural rubber sector. Her work has focused on expanding rubber cultivation into non-traditional areas, socio-economic studies, and adaptive research, and she has contributed to the scientific literature in these fields. She is currently involved in RRISL’s rubber expansion programme in non-traditional areas, socio-economic studies in the rubber sector, and adaptive research under the Institute’s ongoing research programme.',
  },
];

const TECHNICAL_STAFF_GROUPS = [
  {
    title: 'Technical Officers',
    members: [{ name: 'Mr. P.M.M. Jayathilake', qualifications: 'Dip. In Tech. (Agri.)' }],
  },
  {
    title: 'Management Assistants',
    members: [{ name: 'Ms. M.A.R. Srimalee' }],
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

  if (groups.length !== 2 || groupCounts[0] !== 1 || groupCounts[1] !== 1) {
    throw new Error(
      `Staff verification failed: expected 2 technical groups (1 + 1 members), found ${groups.length} groups (${groupCounts.join(', ')} members).`
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
