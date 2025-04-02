/**
 * Normalize chromosome name for VRS ID representation
 *
 * @param chrom - Chromosome name to normalize
 * @returns Normalized chromosome name
 */
export declare function normalizeChromosome(chrom: string): string;
/**
 * Generate a VRS identifier for a variant
 *
 * @param chrom - Chromosome name
 * @param pos - Variant position
 * @param ref - Reference allele
 * @param alt - Alternate allele
 * @param assembly - Genome assembly (default: GRCh38)
 * @returns VRS identifier in ga4gh:VA format
 */
export declare function generateVrsId(chrom: string, pos: number | string, ref: string, alt: string, assembly?: string): string;
/**
 * Check if a string is a valid VRS identifier
 *
 * @param vrsId - The VRS identifier to validate
 * @returns True if the identifier is valid, False otherwise
 */
export declare function isValidVrsId(vrsId: string): boolean;
/**
 * Parse a VRS identifier into its components
 *
 * @param vrsId - The VRS identifier to parse
 * @returns An object containing the components of the VRS ID
 * @throws Error if the VRS ID is invalid
 */
export declare function parseVrsId(vrsId: string): {
    chromosome: string;
    digest: string;
    type: string;
};
/**
 * Extract the chromosome from a VRS identifier
 *
 * @param vrsId - The VRS identifier
 * @returns The chromosome
 * @throws Error if the VRS ID is invalid
 */
export declare function getChromosomeFromVrsId(vrsId: string): string;
/**
 * Get the SQL table name for a variant based on its VRS ID
 *
 * @param vrsId - The VRS identifier
 * @returns The SQL table name
 * @throws Error if the VRS ID is invalid
 */
export declare function getSqlTableForVariant(vrsId: string): string;
/**
 * Build a SQL query to fetch a variant by its VRS ID
 *
 * @param vrsId - The VRS identifier
 * @returns An object with the query string and parameters
 * @throws Error if the VRS ID is invalid
 */
export declare function buildVariantQuery(vrsId: string): {
    query: string;
    params: {
        [key: string]: string;
    };
};
