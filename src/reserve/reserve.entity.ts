import { User } from 'src/auth/user.entity';
import { Place } from 'src/place/place.entity';
import {
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Reserve {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne((_type) => Place, (place) => place.isReserved, {
    eager: true,
    cascade: true,
  })
  @JoinTable()
  place: Place;

  @ManyToOne((_type) => User, (user) => user.isReserved, {
    eager: true,
    cascade: true,
  })
  @JoinTable()
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
