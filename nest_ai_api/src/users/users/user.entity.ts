import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsEmail } from 'class-validator';
import { Entity,  Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserEntity {
    @ApiProperty()
    @Expose()
    @PrimaryGeneratedColumn()
    id: number;

    @IsEmail()
    @ApiProperty()
    @Expose()
    @Column({unique: true} )
    email: string;

    @Exclude()
    @Column({unique: true} )
    normalizedEmail: string;

    @ApiProperty()
    @Expose()
    @Column({} )
    walletAddress: string;

    @Exclude()
    @Column({} )
    walletSecret: string;
}
