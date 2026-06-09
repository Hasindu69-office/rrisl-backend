import type { Schema, Struct } from '@strapi/strapi';

export interface AboutObjectives extends Struct.ComponentSchema {
  collectionName: 'components_about_objectives';
  info: {
    displayName: 'objectives';
    icon: 'book';
  };
  attributes: {
    objectivecontent: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 2;
      }>;
    objectivenumber: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BoardMembersOrganizationLines extends Struct.ComponentSchema {
  collectionName: 'components_board_members_organization_lines';
  info: {
    displayName: 'OrganizationLines';
    icon: 'bulletList';
  };
  attributes: {
    Text: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
        minLength: 3;
      }>;
  };
}

export interface ContactContactformlabels extends Struct.ComponentSchema {
  collectionName: 'components_contact_contactformlabels';
  info: {
    displayName: 'contactformlabels';
  };
  attributes: {
    buttonlabel: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'Send Message'>;
    emailerrormsg: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'Email is required.'>;
    emaillabel: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'Email'>;
    firstnameerrormsg: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'First name is required.'>;
    firstnamelabel: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'First Name'>;
    lastnameerrormsg: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'Last name is required.'>;
    lastnamelabel: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'Last Name'>;
    messageerrormsg: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'Message is required.'>;
    messagelabel: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'Message'>;
    messageplaceholder: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'Write Your Message'>;
    phonenumbererrormsg: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'Phone number is required.'>;
    phonenumberlabel: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'Phone Number'>;
    selectsubjectlabel: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'Select Subject?'>;
  };
}

export interface ContactContactinformation extends Struct.ComponentSchema {
  collectionName: 'components_contact_contactinformations';
  info: {
    displayName: 'contactinformation';
  };
  attributes: {
    address: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'Dartonfield, Agalawatta, 12200'>;
    addresslabel: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'Visit Our Location'>;
    contactformlabels: Schema.Attribute.Component<
      'contact.contactformlabels',
      false
    > &
      Schema.Attribute.Required;
    emailaddress: Schema.Attribute.Email &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }>;
    emaillabel: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'Email'>;
    phonenumberlabel: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'Looking for Consultation'>;
    phonenumbers: Schema.Attribute.Component<'contact.phonenumber', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
        },
        number
      >;
    subtitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'Say something to start a live chat!'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'Contact Information'>;
  };
}

export interface ContactLocationcards extends Struct.ComponentSchema {
  collectionName: 'components_contact_locationcards';
  info: {
    displayName: 'locationcards';
  };
  attributes: {
    address: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'Dartonfield, Agalawatta, Sri Lanka, 12200'>;
    addresslabel: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'Postal Address'>;
    gmapembedlink: Schema.Attribute.String & Schema.Attribute.Required;
    hightlightedtext: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }>;
    phonenumber: Schema.Attribute.Component<'contact.phonenumber', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
        },
        number
      >;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }>;
    verticaltext: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }>;
  };
}

export interface ContactPhonenumber extends Struct.ComponentSchema {
  collectionName: 'components_contact_phonenumbers';
  info: {
    displayName: 'phonenumber';
  };
  attributes: {
    isprimary: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
    label: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }>;
    number: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 20;
        minLength: 7;
      }>;
    sortorder: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
        },
        number
      >;
  };
}

export interface ContactSociallinks extends Struct.ComponentSchema {
  collectionName: 'components_contact_sociallinks';
  info: {
    displayName: 'sociallinks';
  };
  attributes: {
    isvisible: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    platform: Schema.Attribute.Enumeration<
      ['Facebook', 'Instagram', 'LinkedIn', 'X']
    > &
      Schema.Attribute.Required;
    url: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
        minLength: 3;
      }>;
  };
}

export interface ContactSubstationcard extends Struct.ComponentSchema {
  collectionName: 'components_contact_substationcards';
  info: {
    displayName: 'substationcard';
  };
  attributes: {
    emailaddress: Schema.Attribute.Email &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    emaillabel: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }>;
    phonenumbers: Schema.Attribute.Component<'contact.phonenumber', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
        },
        number
      >;
    postaladdress: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }>;
    postaladdresslabel: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'Postal Address'>;
    sortorder: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
        },
        number
      >;
    substationtitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
        minLength: 10;
      }>;
  };
}

