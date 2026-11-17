# Product CSV import

## Purpose

The product-library import is intentionally designed for the supplied Dare & Rise minimal export. Each import is a **replacement**, not an append operation.

## Required CSV headers

The header row must match this sequence exactly:

```csv
Product Title,SKUs,Variant Titles,Cost Price,Selling Price,Compare-at Price / MRP
```

Quoted CSV values are supported, including commas within a product title, SKUs, or variant titles.

## Field mapping

| CSV column | Firestore product field |
| --- | --- |
| `Product Title` | `name` |
| `SKUs` | `sku` |
| `Variant Titles` | `variant` |
| `Cost Price` | `manufacturingCost` |
| `Selling Price` | `sellingPrice` |
| `Compare-at Price / MRP` | `mrp` |

The importer sets `category` to `Imported catalog`, `gstRate` to `5`, and includes a source note.

## SKU behavior

Each CSV row creates **one** Firestore product document. The complete `SKUs` cell is stored unchanged in the product’s single `sku` field. It is not split into multiple records. The complete Variant Titles cell is similarly retained as the single `variant` field.

## Replacement workflow

1. In Product Library, choose **Replace from minimal CSV**.
2. Select the supplied `.csv` file.
3. The app validates the required headers.
4. The app deletes every document in the current user’s Firestore `products` collection.
5. It writes the complete imported product set in Firestore-safe batches of up to 400 writes.
6. The library reloads and displays the new catalog.

Because deletion happens first by design, take a JSON backup from Product Library before importing if the existing catalog must be recoverable.
