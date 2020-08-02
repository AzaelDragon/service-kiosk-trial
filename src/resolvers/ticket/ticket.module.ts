import { TicketResolver } from "./ticket.resolver";
import { Module } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import { TicketService } from "src/services/ticket.service";

@Module({
  providers: [TicketResolver, TicketService, PrismaService]
})
export class TicketModule {}