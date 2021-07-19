import { Component, OnInit } from '@angular/core';

import { EntryService } from '../shared/entry.service';
import { Entry } from '../shared/entry.model';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.scss'],
})
export class EntryListComponent implements OnInit {
  entries: Array<Entry> = [];

  constructor(private entryService: EntryService) {}

  ngOnInit(): void {
    this.entryService.getAll().subscribe(
      entries => {
        this.entries = entries;
      },
      error => {
        console.log('Erro ao carregar a lista.');
      }
    );
  }

  deleteEntry(id: number): void {
    const mustDelete = confirm('Tem certeza que deseja excluir este categoria?');
    if (mustDelete) {
      this.entryService.delete(id).subscribe(
        () => (this.entries = this.entries.filter(c => c.id !== id)),
        () => console.log('Erro ao excluir categoria.')
      );
    }
  }
}
