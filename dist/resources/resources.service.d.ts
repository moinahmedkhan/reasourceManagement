import { Resource } from './entities/resource.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity/user.entity';
export declare class ResourcesService {
    private readonly resourceRepository;
    private readonly userRepository;
    constructor(resourceRepository: Repository<Resource>, userRepository: Repository<User>);
    saveFile(filename: string, userId: number): Promise<string>;
    isUrlExpired(filename: string): Promise<boolean>;
    getFileContent(filename: string): Promise<Buffer | null>;
    handleFileExpiration(): Promise<void>;
    fetchResourcesByStatus(status: 'active' | 'expired', page?: number, pageSize?: number): Promise<Resource[]>;
    fetchResourceById(id: number): Promise<Resource | null>;
    deleteResourceById(id: number): Promise<Resource | null>;
    fetchResourcesByStatusOrAll(status?: 'active' | 'expired', page?: number, pageSize?: number): Promise<Resource[]>;
}