export interface EstateSubstationActivitiesSection
  extends Struct.ComponentSchema {
  collectionName: 'components_estate_substation_activities_sections';
  info: {
    displayName: 'activities-section';
  };
  attributes: {
    card: Schema.Attribute.Component<'estate-substation.activity-card', true> &
      Schema.Attribute.Required;
    sectionheader: Schema.Attribute.Component<'shared.section-header', false> &
      Schema.Attribute.Required;
  };
}

export interface EstateSubstationActivityCard extends Struct.ComponentSchema {
  collectionName: 'components_estate_substation_activity_cards';
  info: {
    displayName: 'activity-card';
    icon: 'bulletList';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
        minLength: 3;
      }>;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    imagealt: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }>;
  };
}

export interface EstateSubstationAnnualRainfallCard
  extends Struct.ComponentSchema {
  collectionName: 'components_estate_substation_annual_rainfall_cards';
  info: {
    displayName: 'annual-rainfall-card';
    icon: 'bulletList';
  };
  attributes: {
    dataperiodlabel: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'Data Period'>;
    description: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'This chart shows the total annual rainfall recorded at the sub-station for the past 10 years.'>;
    footernote: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'Rainfall data recorded daily at the sub-station and reported to the Biometry Division of RRISL.'>;
    highestrainfalllabel: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'Highest Rainfall'>;
    lowestrainfalllabel: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'Lowest Rainfall'>;
    subtitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'from 2010 to 2019'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'Total Annual Rainfall'>;
    totallabel: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'Total'>;
    variationrangelabel: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'Variation Range'>;
    xaxislabel: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'Rainfall (mm)'>;
    yaxislabel: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'Year'>;
    yearaveragelabel: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'10-Year Average'>;
    yearlabel: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'Year'>;
  };
}

export interface EstateSubstationBarchartvalues extends Struct.ComponentSchema {
  collectionName: 'components_estate_substation_barchartvalues';
  info: {
    displayName: 'barchartvalues';
  };
  attributes: {
    label: Schema.Attribute.Enumeration<['A', 'B', 'C', 'D', 'E']> &
      Schema.Attribute.Required;
    value: Schema.Attribute.Decimal & Schema.Attribute.Required;
  };
}

export interface EstateSubstationBulletpoints extends Struct.ComponentSchema {
  collectionName: 'components_estate_substation_bulletpoints';
  info: {
    displayName: 'bulletpoints';
  };
  attributes: {
    label: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }>;
  };
}

export interface EstateSubstationFacilitiesSection
  extends Struct.ComponentSchema {
  collectionName: 'components_estate_substation_facilities_sections';
  info: {
    displayName: 'facilities-section';
  };
  attributes: {
    cards: Schema.Attribute.Component<'estate-substation.facility-card', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 4;
        },
        number
      >;
    paragraph: Schema.Attribute.Component<'estate-substation.paragraph', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 2;
        },
        number
      >;
    sectionheader: Schema.Attribute.Component<'shared.section-header', false> &
      Schema.Attribute.Required;
  };
}

export interface EstateSubstationFacilityCard extends Struct.ComponentSchema {
  collectionName: 'components_estate_substation_facility_cards';
  info: {
    displayName: 'facility-card';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
        minLength: 3;
      }>;
    icon: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }>;
  };
}

export interface EstateSubstationFeatureCard extends Struct.ComponentSchema {
  collectionName: 'components_estate_substation_feature_cards';
  info: {
    displayName: 'feature-card';
    icon: 'book';
  };
  attributes: {
    badge: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 30;
        minLength: 3;
      }>;
    description: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 70;
        minLength: 10;
      }>;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    imagealt: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 20;
        minLength: 3;
      }>;
  };
}

export interface EstateSubstationFeatureSection extends Struct.ComponentSchema {
  collectionName: 'components_estate_substation_feature_sections';
  info: {
    displayName: 'feature-section';
    icon: 'cursor';
  };
  attributes: {
    cards: Schema.Attribute.Component<'estate-substation.feature-card', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
        },
        number
      >;
    description: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
        minLength: 10;
      }>;
    featuresectionbackgroundimage: Schema.Attribute.Media<'images'> &
      Schema.Attribute.Required;
    featuresectionbackgroundimagealt: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }>;
    sectionheader: Schema.Attribute.Component<'shared.section-header', false> &
      Schema.Attribute.Required;
  };
}

