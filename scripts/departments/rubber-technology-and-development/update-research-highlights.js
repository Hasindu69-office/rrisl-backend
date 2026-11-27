'use strict';

const { compileStrapi, createStrapi } = require('@strapi/strapi');

const CONTENT_TYPE_UID =
  'api::rubber-technology-and-development-department.rubber-technology-and-development-department';
const LOCALE = 'en';
const DEPARTMENT_LABEL = 'Rubber Technology and Development';

const HIGHLIGHTS = [
  {
    title:
      'Synthesis of reduced graphene oxide (rGO) and effect of its loading on properties of natural rubber composites',
    description:
      "Recipient of the Best Presenter Award at the National Symposium on Agriculture and Life Sciences (NSALS' 25, January 2025) under the Agricultural Engineering and Process Technology track, Uva Wellassa University of Sri Lanka. This research focuses on the synthesis of reduced graphene oxide (rGO) using the Modified Hummers Method and its incorporation into natural rubber (NR) at varying levels of 1–4 phr according to a conveyor belt manufacturing formula to assess its impact on physio-mechanical and chemical properties compared to conventional carbon black (CB) filler. The findings demonstrate that a small loading of rGO can effectively replace a much higher loading of carbon black (50 phr), achieving optimal comprehensive performance at 2 phr of rGO for practical applications such as conveyor belt rubber.",
    researchteam: 'M.A.Y. Manchanayake, W.D.M. Sampath, G. Abhiram and T.A.R.W.M.M.C.G. Bandara',
    sortorder: 1,
  },
  {
    title: 'Development of rubber composites with green materials',
    description:
      'Formulating sustainable natural rubber composites incorporating eco-friendly, bio-based green materials to enhance environmental performance.',
    sortorder: 2,
  },
  {
    title:
      'Development of dry rubber-based composites with modified natural oil as a replacement for aromatic oil',
    description:
      'Evaluating modified natural oils as non-toxic, sustainable processing oil alternatives to conventional aromatic oils in dry rubber compounding.',
    sortorder: 3,
  },
  {
    title: 'Development of rubber composites with waste materials',
    description:
      'Valorizing industrial and post-consumer waste streams as functional fillers and modifiers in value-added rubber composites.',
    sortorder: 4,
  },
  {
    title: 'Development of coir fiber filled rubber composites',
    description:
      'Reinforcing natural rubber compounds with treated coconut coir fibers to improve mechanical performance and natural resource utilization.',
    sortorder: 5,
  },
  {
    title:
      'Development of a natural rubber and low-density polyethylene (LDPE) blend with improved properties',
    description:
      'Developing compatibilized and dynamically vulcanized natural rubber/LDPE thermoplastic elastomer blends with superior mechanical and ageing properties.',
    sortorder: 6,
  },
  {
    title: 'Development of a nitrosamine safe natural rubber latex-based adhesive',
    description:
      'Formulating nitrosamine-safe natural rubber latex adhesives that comply with international health, safety, and regulatory standards.',
    sortorder: 7,
  },
  {
    title:
      'Development of natural rubber and synthetic rubber blends for high-tech engineering applications',
    description:
      'Engineering tailored blends of natural and synthetic rubbers to meet demanding performance criteria in specialized industrial applications.',
    sortorder: 8,
  },
  {
    title:
      'Development of novel recycling processes for latex or dry rubber-based compound / product waste',
    description:
      'Establishing cost-effective mechano-chemical and processing techniques to reclaim and recycle latex rejects and vulcanized dry rubber waste.',
    sortorder: 9,
  },
  {
    title:
      'Development of natural dry rubber-based cellular compounds with different blowing agents',
    description:
      'Investigating chemical blowing agent systems to control cell morphology, density, and cushioning in dry natural rubber cellular products.',
    sortorder: 10,
  },
  {
    title: 'Synthesis of natural nano-fibers and development of rubber composites with nano-fibers',
    description:
      'Synthesizing bio-derived nanofibers and integrating them into rubber matrices to achieve high-performance nanoscale reinforcement.',
    sortorder: 11,
  },
  {
    title: 'Development of rubber–bitumen masterbatches with modified rubber waste',
    description:
      'Producing rubber–bitumen masterbatches incorporating surface-modified waste rubber for durable road paving and waterproofing applications.',
    sortorder: 12,
  },
  {
    title: 'Development of natural rubber composites with green cellular nanomaterial',
    description:
      'Incorporating green-synthesized cellular nanomaterials into natural rubber matrices to develop lightweight, high-performance functional composites.',
    sortorder: 13,
  },
  {
    title:
      'Synthesis of graphite derivatives and development of rubber composites for high-tech engineering and electronic applications',
    description:
      'Synthesizing functionalized graphite and graphene derivatives to impart superior electrical, thermal, and mechanical properties to natural rubber composites.',
    sortorder: 14,
  },
];

