import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Chat } from './chat.entity';

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fileName: string;

  @Column()
  fileType: string;

  @Column()
  fileSize: number;

  @Column({ type: 'text', nullable: true })
  extractedText: string;

  @Column({ default: false })
  isProcessed: boolean;

  @CreateDateColumn()
  uploadTimestamp: Date;

  @OneToMany(() => Chat, chat => chat.document)
  chats: Chat[];
} 