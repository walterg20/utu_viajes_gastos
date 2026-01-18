import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true, name: 'photo_url' })
  photoUrl: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true, select: false })
  password: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
