import { Repository } from 'typeorm';
import { User } from './user.entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UserService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    createUser(createUserDto: CreateUserDto): Promise<User>;
    findById(id: number): Promise<User>;
    findByUsername(username: string): Promise<User>;
    updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User>;
}
