import { inject, Injectable } from "@angular/core";
import { Translation, TranslocoLoader, TranslocoMissingHandler } from "@jsverse/transloco";
import { HttpClient } from "@angular/common/http";

export class CustomTranslocoMissingHandler implements TranslocoMissingHandler {
    handle(key: string) {
        const pattern = /\[(.*?)\]/g;
        const match = key.match(pattern);
        return match?.[0].replace('[', '').replace(']', '') ?? "";
    }
}

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
    private http = inject(HttpClient);

    getTranslation(lang: string) {
        return this.http.get<Translation>(`/assets/i18n/${lang}.json`);
    }
}
