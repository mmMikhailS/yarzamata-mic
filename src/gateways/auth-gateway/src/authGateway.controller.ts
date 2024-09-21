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
import { catchError } from 'rxjs';

@Controller('auth')
export class AuthGatewayController {
  constructor(private authGatewayService: AuthGatewayService) {}

  @ApiTags('Authorization')
  @ApiExcludeEndpoint()
  @Get('register')
  get() {
    return this.authGatewayService.getRegister();
  }

  @ApiTags('Authorization')
  @ApiOperation({ summary: 'Register a new user' })
  @RegisterResponses()
  @Post('register')
  async registration(@Body() dto: registrationUserDto, @Res() res: any) {
    const registered$ = await this.authGatewayService.register(dto);
    registered$
      .pipe(
        catchError((e) => {
          res.status(400).json({ message: e.message });
          return [];
        }),
      )
      .subscribe((registered) => {
        res
          .setHeader(
            'Authorization',
            `Bearer ${registered.tokens.refreshToken}`,
          )
          .cookie('refreshToken', registered.tokens.refreshToken, {
            httpOnly: true,
            maxAge: 3600000,
          })
          .json(registered);
      });
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
    const login$ = await this.authGatewayService.login(dto);
    login$
      .pipe(
        catchError((e) => {
          res.status(400).json({ message: e.message });
          return [];
        }),
      )
      .subscribe((login) => {
        res
          .setHeader('Authorization', `Bearer ${login.tokens.refreshToken}`)
          .cookie('refreshToken', login.tokens.refreshToken, {
            httpOnly: true,
            maxAge: 3600000,
          })
          .json(login);
      });
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
    const changedPassword$ = await this.authGatewayService.changePassword(dto);
    changedPassword$
      .pipe(
        catchError((e) => {
          res.status(400).json({ message: e.message });
          return [];
        }),
      )
      .subscribe((changedPassword) => {
        res.json(changedPassword);
      });
  }

  @ApiTags('Authorization')
  @ApiExcludeEndpoint()
  @Get('refresh')
  getRefresh() {
    return 'activate';
  }

  @ApiTags('Authorization')
  @ApiOperation({ summary: 'refresh tokens' })
  @RefreshResponses()
  @UseGuards(AuthMiddleware)
  @Post('refresh')
  async refresh(@Req() req: any, @Res() res: any) {
    try {
      const refreshToken = req.cookies['refreshToken'];
      const refreshed$ = await this.authGatewayService.refresh(refreshToken);
      refreshed$
        .pipe(
          catchError((e) => {
            res.status(400).json({ message: e.message });
            return [];
          }),
        )
        .subscribe((refreshed) => {
          res
            .setHeader('Authorization', `Bearer ${refreshed.refreshToken}`)
            .cookie('refreshToken', refreshed.refreshToken, {
              httpOnly: true,
              maxAge: 3600000,
            })
            .json(refreshed);
        });
    } catch (e) {
      return e;
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
    const refreshToken = req.cookies['refreshToken'];
    const activatedAccount$ = await this.authGatewayService.activateAccount(
      code,
      refreshToken,
    );
    activatedAccount$
      .pipe(
        catchError((e) => {
          res.status(400).json({ message: e.message });
          return [];
        }),
      )
      .subscribe((activatedAccount) => {
        res.json(activatedAccount);
      });
  }
}
