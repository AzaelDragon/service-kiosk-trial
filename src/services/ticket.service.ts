import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CreateTicketInput } from 'src/models/inputs/create-ticket.input';
import { TicketStatus, UserRole } from '@prisma/client';
import { TicketIdArgs } from 'src/models/args/ticket-id.args';
import { Ticket } from 'src/models/ticket.model';
import { RateTicketInput } from 'src/models/inputs/rate-ticket.input';
import { User } from 'src/models/user.model';

@Injectable()
export class TicketService {
  constructor(private prisma: PrismaService) {}

  async findAllTickets() {
    return this.prisma.ticket.findMany();
  }

  async findTicket(payload: TicketIdArgs) {
    return this.prisma.ticket.findOne({ where: { id: payload.ticketId } });
  }

  async findClientTickets(id: number) {
    return this.prisma.user.findOne({ where: { id: id } }).clientTickets();
  }

  async findTechnicianTickets(id: number) {
    return this.prisma.user.findOne({ where: { id: id } }).technicianTickets();
  }

  async createTicket(payload: CreateTicketInput) {
    const availableTechnicians = await this.prisma.user.findMany({
      where: { role: 'TECHNICIAN' },
    });
    const technician =
      availableTechnicians[
        Math.floor(Math.random() * availableTechnicians.length)
      ];

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
    return this.prisma.ticket.findOne({ where: { id: ticket.id } }).client();
  }

  async getTechnicianFromTicket(ticket: Ticket) {
    return this.prisma.ticket
      .findOne({ where: { id: ticket.id } })
      .technician();
  }

  async rateTicket(user: User, payload: RateTicketInput) {
    if (user.role !== UserRole.ADMIN) {
      const targetTicket = await this.prisma.ticket.findOne({
        where: { id: payload.ticketId },
      });
      if (user.id != targetTicket.clientId) {
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error:
              "You can only rate a service ticket you've created yourself.",
          },
          HttpStatus.FORBIDDEN,
        );
      }
    }

    return this.prisma.ticket.update({
      data: {
        rating: payload.rating,
        ratingExtra: payload.ratingExtra ? payload.ratingExtra : null,
      },
      where: {
        id: payload.ticketId,
      },
    });
  }
}
