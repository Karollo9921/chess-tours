import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class RequestService {
  private user: { login: string; id: string };

  setUser(user: { login: string; id: string }) {
    this.user = user;
  }

  getUser() {
    return this.user;
  }
}
