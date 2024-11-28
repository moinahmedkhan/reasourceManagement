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
exports.ResourcesController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const resources_service_1 = require("./resources.service");
const path = require("path");
const uuid_1 = require("uuid");
let ResourcesController = class ResourcesController {
    constructor(resourcesService) {
        this.resourcesService = resourcesService;
    }
    async uploadFile(file, userId) {
        if (!file) {
            throw new common_1.BadRequestException('File is required');
        }
        const url = await this.resourcesService.saveFile(file.filename, userId);
        return { url };
    }
    async getFile(filename, res) {
        const fileContent = await this.resourcesService.getFileContent(filename);
        if (!fileContent) {
            throw new common_1.BadRequestException('Link expired, you cannot access this file.');
        }
        const filePath = path.join(__dirname, '../../uploads', filename);
        return res.download(filePath, filename);
    }
    async getResourcesByStatus(status, page = 1, pageSize = 10) {
        if (!status) {
            throw new common_1.BadRequestException('Status is required.');
        }
        if (!['active', 'expired'].includes(status)) {
            throw new common_1.BadRequestException('Invalid status. Valid statuses are "active" and "expired".');
        }
        return await this.resourcesService.fetchResourcesByStatus(status, page, pageSize);
    }
    async getResourceById(id) {
        if (!id) {
            throw new common_1.BadRequestException('ID is required.');
        }
        const resource = await this.resourcesService.fetchResourceById(id);
        if (!resource) {
            throw new common_1.NotFoundException(`Resource with ID ${id} not found.`);
        }
        return resource;
    }
    async deleteResourceById(body) {
        const { id } = body;
        if (!id) {
            throw new common_1.BadRequestException('ID is required.');
        }
        const resource = await this.resourcesService.deleteResourceById(id);
        if (!resource) {
            throw new common_1.NotFoundException(`Resource with ID ${id} not found.`);
        }
        return { message: 'Resource deleted successfully.' };
    }
    async fetchResources(status, page = 1, pageSize = 10) {
        if (status && !['active', 'expired'].includes(status)) {
            throw new common_1.BadRequestException('Invalid status. Valid statuses are "active" or "expired".');
        }
        const validStatus = status;
        const resources = await this.resourcesService.fetchResourcesByStatusOrAll(validStatus, page, pageSize);
        if (!resources.length) {
            throw new common_1.NotFoundException('No resources found.');
        }
        return resources;
    }
};
exports.ResourcesController = ResourcesController;
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, cb) => {
                const uniqueSuffix = (0, uuid_1.v4)();
                const ext = path.extname(file.originalname);
                cb(null, `${uniqueSuffix}${ext}`);
            },
        }),
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], ResourcesController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Get)(':filename'),
    __param(0, (0, common_1.Param)('filename')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ResourcesController.prototype, "getFile", null);
__decorate([
    (0, common_1.Post)('fetch-by-status'),
    __param(0, (0, common_1.Body)('status')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('pageSize')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], ResourcesController.prototype, "getResourcesByStatus", null);
__decorate([
    (0, common_1.Post)('id'),
    __param(0, (0, common_1.Body)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ResourcesController.prototype, "getResourceById", null);
__decorate([
    (0, common_1.Delete)('delete'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ResourcesController.prototype, "deleteResourceById", null);
__decorate([
    (0, common_1.Post)('fetchAllResources'),
    __param(0, (0, common_1.Body)('status')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('pageSize')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], ResourcesController.prototype, "fetchResources", null);
exports.ResourcesController = ResourcesController = __decorate([
    (0, common_1.Controller)('resources'),
    __metadata("design:paramtypes", [resources_service_1.ResourcesService])
], ResourcesController);
//# sourceMappingURL=resources.controller.js.map