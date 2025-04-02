import React, { useState } from 'react';
import { generateVrsId, isValidVrsId, parseVrsId } from 'aiva-vrs';

interface Variant {
  chromosome: string;
  position: number;
  referenceAllele: string;
  alternateAllele: string;
  vrsId?: string;
}

const VariantForm: React.FC = () => {
  const [variant, setVariant] = useState<Variant>({
    chromosome: '',
    position: 0,
    referenceAllele: '',
    alternateAllele: ''
  });
  
  const [result, setResult] = useState<{
    vrsId: string;
    parsedComponents?: ReturnType<typeof parseVrsId>;
  } | null>(null);
  
  const [error, setError] = useState<string | null>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVariant(prev => ({
      ...prev,
      [name]: name === 'position' ? parseInt(value) || 0 : value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      // Validate inputs
      if (!variant.chromosome) {
        throw new Error('Chromosome is required');
      }
      
      if (!variant.position) {
        throw new Error('Position is required');
      }
      
      if (!variant.referenceAllele && !variant.alternateAllele) {
        throw new Error('At least one allele must be specified');
      }
      
      // Generate VRS ID
      const vrsId = generateVrsId(
        variant.chromosome,
        variant.position,
        variant.referenceAllele,
        variant.alternateAllele
      );
      
      // Parse the generated VRS ID
      const parsedComponents = parseVrsId(vrsId);
      
      setResult({
        vrsId,
        parsedComponents
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setResult(null);
    }
  };
  
  return (
    <div className="variant-form-container">
      <h2>VRS ID Generator</h2>
      
      <form onSubmit={handleSubmit} className="variant-form">
        <div className="form-group">
          <label htmlFor="chromosome">Chromosome:</label>
          <input
            type="text"
            id="chromosome"
            name="chromosome"
            value={variant.chromosome}
            onChange={handleInputChange}
            placeholder="e.g., chr7 or 7"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="position">Position:</label>
          <input
            type="number"
            id="position"
            name="position"
            value={variant.position || ''}
            onChange={handleInputChange}
            placeholder="e.g., 55174772"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="referenceAllele">Reference Allele:</label>
          <input
            type="text"
            id="referenceAllele"
            name="referenceAllele"
            value={variant.referenceAllele}
            onChange={handleInputChange}
            placeholder="e.g., G"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="alternateAllele">Alternate Allele:</label>
          <input
            type="text"
            id="alternateAllele"
            name="alternateAllele"
            value={variant.alternateAllele}
            onChange={handleInputChange}
            placeholder="e.g., A"
          />
        </div>
        
        <button type="submit" className="submit-button">
          Generate VRS ID
        </button>
      </form>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {result && (
        <div className="result-container">
          <h3>Generated VRS ID:</h3>
          <div className="vrs-id">{result.vrsId}</div>
          
          {result.parsedComponents && (
            <>
              <h3>Parsed Components:</h3>
              <div className="parsed-components">
                <div><strong>Chromosome:</strong> {result.parsedComponents.chromosome}</div>
                <div><strong>Type:</strong> {result.parsedComponents.type}</div>
                <div><strong>Digest:</strong> {result.parsedComponents.digest}</div>
              </div>
            </>
          )}
        </div>
      )}
      
      <style jsx>{`
        .variant-form-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .variant-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin-bottom: 20px;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        
        label {
          font-weight: 500;
        }
        
        input {
          padding: 8px 12px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 16px;
        }
        
        .submit-button {
          padding: 10px 15px;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .submit-button:hover {
          background-color: #0051a8;
        }
        
        .error-message {
          padding: 10px;
          background-color: #ffebee;
          color: #c62828;
          border-radius: 4px;
          margin-bottom: 20px;
        }
        
        .result-container {
          padding: 15px;
          background-color: #f5f5f5;
          border-radius: 4px;
        }
        
        .vrs-id {
          padding: 10px;
          background-color: #e0f2f1;
          border-radius: 4px;
          font-family: monospace;
          font-size: 16px;
          margin-bottom: 15px;
          word-break: break-all;
        }
        
        .parsed-components {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
      `}</style>
    </div>
  );
};

export default VariantForm;
