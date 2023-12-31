import {
    Body,
    Controller, Delete,
    Get,
    Inject,
    Param,
    Post,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import {ClientProxy} from "@nestjs/microservices";
import {AdminGuard, AuthGuard} from "@app/shared";
import {lastValueFrom} from "rxjs";
import {CreateUserRequestDto} from "../dto/CreateUserRequest.dto";

@Controller("users")
@UseGuards(AuthGuard)
export class UserHttpController {
    constructor(
        @Inject("AUTH_SERVICE")
        private readonly authService: ClientProxy,
    ) {
    }

    @Get()
    async getAllUsers() {
        try {
            const res = this.authService.send({cmd: "get-all-users"}, {})
            return await lastValueFrom(res)
        } catch (e) {
            console.log(e)
            return e
        }
    }

    @Get(":id")
    async getUserById(
        @Param("id") id: number
    ) {
        try {
            const res = this.authService.send({cmd: "get-user-by-id"}, id)
            return await lastValueFrom(res)
        } catch (e) {
            console.log(e);
            return e;
        }
    }

    @UseGuards(AdminGuard)
    @Post()
    async createUser(
        @Body() dto: CreateUserRequestDto
    ) {
        try {
            const res = this.authService.send({cmd: "create-user"}, dto)
            return await lastValueFrom(res)
        } catch (e) {
            console.log(e)
            return e
        }
    }

    @UseGuards(AdminGuard)
    @Delete(":id")
    async deleteUser(
        @Param("id") id: number
    ) {
        try {
            const res = this.authService.send({cmd: "delete-user"}, id)
            return await lastValueFrom(res)
        } catch (e) {
            console.log(e)
            return e
        }
    }
}
