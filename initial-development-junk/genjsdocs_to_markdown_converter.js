const fs = require('fs');
const path = require('path');

// Import the documentation data
// Ensure 'openai-docs-reference.js' exports an object with 'a' (for docs) and 'A' (for mainTitles)
const { a: docs, A: mainTitles } = require('./openai-docs-reference.js');

// Create output directory for markdown files
const OUTPUT_DIR = path.join(__dirname, 'openai-docs-api-reference');
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Main function to convert documentation to markdown.
 * This function acts as the dispatcher for different document types.
 * @param {Array<object>} docs - An array of documentation items to convert.
 */
function convertDocsToMarkdown(docs) {
    console.log(`Found ${docs.length} documentation items to convert`);

    for (let doc of docs) {
        // Skip if it doesn't have a URL, as it's needed for filename generation
        if (!doc.url) {
            console.log(`Skipping doc without URL: ${doc.title || 'Unknown'}`);
            continue;
        }

        // Generate filename from URL
        const urlPath = doc.url.replace('/docs/api-reference/', '');
        const filename = path.join(OUTPUT_DIR, urlPath + '.md');

        // Create directory if it doesn't exist
        fs.mkdirSync(path.dirname(filename), { recursive: true });

        let markdownContent = '';

        // Dispatch based on doc type
        if (doc.type === 'endpoint') {
            markdownContent = convertEndpointToMarkdown(doc);
        } else if (doc.definition) {
            // For definition-based docs like objects or enums
            markdownContent = convertDefinitionToMarkdown(doc);
        } else if (doc.content) {
            // For docs with direct content (e.g., overview pages)
            markdownContent = `# ${doc.title}\n\n${cleanDescription(doc.content)}`;
        } else {
            // For section headers or other types with just a title and optional description
            markdownContent = `# ${doc.title}\n\n`;
            if (doc.description) {
                markdownContent += `${cleanDescription(doc.description)}\n\n`;
            }
        }

        // Write to file
        fs.writeFileSync(filename, markdownContent);
        console.log(`Created: ${filename}`);

        // Recursively process child sections if any
        if (doc.sections && doc.sections.length > 0) {
            convertDocsToMarkdown(doc.sections);
        }
    }
}

/**
 * Convert an endpoint document to markdown.
 * This handles OpenAPI endpoint definitions.
 * @param {object} doc - The documentation item of type 'endpoint'.
 * @returns {string} The Markdown content for the endpoint.
 */
