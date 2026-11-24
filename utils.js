/* Jessé Auto Couros — máscaras e validações (camada única, usada por todos os formulários) */
(function(root){
'use strict';
const only=(s,re)=>String(s==null?'':s).replace(re,'');
const digits=s=>only(s,/\D/g);
const alnum=s=>only(String(s==null?'':s).toUpperCase(),/[^0-9A-Z]/g);

/* ---------- Telefone ---------- */
// Formato único: (00) 00000-0000 (DDD + 9 dígitos, o 3º dígito é sempre 9).
// Compatibilidade: um telefone fixo antigo já salvo no formato (00) 0000-0000 é preservado como está.
const LEGFIX=/^\(\d{2}\) \d{4}-\d{4}$/;
function phoneDigits(s){let d=digits(s);if(d.length>=12&&d.slice(0,2)==='55')d=d.slice(2);if(d.length>=12&&d[0]==='0')d=d.slice(1);return d.slice(0,11)}
function fmtPhone(s){const t=String(s==null?'':s).trim();if(LEGFIX.test(t)&&'2345'.includes(t[5]))return t;
 const d=phoneDigits(s);if(!d)return'';return'('+d.slice(0,2)+(d.length>2?') '+d.slice(2,7):'')+(d.length>7?'-'+d.slice(7,11):'')}
function validPhone(s){const d=phoneDigits(s);return d.length===11&&d[0]!=='0'&&d[1]!=='0'&&d[2]==='9'}

/* ---------- Placa ---------- */
// Antiga ABC-1234 · Mercosul ABC1D23. O 5º caractere (letra ou número) define o padrão.
function plateClean(s){const src=alnum(s);let out='';for(const ch of src){const i=out.length;if(i>6)break;
 const L=/[A-Z]/.test(ch),N=/[0-9]/.test(ch);
 if(i<3?L:i===3?N:i===4?(L||N):N)out+=ch}return out}
function fmtPlate(s){const p=plateClean(s);return p.length>3&&/[0-9]/.test(p[4]||'')?p.slice(0,3)+'-'+p.slice(3):p}
function plateKind(s){const p=plateClean(s);return p.length<5?'':/[A-Z]/.test(p[4])?'mercosul':'antiga'}
function validPlate(s){if(alnum(s).length!==7)return false;const p=plateClean(s);return/^[A-Z]{3}\d{4}$/.test(p)||/^[A-Z]{3}\d[A-Z]\d{2}$/.test(p)}

/* ---------- CPF ---------- */
function cpfClean(s){return digits(s).slice(0,11)}
function fmtCpf(s){const d=cpfClean(s);return d.replace(/^(\d{3})(\d)/,'$1.$2').replace(/^(\d{3})\.(\d{3})(\d)/,'$1.$2.$3').replace(/\.(\d{3})(\d)/,'.$1-$2')}
function cpfDv(base){let sum=0;for(let i=0;i<base.length;i++)sum+=(+base[i])*(base.length+1-i);const r=(sum*10)%11;return r===10?0:r}
function validCpf(s){const d=digits(s);if(d.length!==11||/^(\d)\1{10}$/.test(d))return false;
 const a=cpfDv(d.slice(0,9));return a===+d[9]&&cpfDv(d.slice(0,10))===+d[10]}

/* ---------- CNPJ (numérico e alfanumérico — regra oficial Receita/Serpro) ---------- */
// 12 primeiros caracteres: A–Z e 0–9; 2 últimos (dígitos verificadores): somente números.
// Valor de cada caractere = código ASCII − 48 (A=17 … Z=42); módulo 11; pesos 5,4,3,2,9,8,7,6,5,4,3,2 (e 6,5,… no 2º dígito).
function cnpjClean(s){const src=alnum(s);let out='';for(const ch of src){if(out.length>=14)break;if(out.length>=12?/[0-9]/.test(ch):true)out+=ch}return out}
function fmtCnpj(s){const c=cnpjClean(s);let o=c.slice(0,2);if(c.length>2)o+='.'+c.slice(2,5);if(c.length>5)o+='.'+c.slice(5,8);if(c.length>8)o+='/'+c.slice(8,12);if(c.length>12)o+='-'+c.slice(12,14);return o}
function cnpjDv(base){const w=base.length===12?[5,4,3,2,9,8,7,6,5,4,3,2]:[6,5,4,3,2,9,8,7,6,5,4,3,2];let sum=0;
 for(let i=0;i<base.length;i++)sum+=(base.charCodeAt(i)-48)*w[i];const r=sum%11;return r<2?0:11-r}
function validCnpj(s){const c=alnum(s);if(!/^[0-9A-Z]{12}[0-9]{2}$/.test(c)||/^(.)\1{13}$/.test(c))return false;
 const a=cnpjDv(c.slice(0,12));return a===+c[12]&&cnpjDv(c.slice(0,12)+a)===+c[13]}

/* ---------- Documento genérico (CPF ou CNPJ) ---------- */
// Só números e até 11 dígitos = CPF. Mais de 11 caracteres ou qualquer letra = CNPJ.
function docKind(s){const c=alnum(s);return!c?'':(/[A-Z]/.test(c)||c.length>11)?'cnpj':'cpf'}
function fmtDoc(s){return docKind(s)==='cnpj'?fmtCnpj(s):fmtCpf(s)}
function validDoc(s){const k=docKind(s);return k==='cnpj'?validCnpj(s):k==='cpf'?validCpf(s):false}
const docKey=s=>alnum(s); // para comparar duplicidade ignorando pontuação e espaços

/* ---------- Registro de tipos de campo ---------- */
const TYPES={
 phone:{fmt:fmtPhone,valid:validPhone,msg:'Digite um telefone válido, no formato (00) 00000-0000. Ex.: (67) 99999-9999.',mode:'tel',ph:'(00) 00000-0000',auto:'tel'},
 plate:{fmt:fmtPlate,valid:validPlate,msg:'Placa inválida. Verifique o padrão informado (ABC-1234 ou ABC1D23).',mode:'text',ph:'ABC1D23',cap:true},
 cpf:{fmt:fmtCpf,valid:validCpf,msg:'CPF inválido. Confira os números informados.',mode:'numeric',ph:'000.000.000-00'},
 cnpj:{fmt:fmtCnpj,valid:validCnpj,msg:'CNPJ inválido. Confira os números informados.',mode:'text',ph:'00.000.000/0000-00',cap:true},
 doc:{fmt:fmtDoc,valid:validDoc,msg:null,mode:'text',ph:'CPF ou CNPJ',cap:true}
};
function check(type,value){const t=TYPES[type];if(!t)return'';const v=String(value||'').trim();if(!v)return'';
 if(t.valid(v))return'';return t.msg||(docKind(v)==='cnpj'?TYPES.cnpj.msg:TYPES.cpf.msg)}
const norm=(type,v)=>TYPES[type]?TYPES[type].fmt(v):v;

/* ---------- Máscara em tempo real (mantém o cursor no lugar certo) ---------- */
function attach(el,type){const t=TYPES[type];if(!t||el.__mask)return;el.__mask=1;
 el.setAttribute('inputmode',t.mode);el.setAttribute('autocomplete',t.auto||'off');
 if(t.cap){el.setAttribute('autocapitalize','characters');el.setAttribute('spellcheck','false')}
 if(!el.placeholder)el.placeholder=t.ph;
 const sig=x=>x.replace(/[^0-9A-Za-z]/g,'').length;
 el.addEventListener('input',e=>{if(e.isComposing)return;
  const v=el.value,pos=el.selectionStart==null?v.length:el.selectionStart,out=t.fmt(v);
  if(out===v)return;
  const keep=sig(t.fmt(v.slice(0,pos)));el.value=out;
  let i=0,c=0;while(i<out.length&&c<keep){if(/[0-9A-Za-z]/.test(out[i]))c++;i++}
  if(document.activeElement===el){try{el.setSelectionRange(i,i)}catch(x){}}});
 el.value=t.fmt(el.value)}

const JU={digits,alnum,fmtPhone,validPhone,fmtPlate,plateKind,validPlate,fmtCpf,validCpf,fmtCnpj,validCnpj,docKind,fmtDoc,validDoc,docKey,TYPES,check,norm,attach};
if(typeof module!=='undefined'&&module.exports)module.exports=JU;else root.JU=JU;
})(typeof window!=='undefined'?window:globalThis);
