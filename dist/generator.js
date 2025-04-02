"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeChromosome = normalizeChromosome;
exports.generateVrsId = generateVrsId;
exports.isValidVrsId = isValidVrsId;
exports.parseVrsId = parseVrsId;
exports.getChromosomeFromVrsId = getChromosomeFromVrsId;
exports.getSqlTableForVariant = getSqlTableForVariant;
exports.buildVariantQuery = buildVariantQuery;
const crypto = __importStar(require("crypto"));
/**
 * Normalize chromosome name for VRS ID representation
 *
 * @param chrom - Chromosome name to normalize
 * @returns Normalized chromosome name
 */
function normalizeChromosome(chrom) {
    // Remove 'chr' prefix if present
    if (chrom.startsWith('chr')) {
        chrom = chrom.substring(3);
    }
    // Handle special cases
    if (chrom === 'M')
        return 'MT';
    if (chrom === 'MT')
        return 'MT';
    if (chrom === 'Un')
        return 'UN';
    return chrom;
}
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
function generateVrsId(chrom, pos, ref, alt, assembly = 'GRCh38') {
    try {
        // Normalize chromosome
        const normalizedChrom = normalizeChromosome(chrom);
        // Handle special cases
        if (alt === '*' || ref === '*') {
            return `ga4gh:VA:SPECIAL:${normalizedChrom}-${pos}-${ref}-${alt}`;
        }
        // Create data string for hashing
        const data = `${normalizedChrom}:${pos}:${ref}:${alt}`;
        // Generate SHA-512 hash
        const hash = crypto.createHash('sha512').update(data).digest();
        // Take first 24 bytes and base64 encode
        const truncatedHash = hash.slice(0, 24);
        let b64Digest = truncatedHash.toString('base64');
        // Make URL-safe and remove padding
        b64Digest = b64Digest.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        // Format VRS ID
        return `ga4gh:VA:${normalizedChrom}:${b64Digest}`;
    }
    catch (error) {
        throw new Error(`Error generating VRS ID for ${chrom}:${pos}:${ref}:${alt}: ${error}`);
    }
}
/**
 * Check if a string is a valid VRS identifier
 *
 * @param vrsId - The VRS identifier to validate
 * @returns True if the identifier is valid, False otherwise
 */
function isValidVrsId(vrsId) {
    if (!vrsId) {
        return false;
    }
    // Check if it matches the VRS ID pattern
    const pattern = /^ga4gh:VA:([^:]+):(.+)$/;
    return pattern.test(vrsId);
}
/**
 * Parse a VRS identifier into its components
 *
 * @param vrsId - The VRS identifier to parse
 * @returns An object containing the components of the VRS ID
 * @throws Error if the VRS ID is invalid
 */
function parseVrsId(vrsId) {
    if (!isValidVrsId(vrsId)) {
        throw new Error(`Invalid VRS ID: ${vrsId}`);
    }
    const match = vrsId.match(/^ga4gh:VA:([^:]+):(.+)$/);
    if (!match) {
        throw new Error(`Failed to parse VRS ID: ${vrsId}`);
    }
    return {
        chromosome: match[1],
        digest: match[2],
        type: 'VA' // Variant
    };
}
/**
 * Extract the chromosome from a VRS identifier
 *
 * @param vrsId - The VRS identifier
 * @returns The chromosome
 * @throws Error if the VRS ID is invalid
 */
function getChromosomeFromVrsId(vrsId) {
    const components = parseVrsId(vrsId);
    return components.chromosome;
}
/**
 * Get the SQL table name for a variant based on its VRS ID
 *
 * @param vrsId - The VRS identifier
 * @returns The SQL table name
 * @throws Error if the VRS ID is invalid
 */
function getSqlTableForVariant(vrsId) {
    const chromosome = getChromosomeFromVrsId(vrsId);
    return `variants_chr${chromosome.toLowerCase()}`;
}
/**
 * Build a SQL query to fetch a variant by its VRS ID
 *
 * @param vrsId - The VRS identifier
 * @returns An object with the query string and parameters
 * @throws Error if the VRS ID is invalid
 */
function buildVariantQuery(vrsId) {
    const tableName = getSqlTableForVariant(vrsId);
    const chromosome = getChromosomeFromVrsId(vrsId);
    const query = `
    SELECT *
    FROM public.${tableName}
    WHERE id = @vrsId
    AND chromosome = @chromosome
  `;
    const params = {
        vrsId: vrsId,
        chromosome: chromosome
    };
    return { query, params };
}
