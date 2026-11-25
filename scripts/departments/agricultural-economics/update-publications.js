'use strict';

const { compileStrapi, createStrapi } = require('@strapi/strapi');
const PUBLICATIONS = require('./_publications-data');

const CONTENT_TYPE_UID =
  'api::agricultural-economics-department.agricultural-economics-department';
const LOCALE = 'en';
const DEPARTMENT_LABEL = 'Agricultural Economics';

function extractPublicationYear(text) {
  if (!text) {
    return null;
  }

  const publishedInMatch = text.match(/Published\s+in\s+(19|20)\d{2}/i);
  if (publishedInMatch) {
    const year = Number(publishedInMatch[0].match(/(19|20)\d{2}/)?.[0]);
    if (Number.isFinite(year)) {
      return year;
    }
  }

  const parentheticalMatch = text.match(/\((19|20)\d{2}\)/);
  if (parentheticalMatch) {
    const year = Number(parentheticalMatch[0].replace(/[()]/g, ''));
    if (Number.isFinite(year)) {
      return year;
    }
  }

  const standaloneYears = [...text.matchAll(/\b((?:19|20)\d{2})\b/g)].map((match) =>
    Number(match[1])
  );
  if (standaloneYears.length === 0) {
    return null;
  }

  return Math.max(...standaloneYears);
}

function sortEntriesByYearDescending(entries) {
  return [...entries]
    .map((entry, index) => ({ entry, index, year: extractPublicationYear(entry) }))
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
