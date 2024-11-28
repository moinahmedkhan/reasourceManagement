import { Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class FileUploadHandler {
  private readonly logger = new Logger(FileUploadHandler.name);

  constructor(private readonly client: ClientProxy) {}

  async publishFileUploadedEvent(data: any) {
    try {
      this.logger.log('Publishing file uploaded event to RabbitMQ...');

      await this.client.emit('file-uploaded', data).toPromise(); // Emit the event
      this.logger.log('File uploaded event published successfully.');
    } catch (error) {
      this.logger.error('Error publishing file uploaded event:', error);
    }
  }
}
