import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { User } from '../../user/user.entity/user.entity';

@Entity('fileStore')
@Index('IDX_USER_STATUS', ['user', 'status'])
@Index('IDX_EXPIRATION_TIME', ['expiration_time'])
export class Resource {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.resources)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 255 })
  resource_url: string;

  @Column({ type: 'datetime' })
  expiration_time: Date;

  @Column({
    type: 'enum',
    enum: ['active', 'expired'],
    default: 'active',
  })
  status: 'active' | 'expired';

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
