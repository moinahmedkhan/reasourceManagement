import { Resource } from 'src/resources/entities/resource.entity';
export declare enum UserRole {
    ADMIN = "admin",
    USER = "user"
}
export declare class User {
    id: number;
    username: string;
    password: string;
    role: UserRole;
    resources: Resource[];
    createdAt: Date;
    updatedAt: Date;
}
