import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class RequestService {
  private user: { login: string; email: string };

  setUser(user: { login: string; email: string }) {
    this.user = user;
  }

  getUser() {
    return this.user;
  }
}
