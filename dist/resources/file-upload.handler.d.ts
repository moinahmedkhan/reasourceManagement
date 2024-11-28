import { ClientProxy } from '@nestjs/microservices';
export declare class FileUploadHandler {
    private readonly client;
    private readonly logger;
    constructor(client: ClientProxy);
    publishFileUploadedEvent(data: any): Promise<void>;
}
