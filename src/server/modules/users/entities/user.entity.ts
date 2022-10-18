import { classToPlain, Exclude } from 'class-transformer';
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { IUser } from '../models';
import bcrypt from 'bcrypt';

@Entity({
    name: 'users'
})
export class UserEntity extends BaseEntity implements IUser {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        default: '',
    })
    name: string;

    @Column({
        default: '',
    })
    last_name: string;

    @Column({
        unique: true
    })
    email: string;

    @Exclude({
        toPlainOnly: true
    })
    @Column({
        default: '',
        nullable: true
    })
    password: string;

    @Exclude({
        toPlainOnly: true
    })
    @Column({
        default: '',
    })
    salt: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @Column({
        type: 'timestamp',
        nullable: true,
    })
    last_login: Date;

    @Column({
        type: 'timestamp',
        nullable: true,
    })
    prev_login: Date;

    serialize(): IUser {
        return classToPlain(this) as IUser;
    }

    async validatePassword(password: string): Promise<boolean> {
        const hash = await bcrypt.hash(password, this.salt);
        return hash === this.password;
    }

}
