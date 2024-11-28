import { Injectable, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Injectable()
export class FileProcessingWorker {
  private readonly logger = new Logger(FileProcessingWorker.name);

  @EventPattern('file-uploaded')
  async handleFileUploaded(@Payload() data: any) {
    try {
      this.logger.log(`Received file-uploaded event: ${JSON.stringify(data)}`);

      await this.processFile(data);

      this.logger.log(`File processing completed for: ${data.fileName}`);
    } catch (error) {
      this.logger.error('Error processing file-uploaded event:', error);
      throw error;
    }
  }

  private async processFile(data: any) {
    this.logger.log(`Processing file: ${data.fileName}`);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    this.logger.log(`File processed: ${data.fileName}`);
  }
}
