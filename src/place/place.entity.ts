import { User } from 'src/auth/user.entity';
import { Reserve } from 'src/reserve/reserve.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
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

  @Column({ nullable: true })
  image: string;

  @OneToMany(() => Reserve, (reserve) => reserve.place)
  reserves: Reserve[];

  @ManyToOne(() => User, (user) => user.places, { eager: false })
  owner: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
