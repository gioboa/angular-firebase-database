import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { getDatabase, objectVal, ref, set } from '@angular/fire/database';
import { Observable } from 'rxjs';

type Post = { caption: string; imageUrl: string };

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="feed-container">
      <button class="create-post-button" (click)="openCreatePost()">
        Create New Post
      </button>
      @for (post of posts$ | async | keyvalue; track post.key) {
      <div class="post-card">
        <img
          [src]="post.value.imageUrl"
          [alt]="post.value.caption"
          class="post-image"
        />
        <div class="post-footer">
          <h2>{{ post.value.caption }}</h2>
        </div>
      </div>
      }
    </div>
  `,
  styles: [
    `
      .feed-container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      }
      .create-post-button {
        width: 100%;
        padding: 12px;
        background: #0095f6;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 16px;
        cursor: pointer;
        margin-bottom: 20px;
      }
      .create-post-button:hover {
        background: #0081d6;
      }
      .post-card {
        background: white;
        border: 1px solid #dbdbdb;
        border-radius: 3px;
        margin-bottom: 20px;
      }
      .post-image {
        width: 100%;
        height: auto;
      }
      .post-footer {
        padding: 16px;
      }
    `,
  ],
})
export class AppComponent {
  private DATABASE_TABLE_NAME = 'posts';
  private readonly database;

  readonly posts$: Observable<Record<string, Post>>;

  constructor() {
    this.database = getDatabase(inject(FirebaseApp));
    this.posts$ = objectVal(ref(this.database, this.DATABASE_TABLE_NAME));
  }

  openCreatePost() {
    const newPostKey = `${this.DATABASE_TABLE_NAME}/${this.getRandomNumber()}`;
    const newPostValue: Post = {
      caption: 'Angular 19 + Firebase Database Starter',
      imageUrl: 'https://images.unsplash.com/photo-1575936123452-b67c3203c357',
    };
    set(ref(this.database, newPostKey), newPostValue);
  }

  private getRandomNumber() {
    return Math.floor(Math.random() * (1000 - 1 + 1)) + 1;
  }
}
