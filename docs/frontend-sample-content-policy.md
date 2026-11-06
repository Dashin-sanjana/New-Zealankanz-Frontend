# Public frontend sample-content policy

The project owner previously identified these four non-demo records as unrelated sample listings that do not belong in the marketplace's public product content. The frontend excludes only the exact matching database ID **and** slug from public listing feeds, autocomplete/search results, featured/latest sections, category/location pages, and direct detail routes:

| Database ID | Slug |
| --- | --- |
| `cmr3km3yh000r33ua8zw06pus` | `senior-react-native-developer` |
| `cmr3km2t1000p33uaam8ugr92` | `2018-toyota-aqua-g-hybrid` |
| `cmr3km1q4000n33uauk8q3nf3` | `spacious-master-bedroom-cbd` |
| `cmr3km0mm000l33ua11td01yn` | `beautiful-3-bedroom-family-home` |

This is a frontend presentation policy only. It does not delete, update, relabel, or otherwise write to the database, and it does not hide other non-demo records. Requiring both stable identifiers avoids filtering a different record that happens to reuse a title or slug.

Public banner placements remain API-driven. The backend's public placement endpoint returns active records within their configured date windows; the frontend displays those records, does not infer a sponsor when none is supplied, and collapses empty placements.