function convertEndpointToMarkdown(doc) {
    let markdown = `# ${doc.title || 'Untitled Endpoint'}\n\n`;

    // Method and path
    if (doc.method && doc.path) {
        markdown += `\`${doc.method.toUpperCase()}\` \`${doc.path}\`\n\n`;
    }

    // Summary/Description
    if (doc.definition && doc.definition.summary) {
        markdown += `${cleanDescription(doc.definition.summary)}\n\n`;
    } else if (doc.description) {
        markdown += `${cleanDescription(doc.description)}\n\n`;
    }

    // Parameters section
    if (doc.definition && doc.definition.parameters && doc.definition.parameters.length > 0) {
        markdown += `## Parameters\n\n`;

        const pathParams = doc.definition.parameters.filter(p => p.in === 'path');
        const queryParams = doc.definition.parameters.filter(p => p.in === 'query');
        const headerParams = doc.definition.parameters.filter(p => p.in === 'header');
        const cookieParams = doc.definition.parameters.filter(p => p.in === 'cookie');

        if (pathParams.length > 0) {
            markdown += `### Path Parameters\n\n`;
            markdown += renderParametersTable(pathParams);
        }
        if (queryParams.length > 0) {
            markdown += `### Query Parameters\n\n`;
            markdown += renderParametersTable(queryParams);
        }
        if (headerParams.length > 0) {
            markdown += `### Header Parameters\n\n`;
            markdown += renderParametersTable(headerParams);
        }
        if (cookieParams.length > 0) {
            markdown += `### Cookie Parameters\n\n`;
            markdown += renderParametersTable(cookieParams);
        }
    }

    // Request body
    if (doc.definition && doc.definition.requestBody) {
        markdown += `## Request Body\n\n`;

        const requestBody = doc.definition.requestBody;
        if (requestBody.description) {
            markdown += `${cleanDescription(requestBody.description)}\n\n`;
        }

        const content = requestBody.content;
        if (content) {
            for (const mediaType in content) {
                if (content.hasOwnProperty(mediaType) && content[mediaType].schema) {
                    markdown += `### Content Type: \`${mediaType}\`\n\n`;
                    // Call renderSchema to process the request body schema
                    markdown += renderSchema(content[mediaType].schema, 0);
                }
            }
        }
    }

    // Responses
    if (doc.definition && doc.definition.responses) {
        markdown += `## Responses\n\n`;

        for (const [code, response] of Object.entries(doc.definition.responses)) {
            markdown += `### ${code} - ${response.description || 'No description'}\n\n`;

            if (response.content) {
                for (const mediaType in response.content) {
                    if (response.content.hasOwnProperty(mediaType) && response.content[mediaType].schema) {
                        markdown += `#### Content Type: \`${mediaType}\`\n\n`;
                        // Call renderSchema to process the response schema
                        markdown += renderSchema(response.content[mediaType].schema, 1);
                    }
                }
            }
        }
    }

    // Examples
    const examples = doc.definition && doc.definition['x-oaiMeta'] && doc.definition['x-oaiMeta'].examples;
    if (examples) {
        markdown += `## Examples\n\n`;

        // Request examples
        if (examples.request) {
            markdown += `### Request Examples\n\n`;
            for (const [lang, example] of Object.entries(examples.request)) {
                markdown += `#### ${lang}\n\`\`\`${getLangForCodeBlock(lang)}\n${example}\n\`\`\`\n\n`;
            }
        }

        // Response example
        if (examples.response) {
            markdown += `### Response Example\n\n`;
            markdown += `\`\`\`json\n${typeof examples.response === 'string' ? examples.response : JSON.stringify(examples.response, null, 2)}\n\`\`\`\n\n`;
        }
    }

    return markdown;
}

/**
 * Convert an object definition to markdown with improved handling of complex structures.
 * This handles OpenAPI schema definitions.
 * @param {object} doc - The documentation item containing a definition.
 * @returns {string} The Markdown content for the definition.
 */
function convertDefinitionToMarkdown(doc) {
    let markdown = `# ${doc.title || 'Untitled Definition'}\n\n`;

    // Add description
    if (doc.definition && doc.definition.description) {
        markdown += `${cleanDescription(doc.definition.description)}\n\n`;
    } else if (doc.content) {
        markdown += `${cleanDescription(doc.content)}\n\n`;
    }

    // Schema properties (main object properties)
    if (doc.definition && doc.definition.properties) {
        markdown += `## Properties\n\n`;
        markdown += renderPropertiesTable(doc.definition.properties, doc.definition.required || []);

        // Add detailed property descriptions for better AI readability
        markdown += `\n## Property Details\n\n`;
        for (const [name, prop] of Object.entries(doc.definition.properties)) {
            const required = doc.definition.required && doc.definition.required.includes(name) ? ' (required)' : '';
            markdown += `### \`${name}\`${required}\n\n`;

            if (prop.description) {
                markdown += `${cleanDescription(prop.description)}\n\n`;
            }

            markdown += `**Type**: ${getTypeString(prop)}\n\n`;

            if (prop.enum) {
                markdown += `**Allowed values**: ${prop.enum.map(v => `\`${v}\``).join(', ')}\n\n`;
            }

            if (prop.nullable) {
                markdown += `**Nullable**: Yes\n\n`;
            }

            // If a property itself is an object with properties, reference its nested properties.
            // The main `renderPropertiesTable` already shows them in the table.
            if (prop.type === 'object' && prop.properties && Object.keys(prop.properties).length > 0) {
                markdown += `**Nested Properties**:\n\n`;
                markdown += `* ` + Object.keys(prop.properties).map(p => `\`${p}\``).join(', ') + `\n\n`;
            }
        }
    }

    // If there are additional schemas embedded within this definition (e.g., for complex nested structures)
    if (doc.definition && doc.definition.schemas) {
        for (const [schemaName, schema] of Object.entries(doc.definition.schemas)) {
            markdown += `## ${schemaName}\n\n`;
            markdown += renderSchema(schema); // Recursively render schema
        }
    }

    // Example if available
    const example = doc.example || (doc.definition && doc.definition['x-oaiMeta'] && doc.definition['x-oaiMeta'].example);
    if (example) {
        markdown += `## Example\n\n`;
        markdown += `\`\`\`json\n${typeof example === 'string' ? example : JSON.stringify(example, null, 2)}\n\`\`\`\n\n`;
    }

    return markdown;
}

