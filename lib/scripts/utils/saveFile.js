export function saveFile(data, filename) {
  let a = document.createElement('a'),
    blob = new Blob([JSON.stringify(data)], {type: 'text/plain;charset=utf-8'}),
    url = window.URL.createObjectURL(blob);
  document.body.appendChild(a);
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}
