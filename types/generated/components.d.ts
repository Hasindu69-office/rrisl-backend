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
    imageBottom: Schema.Attribute.Media<'images'>;
    imageTop: Schema.Attribute.Media<'images'>;
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

export interface HomeServiceCard extends Struct.ComponentSchema {
  collectionName: 'components_home_service_cards';
  info: {
    displayName: 'service-card';
    icon: 'stack';
  };
  attributes: {
    cta: Schema.Attribute.Component<'shared.button', false>;
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

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'about.objectives': AboutObjectives;
      'footer.contact-info': FooterContactInfo;
      'footer.link-group': FooterLinkGroup;
      'footer.phone-lines': FooterPhoneLines;
      'home.about-section': HomeAboutSection;
      'home.annoucement-labels': HomeAnnoucementLabels;
      'home.hero-badge': HomeHeroBadge;
      'home.hero-banner': HomeHeroBanner;
      'home.hero-label': HomeHeroLabel;
      'home.homebannerstats': HomeHomebannerstats;
      'home.service-card': HomeServiceCard;
      'home.services-section': HomeServicesSection;
      'shared.breadcrumb-item': SharedBreadcrumbItem;
      'shared.button': SharedButton;
      'shared.error-message': SharedErrorMessage;
      'shared.language-switcher': SharedLanguageSwitcher;
      'shared.links': SharedLinks;
      'shared.page-content': SharedPageContent;
      'shared.page-hero': SharedPageHero;
      'shared.section-header': SharedSectionHeader;
      'shared.sociallinks': SharedSociallinks;
    }
  }
}
