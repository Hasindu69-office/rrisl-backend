import type { Schema, Struct } from '@strapi/strapi';

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
    announcementCardTitle: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Announcement'>;
    backgroundImageDesktop: Schema.Attribute.Media<'images', true>;
    backgroundImageMobile: Schema.Attribute.Media<'images', true>;
    badges: Schema.Attribute.Component<'home.hero-badge', false>;
    description: Schema.Attribute.Blocks;
    hero_annoucements_items: Schema.Attribute.Relation<
      'oneToOne',
      'api::annoucement.annoucement'
    >;
    hero_news_items: Schema.Attribute.Relation<'oneToMany', 'api::new.new'>;
    highlightedText: Schema.Attribute.String;
    labels: Schema.Attribute.Component<'home.hero-label', false>;
    newsCardTitle: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Latest News'>;
    overlayStyle: Schema.Attribute.Enumeration<
      ['dark_gradient', 'light_gradient', 'none']
    >;
    primaryCta: Schema.Attribute.Component<'shared.button', false>;
    showAnnouncementCard: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    showNewsCard: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
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

export interface SharedSectionHeader extends Struct.ComponentSchema {
  collectionName: 'components_shared_section_headers';
  info: {
    displayName: 'section-header';
    icon: 'calendar';
  };
  attributes: {
    alignment: Schema.Attribute.Enumeration<['left', 'center']>;
    eyebrow: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'home.about-section': HomeAboutSection;
      'home.hero-badge': HomeHeroBadge;
      'home.hero-banner': HomeHeroBanner;
      'home.hero-label': HomeHeroLabel;
      'home.service-card': HomeServiceCard;
      'home.services-section': HomeServicesSection;
      'shared.button': SharedButton;
      'shared.language-switcher': SharedLanguageSwitcher;
      'shared.section-header': SharedSectionHeader;
    }
  }
}
