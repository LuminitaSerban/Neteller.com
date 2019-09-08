!function(e,r){"object"==typeof exports&&"object"==typeof module?module.exports=r():"function"==typeof define&&define.amd?define([],r):"object"==typeof exports?exports.vanillaTextMask=r():e.vanillaTextMask=r()}(this,function(){return function(e){function r(n){if(t[n])return t[n].exports;var o=t[n]={exports:{},id:n,loaded:!1};return e[n].call(o.exports,o,o.exports,r),o.loaded=!0,o.exports}var t={};return r.m=e,r.c=t,r.p="",r(0)}([function(e,r,t){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function o(e){var r=e.inputElement,t=(0,u.default)(e),n=function(e){var r=e.target.value;return t.update(r)};return r.addEventListener("input",n),t.update(r.value),{textMaskInputElement:t,destroy:function(){r.removeEventListener("input",n)}}}Object.defineProperty(r,"__esModule",{value:!0}),r.conformToMask=void 0,r.maskInput=o;var i=t(2);Object.defineProperty(r,"conformToMask",{enumerable:!0,get:function(){return n(i).default}});var a=t(5),u=n(a);r.default=o},function(e,r){"use strict";Object.defineProperty(r,"__esModule",{value:!0}),r.placeholderChar="_"},function(e,r,t){"use strict";function n(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:a,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:a,t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},n=t.guide,u=void 0===n||n,l=t.previousConformedValue,s=void 0===l?a:l,f=t.placeholderChar,d=void 0===f?i.placeholderChar:f,c=t.placeholder,v=void 0===c?(0,o.convertMaskToPlaceholder)(r,d):c,p=t.currentCaretPosition,h=t.keepCharPositions,g=u===!1&&void 0!==s,m=e.length,y=s.length,b=v.length,C=r.length,P=m-y,x=P>0,k=p+(x?-P:0),O=k+Math.abs(P);if(h===!0&&!x){for(var M=a,T=k;T<O;T++)v[T]===d&&(M+=d);e=e.slice(0,k)+M+e.slice(k,m)}for(var w=e.split(a).map(function(e,r){return{char:e,isNew:r>=k&&r<O}}),_=m-1;_>=0;_--){var j=w[_].char;if(j!==d){var V=_>=k&&y===C;j===v[V?_-P:_]&&w.splice(_,1)}}var S=a,E=!1;e:for(var N=0;N<b;N++){var A=v[N];if(A===d){if(w.length>0)for(;w.length>0;){var I=w.shift(),L=I.char,R=I.isNew;if(L===d&&g!==!0){S+=d;continue e}if(r[N].test(L)){if(h===!0&&R!==!1&&s!==a&&u!==!1&&x){for(var J=w.length,q=null,F=0;F<J;F++){var W=w[F];if(W.char!==d&&W.isNew===!1)break;if(W.char===d){q=F;break}}null!==q?(S+=L,w.splice(q,1)):N--}else S+=L;continue e}E=!0}g===!1&&(S+=v.substr(N,b));break}S+=A}if(g&&x===!1){for(var z=null,B=0;B<S.length;B++)v[B]===d&&(z=B);S=null!==z?S.substr(0,z+1):a}return{conformedValue:S,meta:{someCharsRejected:E}}}Object.defineProperty(r,"__esModule",{value:!0}),r.default=n;var o=t(3),i=t(1),a=""},function(e,r,t){"use strict";function n(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:l,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:u.placeholderChar;if(e.indexOf(r)!==-1)throw new Error("Placeholder character must not be used as part of the mask. Please specify a character that is not present in your mask as your placeholder character.\n\n"+("The placeholder character that was received is: "+JSON.stringify(r)+"\n\n")+("The mask that was received is: "+JSON.stringify(e)));return e.map(function(e){return e instanceof RegExp?r:e}).join("")}function o(e){return"string"==typeof e||e instanceof String}function i(e){return"number"==typeof e&&void 0===e.length&&!isNaN(e)}function a(e){for(var r=[],t=void 0;t=e.indexOf(s),t!==-1;)r.push(t),e.splice(t,1);return{maskWithoutCaretTraps:e,indexes:r}}Object.defineProperty(r,"__esModule",{value:!0}),r.convertMaskToPlaceholder=n,r.isString=o,r.isNumber=i,r.processCaretTraps=a;var u=t(1),l=[],s="[]"},function(e,r){"use strict";function t(e){var r=e.previousConformedValue,t=void 0===r?o:r,i=e.previousPlaceholder,a=void 0===i?o:i,u=e.currentCaretPosition,l=void 0===u?0:u,s=e.conformedValue,f=e.rawValue,d=e.placeholderChar,c=e.placeholder,v=e.indexesOfPipedChars,p=void 0===v?n:v,h=e.caretTrapIndexes,g=void 0===h?n:h;if(0===l)return 0;var m=f.length,y=t.length,b=c.length,C=s.length,P=m-y,x=P>0,k=0===y,O=P>1&&!x&&!k;if(O)return l;var M=x&&(t===s||s===c),T=0,w=void 0,_=void 0;if(M)T=l-P;else{var j=s.toLowerCase(),V=f.toLowerCase(),S=V.substr(0,l).split(o),E=S.filter(function(e){return j.indexOf(e)!==-1});_=E[E.length-1];var N=a.substr(0,E.length).split(o).filter(function(e){return e!==d}).length,A=c.substr(0,E.length).split(o).filter(function(e){return e!==d}).length,I=A!==N,L=void 0!==a[E.length-1]&&void 0!==c[E.length-2]&&a[E.length-1]!==d&&a[E.length-1]!==c[E.length-1]&&a[E.length-1]===c[E.length-2];!x&&(I||L)&&N>0&&c.indexOf(_)>-1&&void 0!==f[l]&&(w=!0,_=f[l]);for(var R=p.map(function(e){return j[e]}),J=R.filter(function(e){return e===_}).length,q=E.filter(function(e){return e===_}).length,F=c.substr(0,c.indexOf(d)).split(o).filter(function(e,r){return e===_&&f[r]!==e}).length,W=F+q+J+(w?1:0),z=0,B=0;B<C;B++){var D=j[B];if(T=B+1,D===_&&z++,z>=W)break}}if(x){for(var G=T,H=T;H<=b;H++)if(c[H]===d&&(G=H),c[H]===d||g.indexOf(H)!==-1||H===b)return G}else if(w){for(var K=T-1;K>=0;K--)if(s[K]===_||g.indexOf(K)!==-1||0===K)return K}else for(var Q=T;Q>=0;Q--)if(c[Q-1]===d||g.indexOf(Q)!==-1||0===Q)return Q}Object.defineProperty(r,"__esModule",{value:!0}),r.default=t;var n=[],o=""},function(e,r,t){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function o(e){var r={previousConformedValue:void 0,previousPlaceholder:void 0};return{state:r,update:function(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:e,o=n.inputElement,s=n.mask,d=n.guide,m=n.pipe,b=n.placeholderChar,C=void 0===b?p.placeholderChar:b,P=n.keepCharPositions,x=void 0!==P&&P,k=n.showMask,O=void 0!==k&&k;if("undefined"==typeof t&&(t=o.value),t!==r.previousConformedValue){("undefined"==typeof s?"undefined":l(s))===y&&void 0!==s.pipe&&void 0!==s.mask&&(m=s.pipe,s=s.mask);var M=void 0,T=void 0;if(s instanceof Array&&(M=(0,v.convertMaskToPlaceholder)(s,C)),s!==!1){var w=a(t),_=o.selectionEnd,j=r.previousConformedValue,V=r.previousPlaceholder,S=void 0;if(("undefined"==typeof s?"undefined":l(s))===h){if(T=s(w,{currentCaretPosition:_,previousConformedValue:j,placeholderChar:C}),T===!1)return;var E=(0,v.processCaretTraps)(T),N=E.maskWithoutCaretTraps,A=E.indexes;T=N,S=A,M=(0,v.convertMaskToPlaceholder)(T,C)}else T=s;var I={previousConformedValue:j,guide:d,placeholderChar:C,pipe:m,placeholder:M,currentCaretPosition:_,keepCharPositions:x},L=(0,c.default)(w,T,I),R=L.conformedValue,J=("undefined"==typeof m?"undefined":l(m))===h,q={};J&&(q=m(R,u({rawValue:w},I)),q===!1?q={value:j,rejected:!0}:(0,v.isString)(q)&&(q={value:q}));var F=J?q.value:R,W=(0,f.default)({previousConformedValue:j,previousPlaceholder:V,conformedValue:F,placeholder:M,rawValue:w,currentCaretPosition:_,placeholderChar:C,indexesOfPipedChars:q.indexesOfPipedChars,caretTrapIndexes:S}),z=F===M&&0===W,B=O?M:g,D=z?B:F;r.previousConformedValue=D,r.previousPlaceholder=M,o.value!==D&&(o.value=D,i(o,W))}}}}}function i(e,r){document.activeElement===e&&(b?C(function(){return e.setSelectionRange(r,r,m)},0):e.setSelectionRange(r,r,m))}function a(e){if((0,v.isString)(e))return e;if((0,v.isNumber)(e))return String(e);if(void 0===e||null===e)return g;throw new Error("The 'value' provided to Text Mask needs to be a string or a number. The value received was:\n\n "+JSON.stringify(e))}Object.defineProperty(r,"__esModule",{value:!0});var u=Object.assign||function(e){for(var r=1;r<arguments.length;r++){var t=arguments[r];for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])}return e},l="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};r.default=o;var s=t(4),f=n(s),d=t(2),c=n(d),v=t(3),p=t(1),h="function",g="",m="none",y="object",b="undefined"!=typeof navigator&&/Android/i.test(navigator.userAgent),C="undefined"!=typeof requestAnimationFrame?requestAnimationFrame:setTimeout}])});