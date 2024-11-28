import { UserRole } from '../user.entity/user.entity';
export declare class CreateUserDto {
    username: string;
    password: string;
    role: UserRole;
}
