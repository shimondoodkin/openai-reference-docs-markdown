// types.ts

/**
 * Base properties for any documentation item.
 */
export interface BaseDoc {
    id?: string;
    type: string; // "endpoint", "generated", "objectgroup", "object", "enum", "section", etc.
    title: string;
    url: string;
    relativeUrl?: string;
    navigationGroup?: string;
    description?: string;
    sections?: DocItem[]; // Recursive definition
    indent?: number; // Used by objectgroup and possibly others
    content?: string; // For documents with direct markdown content
}

/**
 * Represents an OpenAPI Schema object.
 * This is a recursive definition to handle nested schemas and various OpenAPI schema keywords.
 */
export interface SchemaObject {
    type?: 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object';
    format?: string;
    title?: string;
    description?: string;
    properties?: { [key: string]: SchemaObject };
    items?: SchemaObject; // For array type
    required?: string[];
    enum?: (string | number | boolean | null)[];
    default?: any;
    nullable?: boolean;
    readOnly?: boolean;
    writeOnly?: boolean;
    deprecated?: boolean;
    // Composition keywords
    oneOf?: SchemaObject[];
    anyOf?: SchemaObject[];
    allOf?: SchemaObject[];
    // Additional properties for objects (e.g., for map types)
    additionalProperties?: SchemaObject | boolean;
    // Custom OpenAPI extensions
    'x-oaiTypeLabel'?: string;
    'x-oaiMeta'?: {
        name?: string;
        group?: string;
        example?: any; // The example might be a string (JSON string) or an object
    };
    // Direct example for a schema
    example?: any;
}

/**
 * Represents a single parameter in an endpoint definition.
 */
export interface ParameterObject {
    name: string;
    in: 'query' | 'header' | 'path' | 'cookie';
    description?: string;
    required?: boolean;
    deprecated?: boolean;
    allowEmptyValue?: boolean;
    style?: string;
    explode?: boolean;
    schema?: SchemaObject;
    examples?: { [key: string]: any }; // Example values for the parameter
}

/**
 * Represents the content for a specific media type in a request/response body.
 */
export interface MediaTypeObject {
    schema?: SchemaObject;
    examples?: { [key: string]: any };
    encoding?: { [key: string]: any }; // Placeholder for encoding details
}

/**
 * Defines a single response from an endpoint.
 */
export interface ResponseObject {
    description: string;
    headers?: { [key: string]: SchemaObject }; // Headers schema
    content?: { [mediaType: string]: MediaTypeObject };
    links?: { [key: string]: any }; // Placeholder for links
}

/**
 * Defines all possible responses for an endpoint.
 */
export interface ResponsesObject {
    [statusCode: string]: ResponseObject; // e.g., '200', '404', 'default'
}

/**
 * Custom metadata for an OpenAPI endpoint definition.
 */
export interface XOAIEndpointMeta {
    name?: string;
    group?: string;
    returns?: string;
    examples?: {
        request?: { [lang: string]: string }; // e.g., 'curl', 'node.js'
        response?: string | object;
    };
}

/**
 * The core definition object for an endpoint (operation).
 */
export interface EndpointDefinition {
    summary?: string;
    description?: string;
    operationId?: string;
    tags?: string[];
    parameters?: ParameterObject[];
    requestBody?: RequestBodyObject;
    responses?: ResponsesObject;
    deprecated?: boolean;
    security?: { [key: string]: string[] }[]; // Placeholder for security
    'x-oaiMeta'?: XOAIEndpointMeta;
}

/**
 * Documentation item representing an API endpoint.
 */
export interface EndpointDoc extends BaseDoc {
    type: "endpoint";
    method: string; // 'get', 'post', 'put', 'delete', etc.
    path: string; // Full path e.g., '/realtime/transcription_sessions'
    definition: EndpointDefinition;
}

/**
 * Documentation item representing a standalone schema definition (e.g., an object model).
 */
export interface DefinitionDoc extends BaseDoc {
    type: "object" | "enum" | "definition"; // Explicitly defined object/enum schemas
    definition: SchemaObject; // The actual schema definition
    example?: any; // Top-level example for a definition
}

/**
 * Documentation item for a direct content page (e.g., an overview or a generated section).
 */
export interface ContentDoc extends BaseDoc {
    type: "generated" | "section";
    content: string; // Direct markdown content
}

/**
 * Documentation item for an object group, typically acts as a navigational folder.
 */
export interface ObjectGroupDoc extends BaseDoc {
    type: "objectgroup";
    indent?: number; // From the example, it has an indent property
}

// Union type for all possible documentation items.
export type DocItem = EndpointDoc | DefinitionDoc | ContentDoc | ObjectGroupDoc;

/**
 * Interface for the structure of special hardcoded objects.
 * Used in `handleSpecialObjects` function for custom documentation.
 */
export interface SpecialObjectSchemaProp {
    type: string;
    description: string;
    properties?: { [key: string]: SpecialObjectSchemaProp };
    items?: {
        type: string;
        properties?: { [key: string]: SpecialObjectSchemaProp };
    };
}

export interface SpecialObjectDoc {
    title: string;
    description: string;
    outputPath: string; // Path relative to OUTPUT_DIR
    structure: { [key: string]: SpecialObjectSchemaProp };
    example: any;
}