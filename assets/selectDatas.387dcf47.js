import e from"./index.403fc17a.js";import{d as l,q as a,k as o,o as n,b as t,e as u,B as r,C as s,F as i}from"./vendor.1df36bc3.js";const d=u("h2",null,"basic: ",-1),m=u("h2",null,"multiple: ",-1);var c=l({expose:[],setup(l){const c=(()=>{const e=[];for(let l=0;l<1e3;l++)e.push({value:l,label:"选项"+l});return e})(),g=a(!1),p=a(""),h=o([0,1]),v=({pageIndex:e,pageSize:l,searchText:a})=>{g.value=!0;const o=f(a),n=l*e>o.length?o.length:l*e;return new Promise(((a,t)=>{try{const t=[];for(let a=l*(e-1);a<n;a++)t.push(o[a]);return setTimeout((()=>{g.value=!1}),1e3),a(t||[])}catch(u){return console.log(u),a([])}}))},f=e=>c.filter((l=>l.label.includes(e))),b=e=>{},x=e=>{},V=e=>{},C=()=>{console.log("clear")};return(l,a)=>(n(),t(i,null,[d,u(e,{modelValue:p.value,"onUpdate:modelValue":a[1]||(a[1]=e=>p.value=e),filterable:"",clearable:"",loading:g.value,remote:"",ajaxData:v,onChange:b,onVisibleChange:x,onClear:C},null,8,["modelValue","loading"]),m,u(e,{modelValue:r(h),"onUpdate:modelValue":a[2]||(a[2]=e=>s(h)?h.value=e:h=e),multiple:"",isInitRequest:"",filterable:"",loading:g.value,remote:"",ajaxData:v,onChange:b,onRemoveTag:V},null,8,["modelValue","loading"])],64))}});export default c;