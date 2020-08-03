import {
  Controller,
  Get,
  Param,
  UseInterceptors,
  ClassSerializerInterceptor,
  SerializeOptions,
  Post,
  Body,
} from '@nestjs/common';
import { TicketService } from 'src/services/ticket.service';
import { Ticket } from '@prisma/client';
import { UserService } from 'src/services/user.service';
import { RateTicketDto } from 'src/models/dto/ticket.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller()
export class TicketController {
  constructor(
    private readonly ticketService: TicketService,
    private readonly userService: UserService,
  ) {}

  @ApiTags('Tickets')
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('ticket/:id')
  async getTicket(@Param('id') id: string) {
    return await this.ticketService.findTicket({ ticketId: id });
  }

  @ApiTags('People')
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('user/:id')
  async getUser(@Param('id') id: string) {
    const user = await this.userService.findUser(parseInt(id));
    delete user.password;
    return user;
  }

  @ApiTags('Daily Worklist')
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('user/:id/worklist')
  async getTodayWorklist(@Param('id') id: string) {
    return await this.ticketService.findWorkList(
      parseInt(id),
      new Date(Date.now()),
    );
  }

  @ApiTags('Daily Worklist')
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('user/:id/worklist/:date')
  async getSpecificWorklist(
    @Param('id') id: string,
    @Param('date') date: string,
  ) {
    return await this.ticketService.findWorkList(parseInt(id), new Date(date));
  }

  @ApiTags('Tickets')
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('user/:id/created')
  async getCreatedTickets(@Param('id') id: string) {
    return await this.ticketService.findClientTickets(parseInt(id));
  }

  @ApiTags('Tickets')
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('user/:id/assigned')
  async getAssignedtickets(@Param('id') id: string) {
    return await this.userService.findUser(parseInt(id));
  }

  @ApiTags('Tickets')
  @Post('/ticket/:id/rate')
  async rateTicket(@Body() rateTicketDto: RateTicketDto) {
    await this.ticketService.rateTicket(rateTicketDto);
    return 'Ticket rated successfully.';
  }
}
