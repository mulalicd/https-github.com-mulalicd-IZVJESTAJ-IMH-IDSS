// Čitanje PDF-a u pregledniku (pdf.js). Dokument se obrađuje lokalno i ne šalje se nikamo.
import * as pdfjs from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { groupTextItems, parseLedgerLines, type Ledger, type TextItem } from './parser';

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

export async function readLedgerPdf(file: File): Promise<Ledger> {
  const data = new Uint8Array(await file.arrayBuffer());
  const doc = await pdfjs.getDocument({ data }).promise;
  const items: TextItem[] = [];
  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p);
    const tc = await page.getTextContent();
    for (const it of tc.items) {
      if ('str' in it) items.push({ str: it.str, x: it.transform[4], y: it.transform[5], page: p });
    }
  }
  await doc.destroy();
  return parseLedgerLines(groupTextItems(items), file.name);
}
