(this["webpackJsonpreact-kskd-trend"]=this["webpackJsonpreact-kskd-trend"]||[]).push([[0],{158:function(t,e,n){},290:function(t,e,n){},291:function(t,e,n){},292:function(t,e,n){},300:function(t,e,n){},301:function(t,e,n){},325:function(t,e,n){},327:function(t,e,n){"use strict";n.r(e);var a=n(0),r=n.n(a),s=n(38),i=n.n(s),o=n(101),c=(n(290),n(21)),d=(n(291),n(16)),l=n(17),u=n(22),h=n(23),p=new(function(){function t(){Object(d.a)(this,t)}return Object(l.a)(t,[{key:"getKusts",value:function(t){fetch("https://192.168.30.103/getKusts",{method:"GET"}).then((function(t){return t.json()})).then((function(e){t(e)})).catch((function(t){return console.log("getKusts Error: "+t.message),alert("\u041d\u0435\u0432\u043e\u0437\u043c\u043e\u0436\u043d\u043e \u0441\u0447\u0438\u0442\u0430\u0442\u044c \u0441\u043f\u0438\u0441\u043e\u043a \u043a\u0443\u0441\u0442\u043e\u0432!")}))}},{key:"getTypes",value:function(t){fetch("https://192.168.30.103/getTypes",{method:"GET"}).then((function(t){return t.json()})).then((function(e){t(e)})).catch((function(t){return console.log("Error: "+t.message),alert("\u041d\u0435\u0432\u043e\u0437\u043c\u043e\u0436\u043d\u043e \u0441\u0447\u0438\u0442\u0430\u0442\u044c \u0442\u0438\u043f\u044b \u043e\u0431\u044a\u0435\u043a\u0442\u043e\u0432!")}))}},{key:"getObjects",value:function(t,e,n){var a="https://192.168.30.103/getObjects?";a+="kust="+encodeURI(t),a+="&type="+encodeURI(e),fetch(a,{method:"GET"}).then((function(t){return t.json()})).then((function(t){n(t)})).catch((function(t){return console.log("Error: "+t.message)}))}},{key:"getHistory",value:function(t,e,n,a,r){var s="https://192.168.30.103/getHistory?";s+="sys="+encodeURI(t+":"),s+="&start="+encodeURI(parseInt(e.getTime()/1e3)),s+="&end="+encodeURI(parseInt(n.getTime()/1e3)),a.forEach((function(t,e){s+="&dp"+e+"="+encodeURIComponent(t)})),console.log("URL",s),fetch(s,{method:"GET"}).then((function(t){return t.json()})).then((function(t){r(t),console.log("DATA FROM KASKAD",t)})).catch((function(t){console.log("Error: "+t.message)}))}}]),t}()),f=n(345),v=n(340),b=(n(292),n(8)),j=function(t){Object(u.a)(n,t);var e=Object(h.a)(n);function n(){return Object(d.a)(this,n),e.apply(this,arguments)}return Object(l.a)(n,[{key:"render",value:function(){var t=this;return Object(b.jsx)("div",{className:"DpListContainer",children:Object(b.jsx)(v.a,{selection:!0,verticalAlign:"middle",children:this.props.data.map((function(e,n){return Object(b.jsx)(v.a.Item,{children:Object(b.jsx)(v.a.Content,{children:Object(b.jsx)(f.a,{label:e.text,checked:e.enabled,onChange:function(){return t.props.onChange(e.key)}})})},e.key)}))})})}}]),n}(a.Component),m=n(339),y=function(t){return Object(b.jsx)("div",{className:"DDList",children:Object(b.jsx)(m.a,{onChange:t.onChange,placeholder:t.label,fluid:!0,selection:!0,options:t.data})})},g=(n(300),function(t){Object(u.a)(n,t);var e=Object(h.a)(n);function n(t){var a;return Object(d.a)(this,n),(a=e.call(this,t)).myRef=r.a.createRef(),a}return Object(l.a)(n,[{key:"componentDidMount",value:function(){this.moveFocus(this.props)}},{key:"moveFocus",value:function(t){this.myRef.current.addEventListener("keydown",(function(e){var n=document.activeElement;90===e.keyCode&&n.nextSibling&&(n.nextSibling.focus(),t.data.forEach((function(e){n.tabIndex+1===e.key&&t.onChange(e.value)}))),65===e.keyCode&&n.previousSibling&&(n.previousSibling.focus(),t.data.forEach((function(e){n.tabIndex-1===e.key&&t.onChange(e.value)})))}))}},{key:"render",value:function(){var t=this;return Object(b.jsx)("div",{ref:this.myRef,className:"Objects-List",children:Object(b.jsx)(v.a,{selection:!0,verticalAlign:"middle",children:this.props.data.map((function(e,n){return Object(b.jsx)(v.a.Item,{tabIndex:e.key,onClick:function(){return t.props.onChange(e.value)},children:Object(b.jsx)(v.a.Content,{children:Object(b.jsx)(v.a.Header,{children:e.text})})},e.key)}))})})}}]),n}(a.Component)),k=n(344),O=n(341),x=n(338),A=n(169),D=function(){return Object(b.jsx)("div",{children:Object(b.jsxs)(k.a,{className:"Loader",children:[Object(b.jsx)(O.a,{active:!0,inverted:!0,children:Object(b.jsx)(x.a,{inverted:!0,children:"\u0417\u0430\u0433\u0440\u0443\u0437\u043a\u0430"})}),Object(b.jsx)(A.a,{src:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAABCCAMAAAAPInAgAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2NDZFOEY5NDREQTMxMUU0OEI0MDhCMEM5RjBBNDFEMyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo2NDZFOEY5NTREQTMxMUU0OEI0MDhCMEM5RjBBNDFEMyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjY0NkU4RjkyNERBMzExRTQ4QjQwOEIwQzlGMEE0MUQzIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjY0NkU4RjkzNERBMzExRTQ4QjQwOEIwQzlGMEE0MUQzIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+jI2B7AAAAF1QTFRFvL7AwMLEyMnL5ufoycrMxsjKwcPFzc7Q8PDx+fn68fHy0dLUyszNxsjJvsDB7+/w5OXmxMXH6uvrxsfJ+vr7wsTG+fn50NHTvsDCxcbIysvN7e3u4+Tl1dfY////DQ3b9AAAAB90Uk5T////////////////////////////////////////AM0ZdhAAAADiSURBVHja7NrHDcMwEEVBOknOOaf+y/TdhnkiFwI0U8Li3fany2kIUZpXmiSI0yoOxaE4UByKA8WhOBQHgcWtHIHQ4vbbEUR5PtIbIikOxaE4UByKA8WhOBQHikNxoDgUB4qjU8Xd0wD+Ws9LF2cDTNZUcSgOxSkOxaE4xaE4FIfiFIfiUJzi6GJxNzclZ1O6uKVPPhnX4p988xns41AcKA7FgeJQHIoDxaE4UByKA8WhOPpb3MECjHqa809xNsDULG6mOBSH4kBxKA4Uh+JQnOJQHL0pbrEbQy3t8bu4jwADAOWOuJvLET/EAAAAAElFTkSuQmCC"})]})})},w=(n(301),n(158),function(t){Object(u.a)(n,t);var e=Object(h.a)(n);function n(){var t;Object(d.a)(this,n);for(var a=arguments.length,r=new Array(a),s=0;s<a;s++)r[s]=arguments[s];return(t=e.call.apply(e,[this].concat(r))).state={type:"",types:[],kust:"",kusts:[],objects:[],object:"",dps:[],needUpdate:!1,needTransfer:!1},t}return Object(l.a)(n,[{key:"updKust",value:function(t){this.setState({kust:t,needUpdate:!0})}},{key:"updType",value:function(t){this.setState({type:t,needUpdate:!0})}},{key:"updObject",value:function(t){this.setState({object:t,needTransfer:!0})}},{key:"updSelected",value:function(t){var e=this.state.dps;e[t-1].enabled=!e[t-1].enabled,this.setState({dps:e,needTransfer:!0})}},{key:"componentDidMount",value:function(){var t=this;p.getKusts((function(e){t.setState({kusts:e.kusts})})),p.getTypes((function(e){t.setState({types:e.types})}))}},{key:"componentDidUpdate",value:function(){var t=this;if(this.state.needUpdate&&p.getObjects(this.state.kust,this.state.type,(function(e){t.setState({objects:e.objects,dps:e.dps,needUpdate:!1})})),this.state.needTransfer){var e={kust:this.state.kust,dps:[]};this.state.dps.forEach((function(n){n.enabled&&e.dps.push(t.state.object+n.dp)})),this.props.transferData(e),this.setState({needTransfer:!1})}}},{key:"render",value:function(){var t=this;return Object(b.jsxs)("div",{className:"ControlDiv",children:[0!==this.state.kusts.length?Object(b.jsx)(y,{data:this.state.kusts,label:"\u041d\u043e\u043c\u0435\u0440 \u043a\u0443\u0441\u0442\u0430",onChange:function(e,n){var a=n.value;return t.updKust(a)}}):Object(b.jsx)(D,{}),0!==this.state.types.length?Object(b.jsx)(y,{data:this.state.types,label:"\u041e\u0431\u044a\u0435\u043a\u0442",onChange:function(e,n){var a=n.value;return t.updType(a)}}):Object(b.jsx)(D,{}),0!==this.state.objects.length?Object(b.jsx)(g,{data:this.state.objects,onChange:function(e){return t.updObject(e)}}):"",0!==this.state.objects.length?Object(b.jsx)(j,{data:this.state.dps,onChange:function(e){return t.updSelected(e)}}):""]})}}]),n}(a.Component)),E=n(168),S=n.n(E),M=function(t){Object(u.a)(n,t);var e=Object(h.a)(n);function n(){return Object(d.a)(this,n),e.apply(this,arguments)}return Object(l.a)(n,[{key:"render",value:function(){return Object(b.jsx)(S.a,{value:[this.props.dateStart,this.props.dateEnd],onChange:this.props.onChange,className:"DateTimeRangePicker",format:"dd.MM.y HH:mm:ss",disableClock:!0,disabled:this.props.disabled,clearIcon:null})}}]),n}(a.Component),C=n(53),I=n(5),U=function(t){Object(u.a)(n,t);var e=Object(h.a)(n);function n(){var t;Object(d.a)(this,n);for(var a=arguments.length,r=new Array(a),s=0;s<a;s++)r[s]=arguments[s];return(t=e.call.apply(e,[this].concat(r))).createChart=function(t,e,n,a,r,s){var i=I.s({dateTime:"%A, %e %B %Y \u0433. %X",date:"%d.%m.%Y",time:"%H:%M:%S",periods:["AM","PM"],days:["\u0432\u043e\u0441\u043a\u0440\u0435\u0441\u0435\u043d\u044c\u0435","\u043f\u043e\u043d\u0435\u0434\u0435\u043b\u044c\u043d\u0438\u043a","\u0432\u0442\u043e\u0440\u043d\u0438\u043a","\u0441\u0440\u0435\u0434\u0430","\u0447\u0435\u0442\u0432\u0435\u0440\u0433","\u043f\u044f\u0442\u043d\u0438\u0446\u0430","\u0441\u0443\u0431\u0431\u043e\u0442\u0430"],shortDays:["\u0432\u0441","\u043f\u043d","\u0432\u0442","\u0441\u0440","\u0447\u0442","\u043f\u0442","\u0441\u0431"],months:["\u044f\u043d\u0432\u0430\u0440\u044f","\u0444\u0435\u0432\u0440\u0430\u043b\u044f","\u043c\u0430\u0440\u0442\u0430","\u0430\u043f\u0440\u0435\u043b\u044f","\u043c\u0430\u044f","\u0438\u044e\u043d\u044f","\u0438\u044e\u043b\u044f","\u0430\u0432\u0433\u0443\u0441\u0442\u0430","\u0441\u0435\u043d\u0442\u044f\u0431\u0440\u044f","\u043e\u043a\u0442\u044f\u0431\u0440\u044f","\u043d\u043e\u044f\u0431\u0440\u044f","\u0434\u0435\u043a\u0430\u0431\u0440\u044f"],shortMonths:["\u044f\u043d\u0432","\u0444\u0435\u0432","\u043c\u0430\u0440","\u0430\u043f\u0440","\u043c\u0430\u0439","\u0438\u044e\u043d","\u0438\u044e\u043b","\u0430\u0432\u0433","\u0441\u0435\u043d","\u043e\u043a\u0442","\u043d\u043e\u044f","\u0434\u0435\u043a"]}),o=i.format(".%L"),c=i.format(":%S"),d=i.format("%I:%M"),l=i.format("%I %p"),u=i.format("%a %d"),h=i.format("%b %d"),p=i.format("%B"),f=i.format("%Y"),v=I.r("%d-%m-%y %H:%M:%S"),b=I.o("#my_dataviz").append("svg").attr("width",e+r.left+r.right).attr("height",n+r.top+r.bottom).append("g").attr("transform","translate(".concat(r.left,", ").concat(r.top,")")),j=I.n().domain(I.f(t,(function(t){return t.date}))).range([0,e]),m=I.l().domain([I.j(t,(function(t){return+t.value}))-.002*I.j(t,(function(t){return+t.value})),I.i(t,(function(t){return+t.value}))+.003*I.i(t,(function(t){return+t.value}))]).range([n,0]),y=b.append("g").attr("transform","translate(0, ".concat(n,")")).call(I.a(j).tickFormat(S)),g=(b.append("g").call(I.b(m).ticks(5)),["#e41a1c","#377eb8","#1f3999","#72277d","#ff7f00","#ffff33","#8a3f15","#e64c9d","#999999","#080606"]),k=I.c((function(t){return t.date})).left;b.append("text").text(t[0].param).attr("x",0).attr("y",0).attr("dominant-baseline","hanging").attr("text-anchor","start").attr("fill","black").attr("stroke","black").attr("font-size","1.2em").attr("opacity",.5);var O,x=b.append("g").append("circle").style("fill","none").attr("stroke","black").attr("r",5).style("fill","black").style("opacity",0),A=b.append("g").append("text").style("opacity",0).attr("text-anchor","left").attr("alignment-baseline","middle"),D=(b.append("rect").style("fill","none").style("pointer-events","all").attr("width",e).attr("height",n).on("mousemove",(function(e){var a=j.invert(I.k(e)[0]),r=k(t,a,1),s=t[r];x.attr("cx",j(s.date)).attr("cy",m(s.value)).style("opacity",1),A.html("\u0414\u0430\u0442\u0430: "+v(s.date)+"     \u0417\u043d\u0430\u0447\u0435\u043d\u0438\u0435: "+s.value).attr("x",5).attr("y",n-10).style("opacity",1)})),b.append("defs").append("svg:clipPath").attr("id","clip").append("svg:rect").attr("width",e).attr("height",n).attr("x",0).attr("y",0),I.d().extent([[0,n-50],[e,n]]).on("end",(function(t,e){var n=t.selection;if(n)j.domain([j.invert(n[0]),j.invert(n[1])]),w.select(".brush").call(D.move,null);else{if(!O)return O=setTimeout(E,350);j.domain([4,5])}y.transition().duration(1e3).call(I.a(j).tickFormat(S)),w.select(".line").transition().duration(1e3).attr("d",I.h().curve(I.e).x((function(t){return j(t.date)})).y((function(t){return m(t.value)}))),x.style("opacity",0),A.style("opacity",0)}))),w=b.append("g").attr("clip-path","url(#clip)");function E(){O=null}function S(t){return(I.w(t)<t?o:I.u(t)<t?c:I.t(t)<t?d:I.q(t)<t?l:I.v(t)<t?I.x(t)<t?u:h:I.y(t)<t?p:f)(t)}w.append("path").datum(t).attr("class","line").attr("fill","none").attr("stroke",(function(t,e){return g[s]})).attr("stroke-width",1.5).attr("d",I.h().curve(I.e).x((function(t){return j(t.date)})).y((function(t){return m(t.value)}))),w.append("g").style("border","solid 2px red").attr("class","brush").call(D),b.on("dblclick",(function(){j.domain(I.f(t,(function(t){return t.date}))),y.transition().call(I.a(j).tickFormat(S)),w.select(".line").transition().attr("d",I.h().curve(I.e).x((function(t){return j(t.date)})).y((function(t){return m(t.value)}))),x.style("opacity",0),A.style("opacity",0)}))},t}return Object(l.a)(n,[{key:"componentDidMount",value:function(){this.updateChart()}},{key:"componentDidUpdate",value:function(){this.updateChart()}},{key:"sortByDateAscending",value:function(t,e){return t.date-e.date}},{key:"getWindowDimensions",value:function(){var t=window;return{width:t.innerWidth,height:t.innerHeight}}},{key:"updateChart",value:function(){var t=this;I.o("#my_dataviz").selectAll("*").remove();var e=I.o("#content").node().getBoundingClientRect().height,n=I.o("#content").node().getBoundingClientRect().width,a=I.o("#root").node().getBoundingClientRect().height-e,r=this.props.data,s={top:30,right:50,bottom:30,left:50},i=n-s.left-s.right;try{r.forEach((function(t){t.date=new Date(t.date),t.value=+t.value})),r=r.sort(this.sortByDateAscending);var o=I.g(r,(function(t){return t.param}));o=new Map(Object(C.a)(o.entries()).sort());var c=new Set(r.map((function(t){return t.param})));c=new Set(Object(C.a)(c.entries()).sort());var d=(a-s.top-s.bottom-60*c.size)/c.size,l=0;c.forEach((function(e){t.createChart(o.get(e[0]),i,d,c,s,l),l++}))}catch(u){}}},{key:"render",value:function(){return console.log("data_from_kaskad",this.props.data),Object(b.jsx)("div",{id:"my_dataviz"})}}]),n}(r.a.Component),R=function(t){Object(u.a)(n,t);var e=Object(h.a)(n);function n(){var t;Object(d.a)(this,n);for(var a=arguments.length,r=new Array(a),s=0;s<a;s++)r[s]=arguments[s];return(t=e.call.apply(e,[this].concat(r))).createCharts=function(t,e,n,a,r,s){var i=I.s({dateTime:"%A, %e %B %Y \u0433. %X",date:"%d.%m.%Y",time:"%H:%M:%S",periods:["AM","PM"],days:["\u0432\u043e\u0441\u043a\u0440\u0435\u0441\u0435\u043d\u044c\u0435","\u043f\u043e\u043d\u0435\u0434\u0435\u043b\u044c\u043d\u0438\u043a","\u0432\u0442\u043e\u0440\u043d\u0438\u043a","\u0441\u0440\u0435\u0434\u0430","\u0447\u0435\u0442\u0432\u0435\u0440\u0433","\u043f\u044f\u0442\u043d\u0438\u0446\u0430","\u0441\u0443\u0431\u0431\u043e\u0442\u0430"],shortDays:["\u0432\u0441","\u043f\u043d","\u0432\u0442","\u0441\u0440","\u0447\u0442","\u043f\u0442","\u0441\u0431"],months:["\u044f\u043d\u0432\u0430\u0440\u044f","\u0444\u0435\u0432\u0440\u0430\u043b\u044f","\u043c\u0430\u0440\u0442\u0430","\u0430\u043f\u0440\u0435\u043b\u044f","\u043c\u0430\u044f","\u0438\u044e\u043d\u044f","\u0438\u044e\u043b\u044f","\u0430\u0432\u0433\u0443\u0441\u0442\u0430","\u0441\u0435\u043d\u0442\u044f\u0431\u0440\u044f","\u043e\u043a\u0442\u044f\u0431\u0440\u044f","\u043d\u043e\u044f\u0431\u0440\u044f","\u0434\u0435\u043a\u0430\u0431\u0440\u044f"],shortMonths:["\u044f\u043d\u0432","\u0444\u0435\u0432","\u043c\u0430\u0440","\u0430\u043f\u0440","\u043c\u0430\u0439","\u0438\u044e\u043d","\u0438\u044e\u043b","\u0430\u0432\u0433","\u0441\u0435\u043d","\u043e\u043a\u0442","\u043d\u043e\u044f","\u0434\u0435\u043a"]}),o=i.format(".%L"),c=i.format(":%S"),d=i.format("%I:%M"),l=i.format("%I %p"),u=i.format("%a %d"),h=i.format("%b %d"),p=i.format("%B"),f=i.format("%Y"),v=(I.r("%d-%m-%y %H:%M:%S"),[]);r.forEach((function(t){v.push(t[0])}));var b=I.m().range(["#e41a1c","#377eb8","#1f3999","#72277d","#ff7f00","#ffff33","#8a3f15","#e64c9d","#999999","#080606"]),j=["#e41a1c","#377eb8","#1f3999","#72277d","#ff7f00","#ffff33","#8a3f15","#e64c9d","#999999","#080606"],m=I.o("#my_dataviz").append("svg").attr("width",n+s.left+s.right).attr("height",a+s.top+s.bottom).append("g").attr("transform","translate(".concat(s.left,",").concat(s.top,")")),y=I.n().domain(I.f(e,(function(t){return t.date}))).range([0,n]),g=I.l().domain([I.j(e,(function(t){return+t.value}))-.002*I.j(e,(function(t){return+t.value})),I.i(e,(function(t){return+t.value}))]).range([a,0]);m.append("g").attr("transform","translate(0, ".concat(a,")")).call(I.a(y).tickFormat((function(t){return(I.w(t)<t?o:I.u(t)<t?c:I.t(t)<t?d:I.q(t)<t?l:I.v(t)<t?I.x(t)<t?u:h:I.y(t)<t?p:f)(t)}))),m.append("g").call(I.b(g).ticks(5)),m.selectAll(".line").data(t).join("path").attr("fill","none").attr("class","line").attr("stroke",(function(t){return b(t[0])})).attr("stroke-width",1.5).attr("d",(function(t){return I.h().x((function(t){return y(t.date)})).y((function(t){return g(t.value)}))(t[1])}));m.selectAll("rect").data(v).enter().append("rect").attr("x",n-200).attr("y",(function(t,e){return 20*e})).attr("width",10).attr("height",10).style("fill",(function(t,e){return j[e]})),m.selectAll("text.legend-text").data(v).enter().append("text").attr("x",n-180).attr("y",(function(t,e){return 20*e+9})).text((function(t,e){return v[e]}));var k=m.append("g").attr("class","mouse-over-effects");k.append("path").attr("class","mouse-line").style("stroke","black").style("stroke-width","1px").style("opacity","0");var O=document.getElementsByClassName("line"),x=k.selectAll(".mouse-per-line").data(t).enter().append("g").attr("class","mouse-per-line");x.append("circle").attr("r",7).style("stroke",(function(t){return b(t.name)})).style("fill","none").style("stroke-width","1px").style("opacity","0"),x.append("text").attr("transform","translate(10,3)"),k.append("svg:rect").attr("width",n).attr("height",a).attr("fill","none").attr("pointer-events","all").on("mouseover",(function(){I.o(".mouse-line").style("opacity","1"),I.p(".mouse-per-line circle").style("opacity","1"),I.p(".mouse-per-line text").style("opacity","1")})).on("mousemove",(function(t){var e=I.k(t);I.o(".mouse-line").attr("d",(function(){var t="M"+e[0]+","+a;return t+=" "+e[0]+",0"})),I.p(".mouse-per-line").attr("transform",(function(t,n){for(var a,r,s=y.invert(e[0]),i=I.c((function(t){return t.date})).right,o=(i(t.values,s),0),c=I.o(O[n]).node().getTotalLength();a=Math.floor((o+c)/2),r=I.o(O[n]).node().getPointAtLength(a),a!==c&&a!==o||r.x===e[0];)if(r.x>e[0])c=a;else{if(!(r.x<e[0]))break;o=a}return I.o(this).select("text").text(g.invert(r.y).toFixed(2)).attr("font-weight","bold"),"translate("+e[0]+","+r.y+")"}))}))},t}return Object(l.a)(n,[{key:"componentDidMount",value:function(){this.updateChart()}},{key:"componentDidUpdate",value:function(){this.updateChart()}},{key:"sortByDateAscending",value:function(t,e){return t.date-e.date}},{key:"getWindowDimensions",value:function(){var t=window;return{width:t.innerWidth,height:t.innerHeight}}},{key:"updateChart",value:function(){I.o("#my_dataviz").selectAll("*").remove(),I.o(".Trends").select(".legends").remove();var t=I.o("#content").node().getBoundingClientRect().height,e=I.o("#content").node().getBoundingClientRect().width,n=I.o("#root").node().getBoundingClientRect().height-t,a=this.props.data,r={top:30,right:70,bottom:50,left:70},s=e-r.left-r.right;try{a.forEach((function(t){t.date=new Date(t.date),t.value=+t.value,t.param=t.param})),a=a.sort(this.sortByDateAscending);var i=I.g(a,(function(t){return t.param}));i=new Map(Object(C.a)(i.entries()).sort());var o=new Set(a.map((function(t){return t.param})));o=new Set(Object(C.a)(o.entries()).sort());var c=n-r.top-r.bottom-100;this.createCharts(i,a,s,c,o,r)}catch(d){}}},{key:"render",value:function(){return console.log("data_from_kaskad",this.props.data),Object(b.jsx)("div",{id:"my_dataviz"})}}]),n}(r.a.Component),T=n(342),B=n(10),N=(n(325),function(t){Object(u.a)(n,t);var e=Object(h.a)(n);function n(t){var a;return Object(d.a)(this,n),(a=e.call(this,t)).state={dateStart:new Date,dateEnd:new Date,disabled:!1,data:[],dps:[],needUpdate:!1},a.dropDownData=[{key:1,text:"\u0417\u0430 \u0447\u0430\u0441",value:1},{key:2,text:"\u0417\u0430 5 \u043c\u0438\u043d\u0443\u0442",value:105},{key:3,text:"\u0417\u0430 \u0441\u0443\u0442\u043a\u0438",value:24},{key:4,text:"\u0421\u0432\u043e\u0431\u043e\u0434\u043d\u044b\u0439 \u0432\u044b\u0431\u043e\u0440",value:99}],a}return Object(l.a)(n,[{key:"updateStates",value:function(t){this.setState({data:t.data,dps:this.props.data.dps,needUpdate:!1,dateStart:new Date(this.state.dateStart.setMilliseconds(this.state.dateStart.getMilliseconds()+2e3)),dateEnd:new Date(this.state.dateEnd.setMilliseconds(this.state.dateEnd.getMilliseconds()+2e3))})}},{key:"componentDidUpdate",value:function(){var t=this;(this.props.data.dps.length>0&this.state.dateStart<this.state.dateEnd&this.props.data.dps!==this.state.dps||this.state.needUpdate)&&(clearInterval(this.interval),p.getHistory(this.props.data.kust,this.state.dateStart,this.state.dateEnd,this.props.data.dps,(function(e){t.setState({data:e.data,dps:t.props.data.dps,needUpdate:!1})})),this.state.disabled&&(this.interval=setInterval((function(){p.getHistory(t.props.data.kust,t.state.dateStart,t.state.dateEnd,t.props.data.dps,(function(e){t.updateStates(e)}))}),2e3)))}},{key:"setTime",value:function(t){99!==t&t<=24?this.setState({dateStart:new Date((new Date).setHours((new Date).getHours()-t)),dateEnd:new Date,disabled:!0}):t>100&t<160?this.setState({dateStart:new Date((new Date).setMinutes((new Date).getMinutes()-(t-100))),dateEnd:new Date,disabled:!0}):this.setState({disabled:!1})}},{key:"render",value:function(){var t=this;return console.log("dateStart",this.state.dateStart,"dateEnd",this.state.dateEnd),Object(b.jsx)("div",{className:"ContentDiv",id:"content",children:Object(b.jsxs)("div",{className:"HeaderDiv",children:[Object(b.jsxs)("div",{className:"Picker",children:[Object(b.jsx)("div",{className:"TimePicker",children:Object(b.jsx)(M,{dateStart:this.state.dateStart,dateEnd:this.state.dateEnd,disabled:this.state.disabled,onChange:function(e){return t.setState({dateStart:e[0],dateEnd:e[1]})}})}),Object(b.jsx)("div",{className:"DropDownDate",children:0!==this.dropDownData.length?Object(b.jsx)(y,{label:"Time",data:this.dropDownData,onChange:function(e,n){var a=n.value;return t.setTime(a)}}):""}),Object(b.jsx)("div",{className:"Button",children:Object(b.jsx)(T.a,{onClick:function(){return t.setState({needUpdate:!0})},content:"\u041e\u0431\u043d\u043e\u0432\u0438\u0442\u044c"})})]}),Object(b.jsx)("div",{className:"Trends",children:Object(b.jsxs)(B.c,{children:[Object(b.jsx)(B.a,{path:"/qwerty/:sys/:num",element:0!==this.state.data.length?Object(b.jsx)(R,{data:this.state.data}):Object(b.jsx)("h1",{children:"\u041d\u0435\u0442 \u0434\u0430\u043d\u043d\u044b\u0445"})}),Object(b.jsx)(B.a,{path:"/qwerty",element:0!==this.state.data.length?Object(b.jsx)(U,{data:this.state.data}):Object(b.jsx)("h1",{children:"\u041d\u0435\u0442 \u0434\u0430\u043d\u043d\u044b\u0445"})})]})})]})})}}]),n}(a.Component)),H=function(){var t=Object(a.useState)({kust:"",dps:[]}),e=Object(c.a)(t,2),n=e[0],r=e[1];return Object(b.jsxs)("div",{className:"App",children:[Object(b.jsx)(w,{transferData:function(t){return r(t)}}),Object(b.jsx)(N,{data:n})]})},L=function(t){t&&t instanceof Function&&n.e(3).then(n.bind(null,346)).then((function(e){var n=e.getCLS,a=e.getFID,r=e.getFCP,s=e.getLCP,i=e.getTTFB;n(t),a(t),r(t),s(t),i(t)}))};i.a.render(Object(b.jsx)(o.a,{children:Object(b.jsx)(H,{})}),document.getElementById("root")),L()}},[[327,1,2]]]);
//# sourceMappingURL=main.a50bc077.chunk.js.map