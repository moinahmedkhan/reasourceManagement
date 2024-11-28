import { User } from '../../user/user.entity/user.entity';
export declare class Resource {
    id: number;
    user: User;
    resource_url: string;
    expiration_time: Date;
    status: 'active' | 'expired';
    created_at: Date;
    updated_at: Date;
}
