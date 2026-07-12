import * as migration_20260605_170340_initial_schema from './20260605_170340_initial_schema';
import * as migration_20260605_181312_add_media_collection from './20260605_181312_add_media_collection';
import * as migration_20260606_165336_add_post_category from './20260606_165336_add_post_category';
import * as migration_20260605_200000_add_linkedin_integration from './20260605_200000_add_linkedin_integration';
import * as migration_20260610_162500_dynamic_post_categories from './20260610_162500_dynamic_post_categories';
import * as migration_20260610_180000_add_post_cover_image from './20260610_180000_add_post_cover_image';
import * as migration_20260619_add_post_presentation from './20260619_add_post_presentation';
import * as migration_20260702_add_source_document from './20260702_add_source_document';
import * as migration_20260711_add_post_interest_count from './20260711_add_post_interest_count';
import * as migration_20260712_add_content_program_fields from './20260712_add_content_program_fields';

export const migrations = [
  {
    up: migration_20260605_170340_initial_schema.up,
    down: migration_20260605_170340_initial_schema.down,
    name: '20260605_170340_initial_schema',
  },
  {
    up: migration_20260605_181312_add_media_collection.up,
    down: migration_20260605_181312_add_media_collection.down,
    name: '20260605_181312_add_media_collection',
  },
  {
    up: migration_20260606_165336_add_post_category.up,
    down: migration_20260606_165336_add_post_category.down,
    name: '20260606_165336_add_post_category'
  },
  {
    up: migration_20260605_200000_add_linkedin_integration.up,
    down: migration_20260605_200000_add_linkedin_integration.down,
    name: '20260605_200000_add_linkedin_integration',
  },
  {
    up: migration_20260610_162500_dynamic_post_categories.up,
    down: migration_20260610_162500_dynamic_post_categories.down,
    name: '20260610_162500_dynamic_post_categories',
  },
  {
    up: migration_20260610_180000_add_post_cover_image.up,
    down: migration_20260610_180000_add_post_cover_image.down,
    name: '20260610_180000_add_post_cover_image',
  },
  {
    up: migration_20260619_add_post_presentation.up,
    down: migration_20260619_add_post_presentation.down,
    name: '20260619_add_post_presentation',
  },
  {
    up: migration_20260702_add_source_document.up,
    down: migration_20260702_add_source_document.down,
    name: '20260702_add_source_document',
  },
  {
    up: migration_20260711_add_post_interest_count.up,
    down: migration_20260711_add_post_interest_count.down,
    name: '20260711_add_post_interest_count',
  },
  {
    up: migration_20260712_add_content_program_fields.up,
    down: migration_20260712_add_content_program_fields.down,
    name: '20260712_add_content_program_fields',
  },
];
