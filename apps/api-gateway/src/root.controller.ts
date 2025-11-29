import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class RootController {
  @Get()
  redirectToApi(@Res() res: Response) {
    return res.redirect('/v1');
  }
}
