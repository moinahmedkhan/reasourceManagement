import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity/user.entity';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private usersRepository;
    private jwtService;
    private userService;
    constructor(usersRepository: Repository<User>, jwtService: JwtService, userService: UserService);
    validateUser(loginData: LoginDto): Promise<User | null>;
    login(user: User): Promise<{
        access_token: string;
    }>;
    register(registerDto: RegisterDto): Promise<User>;
    registerAdmin(registerDto: RegisterDto): Promise<User>;
}
