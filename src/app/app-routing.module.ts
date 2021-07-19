import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'categories',
    loadChildren: './views/categories/categories.module#CategoriesModule',
  },
  {
    path: 'entries',
    loadChildren: './views/entries/entries.module#EntriesModule',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
