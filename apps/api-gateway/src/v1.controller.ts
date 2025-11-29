import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { DOCS_URL } from './docs.config'; // Importa a variável de configuração

@Controller()
export class RootController {
  @Get()
  redirectToApi(@Res() res: Response) {
    // Redireciona a raiz da aplicação para a URL de documentação configurada
    return res.redirect(DOCS_URL);
  }
}

@Controller('v1')
export class V1Controller {
  @Get()
  redirectToDocs(@Res() res: Response) {
    // Redireciona /v1 para a URL de documentação configurada
    return res.redirect(DOCS_URL);
  }
}