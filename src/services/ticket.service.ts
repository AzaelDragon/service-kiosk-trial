import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CreateTicketInput } from '../models/inputs/create-ticket.input';
import { TicketStatus, UserRole } from '@prisma/client';
import { TicketIdArgs } from '../models/args/ticket-id.args';
import { Ticket } from '../models/ticket.model';
import { RateTicketInput } from '../models/inputs/rate-ticket.input';
import { User } from '../models/user.model';
import { UpdateTicketStatusInput } from 'src/models/inputs/update-ticket-status.input';

@Injectable()
export class TicketService {
  constructor(private prisma: PrismaService) {}

  async changeTicketStatus(payload: UpdateTicketStatusInput, user: User) {
    if (user.role !== UserRole.ADMIN) {
      const targetTicket = await this.prisma.ticket.findOne({
        where: { id: payload.ticketId },
      });
      if (user.id != targetTicket.technicianId) {
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error:
              'You can only update the status of a ticket that is assigned to you.',
          },
          HttpStatus.FORBIDDEN,
        );
      }
    }

    return this.prisma.ticket.update({
      data: {
        status: payload.status,
      },
      where: {
        id: payload.ticketId,
      },
    });
  }

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

  async findWorkList(technicianId: number, date: Date) {
    const baseDate = date.toISOString().substr(0, 10);
    const startDate = new Date(`${baseDate}T00:00:00.000Z`);
    const endDate = new Date(`${baseDate}T23:59:59.999Z`);
    return this.prisma.user
      .findOne({
        where: { id: technicianId },
      })
      .technicianTickets({
        where: {
          date: {
            gte: startDate,
            lt: endDate,
          },
        },
      });
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
      date: new Date(Date.now()).toISOString(),
      updatedAt: new Date(Date.now()).toISOString(),
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

    return await this.prisma.ticket.create({ data: queryData });
  }

  async getClientFromTicket(ticket: Ticket) {
    return this.prisma.ticket.findOne({ where: { id: ticket.id } }).client();
  }

  async getTechnicianFromTicket(ticket: Ticket) {
    return this.prisma.ticket
      .findOne({ where: { id: ticket.id } })
      .technician();
  }

  async rateTicket(payload: RateTicketInput, user?: User) {
    if (payload.rating < 0 || payload.rating > 5) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'A post can only be rated in a scale of 0 to 5',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (user) {
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
