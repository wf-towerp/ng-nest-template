import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnonymousGuard, AuthorizedGuard } from '@app/core/guards';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: '/home/dashboard',
            },
            {
                path: 'hello-world',
                loadChildren: () => import('./modules/hello-world/hello-world.module').then(m => m.HelloWorldModule),
            },
            {
                path: 'home',
                loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule),
                canActivate: [AuthorizedGuard]
            },
            {
                path: 'auth',
                loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule),
                canActivate: [AnonymousGuard]
            },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        initialNavigation: 'enabledNonBlocking'
    })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
