'use strict';

const { compileStrapi, createStrapi } = require('@strapi/strapi');

const CONTENT_TYPE_UID =
  'api::rubber-technology-and-development-department.rubber-technology-and-development-department';
const LOCALE = 'en';
const DEPARTMENT_LABEL = 'Rubber Technology and Development';

const ACHIEVEMENT_CATEGORIES = [
  {
    title: 'Awards',
    sortorder: 1,
    points: [
      'M.K. Mahanama – Presidential Merit Award in 2003 for the invention titled "Natural Rubber Latex based Flowers for Floral Décor".',
      'M.K. Mahanama – Bronze Medal in the "Industrial Category" at the International Inventors Exhibition held in Geneva, Switzerland in 2006 for the invention titled "Natural Rubber Latex based Flowers for Floral Décor".',
      'The staff of the department was actively involved in organizing the RRISL stall, which won first place at the "Viskam Dakma" exhibition and trade fair held in 2006.',
      'The staff of the department was actively involved in organizing the Ministry of Plantation Industries stall under the Agricultural Cluster, which won first place at the "Deyata Kirula" national development exhibition 2007.',
      'A. Nugawela, D.G. Edirisinghe and M.K. Mahanama – National Science and Technology Award 2010 in the category "Development of Eco Material / Eco-friendly Processes for the Industry" for the "Power Mat" developed out of dipped products waste.',
      'A. Nugawela, D.G. Edirisinghe and M.K. Mahanama – Presidential Award 2010 for the best invention in the "Environment" category for the "Power Mat" developed out of dipped products waste.',
      'M.G.S.M. Wijeratne, L.M.K. Tillekeratne, W.M.G. Seneviratne, D.G. Edirisinghe, W.D.M. Sampath and S.L.G. Ranjith – Best Paper Award under the theme "Rubbers, Rubber Blends and Applications" for "Evaluation of the Suitability of Local Dolomite as a Replacement for Calcite in Solid Tyre Manufacture", IIUPST 2012.',
      'B.H.K.M. Silva, D.G. Edirisinghe and M.K. Mahanama – Best Poster Award for "Improvement of Surface Properties of Natural Rubber Latex Films with a Novel Plasticiser", IIUPST 2012.',
      'W.D.M. Sampath, S.M. Egodage and D.G. Edirisinghe – Best Abstract under the theme "Polymer Science" for "Effect of a Titanate Coupling Agent on Chemical and Ageing Properties of Calcium Carbonate Filled Natural Rubber and Low Density Polyethylene Composites", IIUPST 2015.',
      'D.G. Edirisinghe – Merit Award from the Plastics & Rubber Institute of Sri Lanka in 2015 for significant contribution to the development and growth of the polymer industry in Sri Lanka.',
      'U.N. Ratnayake, D.G. Edirisinghe, W.D.M. Sampath and D.G.M.J. Abeywardena – Technology Award from the National Science Foundation in 2016 for the project titled "High Performance Lighter Weight Prosthetic Foot based on Hybrid Nano-material Filled Natural Rubber Nano-composite".',
      'D.G. Edirisinghe, N.N. Ratnawardhana, M.K. Mahanama and D. Gunathilaka – Presidential Merit Award in the "Chemistry" category for the developed "Mechano-chemical Reclaiming Process (Oreclaim) for Ground Rubber Tyre" using a natural product (Patented in 2016).',
      'D.G. Edirisinghe – Award for "Scientific Excellence" in the Rubber Sector during 2016–2018, received on 04.11.2019 at the Seventh Symposium on Plantation Crop Research, Marino Beach Hotel, Colombo.',
      'I.H.K. Samarasinghe, D.G. Edirisinghe, S. Walpalage and S.M. Egodage (2019) – Best Paper Award for "Effect of Nitrosamine Safe Diisopropyl Xanthogen Polysulfide Accelerator on Cure and Static Mechanical Properties of Natural Rubber Compounds", Seventh Symposium on Plantation Crop Research, Marino Beach Hotel, Colombo, 4th–6th November 2019.',
      'W.D.M. Sampath – "High Mind Lead Mind Award" (2019) for the Best Rubber Industry Participation in the Leadership and Capacity Building Training Programme for "Young Rubber Industry Professionals" conducted by High Brand Team and organized by the Ministry of Industry and Commerce under the project "Rubber Young Cluster Network (RYCN)" in the Rubber Master Plan.',
      'Y.G. Kondarage, H.M.J.C. Pitawala, T. Kirushanthi, D. Edirisinghe and Thusitha N. Etampawala – SLAAS Section D (Life & Earth Sciences) Second Prize at the SLAAS Annual Sessions (December 2019) for the paper titled "Ceramic waste based natural rubber composites: An exciting way for improving mechanical properties".',
      'W.D.M. Sampath, C.A.N. Fernando and D.G. Edirisinghe (2022) – Best Presenter Award (received by W.D.M. Sampath) at the 2nd International Conference on Science and Technology, South Eastern University of Sri Lanka, 24th August 2022, for "Effect of copper grafted graphite loading on cure characteristics of natural rubber composites".',
      'Sampath, W.D.M., Fernando, C.A.N. and Edirisinghe, D.G. (2022) – Merit Award from the 11th YSF Symposium, Sri Lanka for the manuscript titled "Synthesis of graphite oxide and effect of its loading on cure characteristics and ageing properties of natural rubber composites".',
      'Sampath, W.D.M., Fernando, C.A.N. and Edirisinghe, D.G. (2023) – Selected to the Final Round at the Rubber, Plastic and Fiber based industry related research presentation and networking forum 2023 for the presentation titled "High performance natural rubber composites based on graphite nano-sheet".',
      'Sampath, W.D.M., Fernando, C.A.N. and Edirisinghe, D.G. (October 2023) – Best Postgraduate Presenter Award (Session on Technology and Computer Applications) at the 8th Wayamba University Research Congress (WURC), Wayamba University of Sri Lanka for the manuscript titled "Cure characteristics of polyethylene glycol grafted reduced graphene oxide (PEG-g-rGO) filled natural rubber composites".',
      "M.A.Y. Manchanayake, W.D.M. Sampath, G. Abhiram and T.A.R.W.M.M.C.G. Bandara (January 2025) – Best Presenter Award at the National Symposium on Agriculture and Life Sciences (NSALS' 25) under the Agricultural Engineering and Process Technology track, Uva Wellassa University of Sri Lanka, for the manuscript titled \"Synthesis of reduced graphene oxide (rGO) and effect of its loading on properties of natural rubber composites\".",
    ],
  },
  {
    title: 'Patents / Industrial Designs',
    sortorder: 2,
    points: [
      'M.K. Mahanama – Development of NR latex based flowers for floral décor (Patent No. 12696 – 2001).',
      'M.K. Mahanama and D.G. Edirisinghe – Development of shoe soles out of dipped products waste/rejects (Industrial Design No. 7487 – 2005).',
      'M.K. Mahanama and D.G. Edirisinghe – Multi-coloured shoe soles with different surface designs, produced solely out of dipped products waste/rejects (Patent No. 13604 – 2009).',
      'A. Nugawela, M.K. Mahanama and D.G. Edirisinghe – Weed control power mats based on natural rubber dipped products waste (Patent No. 14908 – 2010).',
      'Mahanama, M.K., Seneviratne, P. and Edirisinghe, D.G. – "Cost Effective Environmental Friendly Nursery Bag Produced out of Waste" (2010).',
      'D.G. Edirisinghe, M.K. Mahanama, M.K.N.N. Rathnawardhana and R.P.D. Gunathilaka – "A Mechano-chemical Reclaiming Process (Oreclaim) for Ground Rubber Tyre" (Patent No. 17588 – 2016).',
    ],
  },
];

