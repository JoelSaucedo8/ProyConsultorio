import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from './services/auth.service';
import { take } from 'rxjs/operators';

@Directive({
  selector: '[appHasRole]'
})
export class HasRoleDirective {
  @Input('appHasRole') set appHasRole(role: string) {
    this.authService.getUserRole().pipe(take(1)).subscribe(
      userRole => {
        if (userRole === role) {
          this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
          this.viewContainer.clear();
        }
      },
      error => {
        console.error('Error al obtener el rol del usuario:', error);
      }
    );
  }

  constructor(
    private authService: AuthService,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}
}
