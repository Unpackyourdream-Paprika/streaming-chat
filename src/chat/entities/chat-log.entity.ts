import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'chat_log' })
export class ChatLogEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar' })
  roomId: string;

  @Column({ type: 'int' })
  userId: number;

  @Column({ type: 'text' })
  message: string;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;
}
