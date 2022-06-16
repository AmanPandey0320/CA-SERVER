import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "login_attempts" })
class LoginAttempt {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  email!: string;

  @Column({ nullable: true })
  username!: string;

  @Column()
  sessionID!: string;

  @Column({
    name: "attempt_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  attemptAt!: string;

  @Column({ nullable: false, default: false })
  valid!: boolean;
}

export default LoginAttempt;
