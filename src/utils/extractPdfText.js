import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

// Reads a File object (from an <input type="file">) and returns
// its full extracted text, plus a naive split into page-sized chunks
// so large books can be sent to the API in pieces.
export async function extractPdfText(file) {
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

  const pages = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map(item => item.str).join(' ');
    pages.push(pageText);
  }

  return { pages, numPages: pdf.numPages, fullText: pages.join('\n\n') };
}

// Groups pages into chunks of roughly `pagesPerChunk` pages each.
// Smaller chunks = sharper, more specific cards per API call.
export function chunkPages(pages, pagesPerChunk = 6) {
  const chunks = [];
  for (let i = 0; i < pages.length; i += pagesPerChunk) {
    chunks.push(pages.slice(i, i + pagesPerChunk).join('\n\n'));
  }
  return chunks;
}
