import { TestBed } from '@angular/core/testing';
import { FileDownloadService } from './file-download.service';

describe('FileDownloadService', () => {
    it('should download and release a blob url', () => {
        vi.useFakeTimers();
        const anchor = document.createElement('a');
        const click = vi.spyOn(anchor, 'click').mockImplementation(() => undefined);
        const createElement = vi.spyOn(document, 'createElement').mockReturnValue(anchor);
        Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: vi.fn(() => 'blob:export') });
        Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: vi.fn() });

        const service = TestBed.inject(FileDownloadService);
        service.download(new Blob(['data']), 'Ventas.xlsx');

        expect(createElement).toHaveBeenCalledWith('a');
        expect(anchor.href).toBe('blob:export');
        expect(anchor.download).toBe('Ventas.xlsx');
        expect(click).toHaveBeenCalledOnce();
        expect(document.body.contains(anchor)).toBe(false);
        vi.runAllTimers();
        expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:export');

        createElement.mockRestore();
        vi.useRealTimers();
    });
});
