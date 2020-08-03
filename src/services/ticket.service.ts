import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CreateTicketInput } from 'src/models/inputs/create-ticket.input';
import { TicketStatus, UserRole } from '@prisma/client';
import { TicketIdArgs } from 'src/models/args/ticket-id.args';
import { UserIdArgs } from 'src/models/args/user-id.args';
import { Args } from '@nestjs/graphql';
import { Ticket } from 'src/models/ticket.model';

@Injectable()
export class TicketService {
  constructor(private prisma: PrismaService) {}

  async findAllTickets() {
    return this.prisma.ticket.findMany();
  }

  async findTicket(payload: TicketIdArgs) {
    return this.prisma.ticket.findOne({ where: { id: payload.ticketId } });
  }

  async findClientTickets(payload: UserIdArgs) {
    return this.prisma.user.findOne({ where: { id: payload.userId } })
      .clientTickets;
  }

  async findTechnicianTickets(payload: UserIdArgs) {
    return this.prisma.user.findOne({ where: { id: payload.userId } })
      .technicianTickets;
  }

  async createTicket(payload: CreateTicketInput) {
    const availableTechnicians = await this.prisma.user.count({
      where: { role: UserRole.TECHNICIAN },
    });

    const technician = await this.prisma.user.findOne({
      where: { id: Math.floor(Math.random() * availableTechnicians + 1) },
    });

    const queryData = {
      date: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      client: {
        connect: {
          id: payload.client,
        },
      },
      technician: {
        connect: {
          id: technician.id,
        },
      },
      status: TicketStatus.ASSIGNED,
      type: payload.type,
    };

    return this.prisma.ticket.create({ data: queryData });
  }

  async getClientFromTicket(ticket: Ticket) {
    return await this.prisma.ticket
      .findOne({ where: { id: ticket.id } })
      .client();
  }

  async getTechnicianFromTicket(ticket: Ticket) {
    return await this.prisma.ticket
      .findOne({ where: { id: ticket.id } })
      .technician();
  }
}
