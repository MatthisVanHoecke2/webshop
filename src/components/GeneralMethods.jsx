
export function formatDate(date) {
  const yyyy = date.getFullYear();
  let MM = date.getMonth() + 1;
  let dd = date.getDate();
  let HH = date.getHours();
  let mm = date.getMinutes();
  let ss = date.getSeconds();

  if (dd < 10) dd = '0' + dd;
  if (MM < 10) MM = '0' + MM;
  if(HH < 10) HH = '0' + HH;
  if(mm < 10) mm = '0' + mm;
  if(ss < 10) ss = '0' + ss;

  return `${dd}/${MM}/${yyyy} ${HH}:${mm}:${ss}`;
}

export function calculatePrice(article, detailedPrice, data) {
  const {characters, detailed} = data;
  if(!article) return;
  let price = article?.price;
  if(detailed) price += detailedPrice ?? 0;
  price += (characters * parseInt(article?.extra));
  return price;
}