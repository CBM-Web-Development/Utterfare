import { Component, HostListener } from '@angular/core';
import { SessionService } from './lib/services/session/session.service';
import { ISession } from './lib/interfaces/isession';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Utterfare';

  constructor(
    private sessionService: SessionService
  ){}

  @HostListener("window:beforeunload", ["event"])
  clearSession(event: BeforeUnloadEvent){
    const session: ISession = JSON.parse(localStorage.getItem("session") ?? '[]');

    this.sessionService.terminateSession(session);
    //localStorage.removeItem("sessionId");
    //localStorage.removeItem("session");
  }
}
