import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RateTicketDto {
  @ApiProperty({
    description: 'The CUID of the ticket to rate.',
  })
  ticketId: string;

  @ApiProperty({
    description: 'The rating to set for the service.',
    minimum: 0,
    maximum: 5,
  })
  rating: number;

  @ApiPropertyOptional({
    description: 'Additional information for the rating.',
  })
  ratingExtra: string;
}
