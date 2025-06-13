export interface CrawlRequest {
    id: string;
    userId: string;
    url: string;
    formats: string[];
    jsonOptions?: {
        schema: {
            type: string;
            properties: Record<string, any>;
            required?: string[];
        };
    };
    status: 'pending' | 'processing' | 'completed' | 'failed';
    result?: any;
    error?: string;
    createdAt: Date;
    updatedAt: Date;
} 