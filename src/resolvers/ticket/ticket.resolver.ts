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
    return this.ticketService.findAllTickets();
  }

  @Query((returns) => Ticket)
  async ticket(@Args() id: TicketIdArgs) {
    return this.ticketService.findTicket(id);
  }

  @Query((returns) => [Ticket])
  async clientTickets(@Args() id: UserIdArgs) {
    return this.ticketService.findClientTickets(id);
  }

  @Query((returns) => [Ticket])
  async technicianTickets(@Args() id: UserIdArgs) {
    return this.ticketService.findTechnicianTickets(id);
  }

  @Mutation((returns) => Ticket)
  async createTicket(@Args('createTicketData') data: CreateTicketInput) {
    return this.ticketService.createTicket(data);
  }

  @ResolveField()
  async client(@Parent() ticket: Ticket) {
    const ovo = this.ticketService.getClientFromTicket(ticket);
    console.log(ovo);
    return ovo;
  }

  @ResolveField()
  async technician(@Parent() ticket: Ticket) {
    return this.ticketService.getTechnicianFromTicket(ticket);
  }
}
