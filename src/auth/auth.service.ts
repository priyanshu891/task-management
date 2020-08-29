import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { AuthCredentialDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepo: UserRepository,
        private jwtService: JwtService
    ) { }

    signUp(authCredentialsDto: AuthCredentialDto): Promise<void> {
        return this.userRepo.signUp(authCredentialsDto);
    }

    async signIn(authCredentialsDto: AuthCredentialDto): Promise<{ accessToken: string }> {
        const username = await this.userRepo.validateUserPassword(authCredentialsDto);
        if (!username) {
            throw new UnauthorizedException('Invalid Credentials');
        }
        const payload: JwtPayload = { username };
        const accessToken = await this.jwtService.sign(payload);

        return { accessToken }
    }
}
