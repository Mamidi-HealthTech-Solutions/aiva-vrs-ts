/**
 * Example of using VRS ID Generator with Node.js and a database
 * 
 * This example shows how to:
 * 1. Generate VRS IDs for variants
 * 2. Store variants in a database using the VRS ID as the primary key
 * 3. Query variants by VRS ID
 * 
 * Note: This is a demonstration and uses an in-memory database for simplicity
 */

import { 
  generateVrsId, 
  parseVrsId, 
  getChromosomeFromVrsId,
  getSqlTableForVariant 
} from '../src';

// Mock database implementation (for demonstration purposes)
class MockDatabase {
  private tables: Record<string, Record<string, any>[]> = {};

  // Create a table if it doesn't exist
  private ensureTable(tableName: string): void {
    if (!this.tables[tableName]) {
      this.tables[tableName] = [];
    }
  }

  // Insert a record into a table
  public insert(tableName: string, record: Record<string, any>): void {
    this.ensureTable(tableName);
    this.tables[tableName].push(record);
    console.log(`Inserted record into ${tableName}:`, record);
  }

  // Query records from a table
  public query(tableName: string, condition: (record: Record<string, any>) => boolean): Record<string, any>[] {
    this.ensureTable(tableName);
    return this.tables[tableName].filter(condition);
  }

  // Get all tables
  public getTables(): string[] {
    return Object.keys(this.tables);
  }

  // Get all records in a table
  public getAll(tableName: string): Record<string, any>[] {
    this.ensureTable(tableName);
    return this.tables[tableName];
  }
}

// Example variants
const variantData = [
  { chromosome: 'chr7', position: 55174772, referenceAllele: 'GGAATTAAGAGAAGC', alternateAllele: '' },
  { chromosome: 'chr17', position: 31350290, referenceAllele: 'C', alternateAllele: 'T' },
  { chromosome: 'chr11', position: 108244076, referenceAllele: 'C', alternateAllele: 'G' },
  { chromosome: 'chrX', position: 66765158, referenceAllele: 'T', alternateAllele: 'C' },
  { chromosome: 'chr1', position: 12345, referenceAllele: 'A', alternateAllele: 'G' }
];

// Initialize the mock database
const db = new MockDatabase();

// Process and store variants
function processVariants(variants: typeof variantData): void {
  console.log('Processing variants and storing in database...\n');
  
  for (const variant of variants) {
    // Generate VRS ID
    const vrsId = generateVrsId(
      variant.chromosome, 
      variant.position, 
      variant.referenceAllele, 
      variant.alternateAllele
    );
    
    // Determine the table name based on the chromosome
    const tableName = getSqlTableForVariant(vrsId);
    
    // Store the variant in the database
    db.insert(tableName, {
      id: vrsId,
      chromosome: getChromosomeFromVrsId(vrsId),
      position: variant.position,
      reference_allele: variant.referenceAllele,
      alternate_allele: variant.alternateAllele,
      created_at: new Date().toISOString()
    });
  }
}

// Query variants by VRS ID
function queryVariantByVrsId(vrsId: string): Record<string, any> | null {
  console.log(`\nQuerying variant with VRS ID: ${vrsId}`);
  
  try {
    // Parse the VRS ID to get the chromosome
    const components = parseVrsId(vrsId);
    
    // Determine the table name
    const tableName = getSqlTableForVariant(vrsId);
    
    // Query the database
    const results = db.query(tableName, record => record.id === vrsId);
    
    if (results.length > 0) {
      return results[0];
    } else {
      console.log(`No variant found with VRS ID: ${vrsId}`);
      return null;
    }
  } catch (error) {
    console.error(`Error querying variant: ${error}`);
    return null;
  }
}

// Run the example
function runExample(): void {
  // Process and store variants
  processVariants(variantData);
  
  // Show all tables created
  console.log('\nDatabase tables created:');
  console.log(db.getTables());
  
  // Generate a VRS ID for a test query
  const testVariant = variantData[1]; // chr17 variant
  const testVrsId = generateVrsId(
    testVariant.chromosome,
    testVariant.position,
    testVariant.referenceAllele,
    testVariant.alternateAllele
  );
  
  // Query the variant
  const result = queryVariantByVrsId(testVrsId);
  
  if (result) {
    console.log('\nFound variant:');
    console.log(result);
  }
  
  // Show how to query with an invalid VRS ID
  console.log('\nTrying to query with an invalid VRS ID:');
  try {
    queryVariantByVrsId('invalid-vrs-id');
  } catch (error) {
    console.error(`Error: ${error}`);
  }
  
  // Show the contents of one table
  const sampleTable = db.getTables()[0];
  console.log(`\nContents of table ${sampleTable}:`);
  console.log(db.getAll(sampleTable));
}

// Run the example
runExample();
