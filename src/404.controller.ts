import { Controller, Get, NotFoundException } from '@nestjs/common';

@Controller()
export class NotFoundController {
  @Get('*')
  notFound() {
    throw new NotFoundException('Endpoint not found');
  }
}
