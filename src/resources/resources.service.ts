import { Injectable, NotFoundException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { readFile } from 'fs/promises';
import * as path from 'path';
import { Resource } from './entities/resource.entity';
import { LessThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity/user.entity';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(Resource)
    private readonly resourceRepository: Repository<Resource>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async saveFile(filename: string, userId: number): Promise<string> {
    const expirationTime = new Date(Date.now() + 30 * 60 * 1000); // Expire in 30 minutes

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

  async isUrlExpired(filename: string): Promise<boolean> {
    const resource = await this.resourceRepository.findOne({
      where: { resource_url: `http://localhost:3000/resources/${filename}` },
    });

    if (!resource) {
      return true;
    }

    return Date.now() > resource.expiration_time.getTime();
  }

  async getFileContent(filename: string): Promise<Buffer | null> {
    const isExpired = await this.isUrlExpired(filename);
    if (isExpired) {
      return null;
    }

    const filePath = path.join(__dirname, '../../uploads', filename);
    return readFile(filePath);
  }

  @Cron('*/5 * * * * *')
  async handleFileExpiration() {
    const now = new Date();
    const expiredResources = await this.resourceRepository.find({
      where: { expiration_time: LessThan(now) },
    });

    for (const resource of expiredResources) {
      resource.status = 'expired';
      await this.resourceRepository.save(resource);
    }
  }

  async fetchResourcesByStatus(
    status: 'active' | 'expired',
    page: number = 1,
    pageSize: number = 10,
  ): Promise<Resource[]> {
    const [resources] = await this.resourceRepository.findAndCount({
      where: { status },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    if (resources.length === 0) {
      throw new NotFoundException(`No resources found with status ${status}.`);
    }

    return resources;
  }

  async fetchResourceById(id: number): Promise<Resource | null> {
    const resource = await this.resourceRepository.findOne({ where: { id } });
    return resource;
  }

  async deleteResourceById(id: number): Promise<Resource | null> {
    const resource = await this.resourceRepository.findOne({ where: { id } });
    if (!resource) {
      return null;
    }

    await this.resourceRepository.remove(resource);
    return resource;
  }

  async fetchResourcesByStatusOrAll(
    status?: 'active' | 'expired',
    page: number = 1,
    pageSize: number = 10,
  ): Promise<Resource[]> {
    const resources = await this.resourceRepository.findAndCount({
      where: status ? { status } : {},
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return resources[0];
  }
}