export interface EstateSubstationIntroSection extends Struct.ComponentSchema {
  collectionName: 'components_estate_substation_intro_sections';
  info: {
    displayName: 'intro-section';
    icon: 'check';
  };
  attributes: {
    paragraph: Schema.Attribute.Component<'estate-substation.paragraph', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 6;
        },
        number
      >;
    sectionheader: Schema.Attribute.Component<'shared.section-header', false> &
      Schema.Attribute.Required;
  };
}

export interface EstateSubstationMonitoringSection
  extends Struct.ComponentSchema {
  collectionName: 'components_estate_substation_monitoring_sections';
  info: {
    displayName: 'monitoring-section';
    icon: 'chartBubble';
  };
  attributes: {
    annualrainfalldistribution: Schema.Attribute.Component<
      'estate-substation.annual-rainfall-card',
      false
    > &
      Schema.Attribute.Required;
    monitoringsectionbackgroundimage: Schema.Attribute.Media<'images'> &
      Schema.Attribute.Required;
    monitoringsectionbackgroundimagealt: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }>;
    rainfalldistribution: Schema.Attribute.Component<
      'estate-substation.rainfall-distribution-card',
      false
    > &
      Schema.Attribute.Required;
    sectionheader: Schema.Attribute.Component<'shared.section-header', false> &
      Schema.Attribute.Required;
  };
}

export interface EstateSubstationMonthdata extends Struct.ComponentSchema {
  collectionName: 'components_estate_substation_monthdata';
  info: {
    displayName: 'monthdata';
  };
  attributes: {
    data: Schema.Attribute.Integer & Schema.Attribute.Required;
    month: Schema.Attribute.Enumeration<
      [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ]
    > &
      Schema.Attribute.Required;
  };
}

export interface EstateSubstationParagraph extends Struct.ComponentSchema {
  collectionName: 'components_estate_substation_paragraphs';
  info: {
    displayName: 'paragraph';
    icon: 'cog';
  };
  attributes: {
    paragraph: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
        minLength: 3;
      }>;
  };
}

export interface EstateSubstationPerformancesection
  extends Struct.ComponentSchema {
  collectionName: 'components_estate_substation_performancesections';
  info: {
    displayName: 'performancesection';
    icon: 'connector';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'The sub-station actively supports rubber production studies while maintaining a strong focus on quality processing and efficient tapping systems.'>;
    footernote: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'These results reflect the dedication of our field teams, innovative research, and the continuous improvement of plantation management practices.'>;
    productiontrendcard: Schema.Attribute.Component<
      'estate-substation.productiontrendcard',
      false
    > &
      Schema.Attribute.Required;
    qualityguagecard: Schema.Attribute.Component<
      'estate-substation.qualityguagecard',
      false
    > &
      Schema.Attribute.Required;
    sectionheader: Schema.Attribute.Component<'shared.section-header', false> &
      Schema.Attribute.Required;
    taperproductioncard: Schema.Attribute.Component<
      'estate-substation.tapperproductioncard',
      false
    > &
      Schema.Attribute.Required;
    yieldperformancecard: Schema.Attribute.Component<
      'estate-substation.yeildperformancecard',
      false
    > &
      Schema.Attribute.Required;
  };
}

export interface EstateSubstationProductiontrendcard
  extends Struct.ComponentSchema {
  collectionName: 'components_estate_substation_productiontrendcards';
  info: {
    displayName: 'productiontrendcard';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'of rubber production recorded'>;
    isvisible: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    metricunits: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 10;
      }> &
      Schema.Attribute.DefaultTo<'kg'>;
    referenceyear: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 3000;
          min: 2010;
        },
        number
      >;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'Total Production'>;
  };
}

export interface EstateSubstationQualityguagecard
  extends Struct.ComponentSchema {
  collectionName: 'components_estate_substation_qualityguagecards';
  info: {
    displayName: 'qualityguagecard';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'Approximately 73% of total RSS production was sold as Grade 1 quality.'>;
    insights: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'These results reflect the dedication of our field teams, innovative research, and the continuous improvement of plantation management practices.'>;
    isvisible: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    percentagevalue: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }>;
    percentagevaluelabel: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'Grade 1'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'RSS Quality'>;
  };
}

