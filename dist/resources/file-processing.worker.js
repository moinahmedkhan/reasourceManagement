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
var FileProcessingWorker_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileProcessingWorker = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
let FileProcessingWorker = FileProcessingWorker_1 = class FileProcessingWorker {
    constructor() {
        this.logger = new common_1.Logger(FileProcessingWorker_1.name);
    }
    async handleFileUploaded(data) {
        try {
            this.logger.log(`Received file-uploaded event: ${JSON.stringify(data)}`);
            await this.processFile(data);
            this.logger.log(`File processing completed for: ${data.fileName}`);
        }
        catch (error) {
            this.logger.error('Error processing file-uploaded event:', error);
            throw error;
        }
    }
    async processFile(data) {
        this.logger.log(`Processing file: ${data.fileName}`);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        this.logger.log(`File processed: ${data.fileName}`);
    }
};
exports.FileProcessingWorker = FileProcessingWorker;
__decorate([
    (0, microservices_1.EventPattern)('file-uploaded'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FileProcessingWorker.prototype, "handleFileUploaded", null);
exports.FileProcessingWorker = FileProcessingWorker = FileProcessingWorker_1 = __decorate([
    (0, common_1.Injectable)()
], FileProcessingWorker);
//# sourceMappingURL=file-processing.worker.js.map