/**
 * VRS ID Generator
 * 
 * A TypeScript package for generating and parsing VRS (Variant Representation Specification) 
 * identifiers for genomic variants.
 */

export {
  normalizeChromosome,
  generateVrsId,
  isValidVrsId,
  parseVrsId,
  getChromosomeFromVrsId,
  getSqlTableForVariant,
  buildVariantQuery
} from './generator';
