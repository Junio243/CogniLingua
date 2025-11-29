import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('v1')
export class V1Controller {
  @Get()
  redirectToDocs(@Res() res: Response) {
    return res.redirect('/v1/docs');
  }
}