export interface EstateSubstationRainfallDistributionCard
  extends Struct.ComponentSchema {
  collectionName: 'components_estate_substation_rainfall_distribution_cards';
  info: {
    displayName: 'rainfall-distribution-card';
    icon: 'crown';
  };
  attributes: {
    annualaveragelabel: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'Annual Average'>;
    dataperiodlabel: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'Data Period'>;
    description: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
        minLength: 3;
      }>;
    dryseasonlabel: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'Dry Period'>;
    footernote: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Rainfall pattern shows a bimodal distribution with peaks during the Southwest Monsoon (Apr-May) and Northeast Monsoon (Oct-Nov) periods.'>;
    highestrainfalllabel: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'Highest Rainfall'>;
    legendbarlabel: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'Monthly Rainfall'>;
    legendlinelabel: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'Rainfall trend'>;
    lowestrainfalllabel: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'Lowest Rainfall'>;
    northwestmonsoonlabel: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'Noth West Monsoon'>;
    peakannotationlabel: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'Highest Rainfall Period'>;
    rainfallpatternlabel: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'Rainfall Pattern'>;
    rainfallpatternnamelabel: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'Bimodal'>;
    sourcenote: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Source: Rainfall data recorded daily at the sub-station and reported to RRISL Biometry Division.'>;
    southwestmonsoonlabel: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'South West Monsoon'>;
    subtitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
        minLength: 3;
      }>;
    summarybadgelabel: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'Annual Average'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }>;
    xaxislabel: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'Months'>;
    yaxislabel: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'Rainfall (mm)'>;
  };
}

export interface EstateSubstationTapperproductioncard
  extends Struct.ComponentSchema {
  collectionName: 'components_estate_substation_tapperproductioncards';
  info: {
    displayName: 'tapperproductioncard';
  };
  attributes: {
    averagevaluelabel: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'Average intake per tapper'>;
    barchartvalues: Schema.Attribute.Component<
      'estate-substation.barchartvalues',
      true
    > &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
        },
        number
      >;
    description: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
        minLength: 10;
      }> &
      Schema.Attribute.DefaultTo<'Highest productivity recorded from RRIC 121 clone fields under D3 tapping systems.'>;
    isvisible: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    metatag1: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'RRIC 121 Clone'>;
    metatag2: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'D3 System'>;
    metricvalue: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'9.4'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'Tapper Productivity'>;
  };
}

export interface EstateSubstationYeardata extends Struct.ComponentSchema {
  collectionName: 'components_estate_substation_yeardata';
  info: {
    displayName: 'yeardata';
  };
  attributes: {
    data: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 9999;
        },
        number
      >;
    year: Schema.Attribute.Enumeration<
      [
        'year_2010',
        'year_2011',
        'year_2012',
        'year_2013',
        'year_2014',
        'year_2015',
        'year_2016',
        'year_2017',
        'year_2018',
        'year_2019',
      ]
    > &
      Schema.Attribute.Required;
  };
}

export interface EstateSubstationYeildperformancecard
  extends Struct.ComponentSchema {
  collectionName: 'components_estate_substation_yeildperformancecards';
  info: {
    displayName: 'yeildperformancecard';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'Average yield reached per hectare.'>;
    insight: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'Consistent plantation productivity across managed estates.'>;
    isvisible: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    metricunits: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'kg/ha'>;
    metricvalueofyear: Schema.Attribute.Integer & Schema.Attribute.Required;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'Yield Performance'>;
    totalmetrivalueofyear: Schema.Attribute.Integer & Schema.Attribute.Required;
  };
}

export interface FooterContactInfo extends Struct.ComponentSchema {
  collectionName: 'components_footer_contact_infos';
  info: {
    displayName: 'contact-info';
    icon: 'collapse';
  };
  attributes: {
    Address: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
        minLength: 3;
      }>;
    EmailAddress: Schema.Attribute.Email &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
        minLength: 3;
      }>;
    PhoneNumber: Schema.Attribute.Component<'footer.phone-lines', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
        },
        number
      >;
    Title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'Contact us'>;
  };
}

export interface FooterLinkGroup extends Struct.ComponentSchema {
  collectionName: 'components_footer_link_groups';
  info: {
    displayName: 'link-group';
    icon: 'arrowDown';
  };
  attributes: {
    GroupTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
        minLength: 3;
      }>;
    Links: Schema.Attribute.Component<'shared.links', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 6;
          min: 1;
        },
        number
      >;
  };
}

