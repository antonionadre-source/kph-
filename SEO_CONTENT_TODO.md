# SEO Content Verification Todo List (krakenpfm.ch)

This file contains all local content fields (primarily landmarks) in `/src/data/locations.ts` that have been flagged with `[TODO: verify]`. For optimal Swiss local-SEO and user trust, these placeholders should be reviewed and verified by a local expert or the Kraken Properties and Facilities Management team.

## Overview of Pending Verifications

Please verify that the listed landmarks are factually correct, locally resonant, and accurately spelt. If any of these are incorrect, update their values directly inside `/src/data/locations.ts`.

---

### Region Schaffhausen

| Municipality | Postal Codes | Landmark / Fact to Verify |
|---|---|---|
| **Stein am Rhein** | 8260 | `Städtchen-Tore` |
| **Hallau** | 8215 | `Bergkirche St. Moritz` |
| **Wilchingen** | 8217 | `Weinbaudörfer` |
| **Schleitheim** | 8226 | `Gipsmuseum` |
| **Löhningen** | 8224 | `Dorfbrunnen Löhningen` |
| **Herblingen** | 8207 | `Schloss Herblingen` |
| **Thayngen** | 8240 | `Reiat-Hügelland` |
| **Neuhausen am Rheinfall** | 8212 | `Rheinfall` (Rheinburg / Rheinfall-Ufer) |
| **Buchberg** | 8454 | `Rebberge Buchberg` |
| **Rüdlingen** | 8455 | `Rheinbogen` |
| **Feuerthalen** | 8245 | `Rheinbrücke` |
| **Büsingen am Hochrhein** | 8238 | `Holzbrücke Diessenhofen` |

---

### Region Winterthur

| Municipality | Postal Codes | Landmark / Fact to Verify |
|---|---|---|
| **Laufen-Uhwiesen** | 8248 | `Schloss Laufen` |
| **Rafz** | 8197 | `Rafzer Kirche` |
| **Elgg** | 8353 | `Schloss Elgg` |
| **Kollbrunn** | 8483 | `Tösstal-Landschaft` |
| **Seuzach** | 8472 | `Seuzach-Zentrum` |
| **Neftenbach** | 8413 | `Weinberge Neftenbach` |
| **Wiesendangen** | 8542 | `Wiesendanger Dorfbach` |

---

### Region Zürich

| Municipality | Postal Codes | Landmark / Fact to Verify |
|---|---|---|
| **Dübendorf** | 8600 | `Flugplatz Dübendorf` |
| **Wallisellen** | 8304 | `Glattzentrum` |
| **Opfikon** | 8152 | `Glattpark` |
| **Volketswil** | 8604 | `Gewerbezone Volketswil` |

---

## Instructions for Content Verification

1. Open `/src/data/locations.ts`.
2. Locate the corresponding municipality object (by its `slug` or `name`).
3. Under the `localContext` object, review the `landmark` field.
4. Replace the value (and the `[TODO: verify]` comment if in comments) with the verified local landmark.
5. Set `indexable: true` once the entire municipality object has been reviewed to allow the page to be indexed in the sitemap and crawled by search engines.
