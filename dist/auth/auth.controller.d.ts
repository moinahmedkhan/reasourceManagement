import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<import("../user/user.entity/user.entity").User>;
    login(loginData: LoginDto): Promise<{
        access_token: string;
    }>;
}
