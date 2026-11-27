'use strict';

const { compileStrapi, createStrapi } = require('@strapi/strapi');

const CONTENT_TYPE_UID =
  'api::rubber-technology-and-development-department.rubber-technology-and-development-department';
const LOCALE = 'en';
const DEPARTMENT_LABEL = 'Rubber Technology and Development';

const RESEARCH_STAFF = [
  {
    match: (normalizedName) =>
      normalizedName.includes('sampath') || normalizedName.includes('wdm'),
    name: 'Dr. W.D.M. Sampath',
    role: 'Senior Research Officer',
    education: 'BSc (SL), M.Phil (SL), PhD (SL)',
    emails: ['wikcramage@yahoo.com'],
    biography:
      'Dr. W.D.M. Sampath, B.Sc. (Sp.) (Sabaragamuwa, SL), M.Phil. (Moratuwa, SL) and PhD (Wayamba, SL) is a Senior Research Officer at the Rubber Technology & Development Department, Rubber Research Institute of Sri Lanka. He has fourteen years of research experience in the field of Rubber Technology. His current research areas include development of dry rubber-based blends of natural and synthetic rubbers for various applications, thermoplastic elastomers, modified natural fibre filled green rubber composites, cellular rubber products with dry rubber for special applications, rubber composites with coconut husk materials for special applications, functional graphite and graphite derivatives filled natural rubber composites for electrical and thermal conductivity applications, and rubber composites with nanomaterials. He has 70 international and local publications and 5 awards based on research publications to his credit. He won the Technology Award of Excellence from the National Science Foundation in 2016 and the High Mind Lead Mind Award in 2019 for the Best Rubber Industry Participation in the Leadership and Capacity Building Training Programme for "Young Rubber Industry Professionals".',
  },
  {
    match: (normalizedName) =>
      normalizedName.includes('weerasinghe') ||
      normalizedName.includes('aloka') ||
      normalizedName.includes('ualoka'),
    name: 'Mrs. U. Aloka Weerasinghe',
    role: 'Research Officer',
    education: 'B.Sc. (Sp.) (Colombo, SL)',
    emails: ['aloka.weerasinghe@gmail.com'],
    biography:
      'Mrs. U. Aloka Weerasinghe, B.Sc. (Sp.) (Colombo, SL) is a Research Officer at the Rubber Technology & Development Department, Rubber Research Institute of Sri Lanka. Mrs. U. Aloka Weerasinghe has one year of research experience in the field of Rubber Technology. Her current research areas include development of dry rubber-based blends of natural and synthetic rubbers for various applications, cellular rubber products with dry rubber for special applications, modified natural fiber filled green rubber composites, and rubber composites with nanomaterials.',
  },
];

const TECHNICAL_STAFF_GROUPS = [
  {
    title: 'Technical Officers',
    members: [
      { name: 'Mr. Mahesh Abhayawardena', qualifications: 'NDT (Chemical Eng.), MSc' },
      { name: 'Mrs. Gayathri Bhagyawedha', qualifications: 'NDT (Chemical Eng.)' },
      { name: 'Mrs. Ishani Jayaratne', qualifications: 'BSc (Sp.)' },
      { name: 'Mrs. Madushani Gunawardana', qualifications: 'BSc (Sp.)' },
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

  if (groups.length !== 1 || groupCounts[0] !== 4) {
    throw new Error(
      `Staff verification failed: expected 1 technical group with 4 members, found ${groups.length} groups (${groupCounts.join(', ')} members).`
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
      `Updated and published the ${LOCALE} ${DEPARTMENT_LABEL} staff section with ${RESEARCH_STAFF.length} research profiles and 1 technical staff group (preserved portraits on ${preservedPortraits}; upload remaining portraits in CMS).`
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
