"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class changePassDto {
}
exports.changePassDto = changePassDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: " it's email" }),
    (0, class_validator_1.IsString)({ message: 'email is not a  string' }),
    (0, class_validator_1.IsEmail)({}, { message: 'email is not email' }),
    __metadata("design:type", String)
], changePassDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: " it's oldPassword" }),
    (0, class_validator_1.IsString)({ message: 'oldPassword is not a  string' }),
    __metadata("design:type", String)
], changePassDto.prototype, "oldPassword", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: " it's newPassword" }),
    (0, class_validator_1.IsString)({ message: 'newPassword is not a  string' }),
    __metadata("design:type", String)
], changePassDto.prototype, "newPassword", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: " it's acceptNewPassword" }),
    (0, class_validator_1.IsString)({ message: 'acceptNewPassword is not a  string' }),
    __metadata("design:type", String)
], changePassDto.prototype, "acceptNewPassword", void 0);
//# sourceMappingURL=changePass.dto.js.map