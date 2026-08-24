# Rehost these images before using the project outside Manus

The application currently references Manus-managed `/manus-storage/` URLs. The source images in this folder are the portable replacements. Upload them to the target host or move them into the target application’s static asset workflow, then update `client/src/pages/Home.tsx`.

| File | Used for |
| --- | --- |
| `laserman-logo.png` | Official Laserman logo and brand treatment. |
| `radiodetection-cat4-kit.jpg`, `cscope-mxl4d-kit.jpg` | Service-locating recommendations. |
| `tramex-me5.jpg`, `tramex-cmex5-combo.png`, `tramex-hikmicro-combo.png` | Moisture and building-inspection recommendations. |
| `major-tech-mt145.jpg`, `leica-disto-d2.webp` | Distance-measure recommendations. |
| `major-tech-mt195.jpg`, `major-tech-mt405ex.jpg`, `major-tech-mt915.jpg`, `senshin-fk275.jpg` | Electrical recommendations. |
| `topcon-rl-h5b.png` | Construction-laser recommendation. |
| `tramex-logo.png`, `fluke-industrial-logo.png` | Supplier-brand artwork. |