/**
 * Render parameters as a markdown table
 * @param {Array<object>} parameters - An array of parameter objects.
 * @returns {string} Markdown table string.
 */
function renderParametersTable(parameters) {
    let markdown = `| Name | Type | Required | Description |\n`;
    markdown += `| ---- | ---- | -------- | ----------- |\n`;

    for (const param of parameters) {
        const name = param.name || '';
        const type = param.schema ? getTypeString(param.schema) : '';
        const required = param.required ? 'Yes' : 'No';
        const description = cleanDescription(param.description || '');

        markdown += `| \`${name}\` | ${type} | ${required} | ${description} |\n`;
    }

    markdown += '\n';
    return markdown;
}

/**
 * Render schema properties as a markdown table with support for nested properties.
 * Includes columns for Default and Allowed Values (Enums).
 * @param {object} properties - The properties object from a schema.
 * @param {string[]} requiredProps - An array of required property names.
 * @param {number} indent - Current indentation level for nested properties.
 * @returns {string} Markdown table string.
 */
function renderPropertiesTable(properties, requiredProps = [], indent = 0) {
    let markdown = '';

    // Add header for the initial call to this function
    if (indent === 0) {
        markdown = `| Property | Type | Required | Default | Allowed Values | Description |\n`;
        markdown += `| -------- | ---- | -------- | ------- | -------------- | ----------- |\n`;
    }

    for (const [name, prop] of Object.entries(properties)) {
        const type = getTypeString(prop); // This already handles array of type, oneOf, anyOf, allOf
        const required = requiredProps.includes(name) ? 'Yes' : 'No';
        const description = cleanDescription(prop.description || '');

        // Format default value if present
        const defaultValue = (prop.default !== undefined && prop.default !== null) ?
            `\`${typeof prop.default === 'object' ? JSON.stringify(prop.default) : prop.default}\`` : '';

        // Format allowed values (enums) if present
        const allowedValues = prop.enum ?
            prop.enum.map(v => `\`${v}\``).join(', ') : '';

        // Add indentation for nested properties
        const indentation = indent > 0 ? '  '.repeat(indent) + '↳ ' : '';

        markdown += `| ${indentation}\`${name}\` | ${type} | ${required} | ${defaultValue} | ${allowedValues} | ${description} |\n`;

        // If this property has nested properties, render them recursively within the same table
        if (prop.properties && Object.keys(prop.properties).length > 0) {
            const nestedTable = renderPropertiesTable(prop.properties, prop.required || [], indent + 1);
            // Remove the header from the recursively generated table for seamless embedding
            const nestedRows = nestedTable.split('\n').slice(2).join('\n');
            markdown += nestedRows;
        } else if (prop.type === 'object' && prop.additionalProperties) {
            // Handle objects with additionalProperties (e.g., maps)
            markdown += `| ${indentation}  ↳ (additional properties) | ${getTypeString(prop.additionalProperties)} | - | - | - | Additional properties of this object |\n`;
        }
    }

    // Add a separate section for array item properties if the items have properties
    for (const [name, prop] of Object.entries(properties)) {
        if (prop.type === 'array' && prop.items) {
            if (prop.items.properties && Object.keys(prop.items.properties).length > 0) {
                markdown += `\n\n### Items in \`${name}\` array\n\n`;
                markdown += renderPropertiesTable(prop.items.properties, prop.items.required || []);
            } else if (prop.items.type) {
                // For arrays of primitive types or simple references, add a short note
                const itemTypeString = getTypeString(prop.items);
                const itemDescription = prop.items.description ? ` - ${cleanDescription(prop.items.description)}` : '';
                const itemEnum = prop.items.enum ? `. Allowed values: ${prop.items.enum.map(v => `\`${v}\``).join(', ')}` : '';
                const itemDefault = (prop.items.default !== undefined && prop.items.default !== null) ?
                    `. Default: \`${typeof prop.items.default === 'object' ? JSON.stringify(prop.items.default) : prop.items.default}\`` : '';

                if (itemEnum || itemDefault || itemDescription) {
                    markdown += `\n\n### Items in \`${name}\` array\n\n`;
                    markdown += `Each item is of type \`${itemTypeString}\`${itemEnum}${itemDefault}${itemDescription}\n\n`;
                }
            }
        }
    }

    return markdown;
}

