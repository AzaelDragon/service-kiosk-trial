import {
  Resolver,
  Query,
  Parent,
  Args,
  ResolveField,
  Mutation,
} from '@nestjs/graphql';
import { Ticket } from '../../models/ticket.model';
import { TicketIdArgs } from 'src/models/args/ticket-id.args';
import { CreateTicketInput } from 'src/models/inputs/create-ticket.input';
import { TicketService } from 'src/services/ticket.service';
import { PrismaService } from 'src/services/prisma.service';
import { UserIdArgs } from 'src/models/args/user-id.args';
import { UseGuards } from '@nestjs/common';
import { ApiAuthGuard } from 'src/guards/api-auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/models/user.model';
import { RequestTicketInput } from 'src/models/inputs/request-ticket.input';
import { RateTicketInput } from 'src/models/inputs/rate-ticket.input';

@Resolver((of) => Ticket)
export class TicketResolver {
  constructor(
    private prisma: PrismaService,
    private ticketService: TicketService,
  ) {}

  @UseGuards(ApiAuthGuard, RoleGuard)
  @Roles('ADMIN')
  @Query((returns) => [Ticket])
  async tickets() {
    return await this.ticketService.findAllTickets();
  }

  @UseGuards(ApiAuthGuard, RoleGuard)
  @Roles('ADMIN')
  @Query((returns) => Ticket)
  async ticket(@Args() args: TicketIdArgs) {
    return await this.ticketService.findTicket(args);
  }

  @UseGuards(ApiAuthGuard, RoleGuard)
  @Roles('ADMIN')
  @Query((returns) => [Ticket])
  async clientTickets(@Args() args: UserIdArgs) {
    const test = await this.ticketService.findClientTickets(args.userId);
    console.log(test);
    return test;
  }

  @UseGuards(ApiAuthGuard, RoleGuard)
  @Roles('ADMIN', 'TECHNICIAN', 'CLIENT')
  @Query((returns) => [Ticket])
  async createdTickets(@CurrentUser() user: User) {
    return await this.ticketService.findClientTickets(user.id);
  }

  @UseGuards(ApiAuthGuard, RoleGuard)
  @Roles('ADMIN')
  @Query((returns) => [Ticket])
  async technicianTickets(@Args() args: UserIdArgs) {
    return await this.ticketService.findTechnicianTickets(args.userId);
  }

  @UseGuards(ApiAuthGuard, RoleGuard)
  @Roles('ADMIN', 'TECHNICIAN', 'CLIENT')
  @Mutation((returns) => Ticket)
  async rateTicket(
    @CurrentUser() user: User,
    @Args('data') data: RateTicketInput,
  ) {
    return await this.ticketService.rateTicket(user, data);
  }

  @UseGuards(ApiAuthGuard, RoleGuard)
  @Roles('ADMIN')
  @Mutation((returns) => Ticket)
  async createTicket(@Args('data') data: CreateTicketInput) {
    return await this.ticketService.createTicket(data);
  }

  @UseGuards(ApiAuthGuard, RoleGuard)
  @Roles('ADMIN', 'TECHNICIAN', 'CLIENT')
  @Mutation((returns) => Ticket)
  async requestTicket(
    @CurrentUser() user: User,
    @Args('data') data: RequestTicketInput,
  ) {
    return await this.ticketService.createTicket({
      ...data,
      client: user.id,
    });
  }

  @UseGuards(ApiAuthGuard, RoleGuard)
  @Roles('ADMIN', 'TECHNICIAN')
  @Query((returns) => [Ticket])
  async assignedTickets(@CurrentUser() user: User) {
    return await this.ticketService.findTechnicianTickets(user.id);
  }

  @ResolveField()
  async client(@Parent() ticket: Ticket) {
    return await this.ticketService.getClientFromTicket(ticket);
  }

  @ResolveField()
  async technician(@Parent() ticket: Ticket) {
    return await this.ticketService.getTechnicianFromTicket(ticket);
  }
}
