export default function applyMask(value) {
  let v = value.replace(/\D/g, '');
  if (v.startsWith('8')) v = '7' + v.slice(1);
  if (!v.startsWith('7')) v = '7' + v;
  v = v.slice(0, 11);
  let m = '+7';
  if (v.length > 1) m += ' (' + v.slice(1, 4);
  if (v.length >= 4) m += ') ' + v.slice(4, 7);
  if (v.length >= 7) m += '-' + v.slice(7, 9);
  if (v.length >= 9) m += '-' + v.slice(9, 11);
  return m;
}