function toPoints(entries) {
  return entries.map((paragraph) => ({ paragraph }));
}

function mediaId(media) {
  return Number.isInteger(media?.id) ? media.id : null;
}

function getPopulate() {
  return {
    achievementssection: {
      populate: {
        rightimage: true,
        categories: {
          populate: {
            points: true,
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

function assertPublishedResult(department) {
  if (department?.achievementspresent !== true) {
    throw new Error('Achievements verification failed: achievementspresent is not enabled.');
  }

  const section = department?.achievementssection;

  if (section?.sectiontitle?.trim() !== 'Our Achievements') {
    throw new Error('Achievements verification failed: section title is not Our Achievements.');
  }

  const categories = section?.categories || [];

  if (categories.length !== ACHIEVEMENT_CATEGORIES.length) {
    throw new Error(
      `Achievements verification failed: expected ${ACHIEVEMENT_CATEGORIES.length} categories, found ${categories.length}.`
    );
  }

  for (const expected of ACHIEVEMENT_CATEGORIES) {
    const actual = categories.find((category) => category?.sortorder === expected.sortorder);

    if (!actual) {
      throw new Error(
        `Achievements verification failed: missing category sortorder ${expected.sortorder}.`
      );
    }

    if (actual.title?.trim() !== expected.title) {
      throw new Error(
        `Achievements verification failed: unexpected title for sortorder ${expected.sortorder}.`
      );
    }

    const pointCount = actual.points?.length || 0;

    if (pointCount !== expected.points.length) {
      throw new Error(
        `Achievements verification failed: expected ${expected.points.length} entries for "${expected.title}", found ${pointCount}.`
      );
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

    const rightimage = mediaId(department.achievementssection?.rightimage);
    const achievementsPayload = {
      sectiontitle: 'Our Achievements',
      categories: ACHIEVEMENT_CATEGORIES.map((category) => ({
        title: category.title,
        sortorder: category.sortorder,
        points: toPoints(category.points),
      })),
    };

    if (rightimage) {
      achievementsPayload.rightimage = rightimage;
    }

    await repository.update({
      documentId: department.documentId,
      locale: LOCALE,
      data: {
        achievementspresent: true,
        achievementssection: achievementsPayload,
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

    const totalEntries = ACHIEVEMENT_CATEGORIES.reduce(
      (sum, category) => sum + category.points.length,
      0
    );

    console.log(
      `Updated and published the ${LOCALE} ${DEPARTMENT_LABEL} achievements section with ${ACHIEVEMENT_CATEGORIES.length} categories and ${totalEntries} entries (right image left for CMS).`
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
    console.error(`Failed to update the ${DEPARTMENT_LABEL} achievements section.`);
    console.error(error);
    process.exit(1);
  });
