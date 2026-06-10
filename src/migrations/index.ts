import * as migration_20260605_170340_initial_schema from './20260605_170340_initial_schema';
import * as migration_20260605_181312_add_media_collection from './20260605_181312_add_media_collection';
import * as migration_20260606_165336_add_post_category from './20260606_165336_add_post_category';
import * as migration_20260605_200000_add_linkedin_integration from './20260605_200000_add_linkedin_integration';
import * as migration_20260610_162500_dynamic_post_categories from './20260610_162500_dynamic_post_categories';
import * as migration_20260610_180000_add_post_cover_image from './20260610_180000_add_post_cover_image';

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
];
