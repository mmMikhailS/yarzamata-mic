import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { registrationUserDto } from './dto/authDto/registrationUserDto.dto';
import { loginDto } from './dto/authDto/login.dto';
import { changePassDto } from './dto/authDto/changePass.dto';
import { AuthMiddleware } from './middleware/auth.middleware';
import { ApiExcludeEndpoint, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterResponses } from './responses/authResponses/register.response';
import { LoginResponses } from './responses/authResponses/login.response';
import { ChangePasswordResponses } from './responses/authResponses/changePassword.response';
import { RefreshResponses } from './responses/authResponses/refresh.response';
import { ActivateAccountResponses } from './responses/authResponses/activateAccount.response';
import { AuthGatewayService } from './authGateway.service';

@Controller('/auth')
export class AuthGatewayController {
  constructor(private authGatewayService: AuthGatewayService) {}

  @ApiTags('Authorization')
  @ApiOperation({ summary: 'Register a new user' })
  @RegisterResponses()
  @Post('/register')
  async registration(@Body() dto: registrationUserDto, @Res() res: any) {
    try {
      const registered: any = await this.authGatewayService.register(dto);
      res
        .setHeader('authorization', `Bearer ${registered.tokens.refreshToken}`)
        .cookie('refreshToken', registered.tokens.refreshToken, {
          httpOnly: true,
          maxAge: 3600000,
        })
        .json(registered);
    } catch (e) {
      res.status(400).json({ message: e.message, e });
    }
  }

  @ApiTags('Authorization')
  @ApiExcludeEndpoint()
  @Get('login')
  getLogin() {
    return 'login';
  }

  @ApiTags('Authorization')
  @ApiOperation({ summary: 'login user' })
  @LoginResponses()
  @Post('login')
  async login(@Body() dto: loginDto, @Res() res: any) {
    try {
      const login: any = await this.authGatewayService.login(dto);
      res
        .setHeader('authorization', `Bearer ${login.tokens.refreshToken}`)
        .cookie('refreshToken', login.tokens.refreshToken, {
          httpOnly: true,
          maxAge: 3600000,
        })
        .json(login);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  @ApiTags('Authorization')
  @ApiExcludeEndpoint()
  @Get('changePassword')
  getChangePassword() {
    return 'changePassword';
  }

  @ApiTags('Authorization')
  @ApiOperation({ summary: 'Change password' })
  @ChangePasswordResponses()
  @Post('changePassword')
  @UseGuards(AuthMiddleware)
  @ApiOperation({ summary: 'change password' })
  async changePassword(@Body() dto: changePassDto, @Res() res: any) {
    try {
      const changedPassword = await this.authGatewayService.changePassword(dto);
      res.json(changedPassword);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  @ApiTags('Authorization')
  @ApiOperation({ summary: 'refresh tokens' })
  @RefreshResponses()
  @UseGuards(AuthMiddleware)
  @Post('refresh')
  async refresh(@Req() req: any, @Res() res: any) {
    try {
      const refreshToken = req.cookies['authorization'];
      const refreshed = await this.authGatewayService.refresh(refreshToken);
      res.json(refreshed);
      // .setHeader('Authorization', `Bearer ${refreshed.tokens.refreshToken}`)
      // .cookie('refreshToken', refreshed.tokens.refreshToken, {
      //   httpOnly: true,
      //   maxAge: 3600000,
      // })
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  @ApiTags('Authorization')
  @ApiExcludeEndpoint()
  @Get('activate')
  getActivateAccount() {
    return 'activate';
  }

  @ApiTags('Authorization')
  @ActivateAccountResponses()
  @Post('activate/') // :link
  @UseGuards(AuthMiddleware)
  @ApiOperation({ summary: 'activate user' })
  async activateAccount(
    @Body() code: string,
    @Req() req: any,
    @Res() res: any,
  ) {
    try {
      const refreshToken = req.cookies['refreshToken'];
      const data = { code, refreshToken };
      const activatedAccount =
        await this.authGatewayService.activateAccount(data);
      res.json(activatedAccount);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }
}
