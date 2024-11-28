import { ResourcesService } from './resources.service';
import { Response } from 'express';
import { Resource } from './entities/resource.entity';
export declare class ResourcesController {
    private readonly resourcesService;
    rabbitMQProducerService: any;
    constructor(resourcesService: ResourcesService);
    uploadFile(file: Express.Multer.File, userId: number): Promise<{
        url: string;
    }>;
    getFile(filename: string, res: Response): Promise<void>;
    getResourcesByStatus(status: string, page?: number, pageSize?: number): Promise<Resource[]>;
    getResourceById(id: number): Promise<Resource>;
    deleteResourceById(body: {
        id: number;
    }): Promise<{
        message: string;
    }>;
    fetchResources(status?: string, page?: number, pageSize?: number): Promise<Resource[]>;
}