export interface FooterPhoneLines extends Struct.ComponentSchema {
  collectionName: 'components_footer_phone_lines';
  info: {
    displayName: 'phone-lines';
    icon: 'crown';
  };
  attributes: {
    Label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
        minLength: 3;
      }>;
    Number: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 20;
        minLength: 3;
      }>;
  };
}

export interface HomeAboutSection extends Struct.ComponentSchema {
  collectionName: 'components_home_about_sections';
  info: {
    displayName: 'about-section';
    icon: 'layout';
  };
  attributes: {
    body: Schema.Attribute.Blocks;
    header: Schema.Attribute.Component<'shared.section-header', false>;
    primaryCta: Schema.Attribute.Component<'shared.button', false>;
  };
}

export interface HomeAnnoucementLabels extends Struct.ComponentSchema {
  collectionName: 'components_home_annoucement_labels';
  info: {
    displayName: 'annoucementLabels';
    icon: 'book';
  };
  attributes: {
    annoucementlabel: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
        minLength: 2;
      }>;
    announcementCardTitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
        minLength: 2;
      }>;
    hero_annoucements_item: Schema.Attribute.Relation<
      'oneToOne',
      'api::annoucement.annoucement'
    >;
    hero_news_items: Schema.Attribute.Relation<'oneToMany', 'api::new.new'>;
    newsCardTitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
        minLength: 2;
      }>;
    showAnnoucementCard: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    showNewsCard: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
  };
}

export interface HomeDatainsightssection extends Struct.ComponentSchema {
  collectionName: 'components_home_datainsightssections';
  info: {
    displayName: 'datainsightssection';
  };
  attributes: {
    backgroundimage: Schema.Attribute.Media<'images'> &
      Schema.Attribute.Required;
    description: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 10;
      }> &
      Schema.Attribute.DefaultTo<'This section presents a detailed year-to-year comparison of growth across major rubber product categories, including Sheet, Sole Crepe, Scrap Crepe, Latex Crepe, T.S.R., and Latex Other. It allows users to analyze annual performance by examining changes in production volumes and identifying patterns of growth, decline, or stability over time. Through clear visualization and structured data presentation, the section supports easy comparison between years and product types, helping users understand both short-term fluctuations and long-term industry trends.  The information is particularly useful for researchers, policymakers, rubber growers, exporters, and industry stakeholders who require reliable insights for planning and evaluation. By observing year-on-year movements, users can assess how market demand, production conditions, and policy or environmental factors may influence different product segments.'>;
    statisticslabel: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'Statistics'>;
    statisticsrightheader: Schema.Attribute.Component<
      'shared.section-header',
      false
    > &
      Schema.Attribute.Required;
    statisticstitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'Rubber Production by Different Types'>;
    viewdatabutton: Schema.Attribute.Component<'shared.button', false> &
      Schema.Attribute.Required;
    year: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<2026>;
    yearlabel: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'Year'>;
  };
}

export interface HomeHeroBadge extends Struct.ComponentSchema {
  collectionName: 'components_home_hero_badges';
  info: {
    displayName: 'hero-badge';
    icon: 'layer';
  };
  attributes: {
    avatars: Schema.Attribute.Media<'images', true>;
    icon: Schema.Attribute.Media<'images'>;
    position: Schema.Attribute.Enumeration<
      ['top_left', 'top_right', 'center_right', 'bottom_right']
    >;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface HomeHeroBanner extends Struct.ComponentSchema {
  collectionName: 'components_home_hero_banners';
  info: {
    displayName: 'hero-banner';
    icon: 'landscape';
  };
  attributes: {
    backgroundImageDesktop: Schema.Attribute.Media<'images', true>;
    backgroundImageMobile: Schema.Attribute.Media<'images', true>;
    badges: Schema.Attribute.Component<'home.hero-badge', false>;
    description: Schema.Attribute.Blocks;
    highlightedText: Schema.Attribute.String;
    labels: Schema.Attribute.Component<'home.hero-label', false>;
    overlayStyle: Schema.Attribute.Enumeration<
      ['dark_gradient', 'light_gradient', 'none']
    >;
    primaryCta: Schema.Attribute.Component<'shared.button', false>;
    title: Schema.Attribute.String;
  };
}

export interface HomeHeroLabel extends Struct.ComponentSchema {
  collectionName: 'components_home_hero_labels';
  info: {
    displayName: 'hero-label';
    icon: 'server';
  };
  attributes: {
    position: Schema.Attribute.Enumeration<['left', 'right', 'bottom']>;
    text: Schema.Attribute.String;
  };
}

export interface HomeHomebannerstats extends Struct.ComponentSchema {
  collectionName: 'components_home_homebannerstats';
  info: {
    displayName: 'homebannerstats';
    icon: 'car';
  };
  attributes: {
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
        minLength: 2;
      }>;
    percentage: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
  };
}

export interface HomeNewsandblogsection extends Struct.ComponentSchema {
  collectionName: 'components_home_newsandblogsections';
  info: {
    displayName: 'newsandblogsection';
  };
  attributes: {
    blogsection: Schema.Attribute.Component<'shared.section-header', false>;
  };
}

export interface HomeServiceCard extends Struct.ComponentSchema {
  collectionName: 'components_home_service_cards';
  info: {
    displayName: 'service-card';
    icon: 'stack';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
        minLength: 2;
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 2;
      }>;
  };
}

