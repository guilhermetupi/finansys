import { Component, OnInit } from '@angular/core';

import { CategoryService } from '../shared/category.service';
import { Category } from '../shared/category.model';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
})
export class CategoryListComponent implements OnInit {
  categories: Array<Category> = [];

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.categoryService.getAll().subscribe(
      categories => {
        this.categories = categories;
      },
      error => {
        console.log('Erro ao carregar a lista.');
      }
    );
  }

  deleteCategory(id: number): void {
    const mustDelete = confirm('Tem certeza que deseja excluir este categoria?');
    if (mustDelete) {
      this.categoryService.delete(id).subscribe(
        () => (this.categories = this.categories.filter(c => c.id !== id)),
        () => console.log('Erro ao excluir categoria.')
      );
    }
  }
}
