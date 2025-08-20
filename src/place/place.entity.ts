import { User } from 'src/auth/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Place {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  description: string;

  @Column()
  facilities: string;

  @Column({ unsigned: true })
  price: number;

  @Column({ default: false })
  isReserved: boolean;

  @Column()
  province: string;

  @Column()
  city: string;

  @Column()
  image: string;

  @ManyToOne((_type) => User, (user) => user.place, { eager: true })
  owner: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  UpdatedAt: Date;
}