export interface HomeServicesSection extends Struct.ComponentSchema {
  collectionName: 'components_home_services_sections';
  info: {
    displayName: 'services-section';
    icon: 'dashboard';
  };
  attributes: {
    backgroundImageBack: Schema.Attribute.Media<'images'> &
      Schema.Attribute.Required;
    backgroundImageFront: Schema.Attribute.Media<'images'> &
      Schema.Attribute.Required;
    header: Schema.Attribute.Component<'shared.section-header', false>;
    serviceCards: Schema.Attribute.Component<'home.service-card', true> &
      Schema.Attribute.Required;
  };
}

export interface HomeSupportTheIndustrySection extends Struct.ComponentSchema {
  collectionName: 'components_home_support_the_industry_sections';
  info: {
    displayName: 'support-the-industry-section';
  };
  attributes: {
    backgroundImage: Schema.Attribute.Media<'images'> &
      Schema.Attribute.Required;
    outlinetext: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'What We Do'>;
    plantimage: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    supporttheindustrycard: Schema.Attribute.Component<
      'shared.titleandname',
      true
    > &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 6;
        },
        number
      >;
    supporttheindustrysection: Schema.Attribute.Component<
      'shared.section-header',
      false
    > &
      Schema.Attribute.Required;
  };
}

export interface SharedAlbumcard extends Struct.ComponentSchema {
  collectionName: 'components_shared_albumcards';
  info: {
    displayName: 'albumcard';
    icon: 'book';
  };
  attributes: {
    albumdescription: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
        minLength: 3;
      }>;
    albumimg: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    albumlabel: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }>;
    albumtitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }>;
    url: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }>;
    viewalbumlabel: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'View Album'>;
  };
}

export interface SharedBreadcrumbItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_breadcrumb_items';
  info: {
    displayName: 'breadcrumb-item';
  };
  attributes: {
    href: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    label: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
        minLength: 2;
      }>;
  };
}

export interface SharedButton extends Struct.ComponentSchema {
  collectionName: 'components_shared_buttons';
  info: {
    displayName: 'button';
    icon: 'bold';
  };
  attributes: {
    icon: Schema.Attribute.Media<'images'>;
    label: Schema.Attribute.String;
    linkType: Schema.Attribute.Enumeration<['internal', 'external', 'anchor']>;
    openInNewTab: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    url: Schema.Attribute.String;
    variant: Schema.Attribute.Enumeration<['primary', 'secondary', 'outline']>;
  };
}

export interface SharedDonutchartlabel extends Struct.ComponentSchema {
  collectionName: 'components_shared_donutchartlabels';
  info: {
    displayName: 'donutchartlabel';
    icon: 'star';
  };
  attributes: {
    description: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }>;
    middlevalue: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }>;
  };
}

export interface SharedEmails extends Struct.ComponentSchema {
  collectionName: 'components_shared_emails';
  info: {
    displayName: 'emails';
  };
  attributes: {
    email: Schema.Attribute.Email;
  };
}

export interface SharedErrorMessage extends Struct.ComponentSchema {
  collectionName: 'components_shared_error_messages';
  info: {
    displayName: 'error-message';
    icon: 'alien';
  };
  attributes: {
    Description: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
        minLength: 3;
      }>;
    Title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
        minLength: 3;
      }>;
  };
}

