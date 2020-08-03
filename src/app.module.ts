import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TicketModule } from './resolvers/ticket/ticket.module';
import { DateScalar } from './common/scalars/date.scalar';
import { AuthModule } from './resolvers/auth/auth.module';
import { TicketController } from './controllers/ticket.controller';
import { TicketService } from './services/ticket.service';
import { PrismaService } from './services/prisma.service';
import { UserService } from './services/user.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        autoSchemaFile:
          configService.get('GRAPHQL_SCHEMA_DEST') || './src/schema.graphql',
        debug: configService.get('GRAPHQL_DEBUG') === '1' ? true : false,
        playground:
          configService.get('PLAYGROUND_ENABLE') === '1' ? true : false,
        context: ({ req }) => ({ req }),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    TicketModule,
  ],
  controllers: [TicketController],
  providers: [DateScalar, UserService, TicketService, PrismaService],
})
export class AppModule {}
