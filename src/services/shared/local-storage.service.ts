import { LOCALSTORAGE_ENUM } from '@/enums/local-storage-enum';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  get(key: LOCALSTORAGE_ENUM) {
    const value = localStorage.getItem(key);
    try {
        return value ? JSON.parse(value) : null;
    } catch (error) {
        return null;
    }
  }

  set(key: LOCALSTORAGE_ENUM, value: any) {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  }

  remove(key: LOCALSTORAGE_ENUM) {
    localStorage.removeItem(key);
  }

  clear() {
    localStorage.clear();
  }
}