/**
 * Render a schema object with improved handling of nested structures.
 * @param {object} schema - The schema object to render.
 * @param {number} level - Current heading level for nested schemas.
 * @returns {string} Markdown content for the schema.
 */
function renderSchema(schema, level = 0) {
    let markdown = '';

    // Determine the appropriate heading level
    const headingLevel = Math.min(level + 3, 6); // Start from '###' for sub-schemas

    if (schema.title) {
        markdown += `${'#'.repeat(headingLevel)} ${schema.title}\n\n`;
    }

    if (schema.type === 'object') {
        markdown += `**Type**: ${getTypeString(schema)}\n\n`;
    } else if (schema.type) {
        markdown += `**Type**: \`${schema.type}\`\n\n`;
    }


    if (schema.description) {
        markdown += `${cleanDescription(schema.description)}\n\n`;
    }

    // For objects with properties
    if (schema.properties && Object.keys(schema.properties).length > 0) {
        markdown += `#### Properties:\n\n`; // Sub-heading for properties
        markdown += renderPropertiesTable(schema.properties, schema.required || []);
    }

    // For arrays
    if (schema.type === 'array' && schema.items) {
        markdown += `**Array of:**\n\n`;
        markdown += renderSchema(schema.items, level + 1); // Recurse for item schema
    }

    // For oneOf, anyOf, allOf (composition schemas)
    if (schema.oneOf) {
        markdown += `**One of the following:**\n\n`;
        schema.oneOf.forEach((subSchema, index) => {
            markdown += `${'#'.repeat(headingLevel + 1)} Option ${index + 1}:\n\n`;
            markdown += renderSchema(subSchema, level + 1);
        });
    }

    if (schema.anyOf) {
        markdown += `**Any of the following:**\n\n`;
        schema.anyOf.forEach((subSchema, index) => {
            markdown += `${'#'.repeat(headingLevel + 1)} Option ${index + 1}:\n\n`;
            markdown += renderSchema(subSchema, level + 1);
        });
    }

    if (schema.allOf) {
        markdown += `**All of the following:**\n\n`;
        schema.allOf.forEach((subSchema, index) => {
            markdown += `${'#'.repeat(headingLevel + 1)} Part ${index + 1}:\n\n`;
            markdown += renderSchema(subSchema, level + 1);
        });
    }

    // If there's an example specified directly in the schema, render it
    const example = schema.example || (schema['x-oaiMeta'] && schema['x-oaiMeta'].example);
    if (example) {
        markdown += `**Example:**\n\n\`\`\`json\n${typeof example === 'string' ? example : JSON.stringify(example, null, 2)}\n\`\`\`\n\n`;
    }

    return markdown;
}

/**
 * Get human-readable type string from schema
 * @param {object} schema - The schema object.
 * @returns {string} A string representing the type.
 */
