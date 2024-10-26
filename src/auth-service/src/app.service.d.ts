import { UserRepository } from './repository/user.repository';
import { ActivateRepository } from './repository/activate.repository';
import { TokenService } from './services/token.service';
import { TokenRepository } from './repository/token.repository';
import { registrationUserDto } from './dto/authDto/registrationUserDto.dto';
import { loginDto } from './dto/authDto/login.dto';
import { changePassDto } from './dto/authDto/changePass.dto';
export declare class AppService {
    private userRepository;
    private activateRepository;
    private tokenService;
    private tokenRepository;
    constructor(userRepository: UserRepository, activateRepository: ActivateRepository, tokenService: TokenService, tokenRepository: TokenRepository);
    register(dto: registrationUserDto): Promise<any>;
    login(dto: loginDto): Promise<any>;
    refresh(refreshToken: string): Promise<any>;
    changePassword(dto: changePassDto): Promise<any>;
    activateAccount(code: any, refreshToken: string): Promise<{
        id: number;
        activationLink: string;
        isActivated: boolean;
    }>;
}
