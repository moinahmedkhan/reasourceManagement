import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
  Res,
  BadRequestException,
  Body,
  NotFoundException,
  Delete,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ResourcesService } from './resources.service';
import { Response } from 'express';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Resource } from './entities/resource.entity';

@Controller('resources')
export class ResourcesController {
  rabbitMQProducerService: any;
  constructor(private readonly resourcesService: ResourcesService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = uuidv4();
          const ext = path.extname(file.originalname);
          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('userId') userId: number,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    const url = await this.resourcesService.saveFile(file.filename, userId);

    return { url };
  }

  @Get(':filename')
  async getFile(@Param('filename') filename: string, @Res() res: Response) {
    const fileContent = await this.resourcesService.getFileContent(filename);
    if (!fileContent) {
      throw new BadRequestException(
        'Link expired, you cannot access this file.',
      );
    }

    const filePath = path.join(__dirname, '../../uploads', filename);
    return res.download(filePath, filename);
  }

  @Post('fetch-by-status')
  async getResourcesByStatus(
    @Body('status') status: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ): Promise<Resource[]> {
    if (!status) {
      throw new BadRequestException('Status is required.');
    }

    if (!['active', 'expired'].includes(status)) {
      throw new BadRequestException(
        'Invalid status. Valid statuses are "active" and "expired".',
      );
    }

    return await this.resourcesService.fetchResourcesByStatus(
      status as 'active' | 'expired',
      page,
      pageSize,
    );
  }

  @Post('id')
  async getResourceById(@Body('id') id: number): Promise<Resource> {
    if (!id) {
      throw new BadRequestException('ID is required.');
    }

    const resource = await this.resourcesService.fetchResourceById(id);
    if (!resource) {
      throw new NotFoundException(`Resource with ID ${id} not found.`);
    }

    return resource;
  }

  @Delete('delete')
  async deleteResourceById(@Body() body: { id: number }) {
    const { id } = body;

    if (!id) {
      throw new BadRequestException('ID is required.');
    }

    const resource = await this.resourcesService.deleteResourceById(id);
    if (!resource) {
      throw new NotFoundException(`Resource with ID ${id} not found.`);
    }

    return { message: 'Resource deleted successfully.' };
  }

  @Post('fetchAllResources')
  async fetchResources(
    @Body('status') status?: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ): Promise<Resource[]> {
    if (status && !['active', 'expired'].includes(status)) {
      throw new BadRequestException(
        'Invalid status. Valid statuses are "active" or "expired".',
      );
    }

    const validStatus = status as 'active' | 'expired' | undefined;

    const resources = await this.resourcesService.fetchResourcesByStatusOrAll(
      validStatus,
      page,
      pageSize,
    );

    if (!resources.length) {
      throw new NotFoundException('No resources found.');
    }

    return resources;
  }
}