function normalizeTitle(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function mediaId(media) {
  return Number.isInteger(media?.id) ? media.id : null;
}

function getPopulate() {
  return {
    researchhighlightssection: {
      populate: {
        researchhighlightcards: {
          populate: {
            image: true,
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

function findExistingCard(existingCards, highlight, usedIds) {
  const expectedTitle = normalizeTitle(highlight.title);

  const byTitle = existingCards.find((candidate) => {
    if (usedIds.has(candidate?.id)) return false;
    return normalizeTitle(candidate?.title) === expectedTitle;
  });

  if (byTitle) return byTitle;

  return existingCards.find(
    (candidate) => !usedIds.has(candidate?.id) && candidate?.sortorder === highlight.sortorder
  );
}

function buildCards(existingCards) {
  const usedIds = new Set();

  return HIGHLIGHTS.map((highlight) => {
    const existing = findExistingCard(existingCards, highlight, usedIds);

    if (existing?.id) {
      usedIds.add(existing.id);
    }

    const image = mediaId(existing?.image);
    const payload = {
      title: highlight.title,
      description: highlight.description,
      sortorder: highlight.sortorder,
    };

    if (highlight.researchteam) {
      payload.researchteam = highlight.researchteam;
    }

    if (image) {
      payload.image = image;
    }

    return payload;
  });
}

function assertPublishedResult(department) {
  if (department?.researchhighlightspresent !== true) {
    throw new Error('Research highlights verification failed: the visibility flag is not enabled.');
  }

  const cards = department?.researchhighlightssection?.researchhighlightcards || [];

  if (cards.length !== HIGHLIGHTS.length) {
    throw new Error(
      `Research highlights verification failed: expected ${HIGHLIGHTS.length} cards, found ${cards.length}.`
    );
  }

  for (const expected of HIGHLIGHTS) {
    const actual = cards.find((card) => card?.sortorder === expected.sortorder);

    if (!actual) {
      throw new Error(
        `Research highlights verification failed: missing card with sortorder ${expected.sortorder}.`
      );
    }

    if (actual.title?.trim() !== expected.title) {
      throw new Error(
        `Research highlights verification failed: unexpected title for sortorder ${expected.sortorder}.`
      );
    }

    if (!actual.description?.trim() || actual.description.trim().length < 10) {
      throw new Error(
        `Research highlights verification failed: description missing for sortorder ${expected.sortorder}.`
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

    const existingCards = department.researchhighlightssection?.researchhighlightcards || [];
    const researchhighlightcards = buildCards(existingCards);
    const preservedCount = researchhighlightcards.filter((card) => card.image).length;
    const verticalText =
      department.researchhighlightssection?.verticaltext?.trim() || 'Research Highlights';

    await repository.update({
      documentId: department.documentId,
      locale: LOCALE,
      data: {
        researchhighlightspresent: true,
        researchhighlightssection: {
          verticaltext: verticalText,
          researchhighlightcards,
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
      `Updated and published the ${LOCALE} ${DEPARTMENT_LABEL} research highlights section with ${HIGHLIGHTS.length} flip tiles (preserved images on ${preservedCount}; upload remaining in CMS).`
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
    console.error(`Failed to update the ${DEPARTMENT_LABEL} research highlights section.`);
    console.error(error);
    process.exit(1);
  });