function getTypeString(schema) {
    if (!schema) return '';

    if (schema.type === 'array') {
        if (schema.items) {
            const itemType = getTypeString(schema.items);
            return `array of ${itemType}`;
        }
        return 'array';
    }

    if (schema.type === 'object') {
        if (schema['x-oaiTypeLabel']) {
            return schema['x-oaiTypeLabel'];
        }
        if (schema.additionalProperties) {
            const propType = getTypeString(schema.additionalProperties);
            return `object (map of ${propType})`;
        }
        if (schema.properties) {
            const propCount = Object.keys(schema.properties).length;
            return `object (${propCount} ${propCount === 1 ? 'property' : 'properties'})`;
        }
        return 'object';
    }

    if (schema.enum) {
        // For the main type string, if it's an enum, list its base type then enum values might be in "Allowed Values" column
        return schema.type || 'string'; // Or another base type if known
    }

    if (schema.oneOf) {
        const types = schema.oneOf.map(s => getTypeString(s)).filter(Boolean);
        return `oneOf: ${types.join(' | ')}`;
    }

    if (schema.anyOf) {
        const types = schema.anyOf.map(s => getTypeString(s)).filter(Boolean);
        return `anyOf: ${types.join(' | ')}`;
    }

    if (schema.allOf) {
        return 'allOf'; // Indicates a combination of all listed schemas
    }

    if (schema['x-oaiTypeLabel']) {
        return schema['x-oaiTypeLabel'];
    }

    // If no specific type, return whatever is available
    return schema.type || 'unknown';
}

/**
 * Clean up description text for markdown.
 * Replaces common HTML tags with Markdown equivalents.
 * @param {string} text - The description text.
 * @returns {string} Cleaned text.
 */
function cleanDescription(text) {
    if (!text) return '';

    // Replace common HTML tags with markdown equivalents
    text = text
        .replace(/<code>(.*?)<\/code>/g, '`$1`')
        .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
        .replace(/<em>(.*?)<\/em>/g, '*$1*')
        .replace(/<br\s*\/?>/g, '\n'); // Convert <br> to newline

    return text;
}

/**
 * Get the appropriate language identifier for code blocks
 * @param {string} lang - The original language identifier.
 * @returns {string} The mapped language for Markdown code blocks.
 */
function getLangForCodeBlock(lang) {
    const langMap = {
        'curl': 'bash',
        'node.js': 'javascript',
        'python': 'python',
        'csharp': 'csharp',
        'json': 'json' // Ensure JSON is explicitly handled
    };

    return langMap[lang.toLowerCase()] || lang;
}

/**
 * Special case for handling complex object structures that are not part of the main 'docs'
 * but are defined separately (e.g., in verboseJsonConverter-improved.js).
 */
function handleSpecialObjects() {
    console.log('Processing special complex objects...');

    // Add your special object structures here. These are manually defined and not part of 'docs'.
    const specialObjects = [
        {
            "title": "The transcription object (Verbose JSON)",
            "description": "Represents a verbose json transcription response returned by model, based on the provided input.",
            "outputPath": "audio/verbose-json-object.md",
            "structure": {
                "duration": {
                    "type": "number",
                    "description": "The duration of the input audio."
                },
                "language": {
                    "type": "string",
                    "description": "The language of the input audio."
                },
                "text": {
                    "type": "string",
                    "description": "The transcribed text."
                },
                "segments": {
                    "type": "array",
                    "description": "Segments of the transcribed text and their corresponding details.",
                    "items": {
                        "type": "object",
                        "properties": {
                            "id": { "type": "integer", "description": "The segment ID." },
                            "seek": { "type": "integer", "description": "The seek position." },
                            "start": { "type": "number", "description": "The start time of the segment." },
                            "end": { "type": "number", "description": "The end time of the segment." },
                            "text": { "type": "string", "description": "The transcribed text segment." },
                            "tokens": { "type": "array", "description": "Token IDs for the segment.", "items": { "type": "integer" } },
                            "temperature": { "type": "number", "description": "The temperature used for generation." },
                            "avg_logprob": { "type": "number", "description": "The average log probability of the segment." },
                            "compression_ratio": { "type": "number", "description": "The compression ratio." },
                            "no_speech_prob": { "type": "number", "description": "The probability of no speech in the segment." }
                        }
                    }
                },
                "words": {
                    "type": "array",
                    "description": "Extracted words and their corresponding timestamps.",
                    "items": {
                        "type": "object",
                        "properties": {
                            "word": { "type": "string", "description": "The individual word." },
                            "start": { "type": "number", "description": "The start time of the word." },
                            "end": { "type": "number", "description": "The end time of the word." },
                            "confidence": { "type": "number", "description": "Confidence score for the word recognition." }
                        }
                    }
                }
            },
            "example": {
                "task": "transcribe",
                "language": "english",
                "duration": 8.470000267028809,
                "text": "The beach was a popular spot on a hot summer day. People were swimming in the ocean, building sandcastles, and playing beach volleyball.",
                "segments": [
                    {
                        "id": 0, "seek": 0, "start": 0.0, "end": 3.319999933242798,
                        "text": " The beach was a popular spot on a hot summer day.",
                        "tokens": [50364, 440, 7534, 390, 257, 3743, 4008, 322, 257, 2368, 4266, 786, 13, 50530],
                        "temperature": 0.0, "avg_logprob": -0.2860786020755768, "compression_ratio": 1.2363636493682861, "no_speech_prob": 0.00985979475080967
                    }
                ]
            }
        }
        // Add more special objects as needed
    ];

    // Process each special object
    for (const obj of specialObjects) {
        const markdown = generateSpecialObjectMarkdown(obj);
        const outputFile = path.join(OUTPUT_DIR, obj.outputPath);

        // Create directory if it doesn't exist
        fs.mkdirSync(path.dirname(outputFile), { recursive: true });

        // Write to file
        fs.writeFileSync(outputFile, markdown);
        console.log(`Created special object documentation: ${outputFile}`);
    }
}

