import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Chat } from './chat.entity';

export enum MessageType {
  USER = 'user',
  AI = 'ai'
}

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column({
    type: 'enum',
    enum: MessageType,
    default: MessageType.USER
  })
  type: MessageType;

  @Column({ type: 'json', nullable: true })
  metadata: any; // For source citations, etc.

  @CreateDateColumn()
  timestamp: Date;

  @ManyToOne(() => Chat, chat => chat.messages)
  chat: Chat;

  @Column()
  chatId: number;
} 