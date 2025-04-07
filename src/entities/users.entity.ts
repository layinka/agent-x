import { IsNotEmpty, IsOptional } from 'class-validator';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '@interfaces/users.interface';

@Entity()
export class UserEntity extends BaseEntity implements User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  @Unique(['email'])
  email: string;

  // @Exclude()
  @Column({unique: true} )
  normalizedEmail: string;

  @Column({nullable:true})
  @IsOptional({})
  // @IsNotEmpty()
  password: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;


  

    // @ApiProperty()
    // @Expose()
    @Column({} )
    walletAddress: string;

    // @Exclude()
    @Column({} )
    walletSecret: string;
}
