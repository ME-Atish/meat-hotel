import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AuthRole } from './auth-role.enum';
import { AuthProvider } from './auth-provider.enum';
import { Place } from 'src/place/place.entity';
import { Wallet } from 'src/wallet/walllet.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  password: string;

  @Column()
  phone: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: 'USER' })
  role: AuthRole;

  @Column({ default: false })
  isReserved: boolean;

  @Column({ default: false })
  isOwner: boolean;

  @Column({ default: false })
  isBan: boolean;

  @Column()
  refreshToken: string;

  @Column({ default: 'local' })
  provider: AuthProvider;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany((_type) => Place, (place) => place.owner, {
    eager: true,
    cascade: true,
  })
  place: Place;

  @OneToOne((_type) => Wallet, (wallet) => wallet.user, { cascade: true })
  wallet: Wallet;
}
