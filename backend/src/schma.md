# Database Schema: Me-API Playground

**Database:** MongoDB  
**Collection:** `profiles`  

### Document Structure
| Field | Type | Description |
| :--- | :--- | :--- |
| `name` | String | Full name of the candidate. |
| `email` | String | Unique identifier used for lookup and updates. |
| `education` | String | Academic background. |
| `skills` | [String] | Array of technical strings. |
| `projects` | [Object] | Array containing `{ title, description, links: { github, live } }`. |
| `work` | [String] | Employment history or roles. |
| `links` | Object | Social metadata `{ github, linkedin, portfolio }`. |

### Performance Optimization
- **Index:** `email` (Unique) - Required for the `/update/:email` route to ensure fast O(1) lookups.
- **Index:** `skills` (Multikey) - Supports fast project filtering in the `/search` endpoint.