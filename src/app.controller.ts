import { Controller, Get, Res } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getLogin(@Res() res): object {
    res.status(200);
    return res.redirect('/auth/login');
  }
}
