/**
 * Basic usage example for the VRS ID Generator
 */
import { 
  generateVrsId, 
  parseVrsId, 
  isValidVrsId,
  getChromosomeFromVrsId,
  getSqlTableForVariant,
  buildVariantQuery
} from '../src';

// Example 1: Generate VRS IDs for variants
console.log('Example 1: Generate VRS IDs for variants');
const variants = [
  { chromosome: 'chr7', position: 55174772, referenceAllele: 'GGAATTAAGAGAAGC', alternateAllele: '' },
  { chromosome: 'chr17', position: 31350290, referenceAllele: 'C', alternateAllele: 'T' },
  { chromosome: 'chr11', position: 108244076, referenceAllele: 'C', alternateAllele: 'G' }
];

for (const variant of variants) {
  const vrsId = generateVrsId(
    variant.chromosome, 
    variant.position, 
    variant.referenceAllele, 
    variant.alternateAllele
  );
  
  console.log(`Variant: ${variant.chromosome}:${variant.position} ${variant.referenceAllele}>${variant.alternateAllele}`);
  console.log(`VRS ID: ${vrsId}`);
  console.log();
}

// Example 2: Parse VRS IDs
console.log('\nExample 2: Parse VRS IDs');
const vrsIds = [
  'ga4gh:VA:7:v9TQXvNOQeG1vNRVJCWlD_a1tRf_m2AP',
  'ga4gh:VA:17:0WNx7PqRUIPudU4jNEi-rXwzzFfToSyM',
  'ga4gh:VA:11:T2nN8TdyvZ398c9-JYRi0tY_QbQ4dw5s'
];

for (const vrsId of vrsIds) {
  const components = parseVrsId(vrsId);
  console.log(`VRS ID: ${vrsId}`);
  console.log(`Chromosome: ${components.chromosome}`);
  console.log(`Digest: ${components.digest}`);
  console.log();
}

// Example 3: Build SQL queries
console.log('\nExample 3: Build SQL queries');
for (const vrsId of vrsIds) {
  const { query, params } = buildVariantQuery(vrsId);
  console.log(`VRS ID: ${vrsId}`);
  console.log(`Table: ${getSqlTableForVariant(vrsId)}`);
  console.log(`Query: ${query.trim()}`);
  console.log(`Params: ${JSON.stringify(params)}`);
  console.log();
}

// Example 4: Process a batch of variants
console.log('\nExample 4: Process a batch of variants');

function processBatchOfVariants(variantData: string[][]): { id: string, chromosome: string, position: number }[] {
  return variantData.map(([chrom, pos, ref, alt]) => {
    const vrsId = generateVrsId(chrom, parseInt(pos), ref, alt);
    return {
      id: vrsId,
      chromosome: chrom,
      position: parseInt(pos)
    };
  });
}

const batchData = [
  ['chr1', '12345', 'A', 'G'],
  ['chr2', '23456', 'C', 'T'],
  ['chr3', '34567', 'G', 'A']
];

const processedVariants = processBatchOfVariants(batchData);
console.log('Processed variants:');
console.log(processedVariants);
