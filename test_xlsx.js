import XLSX from 'xlsx';
console.log("XLSX version:", XLSX.version);
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.aoa_to_sheet([["A", "B"]]);
XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
try {
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  console.log("type: 'array' suceeded, length:", wbout.byteLength || wbout.length);
} catch (e) {
  console.log("type: 'array' failed:", e.message);
}
