import { Injectable } from '@angular/core'

@Injectable()
export class PopupsStoreService {
  popups: Record<string, any> = {}
}
