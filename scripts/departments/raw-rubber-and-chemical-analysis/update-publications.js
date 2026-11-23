'use strict';

const { compileStrapi, createStrapi } = require('@strapi/strapi');

const CONTENT_TYPE_UID =
  'api::raw-rubber-and-chemical-analysis-department.raw-rubber-and-chemical-analysis-department';
const LOCALE = 'en';
const DEPARTMENT_LABEL = 'Raw Rubber and Chemical Analysis';

const PUBLICATIONS = [
  {
    title: 'Refereed Journals',
    sortorder: 1,
    points: [
      'Attanayake, A.P., Karunanayake, L. and Nilmini, A.H.R.L. (2018). Effect of ethephon stimulation on natural rubber latex properties: New insight into ethephon stimulation. Journal of the National Science Foundation of Sri Lanka, 46(2), 179–185. DOI: https://doi.org/10.4038/jnsfsr.v46i2.8418',
      'Attanayake, A.P., Karunanayake, L. and Nilmini, A.H.R.L. (2015). Insight into prevention of enzymatic browning and increase of antioxidant potential of crepe rubber with ethephon stimulation. Journal of Rubber Research Institute of Sri Lanka, 95, 58–65.',
      'Siriwardena, S., Attanayake, A.P., Sarathkumara, P.H., Karunathilaka, N., Gamage, H.V.K. and Munasinghe, M.M.A.B. (2012). Raw rubber properties of crepe rubber manufactured from preserved natural rubber latex using different combinations of preservatives. Journal of Rubber Research Institute of Sri Lanka, 92, 32–43.',
      'Ranawaka, R.A.A.P., Hasangika, M.S., Wijewardane, D.S. and Attanayake, A.P. (2025). Preliminary study on the effect of Pestalotiopsis leaf fall disease on raw natural rubber (Hevea brasiliensis) properties and molecular weight in wet zone low country, Sri Lanka. Journal of Rubber Research Institute of Sri Lanka, 105 (Accepted).',
      'Ranawaka, R.A.A.P., Attanayake, A.P., Senevirathna, A.M.W.K., Bandara, T.A.R.W.M.M.C.G., Weerasinghe, M.U.D.S., Koswaththa, K.A.S.T. (2023). Effect of ammonia preservative systems in centrifuged latex characteristics and latex film properties. Journal of the Rubber Research Institute of Sri Lanka, 103, 22–32.',
    ],
  },
  {
    title: 'International and National Conference Communications',
    sortorder: 2,
    points: [
      'Attanayake, A.P., Karunanayake, L. and Nilmini, A.H.R.L. (2015). Viscoelastic properties of stimulated rubber. SJUP International Symposium in Polymer Science, Colombo, Sri Lanka. (Poster Presentation P-12).',
      'Iddamalgoda, I.D.H.C., Attanayake, A.P., Withanage, N.S. and Weerawansa, N.R. (2015). Property variation of centrifuged latex at different maturity stages in glove manufacturing. Research Symposium, Uva Wellassa University, Sri Lanka.',
      'Attanayake, A.P., Karunanayake, L. and Nilmini, A.H.R.L. (2015). Effect of ethephon concentration on rubber yield through magnesium ion and sucrose regulation in Hevea brasiliensis. Young Scientists Forum Symposium.',
      'Attanayake, A.P., Lokuge, C. and Dharmawardana, G.T.S. (2015). Appropriate strategy to overcome potential problems in natural rubber latex processing. RISTCON International Conference, University of Ruhuna.',
      'Kudaligama, K.V.V.S., Rodrigo, V.H.L. and Attanayake, A.P. (2010). Raw rubber properties of Hevea brasiliensis. Proceedings of Symposium on Plantation Crop Research, Colombo, Sri Lanka, pp.157–164.',
      'Attanayake, A.P., Dilshani, D.G.S. and Lokuge, C. (2011). Novel method to determine DAHP content in natural rubber centrifuged latex and effect of residual magnesium and phosphate ions on latex-based dipped products. Rubber Latex Technology, Vol. 1, pp.144–150.',
      'Attanayake, A.P., Karunanayake, L. and Nilmini, A.H.R.L. (2012). Microbial activity in natural rubber latex with different preservative systems. SJUP International Symposium in Polymer Science, Colombo, Sri Lanka.',
      'Attanayake, A.P., Wanigathunga, L., Gamage, H.V.K., Lokuge, C., Wijesekara, D.M.S. and Vitharana, L.P. (2014). Raw rubber properties of new clones introduced by Rubber Research Institute of Sri Lanka. IRRDB International Rubber Conference, Manila, Philippines.',
      'Attanayake, A.P. and Lokuge, C. (2012). Introduction of cyanide-free test method for the determination of magnesium content in natural rubber latex. Annual Review, Rubber Research Institute of Sri Lanka.',
      'Samarasinghe, H.K., Ratnayake, U.N., Attanayake, A.P., Seneviratne, W.M.G. and Wanigathunga, L. (2015). Effect of storage conditions on viscoelastic properties of different grades of latex crepe rubber. IRRDB International Rubber Conference IRC-2015, Vietnam.',
      'Delmon, H.W.O.C., Kaliyadasa, P.E., Arachchi, M.P. and Attanayake, A.P. (2016). Effect of clone type on storage hardening and gel content of raw natural rubber. Research Symposium, Uva Wellassa University.',
      'Weerakoon, W.M.T.H., Attanayake, A.P., Gamage, H.V.K., Lokuge, C. and Vitharana, L.P. (2016). Effect of processing conditions on raw rubber properties of natural rubber. Sixth Symposium on Plantation Crop Research, Colombo, Sri Lanka.',
      'Attanayake, A.P., Karunanayake, L. and Nilmini, A.H.R.L. (2017). Effect of ethephon concentration on physical properties of natural rubber: A qualitative approach for ethephon stimulation. IRRDB International Rubber Conference IRC-2017, Jakarta, Indonesia.',
      'Attanayake, A.P., Karunanayake, L. and Nilmini, A.H.R.L. (2017). The role of ethephon stimulation on the strength properties of natural rubber gum vulcanizates. SJUP International Symposium in Polymer Science.',
      'Nanayakkara, E.N.N., Attanayake, A.P., Wijesinghe, H.G.I.M. and Seneviratne, A.M.W.K. (2018). Effect of ethephon stimulation on physicomechanical properties of carbon black-filled natural rubber vulcanizates. International Research Symposium.',
      'Attanayake, A.P. and Weerasinghe, M.U.D.S. (2019). Study on raw rubber and rheological properties of RRISL 203 clone: Superior clone for sustainable rubber industry. IRRDB International Rubber Conference IRC-2019, Myanmar.',
      'Kudaligama, K.V.V.S. et al. including Attanayake, A.P. (2019). Effectiveness of a new ethephon formulation on latex microdiagnosis and yield potential of Hevea brasiliensis. IRRDB International Rubber Conference IRC-2019, Myanmar.',
      'Harindra, T.N., Kithmini, N.C.Y., Attanayake, A.P., Hewage, J.S. and Ranaweera, A.S. (2021). Purification of carbon black generated from passenger car tyre pyrolysis for dry rubber industry. RISTCON International Conference, University of Ruhuna.',
      'Dilmi, L.A.A., Attanayake, A.P., Perera, G.A.A.R. and Lochana, E.A.L. (2022). Effects of added ammonium laureate soap on physicomechanical properties of natural rubber latex. 6th International Research Conference, Uva Wellassa University.',
      'Ranawaka, R.A.A.P., Attanayake, A.P., Bandara, T.A.R.W.M.M.C.G. and Seneviratne, A.M.W.K. (2022). Effect of ammonia preservative systems in centrifuged latex on phosphate levels and latex film properties. 6th International Research Conference, Uva Wellassa University.',
      'De Zoysa, M.D.A., Attanayake, A.P., Hewage, J.S., Sudusinghe, Y.C.Y. and Ranaweera, S.A. (2023). Replacement of commercial carbon black by upgraded pyrolytic char in solid tyre cushion compounds. International Conference on Applied Sciences, Sabaragamuwa University of Sri Lanka.',
      'Amarasekera, W.K., Attanayake, A.P., Perera, T.A.N.T. and Seneviratne, A.M.W.K. (2024). Impact of varied zinc concentration levels on natural rubber latex film properties. National Symposium on Agriculture & Life Sciences, Uva Wellassa University.',
      'Ratnayake, R.M.V.S., Attanayake, A.P., Gamlath, G.R.V.S. and Seneviratne, A.M.W.K. (2024). Identification of alternative bleaching agent for chemicals used in crepe rubber manufacturing. National Symposium on Agriculture & Life Sciences, Uva Wellassa University.',
      'Gunathilaka, K.P.M.P., Palliyaguru, L. and Attanayake, A.P. (2023). Evaluation of curing characteristics and reinforcing behaviour of cinnamon wood biochar as a filler material for natural rubber composites. Proceedings of the 9th Undergraduate Research Symposium.',
      'Attanayake, A.P., Ranawaka, R.A.A.P. and Sandeepani, K.P.K. (2025). Preliminary study on non-toxic secondary preservative system for natural rubber field latex. National Symposium on Agriculture & Life Sciences, Uva Wellassa University (Accepted).',
      'Attanayake, A.P., Ranawaka, R.A.A.P. and Perera, W.U.L. (2025). Enhancing quality of Technically Specified Rubber (TSR) through process optimization. National Symposium on Agriculture & Life Sciences, Uva Wellassa University (Accepted).',
      'Adithya, P. A. O., Attanayake, A. P., Karunaratne, P. K. D. M. C., & Ranawaka, R. A. A. P. (2026). Investigation of the effect of EDTA incorporation on zinc blooming and mechanical properties of vulcanised rubber under environmental aging conditions. Proceedings of the 12th Undergraduate Research Symposium, University of Sri Jayewardenapura, Paper ID-65',
      'Kaushalya, D. G. M., Attanayake, A. P., Ranawaka, R. A. A. P., & Kumarasinghe, K. G. U. (2026). Effect of blending concentrated natural rubber latices from different origins on colloidal stability and film properties. Proceedings of the 12th Undergraduate Research Symposium, University of Sri Jayewardenapura, Paper ID-59',
    ],
  },
];

