import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";

@Injectable()
export class AtGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride(
      'isPublic', [
      context.getHandler(),
      context.getClass()
    ]
    );

    return (super.canActivate(context) as Promise<boolean>)
      .catch(error => {
        if(isPublic) return true;
        throw new UnauthorizedException();
      });
  }

}