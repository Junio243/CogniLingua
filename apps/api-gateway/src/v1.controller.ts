import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { DOCS_URL } from './docs.config';

@Controller('v1')
export class V1Controller {
  @Get()
  redirectToDocs(@Res() res: Response) {
    return res.redirect(DOCS_URL);
  }
}
