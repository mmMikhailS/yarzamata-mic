"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServiceModule = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const app_controller_1 = require("./app.controller");
const jwt_1 = require("@nestjs/jwt");
const user_repository_1 = require("./repository/user.repository");
const activate_repository_1 = require("./repository/activate.repository");
const token_service_1 = require("./services/token.service");
const token_repository_1 = require("./repository/token.repository");
const prisma_service_1 = require("../prisma/prisma.service");
const config_1 = require("@nestjs/config");
const microservices_1 = require("@nestjs/microservices");
let AuthServiceModule = class AuthServiceModule {
};
exports.AuthServiceModule = AuthServiceModule;
exports.AuthServiceModule = AuthServiceModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                secret: process.env.SECRET_KEY,
            }),
            microservices_1.ClientsModule.registerAsync([
                {
                    name: 'AUTH_SERVICE',
                    imports: [config_1.ConfigModule],
                    inject: [config_1.ConfigService],
                    useFactory: (configService) => ({
                        transport: microservices_1.Transport.KAFKA,
                        options: {
                            client: {
                                clientId: configService.get('CLIENT_AUTH_ID') || 'auth-service',
                                brokers: [
                                    configService.get('KAFKA_BROKER') || 'localhost:9092',
                                ],
                            },
                            producerOnlyMode: true,
                            consumer: {
                                groupId: configService.get('CONSUMER_AUTH_ID') ||
                                    'auth-response',
                            },
                        },
                    }),
                },
            ]),
        ],
        controllers: [],
        providers: [
            app_controller_1.AppController,
            app_service_1.AppService,
            user_repository_1.UserRepository,
            activate_repository_1.ActivateRepository,
            token_service_1.TokenService,
            token_repository_1.TokenRepository,
            prisma_service_1.PrismaService,
        ],
        exports: [app_controller_1.AppController],
    })
], AuthServiceModule);
//# sourceMappingURL=app.module.js.map