export interface SharedHighlightedTitle extends Struct.ComponentSchema {
  collectionName: 'components_shared_highlighted_titles';
  info: {
    displayName: 'highlighted title';
    icon: 'cursor';
  };
  attributes: {
    HighlightedText: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
        minLength: 3;
      }>;
    Title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
        minLength: 3;
      }>;
  };
}

export interface SharedHighlights extends Struct.ComponentSchema {
  collectionName: 'components_shared_highlights';
  info: {
    displayName: 'highlights';
    icon: 'collapse';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
        minLength: 3;
      }>;
    icon: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }>;
  };
}

export interface SharedLanguageSwitcher extends Struct.ComponentSchema {
  collectionName: 'components_shared_language_switchers';
  info: {
    displayName: 'language-switcher';
    icon: 'stack';
  };
  attributes: {
    availablesLocales: Schema.Attribute.JSON;
  };
}

export interface SharedLinks extends Struct.ComponentSchema {
  collectionName: 'components_shared_links';
  info: {
    displayName: 'links';
    icon: 'attachment';
  };
  attributes: {
    Label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
        minLength: 3;
      }>;
    openinnewtab: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
    URL: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
        minLength: 3;
      }>;
  };
}

export interface SharedPageContent extends Struct.ComponentSchema {
  collectionName: 'components_shared_page_contents';
  info: {
    displayName: 'pageContent';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 2;
      }>;
    hightlightedtext: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
        minLength: 2;
      }>;
    outlinetext: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
        minLength: 2;
      }>;
    tag: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 20;
        minLength: 2;
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
        minLength: 2;
      }>;
  };
}

export interface SharedPageHero extends Struct.ComponentSchema {
  collectionName: 'components_shared_page_heroes';
  info: {
    displayName: 'PageHero';
  };
  attributes: {
    backgroundImage: Schema.Attribute.Media<'images'>;
    backgroundImageAlt: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
        minLength: 2;
      }>;
    Breadcrumb: Schema.Attribute.Component<'shared.breadcrumb-item', true>;
    PageTitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
        minLength: 2;
      }>;
  };
}

export interface SharedPoints extends Struct.ComponentSchema {
  collectionName: 'components_shared_points';
  info: {
    displayName: 'points';
  };
  attributes: {
    icon: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    point: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
        minLength: 3;
      }>;
  };
}

export interface SharedSectionHeader extends Struct.ComponentSchema {
  collectionName: 'components_shared_section_headers';
  info: {
    displayName: 'section-header';
    icon: 'calendar';
  };
  attributes: {
    alignment: Schema.Attribute.Enumeration<['left', 'center']>;
    eyebrow: Schema.Attribute.String;
    hightlightedtext: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
        minLength: 2;
      }>;
    title: Schema.Attribute.String;
  };
}

export interface SharedSociallinks extends Struct.ComponentSchema {
  collectionName: 'components_shared_sociallinks';
  info: {
    displayName: 'sociallinks';
    icon: 'attachment';
  };
  attributes: {
    Icon: Schema.Attribute.Media<'images'>;
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
        minLength: 3;
      }>;
    Url: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
        minLength: 3;
      }>;
  };
}

export interface SharedStatisticsTabs extends Struct.ComponentSchema {
  collectionName: 'components_shared_statistics_tabs';
  info: {
    displayName: 'statistics tabs';
  };
  attributes: {
    statisticcharttitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }>;
    statisticdescription: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
        minLength: 10;
      }>;
    statisticdownloadbuttonlabel: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }>;
    statisticdownloaddescription: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }>;
    statisticinsightlabel: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }>;
    statisticname: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }>;
    statistictitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }>;
    xaxislabel: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }>;
    yaxislabel: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }>;
  };
}

export interface SharedTitleandname extends Struct.ComponentSchema {
  collectionName: 'components_shared_titleandnames';
  info: {
    displayName: 'titleandname';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
        minLength: 3;
      }>;
    sortorder: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 100;
        },
        number
      >;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
        minLength: 3;
      }>;
    url: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
        minLength: 3;
      }>;
  };
}

export interface SharedTrProgramcards extends Struct.ComponentSchema {
  collectionName: 'components_shared_tr_programcards';
  info: {
    displayName: 'tr-programcards';
  };
  attributes: {
    imageright: Schema.Attribute.Media<'images'>;
    points: Schema.Attribute.Component<'shared.points', true>;
    programtitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
        minLength: 3;
      }>;
    sortorder: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMax<
        {
          max: 2;
        },
        number
      >;
  };
}

