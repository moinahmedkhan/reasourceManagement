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
exports.ResourcesService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const promises_1 = require("fs/promises");
const path = require("path");
const resource_entity_1 = require("./entities/resource.entity");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const user_entity_1 = require("../user/user.entity/user.entity");
let ResourcesService = class ResourcesService {
    constructor(resourceRepository, userRepository) {
        this.resourceRepository = resourceRepository;
        this.userRepository = userRepository;
    }
    async saveFile(filename, userId) {
        const expirationTime = new Date(Date.now() + 30 * 60 * 1000);
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new Error(`User with ID ${userId} not found.`);
        }
        const resource = this.resourceRepository.create({
            user,
            resource_url: `http://localhost:3000/resources/${filename}`,
            expiration_time: expirationTime,
            status: 'active',
        });
        await this.resourceRepository.save(resource);
        return resource.resource_url;
    }
    async isUrlExpired(filename) {
        const resource = await this.resourceRepository.findOne({
            where: { resource_url: `http://localhost:3000/resources/${filename}` },
        });
        if (!resource) {
            return true;
        }
        return Date.now() > resource.expiration_time.getTime();
    }
    async getFileContent(filename) {
        const isExpired = await this.isUrlExpired(filename);
        if (isExpired) {
            return null;
        }
        const filePath = path.join(__dirname, '../../uploads', filename);
        return (0, promises_1.readFile)(filePath);
    }
    async handleFileExpiration() {
        const now = new Date();
        const expiredResources = await this.resourceRepository.find({
            where: { expiration_time: (0, typeorm_1.LessThan)(now) },
        });
        for (const resource of expiredResources) {
            resource.status = 'expired';
            await this.resourceRepository.save(resource);
        }
    }
    async fetchResourcesByStatus(status, page = 1, pageSize = 10) {
        const [resources] = await this.resourceRepository.findAndCount({
            where: { status },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
        if (resources.length === 0) {
            throw new common_1.NotFoundException(`No resources found with status ${status}.`);
        }
        return resources;
    }
    async fetchResourceById(id) {
        const resource = await this.resourceRepository.findOne({ where: { id } });
        return resource;
    }
    async deleteResourceById(id) {
        const resource = await this.resourceRepository.findOne({ where: { id } });
        if (!resource) {
            return null;
        }
        await this.resourceRepository.remove(resource);
        return resource;
    }
    async fetchResourcesByStatusOrAll(status, page = 1, pageSize = 10) {
        const resources = await this.resourceRepository.findAndCount({
            where: status ? { status } : {},
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
        return resources[0];
    }
};
exports.ResourcesService = ResourcesService;
__decorate([
    (0, schedule_1.Cron)('*/5 * * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ResourcesService.prototype, "handleFileExpiration", null);
exports.ResourcesService = ResourcesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(resource_entity_1.Resource)),
    __param(1, (0, typeorm_2.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository])
], ResourcesService);
//# sourceMappingURL=resources.service.js.map