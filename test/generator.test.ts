import {
  normalizeChromosome,
  generateVrsId,
  isValidVrsId,
  parseVrsId,
  getChromosomeFromVrsId,
  getSqlTableForVariant,
  buildVariantQuery
} from '../src/generator';

describe('normalizeChromosome', () => {
  test('removes chr prefix', () => {
    expect(normalizeChromosome('chr1')).toBe('1');
    expect(normalizeChromosome('1')).toBe('1');
  });

  test('handles special cases', () => {
    expect(normalizeChromosome('chrX')).toBe('X');
    expect(normalizeChromosome('chrM')).toBe('MT');
    expect(normalizeChromosome('MT')).toBe('MT');
    expect(normalizeChromosome('chrUn')).toBe('UN');
  });
});

describe('generateVrsId', () => {
  test('generates consistent IDs for the same variant', () => {
    const id1 = generateVrsId('chr7', 55174772, 'GGAATTAAGAGAAGC', '');
    const id2 = generateVrsId('chr7', 55174772, 'GGAATTAAGAGAAGC', '');
    expect(id1).toBe(id2);
  });

  test('generates different IDs for different variants', () => {
    const id1 = generateVrsId('chr7', 55174772, 'GGAATTAAGAGAAGC', '');
    const id2 = generateVrsId('chr17', 31350290, 'C', 'T');
    expect(id1).not.toBe(id2);
  });

  test('normalizes chromosome in the ID', () => {
    const id1 = generateVrsId('chr7', 55174772, 'G', 'A');
    const id2 = generateVrsId('7', 55174772, 'G', 'A');
    expect(id1).toBe(id2);
  });

  test('handles special cases', () => {
    const id = generateVrsId('chrM', 1234, 'A', 'G');
    expect(id.startsWith('ga4gh:VA:MT:')).toBe(true);
  });
});

describe('isValidVrsId', () => {
  test('validates correct VRS IDs', () => {
    expect(isValidVrsId('ga4gh:VA:7:v9TQXvNOQeG1vNRVJCWlD_a1tRf_m2AP')).toBe(true);
    expect(isValidVrsId('ga4gh:VA:17:0WNx7PqRUIPudU4jNEi-rXwzzFfToSyM')).toBe(true);
  });

  test('rejects invalid VRS IDs', () => {
    expect(isValidVrsId('invalid_id')).toBe(false);
    expect(isValidVrsId('ga4gh:XX:7:v9TQXvNOQeG1vNRVJCWlD_a1tRf_m2AP')).toBe(false);
    expect(isValidVrsId('')).toBe(false);
  });
});

describe('parseVrsId', () => {
  test('parses valid VRS IDs', () => {
    const components = parseVrsId('ga4gh:VA:7:v9TQXvNOQeG1vNRVJCWlD_a1tRf_m2AP');
    expect(components.chromosome).toBe('7');
    expect(components.digest).toBe('v9TQXvNOQeG1vNRVJCWlD_a1tRf_m2AP');
    expect(components.type).toBe('VA');
  });

  test('throws error for invalid VRS IDs', () => {
    expect(() => parseVrsId('invalid_id')).toThrow();
  });
});

describe('getChromosomeFromVrsId', () => {
  test('extracts chromosome from VRS ID', () => {
    expect(getChromosomeFromVrsId('ga4gh:VA:7:v9TQXvNOQeG1vNRVJCWlD_a1tRf_m2AP')).toBe('7');
    expect(getChromosomeFromVrsId('ga4gh:VA:X:v9TQXvNOQeG1vNRVJCWlD_a1tRf_m2AP')).toBe('X');
  });

  test('throws error for invalid VRS IDs', () => {
    expect(() => getChromosomeFromVrsId('invalid_id')).toThrow();
  });
});

describe('getSqlTableForVariant', () => {
  test('gets correct table name for variant', () => {
    expect(getSqlTableForVariant('ga4gh:VA:7:v9TQXvNOQeG1vNRVJCWlD_a1tRf_m2AP')).toBe('variants_chr7');
    expect(getSqlTableForVariant('ga4gh:VA:X:v9TQXvNOQeG1vNRVJCWlD_a1tRf_m2AP')).toBe('variants_chrx');
  });

  test('throws error for invalid VRS IDs', () => {
    expect(() => getSqlTableForVariant('invalid_id')).toThrow();
  });
});

describe('buildVariantQuery', () => {
  test('builds correct SQL query', () => {
    const { query, params } = buildVariantQuery('ga4gh:VA:7:v9TQXvNOQeG1vNRVJCWlD_a1tRf_m2AP');
    expect(query).toContain('FROM public.variants_chr7');
    expect(query).toContain('WHERE id = @vrsId');
    expect(query).toContain('AND chromosome = @chromosome');
    expect(params.vrsId).toBe('ga4gh:VA:7:v9TQXvNOQeG1vNRVJCWlD_a1tRf_m2AP');
    expect(params.chromosome).toBe('7');
  });

  test('throws error for invalid VRS IDs', () => {
    expect(() => buildVariantQuery('invalid_id')).toThrow();
  });
});