export interface SharedValidationlabels extends Struct.ComponentSchema {
  collectionName: 'components_shared_validationlabels';
  info: {
    displayName: 'validationlabels';
  };
  attributes: {
    maximumcharacterslabel: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'cannot exceed 255 characters.'>;
    minimumcharacterlabel: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'must be at least 3 characters.'>;
    requiredlabel: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
        minLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'required'>;
  };
}

export interface VacancyLists extends Struct.ComponentSchema {
  collectionName: 'components_vacancy_lists';
  info: {
    displayName: 'lists';
  };
  attributes: {
    text: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 10;
      }>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'about.objectives': AboutObjectives;
      'board-members.organization-lines': BoardMembersOrganizationLines;
      'contact.contactformlabels': ContactContactformlabels;
      'contact.contactinformation': ContactContactinformation;
      'contact.locationcards': ContactLocationcards;
      'contact.phonenumber': ContactPhonenumber;
      'contact.sociallinks': ContactSociallinks;
      'contact.substationcard': ContactSubstationcard;
      'estate-substation.activities-section': EstateSubstationActivitiesSection;
      'estate-substation.activity-card': EstateSubstationActivityCard;
      'estate-substation.annual-rainfall-card': EstateSubstationAnnualRainfallCard;
      'estate-substation.barchartvalues': EstateSubstationBarchartvalues;
      'estate-substation.bulletpoints': EstateSubstationBulletpoints;
      'estate-substation.facilities-section': EstateSubstationFacilitiesSection;
      'estate-substation.facility-card': EstateSubstationFacilityCard;
      'estate-substation.feature-card': EstateSubstationFeatureCard;
      'estate-substation.feature-section': EstateSubstationFeatureSection;
      'estate-substation.intro-section': EstateSubstationIntroSection;
      'estate-substation.monitoring-section': EstateSubstationMonitoringSection;
      'estate-substation.monthdata': EstateSubstationMonthdata;
      'estate-substation.paragraph': EstateSubstationParagraph;
      'estate-substation.performancesection': EstateSubstationPerformancesection;
      'estate-substation.productiontrendcard': EstateSubstationProductiontrendcard;
      'estate-substation.qualityguagecard': EstateSubstationQualityguagecard;
      'estate-substation.rainfall-distribution-card': EstateSubstationRainfallDistributionCard;
      'estate-substation.tapperproductioncard': EstateSubstationTapperproductioncard;
      'estate-substation.yeardata': EstateSubstationYeardata;
      'estate-substation.yeildperformancecard': EstateSubstationYeildperformancecard;
      'footer.contact-info': FooterContactInfo;
      'footer.link-group': FooterLinkGroup;
      'footer.phone-lines': FooterPhoneLines;
      'home.about-section': HomeAboutSection;
      'home.annoucement-labels': HomeAnnoucementLabels;
      'home.datainsightssection': HomeDatainsightssection;
      'home.hero-badge': HomeHeroBadge;
      'home.hero-banner': HomeHeroBanner;
      'home.hero-label': HomeHeroLabel;
      'home.homebannerstats': HomeHomebannerstats;
      'home.newsandblogsection': HomeNewsandblogsection;
      'home.service-card': HomeServiceCard;
      'home.services-section': HomeServicesSection;
      'home.support-the-industry-section': HomeSupportTheIndustrySection;
      'shared.albumcard': SharedAlbumcard;
      'shared.breadcrumb-item': SharedBreadcrumbItem;
      'shared.button': SharedButton;
      'shared.donutchartlabel': SharedDonutchartlabel;
      'shared.emails': SharedEmails;
      'shared.error-message': SharedErrorMessage;
      'shared.highlighted-title': SharedHighlightedTitle;
      'shared.highlights': SharedHighlights;
      'shared.language-switcher': SharedLanguageSwitcher;
      'shared.links': SharedLinks;
      'shared.page-content': SharedPageContent;
      'shared.page-hero': SharedPageHero;
      'shared.points': SharedPoints;
      'shared.section-header': SharedSectionHeader;
      'shared.sociallinks': SharedSociallinks;
      'shared.statistics-tabs': SharedStatisticsTabs;
      'shared.titleandname': SharedTitleandname;
      'shared.tr-programcards': SharedTrProgramcards;
      'shared.validationlabels': SharedValidationlabels;
      'vacancy.lists': VacancyLists;
    }
  }
}
