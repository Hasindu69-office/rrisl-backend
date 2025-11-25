import type { Schema, Struct } from '@strapi/strapi';

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
    backgroundImageDesktop: Schema.Attribute.Media<'images'>;
    backgroundImageMobile: Schema.Attribute.Media<'images'>;
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

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'home.hero-badge': HomeHeroBadge;
      'home.hero-banner': HomeHeroBanner;
      'home.hero-label': HomeHeroLabel;
      'shared.button': SharedButton;
      'shared.language-switcher': SharedLanguageSwitcher;
    }
  }
}
