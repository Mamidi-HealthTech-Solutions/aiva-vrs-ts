# VRS ID Generator (TypeScript)

A TypeScript package for generating and parsing VRS (Variant Representation Specification) identifiers for genomic variants.

This package was inspired by the [GA4GH Variant Representation Specification](https://vrs.ga4gh.org/en/stable/) (VRS) and provides a similar way to uniquely and precisely identify genomic variants. However, it is not a direct implementation of VRS and can have different IDs than the original VRS specification.

## Installation

```bash
# Install from npm
npm install aiva-vrs

# Or using yarn
yarn add aiva-vrs
```

## Features

- Generate consistent VRS identifiers for genomic variants
- Parse VRS identifiers to extract components
- Validate VRS identifiers
- Build database queries for variant lookup
- Normalize chromosome representations

## Why Use VRS IDs?

### The Problem with Traditional Variant Representation

Traditionally, genomic variants are represented using a combination of:
- Chromosome (e.g., "chr7" or "7")
- Position (e.g., 55174772)
- Reference allele (e.g., "G")
- Alternate allele (e.g., "A")

This approach has several significant challenges:

1. **Inconsistent Representation**: Different tools may represent the same variant differently:
   - Chromosome format inconsistencies (e.g., "chr7" vs "7")
   - Different normalization of complex variants
   - Representation of insertions/deletions varies between tools

2. **Database Querying Complexity**:
   - Querying by 4 separate fields is inefficient
   - Requires complex joins and indexing strategies
   - Difficult to maintain consistency across different data sources

3. **Cross-Reference Challenges**:
   - Matching variants between datasets is error-prone
   - No single identifier to track a variant across systems
   - Difficult to integrate data from multiple sources

### The VRS ID Solution

VRS IDs solve these problems by:

1. **Single Consistent Identifier**: Each variant gets a unique, stable identifier
2. **Deterministic Generation**: The same variant always gets the same ID
3. **Self-Contained Information**: The chromosome is encoded in the ID
4. **Efficient Database Operations**: Query by a single field instead of four
5. **Simplified Data Integration**: Easily match variants across different datasets

## Basic Usage

```typescript
import { 
  generateVrsId, 
  parseVrsId, 
  isValidVrsId 
} from 'aiva-vrs';

// Generate a VRS ID
const vrsId = generateVrsId("chr7", 55174772, "GGAATTAAGAGAAGC", "");
console.log(vrsId);  // ga4gh:VA:7:v9TQXvNOQeG1vNRVJCWlD_a1tRf_m2AP

// Validate a VRS ID
const isValid = isValidVrsId(vrsId);
console.log(isValid);  // true

// Parse a VRS ID
const components = parseVrsId(vrsId);
console.log(components);  // { chromosome: '7', digest: 'v9TQXvNOQeG1vNRVJCWlD_a1tRf_m2AP', type: 'VA' }
```

## Database Integration Examples

### Example 1: Using with Node.js and PostgreSQL

```typescript
import { Client } from 'pg';
import { buildVariantQuery } from 'aiva-vrs';

async function fetchVariant(vrsId: string): Promise<any> {
  const client = new Client({
    connectionString: 'postgresql://postgres:password@localhost/genomics_db'
  });
  
  await client.connect();
  
  try {
    const { query, params } = buildVariantQuery(vrsId);
    
    // Convert named parameters to positional parameters for pg
    const pgQuery = query
      .replace('@vrsId', '$1')
      .replace('@chromosome', '$2');
    
    const result = await client.query(pgQuery, [params.vrsId, params.chromosome]);
    return result.rows[0];
  } finally {
    await client.end();
  }
}

// Usage
fetchVariant('ga4gh:VA:7:v9TQXvNOQeG1vNRVJCWlD_a1tRf_m2AP')
  .then(variant => console.log(variant))
  .catch(error => console.error(error));
```

### Example 2: Using with TypeORM

```typescript
import { getConnection } from 'typeorm';
import { 
  getChromosomeFromVrsId, 
  getSqlTableForVariant 
} from 'aiva-vrs';

async function fetchVariantWithConsequences(vrsId: string): Promise<any> {
  const tableName = getSqlTableForVariant(vrsId);
  const chromosome = getChromosomeFromVrsId(vrsId);
  
  const connection = getConnection();
  
  const result = await connection.query(`
    SELECT v.*, tc.* 
    FROM public.${tableName} v
    LEFT JOIN public.transcript_consequences tc ON v.id = tc.variant_id
    WHERE v.id = $1
    AND v.chromosome = $2
  `, [vrsId, chromosome]);
  
  return result;
}
```

### Example 3: Using with React and GraphQL

```typescript
import { gql, useMutation } from '@apollo/client';
import { generateVrsId } from 'aiva-vrs';

// GraphQL mutation
const ADD_VARIANT = gql`
  mutation AddVariant($id: String!, $chromosome: String!, $position: Int!, $refAllele: String!, $altAllele: String!) {
    addVariant(
      id: $id
      chromosome: $chromosome
      position: $position
      referenceAllele: $refAllele
      alternateAllele: $altAllele
    ) {
      id
      chromosome
      position
    }
  }
`;

function VariantForm() {
  const [addVariant] = useMutation(ADD_VARIANT);
  
  const handleSubmit = (event) => {
    event.preventDefault();
    
    const chromosome = event.target.chromosome.value;
    const position = parseInt(event.target.position.value);
    const refAllele = event.target.refAllele.value;
    const altAllele = event.target.altAllele.value;
    
    // Generate VRS ID
    const vrsId = generateVrsId(chromosome, position, refAllele, altAllele);
    
    // Submit mutation with VRS ID
    addVariant({
      variables: {
        id: vrsId,
        chromosome,
        position,
        refAllele,
        altAllele
      }
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input name="chromosome" placeholder="Chromosome" />
      <input name="position" type="number" placeholder="Position" />
      <input name="refAllele" placeholder="Reference Allele" />
      <input name="altAllele" placeholder="Alternate Allele" />
      <button type="submit">Add Variant</button>
    </form>
  );
}
```

## Development

### Building the Package

```bash
# Install dependencies
npm install

# Build the package
npm run build
```

### Running Tests

```bash
npm test
```

## License

MIT License
