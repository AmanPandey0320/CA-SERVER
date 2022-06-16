import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "user" })
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  username!: string;

  @Column({ nullable: false })
  password!: string;

  @Column({ nullable: true, default: false })
  active!: boolean;

  @Column({ nullable: false, unique: true })
  email!: string;

  @Column({ name: "email_verified", nullable: true, default: false })
  emailVerified!: boolean;

  @Column({
    name: "created_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt!: string;

  @Column({
    name: "deleted_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  deletedAt!: string;
}
