"""Copy the 27 source certificates into the public folder with compact, stable URLs.

Run: python scripts/prepare-certificates.py
Source PDFs are kept unchanged. Recompress with lossless PDF cleanup first; for
large scanned files only, rasterize at a readable resolution to avoid shipping
unnecessarily huge scans to visitors.
"""

from pathlib import Path

import pymupdf


SOURCE = Path(__file__).resolve().parents[2] / 'Sertifikat'
DESTINATION = Path(__file__).resolve().parents[1] / 'public' / 'certificates'
FILES = [
    'bob_certificate.pdf',
    'BuildanAIAgent_Badge20260724-21-2nyp1e.pdf',
    'Certificate IBM SKill AI Introduction.pdf',
    'css certificate.pdf',
    'DOC-20260724-WA0017..pdf',
    'DOC-20260729-WA0010..pdf',
    'DOC-20260731-WA0006..pdf',
    'DOC-20260807-WA0004.pdf',
    'E - Sertifikat Webinar Softskill untuk Bekerja Jarak Jauh.pdf',
    'Intelligent by DesignBuild an AI Agent.pdf',
    'Kurnia Hary Trisnandha (3).pdf',
    'Kurnia Hary Trisnandha (4).pdf',
    'KURNIA HARY TRISNANDHA (5).pdf',
    'Kurnia Hary Trisnandha.pdf',
    'Kurnia Hary Trisnandha1.pdf',
    'KURNIA HARY TRISNANDHA_sign.pdf',
    'llm_certificate.pdf',
    'SERTIFIKAT - Kurnia Hary Trisnandha.pdf',
    'Sertifikat Digital marketing.pdf',
    'Sertifikat ElsaComp.pdf',
    'Sertifikat KURNIA HARY TRISNANDHA Merancang dan Mengelola Jaringan Komputer untuk Spesialis Teknisi Jaringan dan Sistem Komputer 04 Agustus 2023 BL2318LKCN8GINV4514216.pdf',
    'Sertifikat LKS.pdf',
    'Sertifikat Webinar Pengenalan Generative AI dan Aplikasinya dalam Dunia Kerja TI-51.pdf',
    'sertifikat_course_256_4263563_201024185431_copy.pdf',
    'SertifikatCoursera ATNQ4DN4FC4K_copy.pdf',
    'sql_basic certificate.pdf',
    'webinarpenskel4.pdf',
]


def prepare():
    assert len(FILES) == 27 and len(set(FILES)) == len(FILES)
    DESTINATION.mkdir(parents=True, exist_ok=True)
    for number, filename in enumerate(FILES, start=1):
        src = SOURCE / filename
        if not src.is_file():
            raise FileNotFoundError(src)
        dst = DESTINATION / f'cert-{number:02}.pdf'
        with pymupdf.open(src) as original:
            original.save(dst, garbage=4, deflate=True, clean=True)
        # Rasterize only oversized scans; this keeps selectable text for other PDFs.
        if dst.stat().st_size > 2 * 1024 * 1024:
            with pymupdf.open(src) as original:
                compact = pymupdf.open()
                for page in original:
                    image = page.get_pixmap(matrix=pymupdf.Matrix(1.6, 1.6), alpha=False)
                    jpg = image.tobytes('jpg', jpg_quality=82)
                    new_page = compact.new_page(width=page.rect.width, height=page.rect.height)
                    new_page.insert_image(new_page.rect, stream=jpg)
                compact.save(dst, garbage=4, deflate=True)
                compact.close()
        with pymupdf.open(dst) as prepared:
            pix = prepared[0].get_pixmap(matrix=pymupdf.Matrix(0.9, 0.9), alpha=False)
            thumbnail = DESTINATION / f'cert-{number:02}.jpg'
            thumbnail.write_bytes(pix.tobytes('jpg', jpg_quality=65))
        print(f'{dst.name}: {dst.stat().st_size / 1024:.0f} KB | {filename}')


if __name__ == '__main__':
    prepare()