/**
 * Generate markdown for special complex objects.
 * This function is tailored for the `specialObjects` structure, not general OpenAPI schemas.
 * @param {object} objectStructure - The definition of the special object.
 * @returns {string} Markdown content.
 */
function generateSpecialObjectMarkdown(objectStructure) {
    let markdown = '';

    // Title and description
    markdown += `# ${objectStructure.title}\n\n`;

    if (objectStructure.description) {
        markdown += `${objectStructure.description}\n\n`;
    }

    // Properties section
    markdown += `## Properties\n\n`;

    // Main properties table
    markdown += '| Property | Type | Description |\n';
    markdown += '|----------|------|-------------|\n';

    // Add all top-level properties to the main table
    for (const [name, prop] of Object.entries(objectStructure.structure)) {
        markdown += `| **\`${name}\`** | ${prop.type || ''} | ${prop.description || ''} |\n`;
    }

    markdown += '\n';

    // Now add detailed sections for array properties with complex item structures
    for (const [name, prop] of Object.entries(objectStructure.structure)) {
        if (prop.type === 'array' && prop.items && prop.items.properties) {
            markdown += `### Items in \`${name}\` array\n\n`;
            markdown += '| Property | Type | Description |\n';
            markdown += '|----------|------|-------------|\n';

            // Add each property of the array items
            for (const [itemName, itemProp] of Object.entries(prop.items.properties)) {
                const itemType = itemProp.type || '';
                markdown += `| **\`${itemName}\`** | ${itemType} | ${itemProp.description || ''} |\n`;
            }

            markdown += '\n';
        }
    }

    // Example section
    if (objectStructure.example) {
        markdown += `## Example\n\n`;
        markdown += '```json\n';
        markdown += JSON.stringify(objectStructure.example, null, 2);
        markdown += '\n```\n\n';
    }

    return markdown;
}

// --- Start the conversion process ---
try {
    // Process regular API documentation from openai-docs-reference.js
    convertDocsToMarkdown(docs);

    // Process special, hardcoded complex objects if needed
    // Uncomment the line below if you intend to process the `specialObjects` array.
    handleSpecialObjects();

    console.log('Documentation conversion complete!');
} catch (error) {
    console.error('Error during conversion:', error);
}

// Export functions for testing and reuse (optional)
module.exports = {
    convertDocsToMarkdown,
    convertEndpointToMarkdown,
    convertDefinitionToMarkdown,
    renderParametersTable,
    renderPropertiesTable,
    renderSchema,
    getTypeString,
    cleanDescription,
    getLangForCodeBlock,
    handleSpecialObjects, // Exported if needed for external calls/testing
    generateSpecialObjectMarkdown // Exported if needed for external calls/testing
};