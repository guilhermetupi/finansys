import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Category } from '../shared/category.model';
import { CategoryService } from '../shared/category.service';

import { switchMap } from 'rxjs/operators';

import toaster from 'toastr';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss'],
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {
  currentAction: string;
  category: Category;
  categoryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: Array<string> = null;
  submittingForm = false;

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.setCurrentAction();
    this.buildCategoryForm();
    this.loadCategory();
  }

  ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  submitForm(): void {
    this.submittingForm = true;

    if (this.currentAction === 'new') {
      this.createNewCategory();
    } else {
      this.updateCategory();
    }
  }

  private setCurrentAction(): void {
    this.route.snapshot.url[0].path === 'new' ? (this.currentAction = 'new') : (this.currentAction = 'edit');
  }

  private buildCategoryForm(): void {
    this.categoryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
    });
  }

  private loadCategory(): void {
    if (this.currentAction === 'edit') {
      this.route.paramMap.pipe(switchMap(params => this.categoryService.getById(+params.get('id')))).subscribe(
        category => {
          this.category = category;
          this.categoryForm.patchValue(category);
        },
        error => alert('Ocorreu um erro no servidor, tente mais tarde por favor')
      );
    }
  }

  private setPageTitle(): void {
    if (this.currentAction === 'new') {
      this.pageTitle = 'Cadastro de nova categoria';
    } else {
      const categoryName = this.category?.name || '';
      this.pageTitle = 'Editando categoria: ' + categoryName;
    }
  }

  private createNewCategory(): void {
    const category: Category = {
      name: this.categoryForm.get('name').value,
      description: this.categoryForm.get('description').value,
    };

    this.categoryService.create(category).subscribe(
      // tslint:disable-next-line: no-shadowed-variable
      category => this.success(category),
      error => this.error(error)
    );
  }

  private updateCategory(): void {
    const category: Category = {
      id: +this.route.snapshot.url[0].path,
      name: this.categoryForm.get('name').value,
      description: this.categoryForm.get('description').value,
    };

    this.categoryService.update(category).subscribe(
      // tslint:disable-next-line: no-shadowed-variable
      category => this.success(category),
      error => this.error(error)
    );
  }

  private success(category: Category): void {
    toaster.success('Categoria cadastrada com sucesso');
    this.router
      .navigateByUrl('/categories', { skipLocationChange: true })
      .then(() => this.router.navigate(['/categories', category.id, 'edit']));
  }

  private error(error: any): void {
    toaster.error('Ocorreu um erro ao relizar sua solicitação.');
    this.submittingForm = false;

    error.status === 422
      ? (this.serverErrorMessages = JSON.parse(error._body).errors)
      : (this.serverErrorMessages = ['Ocorreu um erro na comunicação com o servidor, tente mais tarde por favor']);
  }
}