function extractPublicationYear(entry) {
  const match = String(entry || '').match(/\((19|20)\d{2}\)/);
  return match ? Number(match[0].slice(1, -1)) : null;
}

function sortEntriesByYearDescending(entries) {
  return entries
    .map((entry, index) => ({
      entry,
      index,
      year: extractPublicationYear(entry),
    }))
    .sort((left, right) => {
      if (left.year == null && right.year == null) {
        return left.index - right.index;
      }

      if (left.year == null) {
        return 1;
      }

      if (right.year == null) {
        return -1;
      }

      if (right.year !== left.year) {
        return right.year - left.year;
      }

      return left.index - right.index;
    })
    .map((item) => item.entry);
}

function toPoints(entries) {
  return sortEntriesByYearDescending(entries).map((paragraph) => ({ paragraph }));
}

function mediaId(media) {
  return Number.isInteger(media?.id) ? media.id : null;
}

function getPopulate() {
  return {
    publicationssection: {
      populate: {
        rightimage: true,
        publications: {
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
  if (department?.publicationspresent !== true) {
    throw new Error('Publications verification failed: publicationspresent is not enabled.');
  }

  const section = department?.publicationssection;

  if (section?.sectiontitle?.trim() !== 'Publications') {
    throw new Error('Publications verification failed: section title is not Publications.');
  }

  const cards = section?.publications || [];

  if (cards.length !== PUBLICATIONS.length) {
    throw new Error(
      `Publications verification failed: expected ${PUBLICATIONS.length} categories, found ${cards.length}.`
    );
  }

  for (const expected of PUBLICATIONS) {
    const actual = cards.find((card) => card?.sortorder === expected.sortorder);

    if (!actual) {
      throw new Error(
        `Publications verification failed: missing category sortorder ${expected.sortorder}.`
      );
    }

    if (actual.title?.trim() !== expected.title) {
      throw new Error(
        `Publications verification failed: unexpected title for sortorder ${expected.sortorder}.`
      );
    }

    const pointCount = actual.points?.length || 0;
    const expectedSorted = sortEntriesByYearDescending(expected.points);

    if (pointCount !== expectedSorted.length) {
      throw new Error(
        `Publications verification failed: expected ${expectedSorted.length} entries for "${expected.title}", found ${pointCount}.`
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

    const rightimage = mediaId(department.publicationssection?.rightimage);
    const publicationsPayload = {
      sectiontitle: 'Publications',
      publications: PUBLICATIONS.map((category) => ({
        title: category.title,
        sortorder: category.sortorder,
        points: toPoints(category.points),
      })),
    };

    if (rightimage) {
      publicationsPayload.rightimage = rightimage;
    }

    await repository.update({
      documentId: department.documentId,
      locale: LOCALE,
      data: {
        publicationspresent: true,
        publicationssection: publicationsPayload,
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

    const totalEntries = PUBLICATIONS.reduce((sum, category) => sum + category.points.length, 0);

    console.log(
      `Updated and published the ${LOCALE} ${DEPARTMENT_LABEL} publications section with ${PUBLICATIONS.length} categories and ${totalEntries} entries (right image left for CMS).`
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
    console.error(`Failed to update the ${DEPARTMENT_LABEL} publications section.`);
    console.error(error);
    process.exit(1);
  });
