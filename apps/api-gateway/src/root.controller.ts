import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { DOCS_URL } from './docs.config';

@Controller()
export class RootController {
  @Get()
  redirectToApi(@Res() res: Response) {
    return res.redirect(DOCS_URL);
  }
}