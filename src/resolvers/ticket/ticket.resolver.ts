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

@Resolver((of) => Ticket)
export class TicketResolver {
  constructor(
    private prisma: PrismaService,
    private ticketService: TicketService,
  ) {}

  @Query((returns) => [Ticket])
  async tickets() {
    return await this.ticketService.findAllTickets();
  }

  @Query((returns) => Ticket)
  async ticket(@Args() args: TicketIdArgs) {
    return await this.ticketService.findTicket(args);
  }

  @Query((returns) => [Ticket])
  async clientTickets(@Args() args: UserIdArgs) {
    const test = await this.ticketService.findClientTickets(args);
    console.log(test);
    return test;
  }

  @Query((returns) => [Ticket])
  async technicianTickets(@Args() args: UserIdArgs) {
    return await this.ticketService.findTechnicianTickets(args);
  }

  @Mutation((returns) => Ticket)
  async createTicket(@Args('createTicketData') data: CreateTicketInput) {
    return await this.ticketService.createTicket(data);
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
