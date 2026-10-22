'use strict';

const { compileStrapi, createStrapi } = require('@strapi/strapi');

const CONTENT_TYPE_UID = 'api::plant-science-department.plant-science-department';
const LOCALE = 'en';

const OVERVIEW = {
  eyebrow: 'Overview',
  title: 'Conducting Research and Development for improving Rubber Production and Productivity',
  highlightedText: 'Rubber Production and Productivity',
  paragraph:
    'The Plant Science Department develops and recommends cost-effective technologies and management practices, from plant production to exploitation, that maximize rubber Production and productivity. Our major research areas focus on;',
  points: [
    'Improving quality planting material production',
    'Planting techniques to improve performance in the rubber fields',
    'The methods of exploitation to improve rubber productivity',
    'Intercropping',
    'Plant physiological and tissue culture research',
  ],
  closingParagraph:
    'In addition, the department is responsible for ensuring quality assurance of planting material production through regular inspection of all rubber nurseries and improving overall efficiency of sustainable rubber harvesting by providing technical advices, training, and technology transfer to stakeholders.',
};

async function findDepartment(repository) {
  const populate = {
    introductionsection: {
      populate: {
        sectionheader: true,
        points: {
          populate: {
            icon: true,
          },
        },
      },
    },
  };

  return (
    (await repository.findFirst({ locale: LOCALE, status: 'published', populate })) ||
    repository.findFirst({ locale: LOCALE, status: 'draft', populate })
  );
}

function getReusableIconId(department) {
  const points = department?.introductionsection?.points;

  if (!Array.isArray(points)) {
    return null;
  }

  for (const point of points) {
    const iconId = point?.icon?.id;

    if (iconId) {
      return iconId;
    }
  }

  return null;
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

    const introduction = department.introductionsection;
    const iconId = getReusableIconId(department);

    if (!introduction?.url) {
      throw new Error('The existing Plant Science overview has no video URL to preserve.');
    }

    if (!iconId) {
      throw new Error('The existing Plant Science overview has no point icon to reuse.');
    }

    await repository.update({
      documentId: department.documentId,
      locale: LOCALE,
      data: {
        introductionsection: {
          sectionheader: {
            eyebrow: OVERVIEW.eyebrow,
            title: OVERVIEW.title,
            hightlightedtext: OVERVIEW.highlightedText,
            alignment: 'left',
          },
          paragraph: OVERVIEW.paragraph,
          closingparagraph: OVERVIEW.closingParagraph,
          points: OVERVIEW.points.map((point) => ({
            point,
            icon: iconId,
          })),
          videotitle: introduction.videotitle || 'Plant Science Department',
          url: introduction.url,
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
      populate: {
        introductionsection: {
          populate: {
            points: true,
          },
        },
      },
    });

    const pointCount = updatedDepartment?.introductionsection?.points?.length || 0;

    if (pointCount !== OVERVIEW.points.length) {
      throw new Error(
        `Overview verification failed: expected ${OVERVIEW.points.length} points, found ${pointCount}.`
      );
    }

    console.log(
      `Updated and published the ${LOCALE} Plant Science overview with ${pointCount} research areas.`
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
    console.error('Failed to update the Plant Science overview.');
    console.error(error);
    process.exit(1);
  });
