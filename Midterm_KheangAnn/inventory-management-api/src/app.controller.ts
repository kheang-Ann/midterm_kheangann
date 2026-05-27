import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Health')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Health check' })
  getHealth(): { status: string; message: string } {
    return {
      status: 'ok',
      message: 'Inventory Management API is running',
    };
  }
}
