import { Repository, EntityRepository } from "typeorm";
import * as bcrypt from 'bcrypt'
import { User } from "./user.entity";
import { AuthCredentialDto } from "./dto/auth-credentials.dto";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async signUp(authCredentialsDto: AuthCredentialDto): Promise<void> {
        const { username, password } = authCredentialsDto;

        const user = new User();
        user.username = username;
        user.salt = await bcrypt.genSalt();
        user.password = await this.hashPassword(password, user.salt);

        try {
            await user.save();
        } catch (error) {
            if (error.code === '23505') {
                // duplicate username
                throw new ConflictException('Username Already Exists');
            } else {
                throw new InternalServerErrorException();
            }
        }

    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt)
    }

    async validateUserPassword(authCredentialsDto: AuthCredentialDto): Promise<string> {
        const { username, password } = authCredentialsDto;
        const user = await this.findOne({ username });

        if (user && await user.validatePassword(password)) {
            return user.username
        } else {
            return null;
        }

    }
}