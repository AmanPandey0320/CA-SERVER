import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "token" })
class Token {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  secret!: string;

  @Column({ nullable: true })
  email!: string;

  @Column({ nullable: true })
  username!: string;

  @Column({
    name: "attempt_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt!: string;

  @Column({ nullable: false, default: false })
  valid!: boolean;
}

export default Token;
