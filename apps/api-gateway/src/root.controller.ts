import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { DOCS_URL } from './docs.config';
import { Public } from './auth/decorators/public.decorator';

@Controller()
export class RootController {
  @Public()
  @Get()
  redirectToApi(@Res() res: Response) {
    return res.redirect(DOCS_URL);
  }
}