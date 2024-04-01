import fs from 'fs';
import dummy from './datatable-src.mjs';

const res = dummy.map(([name, kana], idx) => {
    const id = String(idx).padStart(3, '0');
    return [id, name, kana, idx, "所属", "2010/01/01", "備考"]
});

fs.writeFileSync('datatable.mjs', `export default ${JSON.stringify(res)};`);