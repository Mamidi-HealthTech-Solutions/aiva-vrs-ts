"use strict";
/**
 * VRS ID Generator
 *
 * A TypeScript package for generating and parsing VRS (Variant Representation Specification)
 * identifiers for genomic variants.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildVariantQuery = exports.getSqlTableForVariant = exports.getChromosomeFromVrsId = exports.parseVrsId = exports.isValidVrsId = exports.generateVrsId = exports.normalizeChromosome = void 0;
var generator_1 = require("./generator");
Object.defineProperty(exports, "normalizeChromosome", { enumerable: true, get: function () { return generator_1.normalizeChromosome; } });
Object.defineProperty(exports, "generateVrsId", { enumerable: true, get: function () { return generator_1.generateVrsId; } });
Object.defineProperty(exports, "isValidVrsId", { enumerable: true, get: function () { return generator_1.isValidVrsId; } });
Object.defineProperty(exports, "parseVrsId", { enumerable: true, get: function () { return generator_1.parseVrsId; } });
Object.defineProperty(exports, "getChromosomeFromVrsId", { enumerable: true, get: function () { return generator_1.getChromosomeFromVrsId; } });
Object.defineProperty(exports, "getSqlTableForVariant", { enumerable: true, get: function () { return generator_1.getSqlTableForVariant; } });
Object.defineProperty(exports, "buildVariantQuery", { enumerable: true, get: function () { return generator_1.buildVariantQuery; } });
