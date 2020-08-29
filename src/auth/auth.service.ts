import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { AuthCredentialDto } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
    constructor(@InjectRepository(UserRepository) private userRepo: UserRepository) { }

    signUp(authCredentialsDto: AuthCredentialDto): Promise<void> {
        return this.userRepo.signUp(authCredentialsDto);
    }

    async signIn(authCredentialsDto: AuthCredentialDto) {
        const username = await this.userRepo.validateUserPassword(authCredentialsDto);
        if (!username) {
            throw new UnauthorizedException('Invalid Credentials');
        }
    }
}
