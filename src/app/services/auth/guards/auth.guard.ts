import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  let loggedIn = authService.loggedInSignal;

  if (!loggedIn()) {
    router.navigate([''])
    return false; //In case the navigate failed for any reason - we make sure the page will not be loaded
  }
  return true;
};
