import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Entry } from '../shared/entry.model';
import { EntryService } from '../shared/entry.service';

import { switchMap } from 'rxjs/operators';

import toaster from 'toastr';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.scss'],
})
export class EntryFormComponent implements OnInit, AfterContentChecked {
  currentAction: string;
  entry: Entry;
  entryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: Array<string> = null;
  submittingForm = false;
  imaskConfig = {
    mask: Number,
    scale: 2,
    thousandSeparator: '',
    padFractionalZeros: true,
    normalizeZeros: true,
    radix: ',',
  };

  constructor(
    private entryService: EntryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.setCurrentAction();
    this.buildEntryForm();
    this.loadEntry();
  }

  ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  submitForm(): void {
    this.submittingForm = true;

    if (this.currentAction === 'new') {
      this.createNewEntry();
    } else {
      this.updateEntry();
    }
  }

  private setCurrentAction(): void {
    this.route.snapshot.url[0].path === 'new' ? (this.currentAction = 'new') : (this.currentAction = 'edit');
  }

  private buildEntryForm(): void {
    this.entryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid: [null, [Validators.required]],
      categoryId: [null, [Validators.required]],
      category: [null, [Validators.required]],
    });
  }

  private loadEntry(): void {
    if (this.currentAction === 'edit') {
      this.route.paramMap.pipe(switchMap(params => this.entryService.getById(+params.get('id')))).subscribe(
        entry => {
          this.entry = entry;
          this.entryForm.patchValue(entry);
        },
        error => alert('Ocorreu um erro no servidor, tente mais tarde por favor')
      );
    }
  }

  private setPageTitle(): void {
    if (this.currentAction === 'new') {
      this.pageTitle = 'Cadastro de novo lançamento';
    } else {
      const entryName = this.entry?.name || '';
      this.pageTitle = 'Editando lançamento: ' + entryName;
    }
  }

  private createNewEntry(): void {
    // const entry: Entry = {
    //   name: this.entryForm.get('name').value,
    //   description: this.entryForm.get('description').value,
    // };
    // this.entryService.create(entry).subscribe(
    //   // tslint:disable-next-line: no-shadowed-variable
    //   entry => this.success(entry),
    //   error => this.error(error)
    // );
  }

  private updateEntry(): void {
    // const entry: Entry = {
    //   id: +this.route.snapshot.url[0].path,
    //   name: this.entryForm.get('name').value,
    //   description: this.entryForm.get('description').value,
    // };
    // this.entryService.update(entry).subscribe(
    //   // tslint:disable-next-line: no-shadowed-variable
    //   entry => this.success(entry),
    //   error => this.error(error)
    // );
  }

  private success(entry: Entry): void {
    toaster.success('Lançamento cadastrado com sucesso');
    this.router
      .navigateByUrl('/entries', { skipLocationChange: true })
      .then(() => this.router.navigate(['/entries', entry.id, 'edit']));
  }

  private error(error: any): void {
    toaster.error('Ocorreu um erro ao relizar sua solicitação.');
    this.submittingForm = false;

    error.status === 422
      ? (this.serverErrorMessages = JSON.parse(error._body).errors)
      : (this.serverErrorMessages = ['Ocorreu um erro na comunicação com o servidor, tente mais tarde por favor']);
  }
}
