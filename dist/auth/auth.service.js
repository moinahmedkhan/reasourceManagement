"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcryptjs");
const user_entity_1 = require("../user/user.entity/user.entity");
const user_service_1 = require("../user/user.service");
let AuthService = class AuthService {
    constructor(usersRepository, jwtService, userService) {
        this.usersRepository = usersRepository;
        this.jwtService = jwtService;
        this.userService = userService;
    }
    async validateUser(loginData) {
        const user = await this.userService.findByUsername(loginData.username);
        if (user && (await bcrypt.compare(loginData.password, user.password))) {
            return user;
        }
        return null;
    }
    async login(user) {
        const payload = { username: user.username, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
    async register(registerDto) {
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const newUser = this.userService.createUser({
            username: registerDto.username,
            password: hashedPassword,
            role: user_entity_1.UserRole.USER,
        });
        return newUser;
    }
    async registerAdmin(registerDto) {
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const newUser = this.userService.createUser({
            username: registerDto.username,
            password: hashedPassword,
            role: user_entity_1.UserRole.ADMIN,
        });
        return newUser;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        user_service_1.UserService])
], AuthService);
//# sourceMappingURL=auth.service.js.map