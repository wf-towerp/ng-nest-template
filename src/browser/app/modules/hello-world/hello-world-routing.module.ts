import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HelloWorldComponent } from './views/hello-world/hello-world.component';

const routes: Routes = [
    {
        path: '',
        component: HelloWorldComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HelloWorldRoutingModule { }
