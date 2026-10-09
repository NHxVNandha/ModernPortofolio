import { useEffect, useRef, useState } from 'react'
import certificates from '../data/certifications.js'
import './CertificateGallery.css'

const categories = ['Semua', ...new Set(certificates.map((cert) => cert.category))]

export default function CertificateGallery() {
  const [category, setCategory] = useState('Semua')
  const [selected, setSelected] = useState(null)
  const dialogRef = useRef(null)
  const triggerRef = useRef(null)
  const visible = category === 'Semua' ? certificates : certificates.filter((cert) => cert.category === category)

  useEffect(() => {
    const dialog = dialogRef.current
    if (selected && dialog && !dialog.open) dialog.showModal()
    if (!selected && dialog?.open) dialog.close()
  }, [selected])

  const closePreview = () => {
    setSelected(null)
    triggerRef.current?.focus()
  }

  return (
    <section className="rb-certificate-gallery" aria-labelledby="certificate-heading">
      <div className="mb-8">
        <h2 id="certificate-heading" className="font-headline-lg text-headline-lg mb-4 rb-title rb-threads">Certifications</h2>
        <div className="w-20 h-1 bg-secondary rounded-full" />
        <p className="mt-6 text-on-surface-variant font-body-md text-sm leading-relaxed">
          Pelatihan, hasil uji keterampilan, pengalaman praktik, dan partisipasi kegiatan.
          Pilih kategori untuk menjelajah; klik pratinjau untuk membuka dokumen asli.
        </p>
      </div>

      <div className="rb-cert-filters" role="group" aria-label="Filter kategori sertifikat">
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            className={`rb-cert-filter ${category === item ? 'is-selected' : ''}`}
            aria-pressed={category === item}
            onClick={() => setCategory(item)}
          >
            {item} <span>{item === 'Semua' ? certificates.length : certificates.filter((cert) => cert.category === item).length}</span>
          </button>
        ))}
      </div>

      <p className="rb-cert-result" role="status">Menampilkan {visible.length} dari {certificates.length} berkas sertifikat</p>
      <div className="rb-cert-grid">
        {visible.map((cert) => (
          <article key={cert.id} className="rb-cert-card rb-target-card rb-target-cert">
            <div className="rb-cert-thumbnail">
              <img src={cert.thumbnail} alt={`Halaman pertama sertifikat ${cert.title}`} loading="lazy" />
              <span className="rb-cert-thumbnail-hint">Pratinjau dokumen</span>
            </div>
            <div className="rb-cert-card-top">
              <span className="rb-cert-category">{cert.category}</span>
              <span className="rb-cert-date">{cert.issued}</span>
            </div>
            <h3 className="rb-cert-title">{cert.title}</h3>
            <p className="rb-cert-issuer">{cert.issuer}</p>
            <p className="rb-cert-description">{cert.description}</p>
            <div className="rb-cert-card-bottom">
              <span className="rb-cert-type">{cert.type}</span>
              <div className="rb-cert-actions">
                <button
                  type="button"
                  className="rb-cert-preview"
                  onClick={(event) => { triggerRef.current = event.currentTarget; setSelected(cert) }}
                  aria-label={`Pratinjau PDF ${cert.title}`}
                >
                  <span className="material-symbols-outlined" aria-hidden="true">visibility</span> Pratinjau
                </button>
                <a href={cert.pdf} download={`${cert.id}.pdf`} className="rb-cert-download" aria-label={`Unduh PDF ${cert.title}`}>
                  <span className="material-symbols-outlined" aria-hidden="true">download</span> Unduh
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        className="rb-cert-dialog"
        aria-label={selected ? `Pratinjau ${selected.title}` : 'Pratinjau sertifikat'}
        onClose={() => { setSelected(null); triggerRef.current?.focus() }}
        onClick={(event) => { if (event.target === dialogRef.current) closePreview() }}
      >
        {selected && (
          <div className="rb-cert-dialog-content">
            <div className="rb-cert-dialog-header">
              <div>
                <span className="rb-cert-category">{selected.category}</span>
                <h3>{selected.title}</h3>
                <p>{selected.issuer} · {selected.issued}</p>
              </div>
              <button type="button" className="rb-cert-close" onClick={closePreview} aria-label="Tutup pratinjau">
                <span className="material-symbols-outlined" aria-hidden="true">close</span>
              </button>
            </div>
            <iframe className="rb-cert-document" title={`PDF ${selected.title}`} src={`${selected.pdf}#toolbar=0`} />
            <div className="rb-cert-dialog-footer">
              <p>{selected.description}</p>
              <div className="rb-cert-actions">
                <a href={selected.pdf} target="_blank" rel="noopener noreferrer">Buka PDF</a>
                <a href={selected.pdf} download={`${selected.id}.pdf`}>Unduh PDF</a>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </section>
  )
}
