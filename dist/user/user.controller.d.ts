import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getUserById(req: any): Promise<import("./user.entity/user.entity").User>;
    updateUser(req: any, updateUserDto: UpdateUserDto): Promise<import("./user.entity/user.entity").User>;
}
